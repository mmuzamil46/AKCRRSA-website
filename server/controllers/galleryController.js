const asyncHandler = require('express-async-handler');
const GalleryItem = require('../models/GalleryItem');

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Public
const getGalleryItems = asyncHandler(async (req, res) => {
    const items = await GalleryItem.find().sort({ order: 1, createdAt: -1 });
    res.json(items);
});

// @desc    Create gallery item
// @route   POST /api/gallery
// @access  Private/Admin
const createGalleryItem = asyncHandler(async (req, res) => {
    const { title, description, imageUrl, category, order } = req.body;
    
    const item = await GalleryItem.create({
        title,
        description,
        imageUrl,
        category,
        order
    });
    
    res.status(201).json(item);
});

// @desc    Update gallery item
// @route   PUT /api/gallery/:id
// @access  Private/Admin
const updateGalleryItem = asyncHandler(async (req, res) => {
    const item = await GalleryItem.findById(req.params.id);
    
    if (!item) {
        res.status(404);
        throw new Error('Gallery item not found');
    }
    
    item.title = req.body.title || item.title;
    item.description = req.body.description || item.description;
    item.imageUrl = req.body.imageUrl || item.imageUrl;
    item.category = req.body.category || item.category;
    item.order = req.body.order !== undefined ? req.body.order : item.order;
    
    const updated = await item.save();
    res.json(updated);
});

// @desc    Delete gallery item
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
const deleteGalleryItem = asyncHandler(async (req, res) => {
    const item = await GalleryItem.findById(req.params.id);
    
    if (!item) {
        res.status(404);
        throw new Error('Gallery item not found');
    }
    
    await item.deleteOne();
    res.json({ message: 'Gallery item removed' });
});

module.exports = {
    getGalleryItems,
    createGalleryItem,
    updateGalleryItem,
    deleteGalleryItem
};
