import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
        
        // 1. Log the response to see exactly what the backend is sending
        console.log("Login Response Data:", res.data);

        // 2. Store user data safely
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.role); 
        localStorage.setItem('username', res.data.username);

        // FIXED LINE: res.data.userId matches the backend key
        localStorage.setItem('userId', res.data.userId); 

        // 3. Dynamic Redirect
        if (res.data.role === 'admin') {
            navigate('/manager-dashboard');
        } else {
            navigate('/dashboard');
        }
    } catch (err) {
        // Show the actual error message from the backend if possible
        alert(err.response?.data?.error || "Login Failed: Check server or credentials");
    }
};
    return (
        <div className="glass-form">
            <h2>Welcome Back</h2>
            <p>Enter your details to access alerts</p>
            <form onSubmit={handleLogin}>
                <div className="input-group">
                    <label>Email Address</label>
                    <input type="email" placeholder="name@company.com" 
                        onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="input-group">
                    <label>Password</label>
                    <input type="password" placeholder="••••••••" 
                        onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn-primary">Sign In</button>
            </form>
            <div className="auth-footer">
                New here? <Link to="/register" className="auth-link">Create an account</Link>
            </div>
        </div>
    );
};

export default Login;