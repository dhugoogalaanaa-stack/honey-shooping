import jwt from 'jsonwebtoken';
import userModel from "../models/userModel.js";

const authUser = async (req, res, next) => {
  try {
    // Check multiple possible token locations
    const token = req.header('Authorization')?.replace('Bearer ', '') || 
                 req.header('token') || 
                 req.cookies?.token ||
                 req.query?.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "Authorization required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Handle admin tokens differently
    if (decoded.id === 'admin') {
      req.user = { id: 'admin', email: decoded.email, isAdmin: true };
      req.token = token;
      return next();
    }

    const user = await userModel.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: "Token expired" });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    
    return res.status(401).json({ success: false, message: "Not authorized" });
  }
};

export default authUser;