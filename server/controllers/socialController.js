const asyncHandler = require('express-async-handler');
const SocialSettings = require('../models/SocialSettings');

// @desc    Get social settings
// @route   GET /api/social
// @access  Public
const getSocialSettings = asyncHandler(async (req, res) => {
    let settings = await SocialSettings.findOne();
    
    // If no settings exist yet, return default structure
    if (!settings) {
        settings = {
            facebook: '/',
            telegram: '/',
            tiktok: '/',
            youtube: '/',
            x: '/'
        };
    }
    
    res.json(settings);
});

// @desc    Update social settings
// @route   PUT /api/social
// @access  Private/Admin
const updateSocialSettings = asyncHandler(async (req, res) => {
    let settings = await SocialSettings.findOne();
    
    if (settings) {
        settings.facebook = req.body.facebook || settings.facebook;
        settings.telegram = req.body.telegram || settings.telegram;
        settings.tiktok = req.body.tiktok || settings.tiktok;
        settings.youtube = req.body.youtube || settings.youtube;
        settings.x = req.body.x || settings.x;
        
        const updatedSettings = await settings.save();
        res.json(updatedSettings);
    } else {
        const newSettings = await SocialSettings.create(req.body);
        res.status(201).json(newSettings);
    }
});

module.exports = {
    getSocialSettings,
    updateSocialSettings
};
