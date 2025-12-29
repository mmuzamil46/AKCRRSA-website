const mongoose = require('mongoose');

const staffSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['head', 'team_leader', 'staff'], 
        default: 'staff',
        required: true
    },
    image: {
        type: String,
        required: true,
        default: '/uploads/default-avatar.png' 
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Staff', staffSchema);
