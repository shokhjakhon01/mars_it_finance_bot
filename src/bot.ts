import { Bot, session } from "grammy";
import "dotenv/config";
import mongodbConnection from "./config";
import commands from "./commands/index";
import controllers from "./controllers/index";
import express from "express";
import bodyParser from "body-parser";

const bot = new Bot(process.env.BOT_API_TOKEN as string);

const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());

const webHookPath = `/${process.env.BOT_API_TOKEN}/`;
const webHookUrl = `${process.env.DOMAIN_NAME}${webHookPath}`;

// Function to delete the webhook with error handling
// const deleteWebhook = async () => {
//   try {
//     await bot.api.deleteWebhook();
//     console.log("Webhook deleted successfully");
//   } catch (error) {
//     console.error("Error deleting webhook:", error);
//   }
// };

// Function to set the webhook with error handling
// const setWebhook = async () => {
//   try {
//     await bot.api.setWebhook(webHookUrl);
//     console.log("Webhook set successfully");
//   } catch (error) {
//     console.error("Error setting webhook:", error);
//   }
// };

// Set up session and connect to MongoDB
bot.use(session());
mongodbConnection();

// Register commands and controllers
commands(bot);
controllers(bot);

// Delete the existing webhook before starting the bot
// deleteWebhook();

// Start the bot
bot.start();

// Handle incoming updates via HTTP POST
// app.post(webHookPath, async (req, res) => {
//   try {
//     await bot.handleUpdate(req.body);
//     res.sendStatus(200);
//   } catch (error) {
//     console.error("Error handling update:", error);
//     res.sendStatus(500);
//   }
// });

// Set the new webhook and start the Express server
// setWebhook();
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

