const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: String,
    category: String,
    shortDescription: String,
    longDescription: String,
    price: Number,
    images: [String],
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);