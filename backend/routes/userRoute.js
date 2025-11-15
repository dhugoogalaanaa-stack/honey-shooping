import express from 'express';
import { 
  loginUser, 
  registerUser, 
  adminLogin, 
  verifyUser, 
  countUsers,
  verifyEmail,
  resendVerificationCode,
  checkVerificationStatus,
  requestPasswordReset,
  resetPassword,
  verifyResetToken
} from '../controllers/userController.js';
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/verify-email', verifyEmail);
userRouter.post('/resend-verification', resendVerificationCode);
userRouter.post('/check-verification', checkVerificationStatus);
userRouter.post('/login', loginUser);
userRouter.post('/forgot-password', requestPasswordReset);
userRouter.post('/reset-password', resetPassword);
userRouter.post('/verify-reset-token', verifyResetToken);
userRouter.post('/admin', adminLogin);
userRouter.get('/count', countUsers);
userRouter.get('/verify', authUser, verifyUser);


export default userRouter;