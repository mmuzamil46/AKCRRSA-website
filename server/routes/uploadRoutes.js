const express = require('express');
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const router = express.Router();

const upload = multer({ storage });

// Route: Single Upload
router.post('/', upload.single('image'), (req, res) => {
    try {
        if (!req.file) return res.status(400).send('No file uploaded');
        // Cloudinary returns the URL in req.file.path
        res.send(req.file.path);
    } catch (error) {
        console.error(error);
        res.status(500).send('Upload failed: ' + error.message);
    }
});

// Route: Multiple Uploads
router.post('/multiple', upload.array('images', 10), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) return res.status(400).send('No files');
        const urls = req.files.map(file => file.path);
        res.send(urls);
    } catch (error) {
        console.error(error);
        res.status(500).send('Multiple upload failed');
    }
});

// Route: Check Cloudinary Status (Debug)
router.get('/status', (req, res) => {
    const hasKeys = process.env.CLOUDINARY_CLOUD_NAME && 
                   process.env.CLOUDINARY_API_KEY && 
                   process.env.CLOUDINARY_API_SECRET;
    
    if (hasKeys) {
        res.json({ 
            status: 'online', 
            message: 'Cloudinary appears configured (keys present).',
        });
    } else {
        res.status(500).json({ 
            status: 'offline', 
            message: 'Cloudinary keys are MISSING from .env',
        });
    }
});

module.exports = router;
