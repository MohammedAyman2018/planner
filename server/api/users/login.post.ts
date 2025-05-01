import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '~/server/db/models/User';

export default defineEventHandler(async (event) => {
  try {
    // Get request body
    const body = await readBody(event);

    // Validate required fields
    if (!body.email || !body.password) {
      return createError({
        statusCode: 400,
        statusMessage: 'Email and password are required'
      });
    }

    // In a real application, you would:
    // 1. Fetch user from database
    const user = await User.findOne({ email: body.email });

    if (!user) {
      return createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials'
      });
    }

    // 2. Verify password using bcrypt
    const isPasswordValid = await bcrypt.compare(body.password, user.password);

    if (!isPasswordValid) {
      return createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials'
      });
    }

    // 3. Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      String(process.env.JWT_SECRET), // Use environment variable in production
      {
        expiresIn: '7d'
      }
    );


    return {
      success: true,
      user: {
        _id: user.id,
        email: user.email,
        name: user.name,
        sleep_time: user.sleep_time,
        wakeup_time: user.wakeup_time,
        token: token
      }
    };
  } catch (error) {
    console.error('Login error:', error);
    return createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    });
  }
});
