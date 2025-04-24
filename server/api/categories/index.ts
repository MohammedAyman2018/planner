import { connectToDatabase } from "~/server/db"
import { Category } from "~/server/db/models/categories"

export default defineEventHandler(async (event) => {
  await connectToDatabase()
  return await Category.find()
})