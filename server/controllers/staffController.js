const asyncHandler = require('express-async-handler');
const Staff = require('../models/Staff');

// @desc    Get all staff members
// @route   GET /api/staff
// @access  Public
const getStaff = asyncHandler(async (req, res) => {
    // Sort by role (head first) then created date
    const staff = await Staff.find({}).sort({ createdAt: 1 });
    
    // Custom sort helper could take place here or frontend
    // Ideally: Head -> Team Leaders -> Staff
    
    res.json(staff);
});

// @desc    Create a staff member
// @route   POST /api/staff
// @access  Private/Admin
const createStaff = asyncHandler(async (req, res) => {
    const { name, position, role, image } = req.body;

    const staff = await Staff.create({
        name,
        position,
        role,
        image,
        user: req.user._id
    });

    if (staff) {
        res.status(201).json(staff);
    } else {
        res.status(400);
        throw new Error('Invalid staff data');
    }
});

// @desc    Update staff member
// @route   PUT /api/staff/:id
// @access  Private/Admin
const updateStaff = asyncHandler(async (req, res) => {
    const staff = await Staff.findById(req.params.id);

    if (staff) {
        staff.name = req.body.name || staff.name;
        staff.position = req.body.position || staff.position;
        staff.role = req.body.role || staff.role;
        staff.image = req.body.image || staff.image;

        const updatedStaff = await staff.save();
        res.json(updatedStaff);
    } else {
        res.status(404);
        throw new Error('Staff not found');
    }
});

// @desc    Delete staff member
// @route   DELETE /api/staff/:id
// @access  Private/Admin
const deleteStaff = asyncHandler(async (req, res) => {
    const staff = await Staff.findById(req.params.id);

    if (staff) {
        await staff.deleteOne();
        res.json({ message: 'Staff removed' });
    } else {
        res.status(404);
        throw new Error('Staff not found');
    }
});

module.exports = {
    getStaff,
    createStaff,
    updateStaff,
    deleteStaff
};
