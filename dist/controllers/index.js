"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const user_schema_1 = require("../models/user.schema");
const student_schema_1 = require("../models/student.schema");
const cron = require("node-cron");
const GROUP_ID = -1001909251377;
class Controllers {
    constructor(bot) {
        this.bot = bot;
        this.studentInfo = {};
        this.cronJob = null;
        this.handleText();
        this.handleConfirmation();
        this.studentInfo = {};
        this.scheduleExpiredPostsCheck();
    }
    async scheduleExpiredPostsCheck() {
        if (this.cronJob) {
            try {
                this.cronJob.stop();
            }
            catch (error) {
                console.error("Error stopping the cron job:", error);
            }
            this.cronJob = null;
        }
        this.cronJob = cron.schedule("0 0 */3 * *", async () => {
            const expiredPosts = await student_schema_1.default.find().exec();
            console.log(expiredPosts);
            if (expiredPosts.length == 0) {
                this.cronJob = null;
            }
            if (expiredPosts && expiredPosts.length > 0) {
                for (const post of expiredPosts) {
                    await this.sendExpiredPostToGroup(GROUP_ID, post);
                }
            }
        });
    }
    async sendExpiredPostToGroup(groupId, post) {
        try {
            const formattedInfo = this.formatPostInfo(post);
            await this.bot.api.sendMessage(groupId, formattedInfo);
        }
        catch (error) {
            console.error("Error sending expired post to the group:", error);
        }
    }
    formatPostInfo(post) {
        return `#${post.branch_name}\n\nO'quvchi: ${post.student_name}\nYosh: ${post.age}\nTel raqam: ${post.tel_number}\nO'qutuvchi: ${post.teacher_name}\nGuruhi: ${post.group_name}\n\nSabab: ${post.reason}\n\nSumma: ${post.money_amount}\nKarta raqami\n${post.card_number} \n \n@mars_financial_managerss`;
    }
    async handleText() {
        this.bot.on(":text", async (ctx) => {
            const isCommandInGroup = ctx.chat?.id === GROUP_ID;
            if (isCommandInGroup) {
                console.log("Ignoring command in the specified group");
                return;
            }
            const messageText = ctx.message?.text;
            const existingUser = await user_schema_1.default.findOne({ telegram_id: ctx.from.id });
            if (messageText && existingUser) {
                switch (existingUser.step) {
                    case 1:
                        this.studentInfo.branch_name = messageText.trim();
                        ctx.reply("O'quvchini ismini kiriting! ");
                        await user_schema_1.default.updateOne({ telegram_id: ctx.from.id }, { $set: { step: 2 } });
                        break;
                    case 2:
                        this.studentInfo.student_name = messageText.trim();
                        ctx.reply("O'quvchini yoshini kiriting! ");
                        await user_schema_1.default.updateOne({ telegram_id: ctx.from.id }, { $set: { step: 3 } });
                        break;
                    case 3:
                        this.studentInfo.age = messageText.trim();
                        ctx.reply("Telefon raqamini kiriting! ");
                        await user_schema_1.default.updateOne({ telegram_id: ctx.from.id }, { $set: { step: 4 } });
                        break;
                    case 4:
                        this.studentInfo.tel_number = messageText.trim();
                        ctx.reply("O'qituvchining ismini kiriting! ");
                        await user_schema_1.default.updateOne({ telegram_id: ctx.from.id }, { $set: { step: 5 } });
                        break;
                    case 5:
                        this.studentInfo.teacher_name = messageText.trim();
                        ctx.reply("Guruh nomini kiriting!");
                        await user_schema_1.default.updateOne({ telegram_id: ctx.from.id }, { $set: { step: 6 } });
                        break;
                    case 6:
                        this.studentInfo.group_name = messageText.trim();
                        ctx.reply("Sababini kiriting!");
                        await user_schema_1.default.updateOne({ telegram_id: ctx.from.id }, { $set: { step: 7 } });
                        break;
                    case 7:
                        this.studentInfo.reason = messageText.trim();
                        ctx.reply("Summani kiriting!");
                        await user_schema_1.default.updateOne({ telegram_id: ctx.from.id }, { $set: { step: 8 } });
                        break;
                    case 8:
                        this.studentInfo.money_amount = messageText.trim();
                        ctx.reply("Karta raqamini kiriting! \n Quyidagi formatda:\n 9860260101117372 \n Mukhamedov Nodir");
                        await user_schema_1.default.updateOne({ telegram_id: ctx.from.id }, { $set: { step: 9 } });
                        break;
                    case 9:
                        this.studentInfo.card_number = messageText.trim();
                        await this.sendFormattedInfo(ctx);
                        const inlineKeyboard = new grammy_1.InlineKeyboard()
                            .text("Ha", "yes")
                            .text("Yo'q", "no");
                        ctx.reply("Kiritilgan ma'lumotlar to'g'rimi? (Ha/Yo'q)", {
                            reply_markup: inlineKeyboard,
                        });
                        break;
                    default:
                        break;
                }
            }
        });
    }
    formatUserInfo() {
        const { branch_name, student_name, age, tel_number, teacher_name, group_name, reason, money_amount, card_number, } = this.studentInfo;
        return `#${branch_name}\n\nO'quvchi: ${student_name}\nYosh: ${age}\nTel raqam: ${tel_number}\nO'qutuvchi: ${teacher_name}\nGuruhi: ${group_name}\n\nSabab: ${reason}\n\nSumma: ${money_amount}\nKarta raqami\n${card_number} \n \n@mars_financial_managerss`;
    }
    async sendFormattedInfo(ctx) {
        const formattedInfo = this.formatUserInfo();
        await ctx.reply(formattedInfo);
    }
    async handleConfirmation() {
        this.bot.on("callback_query:data", async (ctx) => {
            const userResponse = ctx.callbackQuery?.data;
            if (userResponse === "yes") {
                await this.saveAndSendToGroup(ctx);
                await user_schema_1.default.updateOne({ telegram_id: ctx.from.id }, { $set: { step: 1 } });
                await ctx.reply("Malumot yuborildi! qayta ishlatish uchun\n /start ni bosing!");
            }
            else if (userResponse === "no") {
                await this.startAgain(ctx);
            }
            else if (userResponse === "forms") {
                const replyOptions = {
                    reply_markup: {
                        keyboard: [
                            [{ text: "Qutbiniso" }],
                            [{ text: "Tinchlik" }],
                            [{ text: "Yunusobod" }],
                        ],
                        resize_keyboard: true,
                        one_time_keyboard: true,
                    },
                };
                ctx.reply("Filialni tanlang:", replyOptions);
            }
            else if (userResponse === "posts") {
                try {
                    const existingUser = await user_schema_1.default.findOne({ telegram_id: ctx.from.id });
                    if (existingUser) {
                        const allPosts = await student_schema_1.default.find({ user_id: existingUser._id });
                        if (allPosts.length > 0) {
                            const inlineKeyboard = new grammy_1.InlineKeyboard();
                            allPosts.forEach((post) => {
                                const formattedPostInfo = this.formatPostInfo(post);
                                inlineKeyboard
                                    .text(`Bajarildi`, `bajarildi__${post._id}`)
                                    .text("Back", "back");
                                ctx.reply(formattedPostInfo, {
                                    reply_markup: inlineKeyboard,
                                });
                            });
                        }
                        else {
                            const inlineKeyboard = new grammy_1.InlineKeyboard().text("Back", "back");
                            ctx.reply("Post topilmadi:", {
                                reply_markup: inlineKeyboard,
                            });
                        }
                    }
                    else {
                        ctx.reply("User not found.");
                    }
                }
                catch (error) {
                    console.error(error);
                    ctx.reply("An error occurred while fetching posts.");
                }
            }
            else if (userResponse === "back") {
                const inlineKeyboard = new grammy_1.InlineKeyboard()
                    .text("Postlarni kurish", "posts")
                    .text("Forma to'ldirish", "forms");
                ctx.reply("Choose an option:", {
                    reply_markup: inlineKeyboard,
                });
            }
        });
    }
    async saveAndSendToGroup(ctx) {
        const formattedInfo = this.formatUserInfo();
        const existingUser = await user_schema_1.default.findOne({ telegram_id: ctx.from.id });
        try {
            await student_schema_1.default.create({ ...this.studentInfo, user_id: existingUser._id });
            const groupId = -1001909251377;
            await ctx.api.sendMessage(groupId, formattedInfo);
            this.studentInfo = {};
        }
        catch (error) {
            console.error("Error saving student information to MongoDB:", error);
        }
    }
    async startAgain(ctx) {
        this.studentInfo = {};
        const inlineKeyboard = new grammy_1.InlineKeyboard()
            .text("Postlarni kurish", "posts")
            .text("Forma to'ldirish", "forms");
        ctx.reply("Choose an option:", {
            reply_markup: inlineKeyboard,
        });
        await user_schema_1.default.updateOne({ telegram_id: ctx.from.id }, { $set: { step: 1 } });
    }
}
function createControllers(bot) {
    return new Controllers(bot);
}
exports.default = createControllers;
//# sourceMappingURL=index.js.map