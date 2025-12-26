const asyncHandler = require('express-async-handler');
const SubcityStats = require('../models/SubcityStats');
const Woreda = require('../models/Woreda');

// @desc    Get all subcity data (Stats + Woredas)
// @route   GET /api/subcity-data
// @access  Public
const getSubcityData = asyncHandler(async (req, res) => {
    let stats = await SubcityStats.findOne();
    if (!stats) {
        // Create initial stats if none exist
        stats = await SubcityStats.create({});
    }

    const woredas = await Woreda.find().sort({ name: 1 });
    
    res.json({
        stats,
        woredas
    });
});

// @desc    Update subcity stats
// @route   PUT /api/subcity-data/stats
// @access  Private (Admin)
const updateSubcityStats = asyncHandler(async (req, res) => {
    const { totalPopulation, totalArea, totalWoredas, description } = req.body;

    let stats = await SubcityStats.findOne();
    if (stats) {
        stats.totalPopulation = totalPopulation !== undefined ? totalPopulation : stats.totalPopulation;
        stats.totalArea = totalArea || stats.totalArea;
        stats.totalWoredas = totalWoredas !== undefined ? totalWoredas : stats.totalWoredas;
        stats.description = description || stats.description;

        const updatedStats = await stats.save();
        res.json(updatedStats);
    } else {
        const newStats = await SubcityStats.create({
            totalPopulation,
            totalArea,
            totalWoredas,
            description
        });
        res.status(201).json(newStats);
    }
});

module.exports = {
    getSubcityData,
    updateSubcityStats
};
