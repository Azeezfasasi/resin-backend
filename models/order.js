// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema({
//     orderNumber: { type: Number, required: true },
//     orderDate: { type: String, required: true },
//     productName: { type: String, required: true },
//     amount: { type: Number, required: true },
//     orderStatus: { type: String, enum: [
//         'Pending', 'Processing', 'On Hold', 'Confirmed', 'Packing',
//         'Out for Delivery', 'Canceled', 'Delivered', 'Completed', 'Refunded',
//         'Partially Shipped'
//     ], default: 'Pending' },
//     // Add other fields as needed (e.g., userId, shippingAddress, etc.)
// }, {
//     timestamps: true, // Adds createdAt and updatedAt fields
// });

// const Order = mongoose.model('Order', orderSchema);

// module.exports = Order;

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderNumber: { type: Number, required: true },
    orderDate: { type: String, required: true },
    productName: { type: String, required: true },
    amount: { type: Number, required: true },
    userId: { type: String, required: true },
    shippingAddress: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    firstName: { type: String, required: true},
    lastName: { type: String, required: true},
    country: { type: String, required: true},
    streetAddress: { type: String, required: true},
    townCity: { type: String, required: true},
    state: { type: String, required: true},
    phone: { type: String, required: true},
    email: { type: String, required: true},
    orderStatus: {
        type: String,
        enum: [
            'Pending', 'Processing', 'On Hold', 'Confirmed', 'Packing',
            'Out for Delivery', 'Canceled', 'Delivered', 'Completed', 'Refunded',
            'Partially Shipped'
        ],
        default: 'Pending'
    },
}, {
    timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;