const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();


const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));



mongoose.connect(process.env.DB);

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

app.listen(8000, () => console.log("Server running on 8000"));
