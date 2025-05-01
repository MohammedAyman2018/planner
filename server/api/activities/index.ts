import { connectToDatabase } from "~/server/db"
import { Activity } from "~/server/db/models/Activity"

export default defineEventHandler(async (event) => {
  try {
    await connectToDatabase()
    const activities = await Activity.find({
      user_id: event.context.user.userId,
    }).populate('category_id')
    return activities
  } catch (error) {
    console.error('Error fetching activities:', error)
    setResponseStatus(event, 500)
    return { error: 'Server error while fetching activities' }
  }
})