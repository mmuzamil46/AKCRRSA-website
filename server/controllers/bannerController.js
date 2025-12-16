const asyncHandler = require('express-async-handler');
const Banner = require('../models/Banner');

const getBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find().sort({ order: 1 });
  res.json(banners);
});

const createBanner = asyncHandler(async (req, res) => {
  const { title, subtitle, image, link, order } = req.body;
  const banner = await Banner.create({ title, subtitle, image, link, order });
  res.status(201).json(banner);
});

const updateBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (banner) {
    banner.title = req.body.title || banner.title;
    banner.subtitle = req.body.subtitle || banner.subtitle;
    banner.image = req.body.image || banner.image;
    banner.link = req.body.link || banner.link;
    banner.order = req.body.order || banner.order;
    banner.isActive = req.body.isActive !== undefined ? req.body.isActive : banner.isActive;
    
    const updatedBanner = await banner.save();
    res.json(updatedBanner);
  } else {
    res.status(404);
    throw new Error('Banner not found');
  }
});

const deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (banner) {
    await banner.deleteOne();
    res.json({ message: 'Banner removed' });
  } else {
    res.status(404);
    throw new Error('Banner not found');
  }
});

module.exports = { getBanners, createBanner, updateBanner, deleteBanner };
