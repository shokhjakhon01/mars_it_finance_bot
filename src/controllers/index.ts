import { Bot, Context, InlineKeyboard, Keyboard } from "grammy"
import User from "../models/user.schema"
import Student from "../models/student.schema"
import * as cron from "node-cron"
import { Types } from "mongoose"
import { IStudent } from "src/interface/interface"

const GROUP_ID = -1001909251377

class Controllers {
  private studentInfo: {
    branch_name?: string
    student_name?: string
    age?: string
    tel_number?: string
    teacher_name?: string
    group_name?: string
    reason?: string
    money_amount?: string
    card_number?: string
  } = {}
  private cronJob: cron.ScheduledTask | null = null
  constructor(private bot: Bot) {
    this.handleText()
    this.handleConfirmation()
    this.studentInfo = {}
    this.scheduleExpiredPostsCheck()
  }

  private async scheduleExpiredPostsCheck() {
    if (this.cronJob) {
      try {
        this.cronJob.stop()
      } catch (error) {
        console.error("Error stopping the cron job:", error)
      }
      this.cronJob = null
    }

    // Schedule a task to check for expired posts every minute
    this.cronJob = cron.schedule("0 0 */3 * *", async () => {
      const expiredPosts = await Student.find().exec()
      console.log(expiredPosts)

      if (expiredPosts.length == 0) {
        this.cronJob = null
      }

      if (expiredPosts && expiredPosts.length > 0) {
        for (const post of expiredPosts) {
          await this.sendExpiredPostToGroup(GROUP_ID, post)
        }
      }
    })
  }

  private async sendExpiredPostToGroup(groupId: number, post: any) {
    try {
      const formattedInfo = this.formatPostInfo(post)

      await this.bot.api.sendMessage(groupId, formattedInfo)
    } catch (error) {
      console.error("Error sending expired post to the group:", error)
    }
  }

  private formatPostInfo(post: IStudent): string {
    return `#${post.branch_name}\n\nO'quvchi: ${post.student_name}\nYosh: ${post.age}\nTel raqam: ${post.tel_number}\nO'qutuvchi: ${post.teacher_name}\nGuruhi: ${post.group_name}\n\nSabab: ${post.reason}\n\nSumma: ${post.money_amount}\nKarta raqami\n${post.card_number} \n \n@mars_financial_managerss`
  }

  async handleText() {
    this.bot.on(":text", async (ctx: Context) => {
      const isCommandInGroup = ctx.chat?.id === GROUP_ID

      if (isCommandInGroup) {
        console.log("Ignoring command in the specified group")
        return
      }
      const messageText = ctx.message?.text
      const existingUser = await User.findOne({ telegram_id: ctx.from.id })

      if (messageText && existingUser) {
        switch (existingUser.step) {
          case 1:
            this.studentInfo.branch_name = messageText.trim()
            ctx.reply("O'quvchini ismini kiriting! ")
            await User.updateOne(
              { telegram_id: ctx.from.id },
              { $set: { step: 2 } }
            )
            break
          case 2:
            this.studentInfo.student_name = messageText.trim()
            ctx.reply("O'quvchini yoshini kiriting! ")
            await User.updateOne(
              { telegram_id: ctx.from.id },
              { $set: { step: 3 } }
            )
            break
          case 3:
            this.studentInfo.age = messageText.trim()
            ctx.reply("Telefon raqamini kiriting! ")
            await User.updateOne(
              { telegram_id: ctx.from.id },
              { $set: { step: 4 } }
            )
            break
          case 4:
            this.studentInfo.tel_number = messageText.trim()
            ctx.reply("O'qituvchining ismini kiriting! ")
            await User.updateOne(
              { telegram_id: ctx.from.id },
              { $set: { step: 5 } }
            )
            break
          case 5:
            this.studentInfo.teacher_name = messageText.trim()
            ctx.reply("Guruh nomini kiriting!")
            await User.updateOne(
              { telegram_id: ctx.from.id },
              { $set: { step: 6 } }
            )
            break
          case 6:
            this.studentInfo.group_name = messageText.trim()
            ctx.reply("Sababini kiriting!")
            await User.updateOne(
              { telegram_id: ctx.from.id },
              { $set: { step: 7 } }
            )
            break
          case 7:
            this.studentInfo.reason = messageText.trim()
            ctx.reply("Summani kiriting!")
            await User.updateOne(
              { telegram_id: ctx.from.id },
              { $set: { step: 8 } }
            )
            break
          case 8:
            this.studentInfo.money_amount = messageText.trim()
            ctx.reply(
              "Karta raqamini kiriting! \n Quyidagi formatda:\n 9860260101117372 \n Mukhamedov Nodir"
            )
            await User.updateOne(
              { telegram_id: ctx.from.id },
              { $set: { step: 9 } }
            )
            break
          case 9:
            this.studentInfo.card_number = messageText.trim()
            await this.sendFormattedInfo(ctx)
            const inlineKeyboard = new InlineKeyboard()
              .text("Ha", "yes")
              .text("Yo'q", "no")

            ctx.reply("Kiritilgan ma'lumotlar to'g'rimi? (Ha/Yo'q)", {
              reply_markup: inlineKeyboard,
            })
            break
          default:
            break
        }
      }
    })
  }

