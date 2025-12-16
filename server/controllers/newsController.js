const asyncHandler = require('express-async-handler');
const News = require('../models/News');

// @desc    Get all news
// @route   GET /api/news
// @access  Public
const getNews = asyncHandler(async (req, res) => {
  const news = await News.find().sort({ date: -1 });
  res.json(news);
});

// @desc    Get single news
// @route   GET /api/news/:id
// @access  Public
const getNewsById = asyncHandler(async (req, res) => {
  const news = await News.findById(req.params.id);
  if (news) {
    res.json(news);
  } else {
    res.status(404);
    throw new Error('News not found');
  }
});

// @desc    Create news
// @route   POST /api/news
// @access  Private (Admin)
const createNews = asyncHandler(async (req, res) => {
  const { title, content, image, images } = req.body;

  const news = new News({
    title,
    content,
    image,
    images: images || [],
    date: Date.now(),
  });

  const createdNews = await news.save();
  res.status(201).json(createdNews);
});

// @desc    Update news
// @route   PUT /api/news/:id
// @access  Private (Admin)
const updateNews = asyncHandler(async (req, res) => {
  const { title, content, image, images } = req.body;

  const news = await News.findById(req.params.id);

  if (news) {
    news.title = title || news.title;
    news.content = content || news.content;
    news.image = image || news.image;
    if (images) news.images = images;

    const updatedNews = await news.save();
    res.json(updatedNews);
  } else {
    res.status(404);
    throw new Error('News not found');
  }
});

// @desc    Delete news
// @route   DELETE /api/news/:id
// @access  Private (Admin)
const deleteNews = asyncHandler(async (req, res) => {
  const news = await News.findById(req.params.id);

  if (news) {
    await news.deleteOne();
    res.json({ message: 'News removed' });
  } else {
    res.status(404);
    throw new Error('News not found');
  }
});

module.exports = {
  getNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
};
