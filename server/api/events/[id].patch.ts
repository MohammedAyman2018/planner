// server/api/users/[id].put.js or server/api/users/[id].put.ts
import { connectToDatabase } from '~/server/db'
import { Event } from '~/server/db/models/Event'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  try {
    // Get request body
    const body = await readBody(event)

    await connectToDatabase()

    // Find the document and update it
    // { new: true } returns the updated document instead of the original
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      {
        ...body,
        user_id: event.context.user.userId,
      },
      { new: true, runValidators: true }
    )

    // If no document was found with that ID
    if (!updatedEvent) {
      setResponseStatus(event, 404)
      return { error: 'Event not found' }
    }

    // Return the updated document
    return updatedEvent
  } catch (error: any) {
    console.error('Error updating event:', error)

    // Handle validation errors
    if (error.name === 'ValidationError') {
      setResponseStatus(event, 400)
      return {
        error: 'Validation error',
        details: Object.values(error.errors).map((e: any) => e.message)
      }
    }

    // Handle invalid ID format
    if (error.name === 'CastError') {
      setResponseStatus(event, 400)
      return { error: 'Invalid ID format' }
    }

    // Handle other errors
    setResponseStatus(event, 500)
    return { error: 'Server error while updating event' }
  }
})