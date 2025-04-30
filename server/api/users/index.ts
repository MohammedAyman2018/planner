import { connectToDatabase } from "~/server/db"
import { User } from "~/server/db/models/User"

export default defineEventHandler(async (event) => {
  try {
    await connectToDatabase()
    const users = await User.find()
    return users
  } catch (error) {
    console.error('Error fetching users:', error)
    setResponseStatus(event, 500)
    return { error: 'Server error while fetching users' }
  }
})