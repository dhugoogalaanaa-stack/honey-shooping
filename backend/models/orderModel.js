import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    size: {
      type: String,
      required: false,
      default: 'default' 
    },
    quantity: {
      type: Number,
      required: true
    },
    image: {
      type: String,
      default: ''
    }
  }],
  address: {
    firstName: String,
    lastName: String,
    email: String,
    street: String,
    city: String,
    region: String,
    zipcode: String,
    country: String,
    phone: String
  },
  amount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'Stripe', 'Chapa'],
    required: true
  },
  payment: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['Payment Pending', 'Order Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Order Placed'
  },
  stripeSessionId: {
    type: String,
    default: ''
  },
  chapaTxRef: {
    type: String,
    default: ''
  },
  chapaCheckoutUrl: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;