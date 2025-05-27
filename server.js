const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const User = require("./models/user"); // ✅ Import User model
const bcrypt = require("bcryptjs"); // ✅ Import bcrypt
const path = require('path');
const productRoutes = require('./routes/productRoutes');
const registrationRoutes = require('./routes/registrationRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Ensure userRoutes exists before requiring it
const userRoutes = require("./routes/userRoutes"); // ✅ Import correctly
app.use("/api/users", userRoutes); // ✅ Use the imported route

app.use("/api/product", require("./routes/productRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const orderRoutes = require("./routes/orderRoutes"); 
app.use("/api/orders", orderRoutes);
app.use('/api', registrationRoutes);

app.post("/send-email", async (req, res) => {
    const { to, subject, text } = req.body;

    if (!to || !subject || !text) {
        return res.status(400).json({ success: false, message: "Missing fields!" });
    }

    const result = await sendEmail(to, subject, text);
    res.json(result);
});

// app.use('/api/wishlist', wishlistRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
