const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'akcrrsa_uploads',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'pdf', 'doc', 'docx'],
        resource_type: 'auto', // Auto-detect (image or raw/document)
    },
});

module.exports = {
    cloudinary,
    storage
};
