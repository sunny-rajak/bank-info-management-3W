const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/auth");
const bankRoutes = require("./routes/bank");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");

const app = express();

const allowedOrigins = [
    "http://localhost:3000",
    "https://bank-info-management-frontend.vercel.app/",
    "https://bank-info-management-frontend-sunny-rajaks-projects.vercel.app/",
    "https://bank-info-management-frontend-git-main-sunny-rajaks-projects.vercel.app/",
];

// Middleware
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/bank", bankRoutes);

const PORT = process.env.PORT || 5000;

// DB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

// Routes placeholder
app.get("/", (req, res) => res.send("Bank Info API Running"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
