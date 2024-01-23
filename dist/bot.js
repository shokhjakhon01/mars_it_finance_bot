"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
require("dotenv/config");
const config_1 = __importDefault(require("./config"));
const index_1 = __importDefault(require("./commands/index"));
const index_2 = __importDefault(require("./controllers/index"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const bot = new grammy_1.Bot(process.env.BOT_API_TOKEN);
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(body_parser_1.default.json());
const webHookPath = `/${process.env.BOT_API_TOKEN}/`;
const webHookUrl = `${process.env.DOMAIN_NAME}${webHookPath}`;
bot.use((0, grammy_1.session)());
(0, config_1.default)();
(0, index_1.default)(bot);
(0, index_2.default)(bot);
bot.api.deleteWebhook();
bot.start();
app.post(webHookPath, async (req, res) => {
    try {
        await bot.handleUpdate(req.body);
        res.sendStatus(200);
    }
    catch (error) {
        console.error("Error handling update:", error);
        res.sendStatus(500);
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${process.env.DOMAIN_NAME}`);
    bot.api.setWebhook(webHookUrl);
});
//# sourceMappingURL=bot.js.map