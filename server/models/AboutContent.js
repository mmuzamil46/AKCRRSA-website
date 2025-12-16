const mongoose = require('mongoose');

const aboutContentSchema = new mongoose.Schema({
    title: {
        type: String,
        default: 'ስለእኛ'
    },
    subtitle: {
        type: String,
        default: 'የአዲስ ከተማ ክፍለ ከተማ የሲቪል ምዝገባ እና የነዋሪነት አገልግሎት ጽ/ቤት'
    },
    heroImage: {
        type: String,
        default: '/img/slide-2.jpg'
    },
    mainContent: {
        type: String,
        required: true
    },
    vision: {
        type: String,
        required: true
    },
    mission: {
        type: String,
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AboutContent', aboutContentSchema);
