import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import moment from 'moment';
import { io } from 'socket.io-client';
import { CheckCircle, Clock, Layout } from 'lucide-react';
const socket = io(import.meta.env.VITE_API_URL, { transports: ['websocket'] });

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/notifications/history/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Fetch error:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) fetchTasks();
    }, [userId]);


    // Inside Dashboard.jsx useEffect
useEffect(() => {
    fetchTasks(); // Initial load

    // 🔥 LISTEN FOR NEW TASKS REAL-TIME
    socket.on('new_notification', () => {
        fetchTasks(); // Automatically refresh the list when a new task arrives
    });

    return () => socket.off('new_notification');
}, [userId]);
    // Inside Dashboard.jsx
// Inside Dashboard.jsx handleMarkAsSeen function
const handleMarkAsSeen = async (task) => {
    try {
        const token = localStorage.getItem('token');
        const currentUsername = localStorage.getItem('username');

        // 1. Update DB
        await axios.put(`${import.meta.env.VITE_API_URL}/api/notifications/${task._id}/read`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });

        // 2. 🔥 TRIGGER SOCKET FOR MANAGER
        socket.emit('task_seen', {
            username: currentUsername,
            taskMessage: task.message
        });

        fetchTasks();
    } catch (err) {
        console.error("Error:", err);
    }
};
    return (
        <div className="dashboard-container">
            <Navbar role="user" />
            
            <main className="main-content" style={{ paddingTop: '120px', paddingBottom: '50px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
                    
                    {/* Professional Header Section */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px' }}>
                        <div style={{ background: '#6c5ce7', padding: '12px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(108, 92, 231, 0.3)' }}>
                            <Layout color="white" size={28} />
                        </div>
                        <div>
                            <h1 style={{ color: 'white', fontSize: '2rem', margin: 0, letterSpacing: '-0.5px' }}>My Assignments</h1>
                            <p style={{ color: 'rgba(255,255,255,0.5)', margin: '5px 0 0 0' }}>Real-time corporate tasks for {username}</p>
                        </div>
                    </div>

                    {/* Task List Section */}
                    <div className="task-stack" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {loading ? (
                            <div style={{ color: 'white', textAlign: 'center', padding: '40px' }}>Syncing with server...</div>
                        ) : tasks.length > 0 ? (
                            tasks.map((task) => (
                                <div key={task._id} 
                                     className={`glass-panel ${task.isRead ? 'task-done' : 'task-active'}`}
                                     style={{
                                         display: 'flex',
                                         justifyContent: 'space-between',
                                         alignItems: 'center',
                                         padding: '25px 30px',
                                         borderRadius: '20px',
                                         background: task.isRead ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.06)',
                                         border: '1px solid rgba(255,255,255,0.1)',
                                         transition: 'all 0.3s ease',
                                         borderLeft: task.isRead ? '6px solid #55efc4' : '6px solid #6c5ce7'
                                     }}>
                                    
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ 
                                            color: task.isRead ? 'rgba(255,255,255,0.4)' : 'white', 
                                            margin: '0 0 10px 0', 
                                            fontSize: '1.25rem',
                                            textDecoration: task.isRead ? 'line-through' : 'none'
                                        }}>
                                            {task.message}
                                        </h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>
                                                {moment(task.createdAt).fromNow()}
                                            </span>
                                            {task.deadline && !task.isRead && (
                                                <span style={{ color: '#ff7675', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600' }}>
                                                    <Clock size={14} /> Due {moment(task.deadline).format('DD MMM')}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div style={{ marginLeft: '20px' }}>
    {task.isRead ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#55efc4', fontWeight: '700' }}>
            <CheckCircle size={22} /> Reviewed
        </div>
    ) : (
        <button 
            onClick={() => handleMarkAsSeen(task)}
            style={{
                background: '#6c5ce7',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '12px',
                cursor: 'pointer',
                border: 'none'
            }}
        >
            Mark as Seen
        </button>
    )}
</div>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '60px', opacity: 0.4 }}>
                                <p style={{ color: 'white', fontSize: '1.2rem' }}>All caught up! No tasks found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;