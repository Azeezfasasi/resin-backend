const Product = require("../models/product");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config(); // Ensure environment variables are loaded

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Storage Configuration for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "product_images", // Cloudinary folder name
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [{ width: 500, height: 500, crop: "limit" }], // Resize images
    },
});

const upload = multer({ storage });

// Create Product with Cloudinary Image Upload
const createProduct = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No image files uploaded" });
        }

        const imagePaths = req.files.map(file => file.path); // Cloudinary URLs
        // const variants = req.body.variantImages || []; 

        const variants = JSON.parse(req.body.variants || "[]"); 

        const product = new Product({
            name: req.body.name,
            shortDescription: req.body.shortDescription,
            longDescription: req.body.longDescription,
            basePrice: req.body.basePrice,
            images: imagePaths,
            category: req.body.category,
            variants // Save variants
        });

        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Product By ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, shortDescription, longDescription, basePrice, category, variants } = req.body;
        let updatedFields = { name, shortDescription, longDescription, basePrice, category };

        if (req.files && req.files.length > 0) {
            const imagePaths = req.files.map(file => file.path);
            updatedFields.images = imagePaths;
        }

        if (variants) {
            updatedFields.variants = JSON.parse(variants); // Ensure variants are parsed correctly
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, updatedFields, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};


// Delete Product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json({ message: "Product deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a variant to a product
const addVariant = async (req, res) => {
    try {
        const { productId } = req.params;
        const { variant } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (!product.variants) {
            product.variants = [];
        }

        product.variants.push(variant);
        await product.save();

        res.status(200).json(product);
    } catch (error) {
        console.error("Error adding variant:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Remove a variant from a product
const removeVariant = async (req, res) => {
    try {
        const { productId } = req.params;
        const { variantId } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        product.variants = product.variants.filter(variant => variant._id.toString() !== variantId);
        await product.save();

        res.status(200).json(product);
    } catch (error) {
        console.error("Error removing variant:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    getAllProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct,
    upload,
    addVariant,
    removeVariant,
};
