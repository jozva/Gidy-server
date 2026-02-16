const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "resumes",
    resource_type: "raw",
    format: async () => "pdf",
    public_id: (req, file) => {
      const firstName = (req.body.firstName || "user")
        .toLowerCase()
        .replace(/\s+/g, "");

      return `${firstName}_resume`;
    },
    type: "upload",        // ADD THIS
    access_mode: "public", 
  },
});

const upload = multer({ storage });

module.exports = upload;
