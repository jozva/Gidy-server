const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const SECRET = "secret123";

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const firstName =
      (req.body.firstName || "user")
        .toLowerCase()
        .replace(/\s+/g, "");

    const ext = path.extname(file.originalname);
    const fileName = `${firstName}_resume${ext}`;

    cb(null, fileName);
  },
});

const upload = multer({ storage });


function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json("No token");

  try {
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json("Invalid token");
  }
}

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json(user);
  } catch (err) {
    res.status(500).json("Server error");
  }
});

router.put("/", auth, async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.userId,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json("Update failed");
  }
});

router.post("/education", auth, async (req, res) => {
  try {
    const {
      college,
      degree,
      field,
      location,
      startDate,
      endDate,
      current,
    } = req.body;

    const user = await User.findById(req.userId);

    user.education.push({
      college,
      degree,
      field,
      location,
      startDate,
      endDate,
      current,
    });

    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json("Failed to add education");
  }
});



router.post("/generate-bio", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    const skills = user.skills?.join(", ") || "";
    const education = user.education?.map(e => e.degree).join(", ") || "";
    const experience = user.experience?.map(e => e.role).join(", ") || "";

    const bio = `Passionate ${experience || "aspiring"} professional with a background in ${education || "relevant studies"}. Skilled in ${skills || "various technologies"}. Eager to build impactful products and grow as a developer.`;

    res.json({ bio });
  } catch (err) {
    res.status(500).json("Error generating bio");
  }
});


router.post(
  "/upload-resume",
  auth,
  upload.single("resume"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Cloudinary file URL
      const fileUrl = req.file.path;

      const user = await User.findByIdAndUpdate(
        req.userId,
        { resume: fileUrl },
        { returnDocument: "after" }
      );

      res.json(user);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Resume upload failed" });
    }
  }
);



router.put("/", auth, async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.userId,
      req.body,
      { returnDocument: "after" }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json("Update failed");
  }
});




module.exports = router;
