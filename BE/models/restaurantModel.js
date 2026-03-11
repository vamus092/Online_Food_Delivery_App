const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
    restaurantName: {
        type: String,
        required: [true, 'Restaurant name is required'],
        trim: true,
        minlength: [3, 'Restaurant name must be at least 3 characters long'],
        maxlength: [100, 'Restaurant name cannot exceed 100 characters']
    },
    address: {
        landmark: {
            type: String,
            trim: true,
            maxlength: [100, 'Landmark cannot exceed 100 characters']
        },
        district: {
            type: String,
            trim: true,
            required: [true, 'District is required']
        },
        state: {
            type: String,
            trim: true,
            required: [true, 'State is required']
        }
    },
    contactNumber: {
        type: String,
        required: [true, 'Contact number is required'],
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v); // Ensures exactly 10 digits
            },
            message: props => `${props.value} is not a valid 10-digit contact number`
        }
    },
    openingHours: {
        open: { 
            type: String, 
            validate: {
                validator: function(v) {
                    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v); // HH:mm format
                },
                message: props => `${props.value} is not a valid opening time (HH:mm)`
            }
        },
        close: { 
            type: String, 
            validate: {
                validator: function(v) {
                    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v); // HH:mm format
                },
                message: props => `${props.value} is not a valid closing time (HH:mm)`
            }
        }
    },
    isOperating: { 
        type: Boolean,
        default: true
    },
    managedBy: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'ManagedBy (Admin User) is required']
    },
    menus: [
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Menu'
        }
    ]
}, { timestamps: true });

const Restaurant = mongoose.model('Restaurant', RestaurantSchema);

module.exports = Restaurant;


