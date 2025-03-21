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
        console.log("Start createProduct");
        console.log("Request Body:", req.body);
        console.log("Request Files:", req.files);

        if (!req.files || req.files.length === 0) {
            console.log("No files were uploaded");
            return res.status(400).json({ message: "No image files uploaded" });
        }

        const categories = req.body.category;
        const imagePaths = req.files.map(file => file.path); // Cloudinary URLs

        console.log("Image Paths (Cloudinary URLs):", imagePaths);
        console.log("Categories:", categories);

        const product = new Product({
            name: req.body.name,
            shortDescription: req.body.shortDescription,
            longDescription: req.body.longDescription,
            price: req.body.price,
            images: imagePaths,
            category: categories,
        });

        const savedProduct = await product.save();
        console.log("Saved Product:", savedProduct);
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error("Create Product Error:", error);
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
        const { name, shortDescription, longDescription, price, category } = req.body;
        let updatedFields = { name, shortDescription, longDescription, price, category };

        if (req.files && req.files.length > 0) {
            const imagePaths = req.files.map(file => file.path); // Cloudinary URLs
            updatedFields.images = imagePaths;
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, updatedFields, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error);
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

module.exports = {
    getAllProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct,
    upload,
};
