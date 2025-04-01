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

router.get("/", getAllProducts);
router.get("/:id", getProductById);
// router.post("/", upload.array("images", 10), createProduct); 
router.post("/", upload.fields([{ name: 'images', maxCount: 10 }, { name: 'variants[0][image]', maxCount: 1 }, { name: 'variants[1][image]', maxCount: 1 }, { name: 'variants[2][image]', maxCount: 1 }, { name: 'variants[3][image]', maxCount: 1 }, { name: 'variants[4][image]', maxCount: 1 }, { name: 'variants[5][image]', maxCount: 1 }, { name: 'variants[6][image]', maxCount: 1 }, { name: 'variants[7][image]', maxCount: 1 }, { name: 'variants[8][image]', maxCount: 1 }, { name: 'variants[9][image]', maxCount: 1 }]), createProduct);
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