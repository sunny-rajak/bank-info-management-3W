const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// @route   POST /api/auth/register
router.post("/register", async (req, res) => {
    const { username, email, password, isAdmin } = req.body;

    console.log("Incoming registration:", req.body);
    try {
        // Check if email exists
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: "Email already exists" });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            isAdmin: isAdmin || false,
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// @route   POST /api/auth/login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            {
                expiresIn: "2d",
            }
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
