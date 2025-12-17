const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const router = express.Router();

// 1. Use Memory Storage (Keep file in RAM)
const storage = multer.memoryStorage();

// 2. File Filter (Images & Documents)
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
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit (we compress it down anyway)
});

// Helper: Process single file buffer
const processFile = async (buffer, mimetype, type) => {
    // If it's an image, compress it
    if (mimetype.startsWith('image/')) {
        let pipeline = sharp(buffer);

        // BANNER: High Quality (1920px width, 90% quality)
        if (type === 'banner') {
            pipeline = pipeline.resize({ width: 1920, withoutEnlargement: true })
                               .jpeg({ quality: 90, force: false })
                               .png({ quality: 90, force: false });
        } 
        // STANDARD: Compressed (800px width, 60% quality)
        else {
            pipeline = pipeline.resize({ width: 800, withoutEnlargement: true })
                               .jpeg({ quality: 60, force: false }) // Convert to JPEG if possible for size
                               .png({ quality: 60, force: false })
                               .webp({ quality: 60, force: false });
        }

        const processedBuffer = await pipeline.toBuffer();
        return `data:${mimetype};base64,${processedBuffer.toString('base64')}`;
    }
    
    // If it's a document (PDF/Doc), just Base64 encode it as-is
    return `data:${mimetype};base64,${buffer.toString('base64')}`;
};

// Route: Single Upload
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    const type = req.query.type; // Check if ?type=banner
    const base64Data = await processFile(req.file.buffer, req.file.mimetype, type);
    
    res.send(base64Data); // Send back the Base64 string directly

  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error during file processing');
  }
});

// Route: Multiple Uploads (e.g. Gallery/News)
router.post('/multiple', upload.array('images', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
             return res.status(400).send('No files uploaded');
        }

        const type = req.query.type;
        const uploadPromises = req.files.map(file => processFile(file.buffer, file.mimetype, type));
        const filePaths = await Promise.all(uploadPromises);

        res.send(filePaths);

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error during multiple file processing');
    }
});

module.exports = router;
