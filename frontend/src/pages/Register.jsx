import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';

const Register = () => {
    const [formData, setFormData] = useState({
        employeeId: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        // 1. Basic Validation
        if (formData.password !== formData.confirmPassword) {
            return alert("Passwords do not match!");
        }

        try {
            // 2. Prepare data (exclude confirmPassword before sending to backend)
            const { confirmPassword, ...dataToSend } = formData;

            // 3. API Call
            const response = await axios.post('${import.meta.env.VITE_API_URL}/api/auth/register', dataToSend);
            
            alert("Employee Registration Successful!");
            navigate('/login');
        } catch (error) {
            // Displays specific error from backend (e.g., "Employee ID already exists")
            alert(error.response?.data?.error || "Registration failed. Please try again.");
        }
    };

    return (
        <div className="glass-form">
            <h2>Employee Join</h2>
            <p>Create your corporate account</p>
            
            <form onSubmit={handleRegister}>
                <input 
                    type="text" 
                    placeholder="Employee ID" 
                    required 
                    onChange={(e) => setFormData({...formData, employeeId: e.target.value})} 
                />
                
                <input 
                    type="text" 
                    placeholder="Full Name" 
                    required 
                    onChange={(e) => setFormData({...formData, username: e.target.value})} 
                />

                <input 
                    type="email" 
                    placeholder="Email Address" 
                    required 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                />

                <input 
                    type="text" 
                    placeholder="Phone Number" 
                    required 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                />

                <input 
                    type="password" 
                    placeholder="Password" 
                    required 
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                />

                <input 
                    type="password" 
                    placeholder="Confirm Password" 
                    required 
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
                />

                <button type="submit" className="btn-primary">
                    Register
                </button>
            </form>

            <div className="auth-footer">
                Already part of the team? <Link to="/login" className="auth-link">Sign In</Link>
            </div>
        </div>
    );
};

export default Register;