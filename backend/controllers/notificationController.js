const Notification = require('../models/Notification');
const User = require('../models/User');

// 1. Create and Deploy New Notification (Fixed to notify everyone on 'common')
// backend/controllers/notificationController.js

// backend/controllers/notificationController.js

exports.createNotification = async (req, res) => {
    try {
        const { type, targetId, message, deadline } = req.body;
        const io = req.app.get('socketio');

        const notificationData = {
            message,
            type, // 'common' or 'specific'
            deadline: deadline || null,
            userId: type === 'specific' ? targetId : null, 
            isRead: false
        };

        const newNotification = new Notification(notificationData);
        await newNotification.save();

        // 🔥 LOGIC: Common goes to everyone, Specific goes to one room
        if (type === 'common') {
            io.emit('new_notification', newNotification);
        } else {
            io.to(targetId).emit('new_notification', newNotification);
        }

        res.status(201).json(newNotification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// 2. Get Notification History (Fixed for Manager visibility)
exports.getNotifications = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Find the user making the request to check their role
        const requestingUser = await User.findById(userId);
        
        let query = {};

        // 🔥 IF MANAGER: Show every single notification in the archive
        if (requestingUser && requestingUser.role === 'admin') {
            query = {}; 
        } 
        // IF EMPLOYEE: Show common ones OR specific ones for them
        else if (userId && userId !== 'undefined') {
            query = {
                $or: [
                    { type: 'common' },
                    { userId: userId }
                ]
            };
        }

        const notifications = await Notification.find(query).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        console.error("❌ Error fetching history:", error);
        res.status(500).json({ error: error.message });
    }
};

// 3. Get Employee Directory
exports.getEmployees = async (req, res) => {
    try {
        const employees = await User.find({ role: 'user' })
            .select('employeeId username email phone _id'); 
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Mark Notification as Read
exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedNotification = await Notification.findByIdAndUpdate(
            id,
            { isRead: true },
            { new: true }
        );

        if (!updatedNotification) {
            return res.status(404).json({ error: "Notification not found" });
        }
        res.status(200).json(updatedNotification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 5. Manager Total History (Alternative route)
exports.getAllHistory = async (req, res) => {
    try {
        const history = await Notification.find({}).sort({ createdAt: -1 });
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};