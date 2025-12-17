const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const { bucket } = require('../config/firebase');
const router = express.Router();

// 1. Use Memory Storage
const storage = multer.memoryStorage();

// 2. File Filter
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|gif|webp|pdf|doc|docx/;
  const mimetype = filetypes.test(file.mimetype) || 
                   file.mimetype === 'application/pdf' ||
                   file.mimetype === 'application/msword' ||
                   file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  if (mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Images or Documents Only!');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Helper: Process and Upload to Firebase
const uploadToFirebase = async (buffer, mimetype, originalname, type) => {
    if (!bucket) throw new Error("Firebase not initialized");

    let fileBuffer = buffer;
    const filename = `${Date.now()}-${originalname.replace(/\s+/g, '_')}`;

    // Compress Images (Skip Documents)
    if (mimetype.startsWith('image/')) {
        let pipeline = sharp(buffer);

        if (type === 'banner') {
            pipeline = pipeline.resize({ width: 1920, withoutEnlargement: true })
                               .jpeg({ quality: 90 });
        } else {
            pipeline = pipeline.resize({ width: 800, withoutEnlargement: true })
                               .jpeg({ quality: 70 });
        }
        fileBuffer = await pipeline.toBuffer();
    }

    const file = bucket.file(filename);
    const stream = file.createWriteStream({
        metadata: { contentType: mimetype },
        resumable: false
    });

    return new Promise((resolve, reject) => {
        stream.on('error', (err) => reject(err));
        stream.on('finish', async () => {
            // Make public
            await file.makePublic();
            // Return public URL
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
            resolve(publicUrl);
        });
        stream.end(fileBuffer);
    });
};

// Route: Single Upload
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send('No file uploaded');
    const url = await uploadToFirebase(req.file.buffer, req.file.mimetype, req.file.originalname, req.query.type);
    res.send(url);
  } catch (error) {
    console.error(error);
    res.status(500).send('Upload failed: ' + error.message);
  }
});

// Route: Multiple Uploads
router.post('/multiple', upload.array('images', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) return res.status(400).send('No files');
        const type = req.query.type;
        const promises = req.files.map(file => uploadToFirebase(file.buffer, file.mimetype, file.originalname, type));
        const urls = await Promise.all(promises);
        res.send(urls);
    } catch (error) {
        console.error(error);
        res.status(500).send('Multiple upload failed');
    }
});

// Route: Check Firebase Status (Debug)
router.get('/status', (req, res) => {
    const envVarLength = process.env.FIREBASE_SERVICE_ACCOUNT ? process.env.FIREBASE_SERVICE_ACCOUNT.length : 0;
    const isBucketInit = !!bucket;
    
    if (isBucketInit) {
        res.json({ 
            status: 'online', 
            message: 'Firebase Storage is initialized and ready.',
            bucketName: bucket.name
        });
    } else {
        res.status(500).json({ 
            status: 'offline', 
            message: 'Firebase is NOT initialized.',
            diagnostics: {
                hasEnvVar: envVarLength > 0,
                envVarLength: envVarLength,
                parseError: !isBucketInit && envVarLength > 0 ? "JSON Parse Failed (likely)" : "N/A"
            }
        });
    }
});

module.exports = router;
