const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const cron = require('node-cron');
const moment = require('moment');

// Config and DB
const connectDB = require('./config/db');
const notificationRoutes = require('./routes/notificationRoutes');
const authRoutes = require('./routes/authRoutes');

// Models
const Task = require('./models/Task'); 
const Notification = require('./models/Notification'); // Ensure this matches your schema

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notifications', notificationRoutes);

// --- CRON JOB: DEADLINE REMINDERS ---
// Checks every hour (at the start of the hour)
cron.schedule('0 * * * *', async () => {
    try {
        const now = new Date();
        const tasks = await Task.find({ deadline: { $gt: now }, status: 'pending' });

        tasks.forEach(task => {
            const hoursLeft = Math.abs(task.deadline - now) / 36e5;
            let reminderMessage = "";

            if (hoursLeft <= 6) {
                reminderMessage = `URGENT: Task deadline in ${Math.round(hoursLeft)} hours!`;
            } else if (now.getHours() === 9) {
                reminderMessage = `Daily Reminder: Task deadline is ${moment(task.deadline).fromNow()}`;
            }

            if (reminderMessage) {
                if (task.targetId === 'all') {
                    io.emit('new_notification', { message: reminderMessage });
                } else {
                    io.to(task.targetId).emit('new_notification', { message: reminderMessage });
                }
            }
        });
    } catch (err) {
        console.error("Cron Error:", err);
    }
});

// --- REAL-TIME SOCKET LOGIC ---
io.on('connection', (socket) => {
    console.log('🚀 A user connected:', socket.id);

    // 1. Join Rooms
    socket.on('join', (userId) => {
        // Individual room for private notifications
        socket.join(userId);
        
        // Logic: You can pass role in join or handle it via a separate emit
        // For simplicity, we also join 'admin_room' if the frontend requests it
        if (userId === 'admin_room') {
            socket.join('admin_room');
            console.log("Admin joined the Command Center room");
        } else {
            console.log(`User ${userId} joined their notification room`);
        }
    });

    // 2. Handle "Task Seen" from Employee
    // Inside server.js io.on('connection')
// Inside server.js io.on('connection')
socket.on('task_seen', (data) => {
    console.log(`Notification: ${data.username} saw ${data.taskMessage}`);
    // This sends the data specifically to the Manager's room
    io.to('admin_room').emit('employee_read_task', data);
});
    // 3. Disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Pass 'io' to controllers so you can use req.app.get('socketio')
app.set('socketio', io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));