  // format user information like telelgram post
  private formatUserInfo(): string {
    const {
      branch_name,
      student_name,
      age,
      tel_number,
      teacher_name,
      group_name,
      reason,
      money_amount,
      card_number,
    } = this.studentInfo

    return `#${branch_name}\n\nO'quvchi: ${student_name}\nYosh: ${age}\nTel raqam: ${tel_number}\nO'qutuvchi: ${teacher_name}\nGuruhi: ${group_name}\n\nSabab: ${reason}\n\nSumma: ${money_amount}\nKarta raqami\n${card_number} \n \n@mars_financial_managerss`
  }

  private async sendFormattedInfo(ctx: Context) {
    const formattedInfo = this.formatUserInfo()
    await ctx.reply(formattedInfo)
  }

  private async handleConfirmation() {
    this.bot.on("callback_query:data", async (ctx) => {
      const userResponse = ctx.callbackQuery?.data

      if (userResponse === "yes") {
        await this.saveAndSendToGroup(ctx)

        await User.updateOne(
          { telegram_id: ctx.from.id },
          { $set: { step: 1 } }
        )
        await ctx.reply(
          "Malumot yuborildi! qayta ishlatish uchun\n /start ni bosing!"
        )
      } else if (userResponse === "no") {
        await this.startAgain(ctx)
      } else if (userResponse === "forms") {
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
        }

        ctx.reply("Filialni tanlang:", replyOptions)
      } else if (userResponse === "posts") {
        try {
          const existingUser = await User.findOne({ telegram_id: ctx.from.id })

          if (existingUser) {
            const allPosts = await Student.find({ user_id: existingUser._id })

            if (allPosts.length > 0) {
              const inlineKeyboard = new InlineKeyboard()
              allPosts.forEach((post) => {
                const formattedPostInfo = this.formatPostInfo(post)
                inlineKeyboard
                  .text(`Bajarildi`, `bajarildi__${post._id}`)
                  .text("Back", "back")
                ctx.reply(formattedPostInfo, {
                  reply_markup: inlineKeyboard,
                })
              })
            } else {
              const inlineKeyboard = new InlineKeyboard().text("Back", "back")
              ctx.reply("Post topilmadi:", {
                reply_markup: inlineKeyboard,
              })
            }
          } else {
            ctx.reply("User not found.")
          }
        } catch (error) {
          console.error(error)
          ctx.reply("An error occurred while fetching posts.")
        }
      } else if (userResponse === "back") {
        const inlineKeyboard = new InlineKeyboard()
          .text("Postlarni kurish", "posts")
          .text("Forma to'ldirish", "forms")

        ctx.reply("Choose an option:", {
          reply_markup: inlineKeyboard,
        })
      }
    })
  }

  private async saveAndSendToGroup(ctx: Context) {
    const formattedInfo = this.formatUserInfo()
    const existingUser = await User.findOne({ telegram_id: ctx.from.id })

    try {
      await Student.create({ ...this.studentInfo, user_id: existingUser._id })
      const groupId = -1001909251377
      await ctx.api.sendMessage(groupId, formattedInfo)

      this.studentInfo = {}
    } catch (error) {
      console.error("Error saving student information to MongoDB:", error)
    }
  }

  //start again
  private async startAgain(ctx: Context) {
    this.studentInfo = {}

    const inlineKeyboard = new InlineKeyboard()
      .text("Postlarni kurish", "posts")
      .text("Forma to'ldirish", "forms")

    ctx.reply("Choose an option:", {
      reply_markup: inlineKeyboard,
    })
    await User.updateOne({ telegram_id: ctx.from.id }, { $set: { step: 1 } })
  }
}

export default function createControllers(bot: Bot) {
  return new Controllers(bot)
}
