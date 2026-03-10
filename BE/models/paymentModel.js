const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  // Reference back to the specific Order
  orderID: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order', 
    required: true 
  },
  // Redundant but useful reference to the User
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  transactionId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, required: true, default: 'completed' }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);