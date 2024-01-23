"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const user_schema_1 = require("../models/user.schema");
const index_1 = require("../config/index");
class Commands {
    constructor(bot) {
        this.bot = bot;
        this.bot = bot;
        this.help();
        this.start();
    }
    help() {
        this.bot.command("help", (ctx) => {
            const isCommandInGroup = ctx.chat?.id === index_1.GROUP_ID;
            if (isCommandInGroup) {
                return;
            }
            ctx.reply("Press /start to use the bot.");
        });
    }
    start() {
        this.bot.command("start", async (ctx) => {
            const isCommandInGroup = ctx.chat?.id === index_1.GROUP_ID;
            console.log(ctx.chat);
            if (isCommandInGroup) {
                return;
            }
            ctx.reply("Assolumu Alaykum Mars it school finance botiga xush kelibsiz");
            const existingUser = await user_schema_1.default.findOne({ telegram_id: ctx.from.id });
            if (existingUser) {
                await user_schema_1.default.updateOne({ telegram_id: ctx.from.id }, { $set: { step: 1 } });
            }
            else {
                const user = await user_schema_1.default.create({
                    telegram_id: ctx.from.id,
                    username: ctx.from.first_name || ctx.from.last_name,
                    step: 1,
                });
            }
            const inlineKeyboard = new grammy_1.InlineKeyboard()
                .text("Postlarni kurish", "posts")
                .text("Forma to'ldirish", "forms");
            ctx.reply("Choose an option:", {
                reply_markup: inlineKeyboard,
            });
        });
    }
}
function createcommmands(bot) {
    return new Commands(bot);
}
exports.default = createcommmands;
//# sourceMappingURL=index.js.map