const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token)
        return res
            .status(401)
            .json({ message: "Access denied. No token provided." });

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        req.user = {
            id: decoded.id,
            isAdmin: decoded.isAdmin, // ✅ include isAdmin
        }; // decoded contains { id: userId }
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid token." });
    }
};

module.exports = authMiddleware;
