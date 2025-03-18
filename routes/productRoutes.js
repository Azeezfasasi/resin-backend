const express = require("express");
const router = express.Router();
const {
    getAllProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct,
    upload,
} = require("../controllers/productControllers");

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", upload.array("images", 10), createProduct); // Allow up to 10 images
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

module.exports = router;