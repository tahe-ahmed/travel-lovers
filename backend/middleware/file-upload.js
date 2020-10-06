const multer = require('multer');
const cloudinary = require('../util/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');  // A multer storage engine for Cloudinary.

const FILE_TYPE = ['png', 'jpeg', 'jpg'];

const storage = new CloudinaryStorage({
  cloudinary,
  folder: 'dev_setups',
  allowedFormats: FILE_TYPE,
  transformation: [{ width: 500, height: 500, crop: 'limit' }]
});

const fileUpload = multer({ storage });
// cleaned prev version for fileUpload for storage cloud
module.exports = fileUpload;

