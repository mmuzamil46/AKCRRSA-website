const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

console.log("Testing Cloudinary Integration...");
console.log(`Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
console.log(`API Key present: ${!!process.env.CLOUDINARY_API_KEY}`);

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Test with a sample image URL (Cloudinary allows uploading from remote URLs)
const sampleImage = "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg";

cloudinary.uploader.upload(sampleImage, { public_id: "test_upload_verify" })
    .then((result) => {
        console.log("SUCCESS: Image uploaded!");
        console.log("Secure URL:", result.secure_url);
        console.log("Public ID:", result.public_id);
    })
    .catch((error) => {
        console.error("ERROR Uploading:", error.message);
        if (error.error) console.error("Details:", error.error);
    });
