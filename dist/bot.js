"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
require("dotenv/config");
const config_1 = require("./config");
const index_1 = require("./commands/index");
const index_2 = require("./controllers/index");
const bot = new grammy_1.Bot(process.env.BOT_API_TOKEN);
bot.use((0, grammy_1.session)());
(0, config_1.default)();
(0, index_1.default)(bot);
(0, index_2.default)(bot);
bot.start();
//# sourceMappingURL=bot.js.map