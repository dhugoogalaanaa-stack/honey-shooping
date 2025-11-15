// middleware/adminAuth.js (alternative fix)
import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {
    try {
        const token = req.headers.token || req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.json({success: false, message: "Not Authorized Login Again"});
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if the user email in token matches admin email
        if (token_decode.email !== process.env.ADMIN_EMAIL) {
            return res.json({success: false, message: "Not Authorized Login Again"});
        }
        
        next();
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }
};

export default adminAuth;