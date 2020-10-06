const cloudinary = require('cloudinary').v2; //The Node.js SDK upload and admin method syntax examples shown throughout this documentation use the v2 signature

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = cloudinary;