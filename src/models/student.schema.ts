import { Schema, Types, model } from "mongoose"
import { IStudent } from "src/interface/interface"

const studentSchema = new Schema({
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
    type: Types.ObjectId,
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
})

const Student = model<IStudent>("Student", studentSchema)

export default Student

//14 * 24 * 60 * 60
// "0 0 */3 * *"

//1209600
