const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary } = require('../config/cloudinary'); 

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    return {
      folder: 'blog-images',
      public_id: `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, '')}`,
      transformation: [{ width: 800, crop: "scale" }],
      allowed_formats: ["jfif", 'jpeg', 'png', 'jpg', 'webp'],
      resource_type: 'auto' 
    };
  }
});

module.exports = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ["jfif", "png", "jpg", "jpeg", "webp"];
    const fileExtension = file.originalname.toLowerCase().split('.').pop();
    
    if (
      file.mimetype.startsWith('image/') && 
      allowedExtensions.includes(fileExtension)
    ) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file format!'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});