const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded images)
app.use('/uploads', express.static('uploads'));

// Basic Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const path = require('path');

// ... (other imports)

// Import Routes
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/news', require('./routes/newsRoutes'));
app.use('/api/woredas', require('./routes/woredaRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/banners', require('./routes/bannerRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));
app.use('/api/documents', require('./routes/documentRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/about', require('./routes/aboutRoutes'));
app.use('/api/gallery', require('./routes/galleryRoutes'));

// Make uploads folder static
const fs = require('fs');
const uploadDir = path.join(__dirname, '/uploads');

if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
