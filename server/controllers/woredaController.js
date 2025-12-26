const asyncHandler = require('express-async-handler');
const Woreda = require('../models/Woreda');

// @desc    Get all woredas
// @route   GET /api/woredas
// @access  Public
const getWoredas = asyncHandler(async (req, res) => {
  const woredas = await Woreda.find().sort({ name: 1 });
  res.json(woredas);
});

// @desc    Create woreda
// @route   POST /api/woredas
// @access  Private (Admin)
const createWoreda = asyncHandler(async (req, res) => {
  const { name, description, mapUrl, managerName, managerPhone, managerPhoto, population, lat, lng } = req.body;
  const { clearChatCache } = require('./chatController');

  const woreda = new Woreda({
    name,
    description,
    mapUrl,
    managerName,
    managerPhone,
    managerPhoto,
    population: population || 0,
    lat: lat || 9.04923,
    lng: lng || 38.71802,
  });

  const createdWoreda = await woreda.save();
  clearChatCache();
  res.status(201).json(createdWoreda);
});

// @desc    Update woreda
// @route   PUT /api/woredas/:id
// @access  Private (Admin)
const updateWoreda = asyncHandler(async (req, res) => {
  const { name, description, mapUrl, managerName, managerPhone, managerPhoto, population, lat, lng } = req.body;
  const { clearChatCache } = require('./chatController');

  const woreda = await Woreda.findById(req.params.id);

  if (woreda) {
    woreda.name = name || woreda.name;
    woreda.description = description || woreda.description;
    woreda.mapUrl = mapUrl || woreda.mapUrl;
    woreda.managerName = managerName || woreda.managerName;
    woreda.managerPhone = managerPhone || woreda.managerPhone;
    woreda.managerPhoto = managerPhoto || woreda.managerPhoto;
    woreda.population = population !== undefined ? population : woreda.population;
    woreda.lat = lat !== undefined ? lat : woreda.lat;
    woreda.lng = lng !== undefined ? lng : woreda.lng;

    const updatedWoreda = await woreda.save();
    clearChatCache();
    res.json(updatedWoreda);
  } else {
    res.status(404);
    throw new Error('Woreda not found');
  }
});

// @desc    Delete woreda
// @route   DELETE /api/woredas/:id
// @access  Private (Admin)
const deleteWoreda = asyncHandler(async (req, res) => {
  const woreda = await Woreda.findById(req.params.id);

  if (woreda) {
    await woreda.deleteOne();
    res.json({ message: 'Woreda removed' });
  } else {
    res.status(404);
    throw new Error('Woreda not found');
  }
});

module.exports = {
  getWoredas,
  createWoreda,
  updateWoreda,
  deleteWoreda,
};
