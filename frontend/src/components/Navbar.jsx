import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBell, FaUserCircle, FaSignOutAlt, FaCheckDouble } from 'react-icons/fa';
import { io } from 'socket.io-client';
import axios from 'axios';
import moment from 'moment';

const socket = io(import.meta.env.VITE_API_URL, { transports: ['websocket'] });
const Navbar = ({ role }) => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const dropdownRef = useRef(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');

    // 1. ADDED THIS: Initial Fetch to load unread notifications on refresh
    useEffect(() => {
        const fetchInitial = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/notifications/history/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // 🔥 LOGIC: Employees load unread tasks. Managers start with empty bell (waiting for real-time seen events).
                if (role !== 'admin') {
                    setNotifications(res.data.filter(n => n.isRead === false));
                } else {
                    setNotifications([]); 
                }
            } catch (err) {
                console.error("Navbar data fetch error:", err);
            }
        };
        if (userId) fetchInitial();
    }, [userId, role]);

    // 2. Real-Time Socket Logic
    useEffect(() => {
        if (userId) {
            socket.emit('join', userId);
            
            if (role === 'admin') {
                socket.emit('join', 'admin_room');

                socket.on('employee_read_task', (data) => {
                    const receipt = {
                        _id: Date.now(),
                        message: `The post "${data.taskMessage}" seen by ${data.username}`,
                        createdAt: new Date(),
                    };
                    setNotifications(prev => [receipt, ...prev]);
                });
            }

            socket.on('new_notification', (data) => {
                // Force add to bell regardless of isRead for real-time alerts
                if (role !== 'admin' || data.type === 'common') {
                    setNotifications(prev => [data, ...prev]);
                }
            });
        }

        return () => {
            socket.off('new_notification');
            socket.off('employee_read_task');
        };
    }, [userId, role]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="manager-nav">
            <div className="nav-left">
                <h2 onClick={() => navigate(role === 'admin' ? '/manager-dashboard' : '/dashboard')} style={{ cursor: 'pointer' }}>
                    Corp<span>Control</span>
                </h2>
                <div className="nav-links">
                    <Link to={role === 'admin' ? "/manager-dashboard" : "/dashboard"}>Dashboard</Link>
                    {role === 'admin' && <Link to="/employee-details">Employee Details</Link>}
                    <Link to="/history">History</Link>
                </div>
            </div>

            <div className="nav-right">
                <div className="bell-container" ref={dropdownRef} style={{ position: 'relative' }}>
                    <div className="notification-bell" onClick={() => setShowDropdown(!showDropdown)} style={{ cursor: 'pointer' }}>
                        <FaBell size={20} color="white" />
                        {notifications.length > 0 && <span className="badge">{notifications.length}</span>}
                    </div>

                    {showDropdown && (
                        <div className="notif-dropdown glass-panel shadow-lg">
                            <div className="dropdown-header">
                                <span>{role === 'admin' ? 'Seen Receipts' : 'Recent Alerts'}</span>
                                <button onClick={() => setNotifications([])} className="clear-btn">
                                    <FaCheckDouble size={12} /> Clear
                                </button>
                            </div>
                            <div className="dropdown-body">
                                {notifications.length > 0 ? (
                                    notifications.map(n => (
                                        <div key={n._id} className="notif-item">
                                            <p>{n.message}</p>
                                            <small>{moment(n.createdAt).fromNow()}</small>
                                        </div>
                                    ))
                                ) : (
                                    <p className="empty-msg">No new updates</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <div className="user-info">
                    <FaUserCircle size={24} color="#a29bfe" />
                    <span style={{ color: 'white' }}>{username}</span>
                </div>
                <button className="logout-btn" onClick={() => { localStorage.clear(); navigate('/login'); }}><FaSignOutAlt /></button>
            </div>
        </nav>
    );
};

export default Navbar;