import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import EmployeeDetails from './pages/EmployeeDetails';
import History from './pages/History';

function App() {
  return (
    <NotificationProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          // Inside App.jsx
<Route 
  path="/history" 
  element={
    <ProtectedRoute>
      {/* Pass the role here so the Navbar knows to stay in 'admin' mode */}
      <History role={localStorage.getItem('role')} />
    </ProtectedRoute>
  } 
/>
          {/* Manager Routes */}
        <Route 
          path="/manager-dashboard" 
          element={
            <ProtectedRoute adminOnly={true}>
              <ManagerDashboard />
            </ProtectedRoute>
          } 
        />
          <Route 
          path="/employee-details" 
          element={
            <ProtectedRoute adminOnly={true}>
              <EmployeeDetails />
            </ProtectedRoute>
          } 
        />
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </NotificationProvider>
  );
}

export default App;