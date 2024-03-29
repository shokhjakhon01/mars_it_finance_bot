import mongoose from "mongoose"
import "dotenv/config"

async function mongodbConnection() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("MongoDB connected successfully")
  } catch (error) {
    console.error("Error connecting to MongoDB:", error)
  }
}

export default mongodbConnection

export const GROUP_ID = -1001909251377
// export const GROUP_ID = -4176834198
