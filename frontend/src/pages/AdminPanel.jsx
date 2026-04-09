import React, { useState } from 'react';
import axios from 'axios';

const AdminPanel = () => {
    const [targetUserId, setTargetUserId] = useState('');
    const [message, setMessage] = useState('');

    const sendNotification = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            // Triggers a real-time push through the backend POST API [cite: 12, 17]
            await axios.post('https://reactproject.onrender.com/api/notifications', 
                { userId: targetUserId, message },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Notification Sent Successfully!");
            setMessage('');
        } catch (error) {
            console.error("Error sending alert", error);
        }
    };

    return (
        <div className="admin-container">
            <h2>Send Role-Based Alert</h2> 
            <form onSubmit={sendNotification}>
                <input 
                    type="text" 
                    placeholder="User ID" 
                    value={targetUserId} 
                    onChange={(e) => setTargetUserId(e.target.value)} 
                    required 
                />
                <textarea 
                    placeholder="Notification Message" 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    required 
                />
                <button type="submit">Push Notification</button> [cite: 12]
            </form>
        </div>
    );
};

export default AdminPanel;