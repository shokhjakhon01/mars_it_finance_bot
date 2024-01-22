import { Schema, model, Document } from "mongoose"
import { IUser } from "src/interface/interface"

const userSchema = new Schema({
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
})

const User = model<IUser>("User", userSchema)

export default User
