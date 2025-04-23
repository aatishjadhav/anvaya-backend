const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided." });
  }

  const token = authHeader.split(" ")[1]; // Extract token from "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: "Token format invalid." });
  }

  try {
    const decodeToken = jwt.verify(token, JWT_SECRET);
    req.user = decodeToken;
    next();
  } catch (error) {
    return res.status(402).json({ message: "Invalid token." });
  }
};

module.exports = verifyToken;
