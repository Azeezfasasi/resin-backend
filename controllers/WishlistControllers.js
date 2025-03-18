// const Wishlist = require("../models/Wishlist.js");
// const Product = require("../models/product.js");


// const addToWishlist = async (req, res) => {
//     try {
//         const { productId } = req.body;
//         const userId = req.user.id;

//         const product = await Product.findById(productId);
//         if (!product) {
//             return res.status(404).json({ message: 'Product not found' });
//         }

//         let wishlist = await Wishlist.findOne({ userId });

//         if (!wishlist) {
//             wishlist = new Wishlist({ userId, items: [] });
//         }

//         // Check if product already exists
//         const itemExists = wishlist.items.find(item => item.productId.toString() === productId);
//         if (itemExists) {
//             return res.status(400).json({ message: 'Product already in wishlist' });
//         }

//         wishlist.items.push({
//             productId,
//             name: product.name,
//             price: product.price,
//             image: product.image
//         });

//         await wishlist.save();
//         res.status(201).json(wishlist);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// const removeFromWishlist = async (req, res) => {
//     try {
//         const { productId } = req.params;
//         const userId = req.user.id;

//         const wishlist = await Wishlist.findOne({ userId });
//         if (!wishlist) {
//             return res.status(404).json({ message: 'Wishlist not found' });
//         }

//         wishlist.items = wishlist.items.filter(item => item.productId.toString() !== productId);

//         await wishlist.save();
//         res.status(200).json({ message: 'Item removed from wishlist', wishlist });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// const getWishlist = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const wishlist = await Wishlist.findOne({ userId }).populate('items.productId');

//         if (!wishlist) {
//             return res.status(404).json({ message: 'Wishlist not found' });
//         }

//         res.status(200).json(wishlist);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// const clearWishlist = async (req, res) => {
//     try {
//         const userId = req.user.id;

//         const wishlist = await Wishlist.findOne({ userId });
//         if (!wishlist) {
//             return res.status(404).json({ message: 'Wishlist not found' });
//         }

//         wishlist.items = [];
//         await wishlist.save();

//         res.status(200).json({ message: 'Wishlist cleared' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// module.exports = {
//     addToWishlist,
//     removeFromWishlist,
//     getWishlist,
//     clearWishlist
// };
