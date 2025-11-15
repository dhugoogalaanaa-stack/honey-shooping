import userModel from '../models/userModel.js';

export const cleanupExpiredVerifications = async () => {
  try {
    const result = await userModel.deleteMany({
      isVerified: false,
      verificationCodeExpires: { $lt: new Date() }
    });
    
    console.log(`Cleaned up ${result.deletedCount} expired verification records`);
  } catch (error) {
    console.error('Error cleaning up expired verifications:', error);
  }
};

// Run cleanup every hour
setInterval(cleanupExpiredVerifications, 60 * 60 * 1000);