import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Send, Users, User, Clock, Plus, History, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import moment from 'moment';

const ManagerDashboard = () => {
    const [employees, setEmployees] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [history, setHistory] = useState([]);
    const [task, setTask] = useState({ 
        type: 'common', 
        targetId: '', 
        message: '', 
        deadline: '' 
    });

    // Load employees and deployment history on mount
    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                
                // Fetch Employees
                const empRes = await axios.get('https://reactproject.onrender.com/api/notifications/employees', config);
                setEmployees(empRes.data);
                
                // Fetch History
                const histRes = await axios.get('https://reactproject.onrender.com/api/notifications/history', config);
                setHistory(histRes.data);
            } catch (err) {
                console.error("Dashboard Data Load Error:", err);
            }
        };
        loadDashboardData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.post('https://reactproject.onrender.com/api/notifications/send', task, config);
            
            alert("🚀 Alert Deployed Successfully!");
            
            // Add new deployment to the top of the list
            setHistory([res.data, ...history]);
            
            // Reset form
            setTask({ type: 'common', targetId: '', message: '', deadline: '' });
            setShowModal(false);
        } catch (err) {
            alert("Deployment Failed: " + (err.response?.data?.error || "Server Error"));
        }
    };

    return (
        <div className="dashboard-container">
            <Navbar role="admin" />
            
            <main className="main-content">
                {/* Header Section */}
                <div className="dashboard-header">
                    <div>
                        <h1 style={{ color: 'white' }}>Command Center</h1>
                        <p style={{ color: 'rgba(255,255,255,0.6)' }}>Manage team alerts and task deployments</p>
                    </div>
                    <button className="create-task-btn" onClick={() => setShowModal(true)}>
                        <Plus size={20} /> Create New Alert
                    </button>
                </div>

                {/* History Section */}
                <div className="dashboard-grid" style={{ marginTop: '30px' }}>
                    <div className="glass-panel history-card" style={{ width: '100%' }}>
                        <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                            <History size={18} color="#a29bfe" /> 
                            <h3 style={{ color: 'white' }}>Recent Deployments</h3>
                        </div>
                        
                        <div className="history-list">
                            {history.length > 0 ? (
                                history.map(item => (
                                    <div key={item._id} className="history-item" style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div className="item-info">
                                            <strong style={{ color: '#a29bfe' }}>
                                                {item.type === 'common' ? '📢 All Staff' : `👤 Specific Employee`}
                                            </strong>
                                            <p style={{ color: 'white', margin: '5px 0' }}>{item.message}</p>
                                            <small style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}>
                                                {moment(item.createdAt).fromNow()}
                                            </small>
                                        </div>
                                        
                                        <div className="item-meta" style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                            {/* 1. DEADLINE (If it exists) */}
                                            {item.deadline && (
                                                <span style={{ color: '#ff7675', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                                                    <Clock size={12}/> {moment(item.deadline).format('DD MMM')}
                                                </span>
                                            )}

                                            {/* 2. SEEN/PENDING STATUS */}
                                            <div style={{ marginTop: '5px' }}>
                                                <span style={{ 
                                                    color: item.isRead ? '#55efc4' : '#fab1a0', 
                                                    fontSize: '0.85rem',
                                                    fontWeight: '600',
                                                    padding: '4px 8px',
                                                    background: item.isRead ? 'rgba(85, 239, 196, 0.1)' : 'rgba(250, 177, 160, 0.1)',
                                                    borderRadius: '6px',
                                                    border: `1px solid ${item.isRead ? 'rgba(85, 239, 196, 0.2)' : 'rgba(250, 177, 160, 0.2)'}`
                                                }}>
                                                    {item.isRead ? '✔ Seen' : '⏳ Pending'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '20px' }}>No deployments found.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* CREATIVE MODAL FORM */}
                {showModal && (
                    <div className="modal-overlay">
                        <div className="glass-panel modal-content">
                            <div className="modal-header">
                                <h2><Send size={22} color="#a29bfe" /> New Deployment</h2>
                                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <X size={24} color="white"/>
                                </button>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="creative-form">
                                <div className="input-group">
                                    <label>Deployment Type</label>
                                    <div className="type-selector">
                                        <button 
                                            type="button" 
                                            className={task.type === 'common' ? 'active' : ''} 
                                            onClick={() => setTask({...task, type: 'common', targetId: ''})}
                                        >
                                            Common
                                        </button>
                                        <button 
                                            type="button" 
                                            className={task.type === 'specific' ? 'active' : ''} 
                                            onClick={() => setTask({...task, type: 'specific'})}
                                        >
                                            Specific
                                        </button>
                                    </div>
                                </div>

                                {task.type === 'specific' && (
                                    <div className="input-group">
                                        <label>Target Employee</label>
                                        <select 
                                            required 
                                            value={task.targetId} 
                                            onChange={(e) => setTask({...task, targetId: e.target.value})}
                                        >
                                            <option value="">Select ID - Name</option>
                                            {employees.map(emp => (
                                                <option key={emp._id} value={emp._id}>
                                                    {emp.employeeId} - {emp.username}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div className="input-group">
                                    <label>Message / Instruction</label>
                                    <textarea 
                                        required 
                                        placeholder="Enter alert details..."
                                        value={task.message} 
                                        onChange={(e) => setTask({...task, message: e.target.value})} 
                                    />
                                </div>

                                <div className="input-group">
                                    <label>Deadline (Optional)</label>
                                    <input 
                                        type="datetime-local" 
                                        value={task.deadline} 
                                        onChange={(e) => setTask({...task, deadline: e.target.value})} 
                                    />
                                </div>

                                <button type="submit" className="deploy-btn">Push Notification</button>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ManagerDashboard;