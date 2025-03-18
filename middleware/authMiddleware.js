const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Import your User model

const protect = async (req, res, next) => {
  let token = req.headers.authorization;
  console.log("Received Token:", token);
  if (token) {
    try {
      const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
      const user = await User.findById(decoded.id); // Fetch the user from the database

      if (!user) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
      }

      if (user.disabled) {
        return res.status(403).json({ message: "Forbidden: User is disabled" });
      }

      req.user = decoded; // Store the decoded token (for id and role)
      req.user.dbUser = user; // Store the full user object from the database

      next();
    } catch (error) {
      console.error("Token Verification Error:", error);
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  } else {
    return res.status(401).json({ message: "No token found" });
  }
};

module.exports = protect;