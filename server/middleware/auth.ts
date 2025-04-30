import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  // Skip authentication for public routes
  const url = getRequestURL(event);
  if (url.pathname.startsWith('/api/users/login') || 
      url.pathname.startsWith('/api/users/logout')) {
    return;
  }

  try {
    // Get token from cookie
    const token = getCookie(event, 'auth_token');
    
    if (!token) {
      return createError({
        statusCode: 401,
        statusMessage: 'Authentication required'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Add user info to event context for use in route handlers
    event.context.user = decoded;
    
  } catch (error) {
    // Clear invalid token
    setCookie(event, 'auth_token', '', {
      httpOnly: true,
      path: '/',
      maxAge: 0
    });
    
    return createError({
      statusCode: 401,
      statusMessage: 'Invalid or expired token'
    });
  }
});