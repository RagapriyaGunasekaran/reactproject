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
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password });
        
        console.log("Login Response Data:", res.data);
        localStorage.setItem('token', res.data.token);
        // Use 'res' because that is what you named your variable above
        localStorage.setItem('role', res.data.role); 
        localStorage.setItem('username', res.data.username); 
        localStorage.setItem('name', res.data.username); // Add this line to cover both bases!
        localStorage.setItem("userId", res.data.userId); 

        // Redirect based on the role
        if (res.data.role === 'admin') {
            navigate('/manager-dashboard');
        } else {
            navigate('/dashboard');
        }
    } catch (err) {
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