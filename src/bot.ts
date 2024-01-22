import { Bot, session } from "grammy"
import "dotenv/config"
import mongodbConnection from "./config"
import commands from "./commands/index"
import controllers from "./controllers/index"

const bot = new Bot(process.env.BOT_API_TOKEN as string)
bot.use(session())
mongodbConnection()
commands(bot)
controllers(bot)

bot.start()
