const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (user) {
      req.user = user;
    }
  } catch (err) {
    console.error('Lỗi xác thực:', err.message);
  }
  next();
};

const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Không có quyền truy cập!" });
    }
    next();
};

module.exports = { auth, isAdmin };
