const express = require("express");
const router = express.Router();
// const { registerUser, loginUser } = require("../controllers/userControllers");
const {registerUser, loginUser, requestPasswordReset, resetPassword, forgotPassword, editUser, getUserRoleCounts, getAllUsers, getMe, deleteUser, resetUserPassword, changeUserRole, upload } = require("../controllers/userControllers");

const authMiddleware = require('../middleware/authMiddleware');

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.post("/forgot-password", forgotPassword);
router.get('/role-counts', getUserRoleCounts);
router.get('/', getAllUsers);
router.get('/me', authMiddleware, getMe);
router.put('/:userId', authMiddleware, upload, editUser);
router.delete('/:userId', authMiddleware, deleteUser);
router.patch('/:userId/reset-password', authMiddleware, resetUserPassword);
router.patch('/:userId/role', authMiddleware, changeUserRole);


module.exports = router;
