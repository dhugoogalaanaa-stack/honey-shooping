import express from 'express';
import { 
   placeOrder, 
  placeOrderStripe, 
  placeOrderChapa, 
  allOrders, 
  userOrders, 
  updateStatus,
  verifyStripePayment,
  verifyChapaPayment,
  chapaWebhook,
  getOrderStats,
  getSalesTrend,
  getRecentOrders,
  getTopSoldItems
} from '../controllers/orderController.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';

const orderRouter = express.Router();

// Admin features
orderRouter.get('/list', adminAuth, allOrders);
orderRouter.put('/status', adminAuth, updateStatus);

// Payment features
orderRouter.post('/place', authUser, placeOrder);
orderRouter.post('/stripe', authUser, placeOrderStripe);
orderRouter.post('/chapa', authUser, placeOrderChapa);
orderRouter.post('/verify-stripe', authUser, verifyStripePayment);
orderRouter.post('/verify-chapa', authUser, verifyChapaPayment);
orderRouter.get('/stats', adminAuth, getOrderStats);
orderRouter.get('/sales-trend', adminAuth, getSalesTrend);
orderRouter.get('/recent', adminAuth, getRecentOrders);
orderRouter.get('/top-sold', adminAuth, getTopSoldItems);

// Webhook for Chapa (no auth needed)
orderRouter.post('/chapa-webhook', chapaWebhook);

// User feature - get user orders
orderRouter.get('/userorders', authUser, userOrders);

export default orderRouter;