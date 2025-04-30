import { connectToDatabase } from "~/server/db"
import { User } from "~/server/db/models/User"
import bcrypt from "bcrypt";

export default defineEventHandler(async (event) => {
  try {
    await connectToDatabase()

    const body = await readBody(event)

    // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(10)
    body.password = await bcrypt.hash(body.password, salt)

    const newUser = new User({
      role: body.role || 'user',
      name: body.name,
      email: body.email,
      password: body.password,
      sleep_time: body.sleep_time,
      wakeup_time: body.wakeup_time,
    })

    await newUser.save()


    return newUser
  } catch (error: any) {
    console.error('Error creating User:', error)

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
    return { error: 'Server error while creating User' }
  }
})