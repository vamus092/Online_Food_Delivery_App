const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  agentName: {
    type: String,
    required: [true, "Agent Name is required"],
    trim: true,
    minlength: [2, "Agent Name must be at least 2 characters long"],
    maxlength: [50, "Agent Name cannot exceed 50 characters"]
  },
  phoneNumber: {
    type: String,
    required: [true, "Agent phone number is required"],
    validate: {
      validator: function(v) {
        // Simple regex for 10-digit phone numbers
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid 10-digit phone number`
    }
  },
  availability: {
    type: Boolean,
    required: [true, "Agent availability is required"],
    default: true
  },
  orderAssigned:{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order',
  }
}, { timestamps: true });

module.exports = mongoose.model('Agent', agentSchema);

