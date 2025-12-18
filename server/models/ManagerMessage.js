const mongoose = require('mongoose');

const managerMessageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: 'Manager Name'
    },
    title: {
        type: String,
        required: true,
        default: 'Office Manager'
    },
    message: {
        type: String,
        required: true,
        default: 'Welcome to our office.'
    },
    image: {
        type: String,
        required: true,
        default: '/img/placeholder-manager.jpg'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ManagerMessage', managerMessageSchema);
