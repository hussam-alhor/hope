const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// التهيئة الأساسية
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});


// دالة الحذف
const cloudinaryRemoveImage = async (imagePublicId) => {
  try {
    return await cloudinary.uploader.destroy(imagePublicId);
  } catch (error) {
    throw error;
  }
};

// دالة حذف متعددة
const cloudinaryRemoveMultipleImage = async (publicIds) => {
  try {
    return await cloudinary.api.delete_resources(publicIds);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  cloudinary,
  cloudinaryRemoveImage,
  cloudinaryRemoveMultipleImage
};