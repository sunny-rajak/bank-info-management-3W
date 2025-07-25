// routes/user.js
const express = require("express");
const auth = require("../middleware/auth");
const BankAccount = require("../models/BankAccount");
const User = require("../models/User");

const router = express.Router();

// @route   GET /api/user/account
router.get("/account", auth, async (req, res) => {
    try {
        const accounts = await BankAccount.find({ user: req.user.id });
        const user = await User.findById(req.user.id).select("username email");

        if (!accounts || !user) {
            return res.status(404).json({ message: "Bank account not found" });
        }

        res.json({
            user: {
                name: user.username,
                email: user.email,
            },
            accounts,
        });
    } catch (err) {
        console.error("User account fetch error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
