import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoute.js';
import cartRoutes from './routes/cartRoute.js';
import productRoutes from './routes/productRoute.js';

dotenv.config();

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token']
}));

// Middleware
app.use(express.json());

// Basic health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/user', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/product', productRoutes);

// Temporary mock products endpoint (fallback)
app.get('/api/product/list', (req, res) => {
  const mockProducts = [
    {
      _id: '1',
      name: 'Classic White T-Shirt',
      price: 299,
      description: 'Premium quality cotton t-shirt for everyday wear',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
      category: 'clothing',
      inStock: true,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['White', 'Black', 'Gray']
    },
    {
      _id: '2',
      name: 'Denim Jacket',
      price: 1299,
      description: 'Vintage style denim jacket for all seasons',
      image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400',
      category: 'clothing',
      inStock: true,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Blue', 'Black']
    }
  ];
  
  console.log('Serving mock products data');
  res.json({ success: true, products: mockProducts });
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.log('❌ MONGODB_URI is not defined in environment variables');
} else {
  mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log('✅ MongoDB Connected');
  })
  .catch(err => {
    console.log('❌ MongoDB Connection Error:', err.message);
  });
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server started on PORT: ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`📍 Network: http://127.0.0.1:${PORT}`);
});