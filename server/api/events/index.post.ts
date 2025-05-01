import { connectToDatabase } from "~/server/db"
import { Event } from "~/server/db/models/Event"

export default defineEventHandler(async (event) => {
  await connectToDatabase()
  const body = await readBody(event)
  await Event.create({
    ...body,
    user_id: event.context.user.userId,
  }).then((Event) => {
    return Event
  }).catch((error) => {
    return error
  })
})