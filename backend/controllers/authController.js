const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { employeeId, username, email, phone, password } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ 
            $or: [{ email }, { employeeId }] 
        });

        if (userExists) {
            return res.status(400).json({ error: "Employee ID or Email already exists" });
        }

        const user = new User({ 
            employeeId, 
            username, 
            email, 
            phone, 
            password 
        });

        await user.save();
        res.status(201).json({ message: "Employee registered successfully" });

    } catch (error) {
        console.error("❌ Register Error:", error.message);
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.log(`⚠️ Login attempt failed: ${email} not found.`);
            return res.status(400).json({ error: "Invalid Credentials" });
        }

        // 2. Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log(`⚠️ Password mismatch for: ${email}`);
            return res.status(400).json({ error: "Invalid Credentials" });
        }

        // 3. Create Token
        // Make sure your .env file has JWT_SECRET=your_secret_key
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        // 4. Send back data for LocalStorage
        res.json({
            token,
            role: user.role,
            userId: user._id, // This is what the Dashboard uses!
            username: user.username
        });

        console.log(`✅ Login successful: ${user.username} (${user.role})`);

    } catch (error) {
        console.error("❌ Login Server Error:", error);
        res.status(500).json({ error: "Server error during login" });
    }
};