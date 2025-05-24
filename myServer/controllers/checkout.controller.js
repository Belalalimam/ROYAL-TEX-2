const {Carts} = require('../models/cart.modal');
const {Order} = require('../models/order.modal');
const { validateCreateOrder, validateUpdateOrder, validateOrderStatus } = require('../models/order.modal');
const { Products } = require('../models/product.moduls');
const Payment = require('../config/payment');

exports.processCheckout = async (req, res) => {
  try {
    const userId = req.user.id;
    const {paymentMethodId =  'cash_on_delivery' , ...shippingAddress} = req.body;

    // 1. Get the user's cart
    const cart = await Carts.findOne({ userId }).populate('items.productId', 'name title price productName productPrice').exec(); 
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    let totalAmount = 0;
    const orderItems = cart.items.map(item => {
      const itemTotal = item.quantity * item.productPrice;
      totalAmount += itemTotal;
      
      return {
        productId: item.productId._id.toString(),
        name: item.productId.productName || item.productId.name || item.productId.title,
        quantity: item.quantity,
        productPrice: item.productPrice
      };
    });
    
    // 2. Validate items (check stock, prices, etc.)
    for (const item of cart.items) {
      console.log("🚀 ~ exports.processCheckout= ~ item:", item)
      // Fetch the actual product from database to get current price
      const actualProduct = await Products.findById(item.productId._id);
      
      if (!actualProduct) {
        return res.status(400).json({ 
          message: `Product ${item.productId.productName || item.productId.name || item.productId.title || 'not found'} is no longer available` 
        });
      }
      
      // Check if price has changed - compare with actual product price
      const currentPrice = actualProduct.productPrice || actualProduct.price;
      if (currentPrice !== item.productPrice) {
        return res.status(400).json({ 
          message: `Price for ${actualProduct.productName || actualProduct.name || actualProduct.title || 'this product'} has changed. Please refresh your cart` 
        });
      }

      // Check stock availability
      if (actualProduct.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${actualProduct.productName || actualProduct.name || actualProduct.title}. Available: ${actualProduct.stock}` 
        });
      }
    }
    
    // 3. Prepare order data for validation
    const orderData = {
      items: cart.items.map(item => ({
        productId: item.productId._id.toString(),
        name: item.productId.productName || item.productId.name || item.productId.title,
        quantity: item.quantity,
        productPrice: item.productPrice
      })),
      totalAmount: totalAmount,
      shippingAddress,
      paymentMethod: paymentMethodId
    };
    
    // 4. Validate order data using the validation function from order modal
    const { error } = validateCreateOrder(orderData);
    if (error) {
      return res.status(400).json({ 
        message: error.details[0].message 
      });
    }
    
    // 5. Create order
    const order = new Order({
      userId,
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      shippingAddress: orderData.shippingAddress,
      status: 'pending',
      paymentMethod: orderData.paymentMethod
    });
    
    await order.save();
    
    // 6. Process payment if not cash on delivery
    if (paymentMethodId !== 'cash_on_delivery') {
      // Implement payment processing logic here
      // const paymentResult = await Payment.processPayment(paymentMethodId, cart.totalAmount);
      
      // if (paymentResult.success) {
      //   order.paymentStatus = 'paid';
      //   order.paymentDetails = paymentResult.details;
      // } else {
      //   order.paymentStatus = 'failed';
      //   order.paymentDetails = { error: paymentResult.error };
      // }
      
      // await order.save();
    }
    
    // 7. Update product inventory
    for (const item of cart.items) {
      await Products.findByIdAndUpdate(
        item.productId._id,
        { $inc: { stock: -item.quantity } }
      );
    }
    
    // 8. Clear the user's cart
    await Carts.findOneAndUpdate(
      { userId },
      { $set: { items: [], totalAmount: 0 } }
    );
    
    // 9. Return success response with order details
    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: {
        id: order._id,
        totalAmount: order.totalAmount,
        status: order.status,
        paymentStatus: order.paymentStatus
      }
    });
    
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
    const { orderId } = req.params;
    const userId = req.user.id;
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    // Ensure the order belongs to the requesting user
    if (order.userId.toString() !== userId) {
      return res.status(403).json({ message: "You don't have permission to view this order" });
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

// Get user orders
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 });
    
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

// Update order status (admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    // Validate order status
    const { error } = validateOrderStatus({ status });
    if (error) {
      return res.status(400).json({ 
        message: error.details[0].message 
      });
    }
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    order.status = status;
    await order.save();
    
    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order
    });
    
  } catch (error) {
    console.error("Update order status error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating order status",
      error: error.message
    });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    // Ensure the order belongs to the requesting user  
    if (order.userId.toString() !== userId) {
      return res.status(403).json({ message: "You don't have permission to cancel this order" });
    }
    
    // Only allow cancellation if order is pending or processing
    if (order.status !== 'pending' && order.status !== 'processing') {
      return res.status(400).json({ 
        message: "Cannot cancel order. Order status is " + order.status 
      });
    }
    
    // Validate the status update
    const { error } = validateOrderStatus({ status: 'cancelled' });
    if (error) {
      return res.status(400).json({ 
        message: error.details[0].message 
      });
    }
    
    order.status = 'cancelled';
    await order.save();
    
    // Return items to inventory
    for (const item of order.items) {
      await Products.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: item.quantity } }
      );
    }
    
    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order
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

// Update order (admin only)
exports.updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const updateData = req.body;
    
    // Validate update data
    const { error } = validateUpdateOrder(updateData);
    if (error) {
      return res.status(400).json({ 
        message: error.details[0].message 
      });
    }
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    // Update order fields
    Object.keys(updateData).forEach(key => {
      order[key] = updateData[key];
    });
    
    await order.save();
    
    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order
    });
    
  } catch (error) {
    console.error("Update order error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the order",
      error: error.message
    });
  }
};
