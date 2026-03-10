const mongoose = require('mongoose');
const validator = require('validator'); 

const addressSchema = new mongoose.Schema({
  flatNo: {
    type: String,
    trim: true,
    maxlength: [10, "Flat number cannot exceed 10 characters"]
  },
  landmark: {
    type: String,
    trim: true,
    maxlength: [50, "Landmark cannot exceed 50 characters"]
  },
  street: {
    type: String,
    trim: true,
    maxlength: [50, "Street name cannot exceed 50 characters"]
  },
  city: {
    type: String,
    required: [true, "City is required"],
    trim: true,
    match: [/^[a-zA-Z\s]+$/, "City name must contain only letters"]
  },
  district: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    required: [true, "State is required"],
    trim: true,
    match: [/^[a-zA-Z\s]+$/, "State name must contain only letters"]
  },
  zipCode: {
    type: String, // better as String to validate length
    required: [true, "Zip code is required"],
    match: [/^\d{6}$/, "Zip code must be exactly 6 digits"]
  },
  // country: {
  //   type: String,
  //   required: [true, "Country is required"],
  //   trim: true,
  //   match: [/^[a-zA-Z\s]+$/, "Country name must contain only letters"]
  // }
});

const Addresses = mongoose.model('Address', addressSchema);

module.exports = {
    Addresses
};
