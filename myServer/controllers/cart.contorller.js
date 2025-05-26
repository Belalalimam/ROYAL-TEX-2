const asyncWrapper = require("../models/asyncWrapper");
const { Carts, addToCartValidate, updateCartValidate } = require("../models/cart.modal");
const { Products } = require("../models/product.moduls");

/**-----------------------------------------------
 * @desc    Add item to cart
 * @route   /api/cart/:productId
 * @method  POST
 * @access  private
 ------------------------------------------------*/
const addToCart = asyncWrapper(async (req, res) => {
  // Get productId from params and other data from body
  const { productId } = req.params;
  const { quantity, productPrice } = req.body;
  
  // Create validation object with productId from params
  const validationData = {
    productId,
    quantity,
    productPrice
  };
  
  const { error } = addToCartValidate(validationData);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const userId = req.user.id;

  // Check if product exists
  const product = await Products.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  // Find user's cart or create new one
  let cart = await Carts.findOne({ userId });
  
  if (!cart) {
    cart = new Carts({
      userId,
      items: [],
      totalAmount: 0
    });
  }

  // Check if item already exists in cart
  const existingItemIndex = cart.items.findIndex(item => {
    if (!item || !item.productId) {
      return false;
    }
    return item.productId.toString() === productId.toString();
  });

  if (existingItemIndex > -1) {
    // Update quantity if item exists
    cart.items[existingItemIndex].quantity += parseInt(quantity);
  } else {
    // Add new item to cart
    cart.items.push({
      productId,
      quantity: parseInt(quantity),
      productPrice: parseFloat(productPrice)
    });
  }

  // Calculate total
  cart.calculateTotal();
  
  // Save cart
  await cart.save();
  
  // Populate product details
  await cart.populate('items.productId');

  res.status(200).json(cart);
});

/**-----------------------------------------------
 * @desc    Update cart item quantity
 * @route   /api/cart/:itemId
 * @method  PUT
 * @access  private
 ------------------------------------------------*/
const updateCartItem = asyncWrapper(async (req, res) => {
  const { error } = updateCartValidate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { quantity } = req.body;
  const { itemId } = req.params;
  const userId = req.user.id;

  console.log("Received itemId:", itemId);
  console.log("User ID:", userId);

  // Validate inputs
  if (!itemId) {
    return res.status(400).json({ message: "Item ID is required" });
  }

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  // Find user's cart
  const cart = await Carts.findOne({ userId });
  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  // Check if cart has items
  if (!cart.items || cart.items.length === 0) {
    return res.status(404).json({ message: "Cart is empty" });
  }

  console.log("Cart items found:", cart.items.map(item => ({
    itemId: item._id ? item._id.toString() : 'undefined',
    productId: item.productId ? item.productId.toString() : 'undefined'
  })));

  // Find the item by _id with proper null checks
  const itemIndex = cart.items.findIndex(item => {
    if (!item || !item._id) {
      return false;
    }
    return item._id.toString() === itemId.toString();
  });

  if (itemIndex === -1) {
    return res.status(404).json({ 
      message: "Item not found in cart",
      receivedItemId: itemId,
      availableItems: cart.items.map(item => ({
        itemId: item && item._id ? item._id.toString() : 'undefined',
        productId: item && item.productId ? item.productId.toString() : 'undefined'
      }))
    });
  }

  // Validate quantity
  if (!quantity || quantity < 1) { 
    return res.status(400).json({ message: "Quantity must be greater than 0" });
  }

  // Update quantity
  cart.items[itemIndex].quantity = parseInt(quantity);

  // Calculate total
  cart.calculateTotal();
  
  // Save cart
  await cart.save();
  
  // Populate product details
  await cart.populate('items.productId');

  res.status(200).json(cart);
});

/**-----------------------------------------------
 * @desc    Get user cart
 * @route   /api/cart
 * @method  GET
 * @access  private
 ------------------------------------------------*/
const getCart = asyncWrapper(async (req, res) => {
  const userId = req.user.id;
  
  const cart = await Carts.findOne({ userId }).populate('items.productId');
  
  if (!cart) {
    return res.status(200).json({
      userId,
      items: [],
      totalAmount: 0
    });
  }

  res.status(200).json(cart);
});

/**-----------------------------------------------
 * @desc    Remove item from cart
 * @route   /api/cart/:itemId
 * @method  DELETE
 * @access  private
 ------------------------------------------------*/
const removeFromCart = asyncWrapper(async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user.id;

  if (!itemId) {
    return res.status(400).json({ message: "Item ID is required" });
  }

  const cart = await Carts.findOne({ userId });
  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  // Remove item from cart with proper null checks
  cart.items = cart.items.filter(item => {
    if (!item || !item._id) {
      return false;
    }
    return item._id.toString() !== itemId.toString();
  });
  
  // Calculate total
  cart.calculateTotal();
  
  // Save cart
  await cart.save();
  
  // Populate product details
  await cart.populate('items.productId');

  res.status(200).json(cart);
});

module.exports = {
  addToCart,
  updateCartItem,
  getCart,
  removeFromCart
};
