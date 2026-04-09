import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import moment from 'moment';
import { History as HistoryIcon, Search, Clock, ShieldCheck } from 'lucide-react';

const History = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Get stored data
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('role');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                // Fetch the full history for the user
                const res = await axios.get(`http://localhost:5000/api/notifications/history/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setLogs(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching history archive:", err);
                setLoading(false);
            }
        };

        if (userId) {
            fetchHistory();
        }
    }, [userId]);

    return (
        <div className="dashboard-container">
            {/* 1. Pass the role from localStorage to keep Navbar consistent */}
            <Navbar role={userRole} /> 

            <main className="main-content" style={{ paddingTop: '120px', paddingBottom: '50px' }}>
                <div className="glass-panel" style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px', borderRadius: '24px' }}>
                    
                    {/* Header Section */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ background: 'rgba(162, 155, 254, 0.2)', padding: '12px', borderRadius: '12px' }}>
                                <HistoryIcon color="#a29bfe" size={32} />
                            </div>
                            <div>
                                <h2 style={{ color: 'white', margin: 0, fontSize: '1.8rem' }}>Notification Archive</h2>
                                <p style={{ color: 'rgba(255,255,255,0.4)', margin: '5px 0 0 0' }}>Review all past corporate communications</p>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="history-table-wrapper" style={{ overflowX: 'auto' }}>
                        {loading ? (
                            <p style={{ color: 'white', textAlign: 'center', padding: '20px' }}>Loading archive...</p>
                        ) : logs.length > 0 ? (
                            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px', color: 'white' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left' }}>
                                        <th style={{ padding: '15px', color: 'rgba(255,255,255,0.3)', fontWeight: '600', fontSize: '0.9rem', textTransform: 'uppercase' }}>Message</th>
                                        <th style={{ padding: '15px', color: 'rgba(255,255,255,0.3)', fontWeight: '600', fontSize: '0.9rem', textTransform: 'uppercase' }}>Type</th>
                                        <th style={{ padding: '15px', color: 'rgba(255,255,255,0.3)', fontWeight: '600', fontSize: '0.9rem', textTransform: 'uppercase' }}>Sent Date</th>
                                        <th style={{ padding: '15px', color: 'rgba(255,255,255,0.3)', fontWeight: '600', fontSize: '0.9rem', textTransform: 'uppercase' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map(log => (
                                        <tr key={log._id} className="history-row" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                                            <td style={{ padding: '20px 15px', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px', fontSize: '1rem' }}>
                                                {log.message}
                                            </td>
                                            <td style={{ padding: '20px 15px' }}>
                                                <span style={{ 
                                                    fontSize: '0.75rem', 
                                                    padding: '5px 12px', 
                                                    borderRadius: '6px', 
                                                    fontWeight: '700',
                                                    background: log.type === 'common' ? 'rgba(108, 92, 231, 0.2)' : 'rgba(225, 112, 85, 0.2)',
                                                    color: log.type === 'common' ? '#a29bfe' : '#ff7675',
                                                    border: `1px solid ${log.type === 'common' ? 'rgba(108, 92, 231, 0.3)' : 'rgba(225, 112, 85, 0.3)'}`,
                                                    textTransform: 'capitalize'
                                                }}>
                                                    {log.type}
                                                </span>
                                            </td>
                                            <td style={{ padding: '20px 15px', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <Clock size={14} />
                                                    {moment(log.createdAt).format('lll')}
                                                </div>
                                            </td>
                                            <td style={{ padding: '20px 15px', borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}>
                                                <div style={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    gap: '8px', 
                                                    color: log.isRead ? '#55efc4' : '#fab1a0',
                                                    fontWeight: '600'
                                                }}>
                                                    {log.isRead ? <ShieldCheck size={18} /> : <div style={{width:8, height:8, background:'#fab1a0', borderRadius:'50%'}}></div>}
                                                    {log.isRead ? 'Seen' : 'Unread'}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '50px' }}>
                                <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '1.2rem' }}>Archive is empty.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default History;