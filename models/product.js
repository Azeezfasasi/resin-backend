// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema({
//     name: String,
//     category: String,
//     shortDescription: String,
//     longDescription: String,
//     price: Number,
//     images: [String],
// }, { timestamps: true });

// module.exports = mongoose.model("Product", productSchema);

const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
    name: String, // e.g., "Small", "Medium", "Large"
    price: Number,
    stock: Number,
    image: [String], // Optional: specific image for the variant
    attributes: {
        color: String,
        size: String,
        material: String
    }
});

const productSchema = new mongoose.Schema({
    name: String,
    category: String,
    shortDescription: String,
    longDescription: String,
    basePrice: Number, // Default price, if no variant is selected
    images: [String],
    variants: [variantSchema] // New field for variable products
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
