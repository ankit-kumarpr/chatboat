const jwt = require("jsonwebtoken");

// const jwt = require("jsonwebtoken");
// const User = require("../models/User"); 

// module.exports = async (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   console.log("auth headers", authHeader);
//   if (!authHeader || !authHeader.startsWith("Bearer ")) return res.sendStatus(401);

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
//     req.user = decoded;

//  
//     const user = await User.findById(decoded.id);
//     if (!user) return res.status(404).json({ error: "User not found" });

//     if (user.isBanned.status) {
//       // If temporary ban
//       if (user.isBanned.bannedUntil && new Date(user.isBanned.bannedUntil) > new Date()) {
//         return res.status(403).json({ error: "You are temporarily banned", reason: user.isBanned.reason });
//       }

//       // If permanent ban (no bannedUntil date)
//       if (!user.isBanned.bannedUntil) {
//         return res.status(403).json({ error: "You are permanently banned", reason: user.isBanned.reason });
//       }
//     }

//     next();
//   } catch (err) {
//     console.error("Auth error:", err);
//     return res.sendStatus(403);
//   }
// };

// module.exports = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   console.log("auth headers",authHeader);
//   if (!authHeader || !authHeader.startsWith("Bearer ")) return res.sendStatus(401);

//   const token = authHeader.split(" ")[1];
//   try {
//     const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.sendStatus(403);
//   }
// };



// const jwt = require('jsonwebtoken');
const User = require('../Models/UserModel'); // optional if you want to validate user existence

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Auth Header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: true, message: "Unauthorized: Token missing or malformed" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

    // Optional: Verify user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: true, message: "Unauthorized: User not found" });
    }

    req.user = user; // attach full user object for convenience
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    return res.status(403).json({ error: true, message: "Forbidden: Invalid or expired token" });
  }
};