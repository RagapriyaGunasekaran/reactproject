const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    targetId: { type: String, default: 'all' }, // 'all' or specific User ID
    message: { type: String, required: true },
    deadline: { type: Date },
    status: { type: String, default: 'pending' },
    seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of users who clicked 'seen'
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', TaskSchema);