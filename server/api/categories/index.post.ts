import { connectToDatabase } from "~/server/db"
import { Category } from "~/server/db/models/categories"

export default defineEventHandler(async (event) => {
  await connectToDatabase()
  const body = await readBody(event)
  await Category.create(body).then((category) => {
    return category
  }).catch((error) => {
    return error
  })
})