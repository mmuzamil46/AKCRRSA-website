const mongoose = require('mongoose');

const socialSettingsSchema = new mongoose.Schema({
    facebook: {
        type: String,
        default: '/'
    },
    telegram: {
        type: String,
        default: '/'
    },
    tiktok: {
        type: String,
        default: '/'
    },
    youtube: {
        type: String,
        default: '/'
    },
    x: {
        type: String,
        default: '/'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('SocialSettings', socialSettingsSchema);
