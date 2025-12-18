const ManagerMessage = require('../models/ManagerMessage');

// @desc    Get manager message
// @route   GET /api/manager
// @access  Public
const getManagerMessage = async (req, res) => {
    try {
        let message = await ManagerMessage.findOne({ isActive: true });
        
        // If none exists, create a default one
        if (!message) {
            message = await ManagerMessage.create({
                name: 'ያልተገለጸ ስም',
                title: 'የጽህፈት ቤት ኃላፊ',
                message: 'እንኳን ወደ አዲስ ከተማ ክፍለ ከተማ የሲቪል ምዝገባ እና የነዋሪነት አገልግሎት ጽ/ቤት በሰላም መጣችሁ።',
                image: 'https://res.cloudinary.com/demo/image/upload/v1631231234/sample.jpg'
            });
        }
        
        res.json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update manager message
// @route   PUT /api/manager
// @access  Private/Admin
const updateManagerMessage = async (req, res) => {
    try {
        const { name, title, message, image, isActive } = req.body;
        
        let managerInfo = await ManagerMessage.findOne();
        
        if (managerInfo) {
            managerInfo.name = name || managerInfo.name;
            managerInfo.title = title || managerInfo.title;
            managerInfo.message = message || managerInfo.message;
            managerInfo.image = image || managerInfo.image;
            managerInfo.isActive = isActive !== undefined ? isActive : managerInfo.isActive;
            
            const updated = await managerInfo.save();
            res.json(updated);
        } else {
            const created = await ManagerMessage.create({
                name, title, message, image, isActive
            });
            res.status(201).json(created);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getManagerMessage,
    updateManagerMessage
};
