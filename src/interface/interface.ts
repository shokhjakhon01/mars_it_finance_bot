import { Context, SessionFlavor } from "grammy"
import { Document, Types } from "mongoose"

export interface IUser extends Document {
  telegram_id: string
  username?: string
  step: number
}

export interface IStudent extends Document {
  branch_name: string
  student_name: string
  age: number
  tel_number: string
  teacher_name: string
  group_name: string
  reason: string
  money_amount: number
  card_number: string
  user_id: Types.ObjectId
  created_at: Date
  message_id: number
}
