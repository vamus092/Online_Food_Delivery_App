const mongoose = require('mongoose');
const validator = require('validator');

const menuSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  SectionName: {
    type: String,
    required: [true, "Section name is required"],
    trim: true,
    maxlength: [50, "Section name cannot exceed 50 characters"],
    enum: {
      values: ['Main Course', 'Desserts', 'Beverages', 'Starters'],
      message: '{VALUE} is not a valid section name'
    }
  },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item'
    }
  ]
}, { timestamps: true });


module.exports = mongoose.model('Menu', menuSchema);
