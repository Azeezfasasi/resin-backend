const express = require("express");
const router = express.Router();
const {
    getAllProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct,
    upload,
    addVariant,
    removeVariant,
} = require("../controllers/productControllers");
const multer = require("multer");

const storage = multer.memoryStorage(); // Store files in memory
const uploadMulter = multer({ storage: storage });

router.get("/", getAllProducts);
router.get("/:id", getProductById);
// router.post("/", upload.array("images", 10), createProduct); 
router.post(
    "/",
    uploadMulter.fields([
        { name: "images", maxCount: 10 },
        // dynamically made variant image names.
    ]),
    createProduct
);
router.delete("/:id", deleteProduct);
router.get('/count', async (req, res) => {
    try {
        const count = await Product.countDocuments();
        res.json({ count: count });
    } catch (error) {
        console.error('Error counting products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.put('/:id', upload.array('images',10), updateProduct);
router.put("/:productId/add-variant", addVariant);
router.put("/:productId/remove-variant", removeVariant);

module.exports = router;