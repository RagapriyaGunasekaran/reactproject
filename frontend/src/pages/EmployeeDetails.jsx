import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const EmployeeDetails = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmployees = async () => {
    try {
        const token = localStorage.getItem('token');
        
        // Use BACKTICKS ( ` ) here, not single quotes
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/notifications/employees`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        // Add a safety check: Only set if the data is an array
        if (Array.isArray(res.data)) {
            setEmployees(res.data);
        } else {
            console.error("Data received is not an array:", res.data);
            setEmployees([]); 
        }
        
        setLoading(false);
    } catch (err) {
        console.error("Error fetching directory:", err);
        setLoading(false);
    }
};
        fetchEmployees();
    }, []);

    return (
        <div className="dashboard-container">
            <Navbar role="admin" />
            <div className="main-content">
                <div className="glass-panel" style={{ width: '100%', maxWidth: '900px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <h2 style={{ color: 'white' }}>Registered Employee Directory</h2>
                        <p style={{ color: 'rgba(255,255,255,0.5)' }}>Total Registered Staff: {employees.length}</p>
                    </div>

                    <div className="table-wrapper">
                        <table className="employee-table">
                            <thead>
                                <tr>
                                    <th>Employee ID</th>
                                    <th>Full Name</th>
                                    <th>Email Address</th>
                                    <th>Phone Number</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="4" style={{ textAlign: 'center' }}>Loading staff data...</td></tr>
                                ) : employees.length > 0 ? (
                                    employees.map((emp) => (
                                        <tr key={emp._id}>
                                            <td style={{ fontWeight: 'bold', color: '#a29bfe' }}>{emp.employeeId}</td>
                                            <td>{emp.username}</td>
                                            <td>{emp.email}</td>
                                            <td>{emp.phone || 'N/A'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="4" style={{ textAlign: 'center' }}>No employees registered yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDetails;