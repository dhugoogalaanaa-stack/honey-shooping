// ./config/mongodb.js
import mongoose from 'mongoose';

const connectDB = async () => {
  let retries = 5; // Number of times to retry
  while (retries) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000, // Try for 5s before failing
        socketTimeoutMS: 45000,         // Drop inactive sockets after 45s
      });

      console.log('✅ MongoDB Connected');

      // Verify connection with a ping
      const adminDb = mongoose.connection.db.admin();
      await adminDb.ping();
      console.log('✅ MongoDB Ping Successful');
      return; // Exit function if connected
    } catch (err) {
      console.error(`❌ MongoDB Connection Error: ${err.message}`);
      retries -= 1;
      if (retries === 0) {
        console.error('⛔ All retries failed. Exiting...');
        process.exit(1);
      }
      console.log(`⏳ Retrying in 5 seconds... (${retries} retries left)`);
      await new Promise(res => setTimeout(res, 5000));
    }
  }
};

export default connectDB;
