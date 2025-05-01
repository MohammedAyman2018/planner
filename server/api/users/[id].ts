import { connectToDatabase } from "~/server/db"
import { User } from "~/server/db/models/User"

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  if (!id) {
    setResponseStatus(event, 400)
    return { error: 'Missing ID' }
  }
  // Check which HTTP method is being used
  if (event.node.req.method === 'DELETE') {
    try {
      await connectToDatabase()

      // Find and delete the document
      const result = await User.findByIdAndDelete(id)

      // If no document was found with that ID
      if (!result) {
        setResponseStatus(event, 404)
        return { error: 'User not found' }
      }

      // Return success response
      return { success: true, message: 'User deleted successfully' }
    } catch (error: any) {
      console.error('Error deleting user:', error)

      // Handle invalid ID format
      if (error.name === 'CastError') {
        setResponseStatus(event, 400)
        return { error: 'Invalid ID format' }
      }

      // Handle other errors
      setResponseStatus(event, 500)
      return { error: 'Server error while deleting user' }
    }
  }

  if (event.node.req.method === 'GET') {
    try {
      await connectToDatabase()
      // Find the document by ID
      const user = await User.findById(id)
      // If no document was found with that ID
      if (!user) {
        setResponseStatus(event, 404)
        return { error: 'User not found' }
      }
      // Return the found document
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        sleep_time: user.sleep_time,
        role: user.role,
        wakeup_time: user.wakeup_time,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    } catch (error: any) {
      console.error('Error fetching user:', error)
      // Handle invalid ID format
      if (error.name === 'CastError') {
        setResponseStatus(event, 400)
        return { error: 'Invalid ID format' }
      }
      // Handle other errors
      setResponseStatus(event, 500)
      return { error: 'Server error while fetching user' }
    }
  }
})
