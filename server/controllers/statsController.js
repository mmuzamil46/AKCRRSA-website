const asyncHandler = require('express-async-handler');
const CumulativeStats = require('../models/CumulativeStats');
const VisitorCount = require('../models/VisitorCount');

// @desc    Get all cumulative service stats
// @route   GET /api/stats/cumulative
// @access  Public
const getCumulativeStats = asyncHandler(async (req, res) => {
    const stats = await CumulativeStats.find().sort({ totalCount: -1 });
    res.json(stats);
});

// @desc    Increment visitor count
// @route   POST /api/stats/visit
// @access  Public
const incrementVisitorCount = asyncHandler(async (req, res) => {
    let visitorStats = await VisitorCount.findOne();
    
    if (!visitorStats) {
        visitorStats = await VisitorCount.create({ count: 1 });
    } else {
        visitorStats.count += 1;
        visitorStats.lastVisited = Date.now();
        await visitorStats.save();
    }
    
    res.json({ count: visitorStats.count });
});

// @desc    Get visitor count
// @route   GET /api/stats/visit
// @access  Public
const getVisitorCount = asyncHandler(async (req, res) => {
    const visitorStats = await VisitorCount.findOne();
    const count = visitorStats ? visitorStats.count : 0;
    res.json({ count });
});

module.exports = {
    getCumulativeStats,
    incrementVisitorCount,
    getVisitorCount
};
