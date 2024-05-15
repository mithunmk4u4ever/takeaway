const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema({
//     order_data: {
//         type: Array,
//         required: true
//     },
//     order_date: {
//         type: Date,
//         default: Date.now
//     },
//     image: {
//         type: String,
//         // required:true
//     }
// });

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        type: Array,
        required: false
    },
    orders: {
        type: Array,
        required: false,
        default: Date.now
    }, // Embed orders within the User schema
    date: {
        type: Date,
        default: Date.now
    },
    address: [
        {
            house: {
                type: String
            },
            street: {
                type: String
            },
            city: {
                type: String
            },
            pin:{
                type:Number
            },
            phone:{
                type: Number
            },
            required: false,
        }
    ]
});

const User = mongoose.model('User', userSchema);
module.exports = User;
