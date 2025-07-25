const express = require("express");
const BankAccount = require("../models/BankAccount");
const auth = require("../middleware/auth");

const router = express.Router();

// @route   POST /api/bank/add
// @desc    Add new bank account
// @access  Private
router.post("/add", auth, async (req, res) => {
    const { ifscCode, branchName, bankName, accountNumber, accountHolderName } =
        req.body;

    if (
        !ifscCode ||
        !branchName ||
        !bankName ||
        !accountNumber ||
        !accountHolderName
    ) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const newAccount = new BankAccount({
            user: req.user.id,
            ifscCode,
            branchName,
            bankName,
            accountNumber,
            accountHolderName,
        });

        await newAccount.save();
        res.status(201).json({
            message: "Bank account added",
            account: newAccount,
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// @route   GET /api/bank
// @desc    Get all bank accounts of logged-in user
// @access  Private
router.get("/", auth, async (req, res) => {
    try {
        const accounts = await BankAccount.find({ user: req.user.id });
        res.status(200).json(accounts);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// @route   PUT /api/bank/:id
// @desc    Update bank account by ID
// @access  Private
router.put("/:id", auth, async (req, res) => {
    try {
        const updated = await BankAccount.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true }
        );

        if (!updated)
            return res.status(404).json({ message: "Bank account not found" });

        res.status(200).json({
            message: "Updated successfully",
            account: updated,
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// @route   DELETE /api/bank/:id
// @desc    Delete bank account by ID
// @access  Private
router.delete("/:id", auth, async (req, res) => {
    try {
        const deleted = await BankAccount.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id,
        });

        if (!deleted)
            return res.status(404).json({ message: "Bank account not found" });

        res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
