"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GROUP_ID = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
async function mongodbConnection() {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    }
    catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}
exports.default = mongodbConnection;
exports.GROUP_ID = -1001909251377;
//# sourceMappingURL=index.js.map