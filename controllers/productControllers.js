const Product = require("../models/product");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ dest: 'uploads/' });

const createProduct = async (req, res) => {
    try {
        console.log("Start createProduct");
        console.log("Request Body:", req.body);
        console.log("Request Files:", req.files); // Log req.files

        if (!req.files || req.files.length === 0) {
            console.log("No files were uploaded");
            return res.status(400).json({ message: "No image files uploaded" });
        }

        const categories = req.body.category;
        const imagePaths = req.files.map(file => `https://resin-backend.onrender.com/uploads/${file.filename}`);

        console.log("Image Paths:", imagePaths);
        console.log("Categories:", categories);

        const product = new Product({
            name: req.body.name,
            shortDescription: req.body.shortDescription,
            longDescription: req.body.longDescription,
            price: req.body.price,
            images: imagePaths,
            category: categories,
        });

        console.log("Product object before save:", product);

        const savedProduct = await product.save();
        console.log("Saved product image paths:", savedProduct.images);

        console.log("Saved Product:", savedProduct);
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error("Create Product Error:", error); // Log the error
        res.status(500).json({ message: error.message });
    }
};

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        const productsWithFullImagePaths = products.map((product) => {
            const productObject = product.toObject();
            if (productObject.images && productObject.images.length > 0) {
                productObject.images = productObject.images.map((image) => {
                    return image;
                });
            }
            return productObject;
        });
        res.status(200).json(productsWithFullImagePaths);
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
        const productObject = product.toObject();
        if (productObject.images && productObject.images.length > 0) {
            productObject.images = productObject.images.map((image) => {
                return image;
            });
        }
        res.status(200).json(productObject);
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
            const imagePaths = req.files.map(file => `https://resin-backend.onrender.com/uploads/${file.filename}`);
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