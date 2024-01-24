import { Bot, session } from "grammy"
import "dotenv/config"
import mongodbConnection from "./config"
import commands from "./commands/index"
import controllers from "./controllers/index"
import express from "express"
import bodyParser from "body-parser"

const bot = new Bot(process.env.BOT_API_TOKEN as string)

const app = express()
const PORT = process.env.PORT || 3000
app.use(bodyParser.json())

const webHookPath = `/${process.env.BOT_API_TOKEN}/`
const webHookUrl = `${process.env.DOMAIN_NAME}${webHookPath}`

bot.use(session())
mongodbConnection()
commands(bot)
controllers(bot)
bot.api.deleteWebhook()

bot.start()

app.post(webHookPath, async (req, res) => {
  try {
    await bot.handleUpdate(req.body)
    res.sendStatus(200)
  } catch (error) {
    console.error("Error handling update:", error)
    res.sendStatus(500)
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${process.env.DOMAIN_NAME}`)

  bot.api.setWebhook(webHookUrl)
})
