import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';

import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import './utils/cleanupService.js';

// ✅ Initialize app first
const app = express();
const port = process.env.PORT || 4000;

// ✅ Connect to database and cloudinary
connectDB();
connectCloudinary();

// ✅ Middleware
app.use(express.json());
app.use(cors());

// ✅ Serve uploads folder if needed
app.use('/uploads', express.static('uploads'));

// ✅ API routes
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order',orderRouter);

// ✅ Health check route
app.get('/', (req, res) => {
  res.send("API Working");
});

// ✅ Start server
app.listen(port, () => console.log(`🚀 Server started on PORT: ${port}`));
  