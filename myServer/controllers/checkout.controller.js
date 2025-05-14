const {Carts} = require('../models/cart.modal');
const Order = require('../models/order.modal');
const {Products} = require('../models/product.moduls'); // Make sure to import this
const Payment = require('../config/payment');

// Checkout controller
exports.processCheckout = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const { shippingAddress } = req.body;
    
    // 1. Get the user's cart
    const cart = await Carts.findOne({ userId }).populate('items.productId');
console.log(cart)
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }
    
    // 2. Validate items (check stock, prices, etc.)
    for (const item of cart.items) {
      const product = item.productId;
      console.log("🚀 ~ exports.processCheckout= ~ item:", item)
      
      
      // Check if product exists and is available
      // if (!product || !product.isAvailable) {
      //   return res.status(400).json({ 
      //     message: `Product ${product ? product.productName : 'Unknown'} is no longer available` 
      //   });
      // }
      
      // Check if price has changed
      if (product.productPrice !== item.productPrice) {
        return res.status(400).json({ 
          message: `Price for ${product.productName} has changed. Please refresh your cart` 
        });
      }
      
      // Check stock
      // if (product.stock < item.quantity) {
      //   return res.status(400).json({ 
      //     message: `Not enough stock for ${product.name}. Only ${product.stock} available` 
      //   });
      // }
    }
    
    // 3. Create order
    const order = new Order({
      userId,
      items: cart.items,
      totalAmount: cart.totalAmount,
      shippingAddress,
      status: 'pending',
      paymentMethod: 'cash_on_delivery'
    });
    
    await order.save();
    
    // 4. Process payment (for COD, we just mark it as pending)
    const paymentResult = await Payment.processPayment({
      amount: cart.totalAmount,
      orderId: order._id
    });
    
    // 5. Update order status
    order.paymentStatus = 'pending'; // For COD, payment is pending until delivery
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
      order: order._id,
      message: "Order placed successfully. Payment will be collected upon delivery."
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

// Add this to your checkout controller
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
