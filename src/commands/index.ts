import { Bot, Context, InlineKeyboard } from "grammy"
import User from "../models/user.schema"
import { GROUP_ID } from "../config/index"

class Commands {
  constructor(private bot: Bot) {
    this.bot = bot
    this.help()
    this.start()
  }

  help() {
    this.bot.command("help", (ctx: Context) => {
      const isCommandInGroup = ctx.chat?.id === GROUP_ID

      if (isCommandInGroup) {
        return
      }
      ctx.reply("Press /start to use the bot.")
    })
  }

  start() {
    this.bot.command("start", async (ctx: Context) => {
      const isCommandInGroup = ctx.chat?.id === GROUP_ID

      if (isCommandInGroup) {
        return
      }

      ctx.reply("Assolumu Alaykum Mars it school finance botiga xush kelibsiz")

      const existingUser = await User.findOne({ telegram_id: ctx.from.id })

      if (existingUser) {
        await User.updateOne(
          { telegram_id: ctx.from.id },
          { $set: { step: 1 } }
        )
      } else {
        const user = await User.create({
          telegram_id: ctx.from.id,
          username: ctx.from.first_name || ctx.from.last_name,
          step: 1,
        })
      }

      const inlineKeyboard = new InlineKeyboard()
        .text("Postlarni kurish", "posts")
        .text("Forma to'ldirish", "forms")

      ctx.reply("Choose an option:", {
        reply_markup: inlineKeyboard,
      })
    })
  }
}

export default function createcommmands(bot: Bot) {
  return new Commands(bot)
}
