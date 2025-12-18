const mongoose = require('mongoose');

const galleryItemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    images: {
        type: [String],
        required: true,
        validate: [v => v.length > 0, 'At least one image is required']
    },
    category: {
        type: String,
        enum: ['Events', 'Office', 'Services', 'Community', 'Other'],
        default: 'Other'
    },
    order: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('GalleryItem', galleryItemSchema);
