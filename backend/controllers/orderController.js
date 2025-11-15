import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import Chapa from "chapa";

//global variables
const currency = "ETB";
const deliveryCharge = 10;

//gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const chapa = new Chapa(process.env.CHAPA_SECRET_KEY);

// placing orders on cod
const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, amount, address } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No items in order",
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order amount",
      });
    }

    if (!address || typeof address !== "object") {
      return res.status(400).json({
        success: false,
        message: "Invalid address",
      });
    }

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
      status: "Order Placed",
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({
      success: true,
      message: "Order Placed Successfully",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("Order placement error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// User orders for Frontend
const userOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await orderModel.find({ userId }).sort({ date: -1 }).lean();

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Fetch orders error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// All orders data for admin panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .sort({ date: -1 })
      .populate("userId", "name email")
      .lean();

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Fetch all orders error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update order status from admin panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        message: "Order ID and status are required",
      });
    }

    const validStatuses = [
      "Payment Pending",
      "Order Placed",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Order status updated",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Stripe payment integration
const placeOrderStripe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, amount, address } = req.body;
    const origin = req.headers.origin || "http://localhost:3000";

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No items in order",
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order amount",
      });
    }

    if (!address || typeof address !== "object") {
      return res.status(400).json({
        success: false,
        message: "Invalid address",
      });
    }

    // Create order in database with pending payment
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
      status: "Payment Pending",
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency: currency.toLowerCase(),
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: currency.toLowerCase(),
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: Math.round(deliveryCharge * 100),
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}&gateway=stripe`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}&gateway=stripe`,
      metadata: {
        orderId: newOrder._id.toString(),
        userId: userId.toString(),
      },
      customer_email: address.email,
    });

    await orderModel.findByIdAndUpdate(newOrder._id, {
      stripeSessionId: session.id,
    });

    res.json({
      success: true,
      session_url: session.url,
      session_id: session.id,
    });
  } catch (error) {
    console.error("Stripe order placement error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Chapa payment integration
const placeOrderChapa = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, amount, address } = req.body;
    const origin = req.headers.origin || "http://localhost:3000";

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No items in order",
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order amount",
      });
    }

    if (!address || typeof address !== "object") {
      return res.status(400).json({
        success: false,
        message: "Invalid address",
      });
    }

    // Create order in database with pending payment
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Chapa",
      payment: false,
      date: Date.now(),
      status: "Payment Pending",
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Prepare Chapa payment data
    const tx_ref = `chapa-${newOrder._id}-${Date.now()}`;

    const paymentData = {
      amount: amount + deliveryCharge,
      currency: currency,
      email: address.email,
      first_name: address.firstName,
      last_name: address.lastName,
      phone_number: address.phone,
      tx_ref: tx_ref,
      callback_url: `${process.env.BACKEND_URL}/api/order/chapa-callback`,
      return_url: `${origin}/verify?success=true&orderId=${newOrder._id}&gateway=chapa&tx_ref=${tx_ref}`,
      "customization[title]": "Order Payment",
      "customization[description]": `Payment for order #${newOrder._id}`,
    };

    // Initialize Chapa payment
    const response = await chapa.initialize(paymentData, {
      autoReference: true,
    });

    if (
      response.status === "success" &&
      response.data &&
      response.data.checkout_url
    ) {
      // Save Chapa transaction reference to order
      await orderModel.findByIdAndUpdate(newOrder._id, {
        chapaTxRef: tx_ref,
        chapaCheckoutUrl: response.data.checkout_url,
      });

      res.json({
        success: true,
        checkout_url: response.data.checkout_url,
        tx_ref: tx_ref,
      });
    } else {
      throw new Error(response.message || "Failed to initialize Chapa payment");
    }
  } catch (error) {
    console.error("Chapa order placement error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Chapa webhook handler
const chapaWebhook = async (req, res) => {
  try {
    const event = req.body;

    // Verify the webhook signature
    const signature = req.headers["chapa-signature"];
    const verified = chapa.verifyWebhook(event, signature);

    if (!verified) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    if (event.event === "charge.success") {
      const { tx_ref, status } = event;

      // Find order by transaction reference
      const order = await orderModel.findOne({ chapaTxRef: tx_ref });

      if (order && status === "success") {
        // Update order payment status
        await orderModel.findByIdAndUpdate(order._id, {
          payment: true,
          status: "Order Placed",
        });

        // Clear user's cart
        await userModel.findByIdAndUpdate(order.userId, { cartData: {} });
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Chapa webhook error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify Stripe payment
const verifyStripePayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.stripeSessionId) {
      try {
        const session = await stripe.checkout.sessions.retrieve(
          order.stripeSessionId
        );

        if (session.payment_status === "paid") {
          const updatedOrder = await orderModel.findByIdAndUpdate(
            orderId,
            {
              payment: true,
              status: "Order Placed",
            },
            { new: true }
          );

          await userModel.findByIdAndUpdate(order.userId, { cartData: {} });

          return res.json({
            success: true,
            message: "Payment verified successfully",
            order: updatedOrder,
          });
        }
      } catch (stripeError) {
        console.error("Stripe session retrieval error:", stripeError);
      }
    }

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      {
        payment: true,
        status: "Order Placed",
      },
      { new: true }
    );

    await userModel.findByIdAndUpdate(order.userId, { cartData: {} });

    res.json({
      success: true,
      message: "Payment verified successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Stripe payment verification error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const verifyChapaPayment = async (req, res) => {
  try {
    const { tx_ref } = req.body;

    if (!tx_ref) {
      return res.status(400).json({
        success: false,
        message: "Transaction reference is required",
      });
    }

    // Verify payment with Chapa API
    const verificationResponse = await chapa.verify(tx_ref);

    if (verificationResponse.status === "success") {
      // Find order by transaction reference
      const order = await orderModel.findOne({ chapaTxRef: tx_ref });

      if (order) {
        // Update order payment status
        await orderModel.findByIdAndUpdate(order._id, {
          payment: true,
          status: "Order Placed",
        });

        // Clear user's cart
        await userModel.findByIdAndUpdate(order.userId, { cartData: {} });

        return res.json({
          success: true,
          message: "Payment verified successfully",
          order,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Order not found for this transaction",
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    console.error("Chapa payment verification error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await orderModel.countDocuments();

    // Calculate total sales from all delivered orders
    const deliveredOrders = await orderModel.find({ status: "Delivered" });
    const totalSales = deliveredOrders.reduce(
      (sum, order) => sum + order.amount,
      0
    );

    res.json({ success: true, totalOrders, totalSales });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const getSalesTrend = async (req, res) => {
  try {
    const { range = "This Year", startDate, endDate } = req.query;

    let startDateFilter = new Date();
    let groupByFormat = "%Y-%m"; // Default to monthly grouping

    switch (range) {
      case "Today":
        startDateFilter.setHours(0, 0, 0, 0);
        groupByFormat = "%Y-%m-%d %H:00"; // Group by hour
        break;
      case "This Week":
        // Set to start of week (Sunday)
        startDateFilter.setDate(
          startDateFilter.getDate() - startDateFilter.getDay()
        );
        startDateFilter.setHours(0, 0, 0, 0);
        groupByFormat = "%Y-%m-%d"; // Group by day
        break;
      case "This Month":
        startDateFilter.setDate(1);
        startDateFilter.setHours(0, 0, 0, 0);
        groupByFormat = "%Y-%m-%d"; // Group by day
        break;
      case "This Year":
        startDateFilter.setMonth(0, 1);
        startDateFilter.setHours(0, 0, 0, 0);
        groupByFormat = "%Y-%m"; // Group by month
        break;
      case "All Time":
        startDateFilter = new Date(0); // Beginning of time
        groupByFormat = "%Y"; // Group by year
        break;
      case "Custom Range":
        if (startDate && endDate) {
          startDateFilter = new Date(startDate);
          const endDateFilter = new Date(endDate);

          // Determine appropriate grouping based on date range span
          const diffTime = Math.abs(endDateFilter - startDateFilter);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays <= 1) {
            groupByFormat = "%Y-%m-%d %H:00"; // Group by hour
          } else if (diffDays <= 31) {
            groupByFormat = "%Y-%m-%d"; // Group by day
          } else if (diffDays <= 365) {
            groupByFormat = "%Y-%m"; // Group by month
          } else {
            groupByFormat = "%Y"; // Group by year
          }
        } else {
          // Default to last 12 months if no custom dates provided
          startDateFilter.setMonth(startDateFilter.getMonth() - 11);
          groupByFormat = "%Y-%m";
        }
        break;
      default:
        startDateFilter.setMonth(startDateFilter.getMonth() - 11);
        groupByFormat = "%Y-%m";
    }

    // Build match filter
    const matchFilter = {
      status: "Delivered",
      date: { $gte: startDateFilter },
    };

    // Add end date filter for custom range
    if (range === "Custom Range" && startDate && endDate) {
      matchFilter.date.$lte = new Date(endDate);
    }

    const salesData = await orderModel.aggregate([
      {
        $match: matchFilter,
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: groupByFormat,
              date: "$date",
            },
          },
          totalSales: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Format the data for the chart
    const trend = salesData.map((item) => ({
      label: item._id,
      sales: item.totalSales,
      orders: item.count,
    }));

    res.json({ success: true, trend });
  } catch (error) {
    console.error("Sales trend error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
const getRecentOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find()
      .sort({ date: -1 })
      .limit(10)
      .populate("userId", "name email");

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const getTopSoldItems = async (req, res) => {
  try {
    const topItems = await orderModel.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          totalSold: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    // Calculate percentages
    const totalSold = topItems.reduce((sum, item) => sum + item.totalSold, 0);
    const items = topItems.map((item) => ({
      name: item._id,
      percentage:
        totalSold > 0 ? Math.round((item.totalSold / totalSold) * 100) : 0,
    }));

    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
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
  getTopSoldItems,
};
