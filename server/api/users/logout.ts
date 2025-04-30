export default defineEventHandler((event) => {
  try {
    // Clear the auth cookie
    setCookie(event, 'auth_token', '', {
      httpOnly: true,
      path: '/',
      maxAge: 0, // Expire immediately
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    return {
      success: true,
      message: 'Logged out successfully'
    };
  } catch (error) {
    console.error('Logout error:', error);
    return createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    });
  }
});