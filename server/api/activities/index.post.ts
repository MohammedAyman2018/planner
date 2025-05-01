import { connectToDatabase } from "~/server/db"
import { Activity } from "~/server/db/models/Activity"

export default defineEventHandler(async (event) => {
  try {
    await connectToDatabase()

    const body = await readBody(event)

    const newActivity = new Activity({
      user_id: event.context.user.userId,
      label: body.label,
      category_id: body.category_id
    })

    await newActivity.save()

    await newActivity.populate('category_id')

    return newActivity
  } catch (error: any) {
    console.error('Error creating activity:', error)

    // Handle validation errors
    if (error.name === 'ValidationError') {
      setResponseStatus(event, 400)
      return {
        error: 'Validation error',
        details: Object.values(error.errors).map((e: any) => e.message)
      }
    }

    // Handle invalid category ID format
    if (error.name === 'CastError') {
      setResponseStatus(event, 400)
      return { error: 'Invalid category ID format' }
    }

    // Handle other errors
    setResponseStatus(event, 500)
    return { error: 'Server error while creating activity' }
  }
})