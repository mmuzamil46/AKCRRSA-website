const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

app.use(cors({
    origin: '*', // Allow all origins (simpler for this case)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true // Enable if you use cookies/sessions
}));
app.use(express.json({ limit: '50mb' })); // Increase payload size for Base64 images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

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
app.use('/api/manager', require('./routes/managerRoutes'));
app.use('/api/social', require('./routes/socialRoutes'));
app.use('/api/subcity-data', require('./routes/subcityDataRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));
app.use('/api/staff', require('./routes/staffRoutes'));
app.use('/api/ontime-reg', require('./routes/remoteReportRoutes'));


// Make uploads folder static
const fs = require('fs');
const uploadDir = path.join(__dirname, '/uploads');

if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
