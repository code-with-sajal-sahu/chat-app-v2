import jwt from 'jsonwebtoken';
import User from '../model/User.js';

export const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        status: 401,
        message: 'No authentication token, access denied'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by id
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        status: 401,
        message: 'User not found'
      });
    }

    // Add user to request
    req.user = user;
    req.userId = decoded.userId;
    
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({
      status: 401,
      message: 'Token is invalid or expired'
    });
  }
};

