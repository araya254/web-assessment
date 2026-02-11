const jwt = require("jsonwebtoken");
const SECRET = "mysecretkey";

function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token.split(" ")[1], SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Token ไม่ถูกต้อง" });
  }
}

module.exports = auth;
