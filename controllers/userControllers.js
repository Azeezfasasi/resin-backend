const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const sendResetEmail = require("../mail");

const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Storage Configuration for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "profile_images", // Cloudinary folder name
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [{ width: 500, height: 500, crop: "limit" }], // Resize images
    },
});

const upload = multer({ storage });

// Register user
const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, role, profileImage } = req.body;

  if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
  }

  // Hash password before saving
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
      const newUser = await User.create({
          firstName,
          lastName,
          email,
          password: hashedPassword,  // Store hashed password
          role,
          profileImage,
      });

      res.status(201).json({ message: "User registered successfully. Please login" });
  } catch (error) {
      res.status(500).json({ message: "Error registering user", error });
  }
};

// Login User
const loginUser = async (req, res) => {
  console.log("Received login request:", req.body); // Debugging

  const { email, password } = req.body;

  if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email });

  if (!user) {
      return res.status(400).json({ message: "User not found" });
  }

  // Compare hashed password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
  }

  // Generate JWT Token
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "24h" });

  res.status(200).json({
      message: "Login successful",
      token,
      user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
      },
  });
};

// Request Password Reset
const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Generate a token valid for 1 hour
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
  
      // Send email with reset link
      await sendResetEmail(email, token);
  
      res.status(200).json({ message: "Password reset email sent successfully" });
    } catch (error) {
      console.error("Password reset error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

//   Reset password
 const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
  
    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update password
      user.password = hashedPassword;
      await user.save();
  
      res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(400).json({ message: "Invalid or expired token" });
    }
  };

//   Forgot password
const forgotPassword = async (req, res) => {
    console.log("Forgot Password Route Hit");  // Debugging log
    try {
        const { email } = req.body;
        console.log("Email received:", email); // Debugging log

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });
        console.log("User found:", user); // Debugging log

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate Reset Token (Example: You may use JWT or a random string)
        const resetToken = "123456"; // Replace with real token generation logic
        console.log("Generated Reset Token:", resetToken);

        // Send Reset Email (Ensure email service is working)
        await sendResetEmail(email, resetToken);
        console.log("Reset email sent");

        res.json({ message: "Password reset link sent to email" });
    } catch (error) {
        console.error("Forgot Password Error:", error); // Show error in terminal
        res.status(500).json({ message: "Internal server error" });
    }
};

// Edit User
// const editUser = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const updatedData = req.body;

//     // Hash the password if it's included
//     if (updatedData.password) {
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(updatedData.password, salt);
//       updatedData.password = hashedPassword;
//     }

//     const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });

//     if (!updatedUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json({ message: "User updated successfully", user: updatedUser });
//   } catch (error) {
//     console.error("Edit User Error:", error);
//     res.status(500).json({ message: "Internal server error", error: error.message });
//   }
// };
const editUser = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error uploading file', error: err });
    }
    try {
      const { userId } = req.params;
      const { firstName, lastName, email, password } = req.body;
      const updatedData = { firstName, lastName, email };

      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        updatedData.password = hashedPassword;
      }

      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'profile_images',
        });
        updatedData.profileImage = result.secure_url;
        fs.unlinkSync(req.file.path);
      }

      const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
      console.error('Edit User Error:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });
};

// Role Counts
const getUserRoleCounts = async (req, res) => {
  try {
      const customerCount = await User.countDocuments({ role: "Customer" });
      const adminCount = await User.countDocuments({ role: "Admin" });

      res.status(200).json({ customerCount, adminCount });
  } catch (error) {
      console.error("Error getting user role counts:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
      const users = await User.find(); // Fetch all users from the database
      res.status(200).json(users);
  } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};

// Get me (Current User)
const getMe = async (req, res) => {
  try {
      if (!req.user) {
          return res.status(401).json({ message: "Unauthorized" });
      }
      const user = await User.findById(req.user.id);
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
  } catch (error) {
      console.error("Error fetching user details:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
      const { userId } = req.params;
      console.log("Backend received delete request for user ID:", userId); // Add this line
      const deletedUser = await User.findByIdAndDelete(userId);

      if (!deletedUser) {
          return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};

// Reset users passwords from admin dash
const resetUserPassword = async (req, res) => {
  try {
      const { userId } = req.params;
      const { newPassword } = req.body;

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      const updatedUser = await User.findByIdAndUpdate(
          userId,
          { password: hashedPassword },
          { new: true }
      );

      if (!updatedUser) {
          return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
      console.error("Error resetting user password:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};

// Change User Role
const changeUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: role },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User role updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error changing user role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = { registerUser, loginUser, requestPasswordReset, resetPassword, forgotPassword, editUser, getUserRoleCounts, getAllUsers, getMe, deleteUser, resetUserPassword, changeUserRole  };
