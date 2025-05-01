import { connectToDatabase } from "~/server/db"
import { Event } from "~/server/db/models/Event"

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  // Check which HTTP method is being used
  if (event.node.req.method === 'DELETE') {
    try {
      await connectToDatabase()

      // Find and delete the document
      const result = await Event.findByIdAndDelete(id)

      // If no document was found with that ID
      if (!result) {
        setResponseStatus(event, 404)
        return { error: 'Event not found' }
      }

      // Return success response
      return { success: true, message: 'Event deleted successfully' }
    } catch (error: any) {
      console.error('Error deleting event:', error)

      // Handle invalid ID format
      if (error.name === 'CastError') {
        setResponseStatus(event, 400)
        return { error: 'Invalid ID format' }
      }

      // Handle other errors
      setResponseStatus(event, 500)
      return { error: 'Server error while deleting event' }
    }
  }
})
