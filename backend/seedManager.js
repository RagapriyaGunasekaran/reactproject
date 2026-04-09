const mongoose = require('mongoose');
const User = require('./models/User'); 
require('dotenv').config();

const seedManager = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const managerEmail = "manager@corp.com"; 
        const existing = await User.findOne({ email: managerEmail });

        if (existing) {
            console.log("Manager already exists!");
            process.exit();
        }

        const manager = new User({
            employeeId: "MGR001",
            username: "Admin Manager",
            email: managerEmail,
            phone: "9999999999",
            password: "manager123", // Will be hashed by your User model's pre-save hook
            role: "admin"
        });

        await manager.save();
        console.log("✅ Manager created! Login with: manager@corp.com / manager123");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedManager();