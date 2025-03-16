const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

const cloudinary = require("./cloudinary");
// Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "yoga", // Folder name in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"], // Allowed image formats
    transformation: [
      { width: 500, height: 500, crop: "limit", quality: "auto" },
    ],
  },
});

const upload = multer({ storage });

module.exports = upload;
