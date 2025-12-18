const asyncHandler = require('express-async-handler');
const GalleryItem = require('../models/GalleryItem');

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Public
const getGalleryItems = asyncHandler(async (req, res) => {
    let items = await GalleryItem.find().sort({ order: 1, createdAt: -1 });
    
    // Migration: Map old 'imageUrl' to 'images' array if it exists (for backward compatibility)
    items = items.map(item => {
        const itemObj = item.toObject();
        if (itemObj.imageUrl && (!itemObj.images || itemObj.images.length === 0)) {
            itemObj.images = [itemObj.imageUrl];
        }
        return itemObj;
    });

    res.json(items);
});

// @desc    Create gallery item
// @route   POST /api/gallery
// @access  Private/Admin
const createGalleryItem = asyncHandler(async (req, res) => {
    const { title, description, images, category, order } = req.body;
    
    if (!images || !Array.isArray(images) || images.length === 0) {
        res.status(400);
        throw new Error('At least one image is required');
    }

    const item = await GalleryItem.create({
        title,
        description,
        images,
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
    item.images = req.body.images || item.images;
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
