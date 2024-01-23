"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const studentSchema = new mongoose_1.Schema({
    branch_name: {
        type: "string",
        required: true,
    },
    student_name: {
        type: "string",
        required: true,
    },
    age: {
        type: "string",
        required: true,
    },
    tel_number: {
        type: "string",
        required: true,
    },
    teacher_name: {
        type: "string",
        required: true,
    },
    group_name: {
        type: "string",
        required: true,
    },
    reason: {
        type: "string",
        required: true,
    },
    money_amount: {
        type: "string",
        required: true,
    },
    card_number: {
        type: "string",
        required: true,
    },
    user_id: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
        expires: 1209600,
    },
    message_id: {
        type: "number",
        required: true,
    },
});
const Student = (0, mongoose_1.model)("Student", studentSchema);
exports.default = Student;
//# sourceMappingURL=student.schema.js.map