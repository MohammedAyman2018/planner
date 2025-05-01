import { connectToDatabase } from "~/server/db"
import { Category } from "~/server/db/models/categories"

export default defineEventHandler(async (event) => {
  await connectToDatabase()
  const body = await readBody(event)
  await Category.create({
    ...body,
    user_id: event.context.user.userId,
  }).then((category) => {
    return category
  }).catch((error) => {
    return error
  })
})