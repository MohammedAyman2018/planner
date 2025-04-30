import bcrypt from 'bcrypt';
import { IUser } from '~/interfaces/users';
import { User } from '~/server/db/models/User';

export default defineEventHandler(async (event) => {
  // GET request - fetch user profile
  if (event.method === 'GET') {
    try {
      // Get user ID from authenticated session
      const userId = event.context.user?.userId;

      if (!userId) {
        return createError({
          statusCode: 401,
          statusMessage: 'Authentication required'
        });
      }

      // Fetch user from database
      const user = await User.findById(userId);

      if (!user) {
        return createError({
          statusCode: 404,
          statusMessage: 'User not found'
        });
      }

      // Return user data without password
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return createError({
        statusCode: 500,
        statusMessage: 'Internal server error'
      });
    }
  }

  // PUT request - update user profile
  if (event.method === 'PUT') {
    try {
      // Get user ID from authenticated session
      const userId = event.context.user?.userId;

      if (!userId) {
        return createError({
          statusCode: 401,
          statusMessage: 'Authentication required'
        });
      }

      // Get request body
      const body = await readBody(event);

      // Validate required fields
      if (!body.name || !body.email || !body.sleep_time || !body.wakeup_time) {
        return createError({
          statusCode: 400,
          statusMessage: 'Required fields are missing'
        });
      }

      // Fetch current user data
      const currentUser = await User.findById(userId);

      if (!currentUser) {
        return createError({
          statusCode: 404,
          statusMessage: 'User not found'
        });
      }

      // Check if changing password
      if (body.password) {
        // Verify current password
        if (!body.currentPassword) {
          return createError({
            statusCode: 400,
            statusMessage: 'Current password is required to set a new password'
          });
        }

        const isPasswordValid = await bcrypt.compare(body.currentPassword, currentUser.password);

        if (!isPasswordValid) {
          return createError({
            statusCode: 401,
            statusMessage: 'Current password is incorrect'
          });
        }

        // Hash new password
        body.password = await bcrypt.hash(body.password, 10);
      }

      // Remove currentPassword from update data
      delete body.currentPassword;

      // Update user in database
      const updatedUser = await User.findOneAndUpdate(userId, {
        name: body.name,
        email: body.email,
        sleep_time: body.sleep_time,
        wakeup_time: body.wakeup_time,
        ...(body.password && { password: body.password }),
        updated_at: new Date()
      });

      // Return updated user data without password
      const { password, ...userWithoutPassword } = updatedUser;
      return {
        success: true,
        user: userWithoutPassword
      };
    } catch (error) {
      console.error('Error updating profile:', error);
      return createError({
        statusCode: 500,
        statusMessage: 'Internal server error'
      });
    }
  }

  // Method not allowed
  return createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  });
});

