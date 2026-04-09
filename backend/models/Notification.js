const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    // Links the notification to a specific user [cite: 18]
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        default: null
    },
    // The actual text message of the alert [cite: 10]
    message: {
        type: String,
        required: true
    },
    // Used for Role-Based Alerts (e.g., 'admin', 'user') [cite: 15]
    role: {
        type: String,
        default: 'user'
    },
    // Tracks the Mark as Read/Unread status [cite: 14]
    isRead: {
        type: Boolean,
        default: false
    },
    // Automatically stores when the notification was created
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Notification', NotificationSchema);