const express = require("express");
const Cart = require("../models/cart");
const router = express.Router();

// Get user's cart
router.get("/:userId", async (req, res) => {
  const cart = await Cart.findOne({ userId: req.params.userId }).populate("products.productId");
  res.json(cart);
});

// Add product to cart
router.post("/", async (req, res) => {
  const { userId, productId, quantity } = req.body;
  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({ userId, products: [{ productId, quantity }] });
  } else {
    cart.products.push({ productId, quantity });
    await cart.save();
  }

  res.status(201).json(cart);
});

module.exports = router;
