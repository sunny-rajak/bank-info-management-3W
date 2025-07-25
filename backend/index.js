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

// Middleware
app.use(cors());
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
