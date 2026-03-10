const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  agentAssigned: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent',
  },
  items: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
      quantity: { type: Number, required: true, min: 1 },
    }
  ],
  totalAmount: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    // default: 'Pending',
    // enum:['Pending', 'Accepted', 'Delivery In Progress', 'Cancelled With Refund'],
    enum: {
      values:['Pending', 'Accepted', 'Delivery in progress','Rejected', 'Delivered','Cancelled With refund'],
      message: '{VALUE} is not a valid status'
    },
  },
  paymentMethod: { 
    type: String, enum: ['DEBIT CARD', 'CREDIT CARD', 'UPI'],
    trim: true,
    default: 'DEBIT CARD'
   },
  paymentStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },

  // ETA field with validation
  etaTime: {
    type: Date,
  }

}, { timestamps: true });

orderSchema.pre('findOneAndUpdate', async function () {
  const update = this.getUpdate();
  // console.log(update);

  // Check if status is being set to Accepted
  if (update.etaTime && new Date(update.etaTime) <= new Date()){
    throw new Error('ETA time must be a future date');
  }
 
    // status === Accepted and agentAssigned === undefined
    if (update.status === "Accepted" && !update.agentAssigned) {
    throw new Error('An agent must be assigned only when status is Accepted');
  }

});

// orderSchema.pre('findOneAndUpdate', async function() {
//   const update = this.getUpdate();

//   // Check if status is being set to Accepted
//   if (!update.agentAssigned) {
//     throw new Error('An agent must be assigned when status is Accepted');
//   }
// });


module.exports = mongoose.model('Order', orderSchema);
