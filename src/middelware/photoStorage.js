const path = require("path");
const multer = require("multer");
const fs = require("fs");

// تحديد مسار مجلد الصور
const uploadDir = path.join(__dirname, "../images");
console.log("Upload directory:", uploadDir); 

const photoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); 
  },
  filename: (req, file, cb) => {
    if (file) {
      // استبدل الأحرف غير المسموح بها في أسماء الملفات
      const safeFileName = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_');
      cb(null, new Date().toISOString().replace(/:/g, "-") + safeFileName);
    } else {
      cb(null, false);
    }
  }
});

module.exports = multer({
  storage: photoStorage,
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ["jfif", "png", "jpg", "jpeg", "webp"];
    const fileExtension = file.originalname
      .toLowerCase()
      .split(".")
      .pop();
    
    if (
      file.mimetype.startsWith("image/") || 
      allowedExtensions.includes(fileExtension)
    ) {
      cb(null, true);
    } else {
      cb({ message: "Unsupported file format" }, false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});