const express = require("express");
const BankAccount = require("../models/BankAccount");
const User = require("../models/User");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();

// @route   GET /api/admin/accounts
// @desc    View all user bank accounts with optional filters
// @access  Admin only
// router.get("/accounts", auth, admin, async (req, res) => {
//     const { username, email, ifscCode, bankName } = req.query;

//     try {
//         const users = await User.find({
//             ...(username && { username: { $regex: username, $options: "i" } }),
//             ...(email && { email: { $regex: email, $options: "i" } }),
//         });

//         const userIds = users.map((u) => u._id);

//         const accounts = await BankAccount.find({
//             user: { $in: userIds },
//             ...(ifscCode && { ifscCode: { $regex: ifscCode, $options: "i" } }),
//             ...(bankName && { bankName: { $regex: bankName, $options: "i" } }),
//         }).populate("user", "username email");

//         res.status(200).json(accounts);
//     } catch (err) {
//         res.status(500).json({ message: "Server error" });
//     }
// });

router.get("/accounts", auth, admin, async (req, res) => {
    const {
        username,
        email,
        ifscCode,
        bankName,
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        order = "desc",
    } = req.query;

    try {
        // Step 1: Filter users
        const userQuery = {};
        if (username) userQuery.username = { $regex: username, $options: "i" };
        if (email) userQuery.email = { $regex: email, $options: "i" };

        const matchedUsers = await User.find(userQuery);
        const matchedUserIds = matchedUsers.map((u) => u._id);

        // Step 2: Filter accounts
        const accountQuery = {};
        if (matchedUserIds.length > 0)
            accountQuery.user = { $in: matchedUserIds };
        if (ifscCode)
            accountQuery.ifscCode = { $regex: ifscCode, $options: "i" };
        if (bankName)
            accountQuery.bankName = { $regex: bankName, $options: "i" };

        // Step 3: Sorting & Pagination
        const sortOption = { [sortBy]: order === "asc" ? 1 : -1 };
        const skip = (page - 1) * limit;

        const accounts = await BankAccount.find(accountQuery)
            .populate("user", "username email")
            .sort(sortOption)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await BankAccount.countDocuments(accountQuery);

        res.status(200).json({
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            accounts,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// @route   DELETE /api/admin/account/:id
// @desc    Admin deletes a bank account by ID
// @access  Private (Admin only)
router.delete("/accounts/:id", auth, admin, async (req, res) => {
    try {
        const deleted = await BankAccount.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: "Account not found" });
        }

        res.status(200).json({ message: "Account deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
