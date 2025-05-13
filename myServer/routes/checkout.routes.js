const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkout.controller');
const { verifyToken } = require('../middlewares/verifyToken');

// Checkout route - process a new order
router.post('/', verifyToken, checkoutController.processCheckout);

// Get order details by ID
router.get('/:orderId', verifyToken, checkoutController.getOrderDetails);

module.exports = router;
 