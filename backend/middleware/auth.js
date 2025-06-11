import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ 
      msg: 'No token, authorization denied',
      error: 'AUTH_NO_TOKEN'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if token is expired
    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      return res.status(401).json({ 
        msg: 'Token has expired',
        error: 'AUTH_TOKEN_EXPIRED'
      });
    }

    // Add user from payload
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    res.status(401).json({ 
      msg: 'Token is not valid',
      error: 'AUTH_INVALID_TOKEN'
    });
  }
};

export default auth; 