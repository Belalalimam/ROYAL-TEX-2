const {Carts} = require('../models/cart.modal');
const Order = require('../models/order.modal');
const {Products} = require('../models/product.modal'); // Make sure this import exists
const Payment = require('../services/payment.service');

// Process checkout
exports.processCheckout = async (req, res) => {
  try {
    const userId = req.user.id;
    const { paymentMethodId = 'cash_on_delivery', shippingAddress } = req.body;
    
    // 1. Get the user's cart
    const cart = await Carts.findOne({ userId }).populate('items.productId');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }
    
    // 2. Validate items (check stock, prices, etc.)
    for (const item of cart.items) {
      const product = item.productId;
      
      // Check if product exists and is available
      if (!product || !product.isAvailable) {
        return res.status(400).json({ 
          message: `Product ${product ? product.name : 'Unknown'} is no longer available` 
        });
      }
      
      // Check if price has changed
      if (product.price !== item.productPrice) {
        return res.status(400).json({ 
          message: `Price for ${product.name} has changed. Please refresh your cart` 
        });
      }
      
      // Check stock
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Not enough stock for ${product.name}. Only ${product.stock} available` 
        });
      }
    }
    
    // 3. Create order
    const order = new Order({
      userId,
      items: cart.items.map(item => ({
        productId: item.productId._id,
        name: item.productId.name,
        quantity: item.quantity,
        productPrice: item.productPrice
      })),
      totalAmount: cart.totalAmount,
      shippingAddress,
      status: 'pending',
      paymentMethod: paymentMethodId || 'cash_on_delivery'
    });
    
    await order.save();
    
    // 4. Process payment
    const paymentResult = await Payment.processPayment({
      amount: cart.totalAmount,
      paymentMethodId,
      orderId: order._id
    });
    
    if (paymentResult.success) {
      // 5. Update order status
      order.paymentStatus = paymentMethodId === 'cash_on_delivery' ? 'pending' : 'paid';
      order.paymentDetails = paymentResult.details;
      await order.save();
      
      // 6. Update product stock
      for (const item of cart.items) {
        await Products.findByIdAndUpdate(
          item.productId._id,
          { $inc: { stock: -item.quantity } }
        );
      }
      
      // 7. Clear the cart
      await Carts.findByIdAndUpdate(cart._id, { 
        $set: { items: [], totalAmount: 0 } 
      });
      
      return res.status(200).json({
        success: true,
        order: {
          id: order._id,
          totalAmount: order.totalAmount,
          status: order.status,
          paymentStatus: order.paymentStatus
        },
        message: paymentMethodId === 'cash_on_delivery' 
          ? "Order placed successfully. Payment will be collected upon delivery."
          : "Order placed and payment processed successfully."
      });
    } else {
      // Payment failed
      order.status = 'payment_failed';
      order.paymentStatus = 'failed';
      order.paymentDetails = paymentResult.error;
      await order.save();
      
      return res.status(400).json({
        success: false,
        message: "Payment failed",
        error: paymentResult.error
      });
    }
    
  } catch (error) {
    console.error("Checkout error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during checkout",
      error: error.message
    });
  }
};

// Get order details
exports.getOrderDetails = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const userId = req.user.id;
    
    const order = await Order.findOne({ 
      _id: orderId,
      userId: userId 
    }).populate('items.productId');
    
    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: "Order not found" 
      });
    }
    
    return res.status(200).json({
      success: true,
      order
    });
    
  } catch (error) {
    console.error("Get order details error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving order details",
      error: error.message
    });
  }
};

// Get all orders for a user
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .populate('items.productId');
    
    return res.status(200).json({
      success: true,
      orders
    });
    
  } catch (error) {
    console.error("Get user orders error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving orders",
      error: error.message
    });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const userId = req.user.id;
    
    const order = await Order.findOne({ _id: orderId, userId });
    
    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: "Order not found" 
      });
    }
    
    // Only allow cancellation if order is still pending
    if (order.status !== 'pending') {
      return res.status(400).json({ 
        success: false,
        message: "Cannot cancel order that is already being processed" 
      });
    }
    
    // Update order status
    order.status = 'cancelled';
    await order.save();
    
    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: item.quantity } }
      );
    }
    
    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully"
    });
    
  } catch (error) {
    console.error("Cancel order error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while cancelling the order",
      error: error.message
    });
  }
};
