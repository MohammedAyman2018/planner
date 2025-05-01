// server/api/users/[id].put.js or server/api/users/[id].put.ts
import { connectToDatabase } from '~/server/db'
import { User } from "~/server/db/models/User"
import bcrypt from 'bcrypt';

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  try {
    // Get request body
    const body = await readBody(event)

    await connectToDatabase()

    // Find the document and update it
    if (body.currentPassword) {
      // Validate current password
      const user = await User.findById(id)
      if (!user || !(await bcrypt.compare(body.currentPassword, user.password))) {
        setResponseStatus(event, 401)
        return { error: 'Invalid current password' }
      }
      // Update password
      body.password
    }

    // { new: true } returns the updated document instead of the original
    const updatedUser = await User.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    )

    // If no document was found with that ID
    if (!updatedUser) {
      setResponseStatus(event, 404)
      return { error: 'User not found' }
    }

    // Return the updated document
    return updatedUser
  } catch (error: any) {
    console.error('Error updating user:', error)

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
    return { error: 'Server error while updating user' }
  }
})