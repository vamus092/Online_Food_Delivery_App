const mongoose = require('mongoose');
const validator = require('validator'); 
const Address = require('./addressModel');

// Here Schema() constructor of schema class
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is missing"],
    trim: true,
    validate: [
      {
        validator: function(value) {
          return validator.isAlpha(value, 'en-US', { ignore: ' ' });
        },
        message: "Username should contain only alphabets"
      }
    ]
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    lowercase: true,
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email"
    }
  },
  password: {
    type: String,
    required: [true, "Password is missing"],
    minlength: [8, "Password should be at least 8 characters"],
    select: false
  },
  dateofBirth: {
    type: Date
  },
  phoneNumber: {
    type: String,
    validate: {
      validator: function(value) {
        return /^\d{10}$/.test(value);
      },
      message: "Phone number must be exactly 10 digits"
    }
  },
  role: {
    type: String,
    required: [true, "Role is a required field"],
    enum: {
      values: ['ADMIN', 'USER','HOTEL-MANAGER'],
      message: "This role does, not exist"
    },
    trim: true,
    default:'USER',
    uppercase: true, 
  },
  status:{
     type:String,
     default:'active'   
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address'
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = {
    User
};














//name: A string that identifies the model. Here it’s "User".
//schema: The schema object you defined earlier (userSchema),
// which describes the structure of documents in that collection.

//It binds the schema to a MongoDB collection.
//It returns a Model class (User in this case).
//That model has methods like .find(), .findById(), .create(), .updateOne(), etc.