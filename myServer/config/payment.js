// Simple payment service for Cash on Delivery
const Payment = {
    processPayment: async ({ amount, orderId }) => {
      try {
        // For Cash on Delivery, we just approve the payment without processing
        return {
          success: true,
          details: {
            method: 'cash_on_delivery',
            amount: amount,
            orderId: orderId,
            timestamp: new Date()
          }
        };
      } catch (error) {
        console.error("Payment processing error:", error);
        return {
          success: false,
          error: "Failed to process payment: " + error.message
        };
      }
    }
  };
  
  module.exports = Payment;
  