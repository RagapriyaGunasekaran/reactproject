const express = require('express');
const router = express.Router();
// Import all functions from the controller
const { 
    createNotification, 
    getNotifications, 
    markAsRead, 
    getEmployees, 
    getAllHistory 
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

// --- MANAGER ROUTES ---

// Fill the "Specific Employee" dropdown
router.get('/employees', protect, getEmployees);

// Send new notification
router.post('/send', protect, createNotification);

// Manager gets EVERY notification for the history card
// FIXED: Removed "notificationController." because we destructured it above
router.get('/history', protect, getAllHistory); 


// --- EMPLOYEE ROUTES ---

// Employee gets only Common OR Specific to them
router.get('/history/:userId', protect, getNotifications);

// Mark a specific notification as read
router.put('/:id/read', protect, markAsRead);

module.exports = router;