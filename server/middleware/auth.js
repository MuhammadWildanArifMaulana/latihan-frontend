const jwt = require("jsonwebtoken");
require("dotenv").config();

function verifyToken(req, res, next) {
  const header = req.headers["authorization"] || req.headers["Authorization"];
  if (!header) return res.status(401).json({ message: "No token provided" });

  const parts = header.split(" ");
  if (parts.length !== 2)
    return res.status(401).json({ message: "Token error" });

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme))
    return res.status(401).json({ message: "Malformed token" });

  jwt.verify(token, process.env.JWT_SECRET || "secret", (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
}

module.exports = { verifyToken };
