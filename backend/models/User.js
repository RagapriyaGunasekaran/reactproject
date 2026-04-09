const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    employeeId: { type: String, required: true, unique: true }, // Added
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true }, // Added
    password: { type: String, required: true },
    role: { type: String, default: 'user' } // 'user' for Employee, 'admin' for Manager
});

// Use the refined hashing middleware we fixed earlier
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', UserSchema);