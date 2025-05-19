const mongoose = require("mongoose");
const Joi = require("joi");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true
    },
    items: [{
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
        required: true
      },
      name: String,
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      productPrice: {
        type: Number,
        required: true
      }
    }],
    totalAmount: {
      type: Number,
      required: true
    },
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      enum: ['cash_on_delivery', 'credit_card', 'paypal'],
      default: 'cash_on_delivery'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    paymentDetails: {
      type: Object
    },
    trackingNumber: String
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model("Order", OrderSchema);

// Validate Create Order
function validateCreateOrder(obj) {
  const schema = Joi.object({
    items: Joi.array().items(
      Joi.object({
        productId: Joi.string().required(),
        name: Joi.string(),
        quantity: Joi.number().integer().min(1).required(),
        productPrice: Joi.number().min(0).required()
      })
    ).min(1).required(),
    totalAmount: Joi.number().min(0).required(),
    shippingAddress: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(), 
      country: Joi.string().required(),
      zipCode: Joi.string().required()
    }).required(),
    paymentMethod: Joi.string().valid('cash_on_delivery', 'credit_card', 'paypal').default('cash_on_delivery').required()
  });
  return schema.validate(obj);
}

// Validate Update Order
function validateUpdateOrder(obj) {
  const schema = Joi.object({
    status: Joi.string().valid('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
    paymentStatus: Joi.string().valid('pending', 'paid', 'failed', 'refunded'),
    trackingNumber: Joi.string(),
    paymentDetails: Joi.object()
  });
  return schema.validate(obj);
}

// Validate Order Status Update
function validateOrderStatus(obj) {
  const schema = Joi.object({
    status: Joi.string().valid('pending', 'processing', 'shipped', 'delivered', 'cancelled').required()
  });
  return schema.validate(obj);
}

// Validate Payment Status Update
function validatePaymentStatus(obj) {
  const schema = Joi.object({
    paymentStatus: Joi.string().valid('pending', 'paid', 'failed', 'refunded').required()
  });
  return schema.validate(obj);
}

module.exports = {
  Order,
  validateCreateOrder,
  validateUpdateOrder,
  validateOrderStatus,
  validatePaymentStatus
};
