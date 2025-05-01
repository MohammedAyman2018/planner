import { connectToDatabase } from "~/server/db"
import { Event } from "~/server/db/models/Event"

export default defineEventHandler(async (event) => {
  await connectToDatabase()
  return await Event.find({
    user_id: event.context.user.userId,
  })
})