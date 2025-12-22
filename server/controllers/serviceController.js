const Service = require('../models/Service');
const { clearChatCache } = require('./chatController');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a service
// @route   POST /api/services
// @access  Private (Admin)
const createService = async (req, res) => {
  const { title, description, icon, requirements, slug, hasCategories, categories } = req.body;

  if (!title || !description || !slug) {
    return res.status(400).json({ message: 'Title, Description, and Slug are required' });
  }

  try {
    const service = new Service({
      title,
      description,
      icon,
      requirements,
      slug,
      hasCategories,
      categories
    });

    const createdService = await service.save();
    clearChatCache();
    res.status(201).json(createdService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private (Admin)
const updateService = async (req, res) => {
  const { title, description, icon, requirements, slug, hasCategories, categories } = req.body;

  try {
    const service = await Service.findById(req.params.id);

    if (service) {
      service.title = title || service.title;
      service.description = description || service.description;
      service.icon = icon || service.icon;
      service.requirements = requirements || service.requirements;
      service.slug = slug || service.slug;
      service.hasCategories = hasCategories !== undefined ? hasCategories : service.hasCategories;
      service.categories = categories || service.categories;

      const updatedService = await service.save();
      clearChatCache();
      res.json(updatedService);
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private (Admin)
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (service) {
      await service.deleteOne();
      clearChatCache();
      res.json({ message: 'Service removed' });
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getServices,
  createService,
  updateService,
  deleteService,
};
