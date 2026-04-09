import React, { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        if (userId && token) {
            const socket = io(import.meta.env.VITE_API_URL, {
        transports: ['websocket']
    });

            // Join the private room based on userId 
            socket.emit('join', userId);

            // Listen for Real-Time Push Notifications 
            socket.on("new_notification", (newNotif) => {
                setNotifications((prev) => [newNotif, ...prev]);
                setUnreadCount((prev) => prev + 1);
            });

            return () => socket.disconnect();
        }
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, setNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);