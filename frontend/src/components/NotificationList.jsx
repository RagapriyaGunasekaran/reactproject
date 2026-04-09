import React from 'react';
import axios from 'axios';
import { useNotifications } from '../context/NotificationContext';

const NotificationList = () => {
    const { notifications, setNotifications } = useNotifications();
    const token = localStorage.getItem('token');

    // Fulfills "Mark as Read" [cite: 14, 19]
    const handleMarkAsRead = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(notifications.map(n => 
                n._id === id ? { ...n, isRead: true } : n
            ));
        } catch (err) {
            console.error("Update failed", err);
        }
    };

    // Fulfills "DELETE/notifications/:id" [cite: 19]
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/notifications/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Update local state to remove the item from History [cite: 13]
            setNotifications(notifications.filter(n => n._id !== id));
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    return (
        <div className="notification-list">
            <h2>Notification History</h2> [cite: 13]
            {notifications.length === 0 ? <p>No notifications yet.</p> : (
                notifications.map((notif) => (
                    <div key={notif._id} className={`item ${notif.isRead ? 'read' : 'unread'}`}>
                        <p>{notif.message}</p>
                        <div className="actions">
                            {!notif.isRead && (
                                <button onClick={() => handleMarkAsRead(notif._id)}>Mark as Read</button>
                            )}
                            <button onClick={() => handleDelete(notif._id)} style={{color: 'red'}}>Delete</button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default NotificationList;