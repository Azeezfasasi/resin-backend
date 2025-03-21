// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const Order = require('../models/order');

// POST /api/orders (Create an order)
router.post('/', async (req, res) => {
    try {
        const {
            userId, items, shippingAddress, paymentMethod, total, orderDate,
            firstName, lastName, country, streetAddress, townCity, state, phone, email
        } = req.body;

        const orderNumber = Math.floor(Math.random() * 1000000000);
        const productNames = items.map(item => item.name).join(', ');

        const order = new Order({
            orderNumber: orderNumber,
            orderDate: orderDate,
            productName: productNames,
            amount: total,
            userId: userId,
            shippingAddress: shippingAddress,
            paymentMethod: paymentMethod,
            firstName: firstName,
            lastName: lastName,
            country: country,
            streetAddress: streetAddress,
            townCity: townCity,
            state: state,
            phone: phone,
            email: email,
        });

        await order.save();
        res.status(201).json({ 
            message: 'Order created successfully',
            orderNumber: orderNumber,
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// GET /api/orders (Get all orders)
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// PUT /api/orders/:id (Update order status)
router.put('/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { orderStatus: req.body.orderStatus },
            { new: true }
        );
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: 'Failed to update order status' });
    }
});

// GET /api/orders/track/:orderNumber (Track order by order number)
router.get('/track/:orderNumber', async (req, res) => {
    try {
        const order = await Order.findOne({ orderNumber: req.params.orderNumber });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        console.error('Error tracking order:', error);
        res.status(500).json({ error: 'Failed to track order' });
    }
});

// Get Count Orders
router.get('/count', async (req, res) => {
    try {
        const count = await Order.countDocuments();
        res.json({ count: count });
    } catch (error) {
        console.error('Error counting orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;