const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET = "secret123";

router.post("/register", async (req, res) => {
  const { firstName,lastName, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashed,
    bio: "",
    skills: [],
    socialLinks: [],
  });

  res.json(user);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json("User not found");

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json("Wrong password");

  const token = jwt.sign({ id: user._id }, SECRET);

  res.json({ token });
});

module.exports = router;
