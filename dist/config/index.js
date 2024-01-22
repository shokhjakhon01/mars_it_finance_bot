"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
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
//# sourceMappingURL=index.js.map