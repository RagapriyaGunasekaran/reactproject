import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    
    // If no JWT token exists, redirect to login
    if (!token) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;