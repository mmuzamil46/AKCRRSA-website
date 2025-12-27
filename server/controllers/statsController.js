const asyncHandler = require('express-async-handler');
const CumulativeStats = require('../models/CumulativeStats');

// @desc    Get all cumulative service stats
// @route   GET /api/stats/cumulative
// @access  Public
const getCumulativeStats = asyncHandler(async (req, res) => {
    const stats = await CumulativeStats.find().sort({ totalCount: -1 });
    res.json(stats);
});

module.exports = {
    getCumulativeStats
};
