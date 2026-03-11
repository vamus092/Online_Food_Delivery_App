const mongoose = require('mongoose');
const validator = require('validator');

const itemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: [true, "Item name is required"],
    trim: true,
    maxlength: [100, "Item name cannot exceed 100 characters"]
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [11, "Price must be at least 11"],
    max: [10000, "Price cannot exceed 10,000"]
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
    maxlength: [500, "Description cannot exceed 500 characters"]
  },
  imagePath: {
    type: String,
  }
}, { timestamps: true });


const Item = mongoose.model('Item', itemSchema);

module.exports = {
   Item
};