"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    telegram_id: {
        type: "string",
        required: true,
    },
    username: {
        type: "string",
    },
    step: {
        type: "number",
        default: 0,
    },
});
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
//# sourceMappingURL=user.schema.js.map