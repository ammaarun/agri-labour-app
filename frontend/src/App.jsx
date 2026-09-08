import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import FarmerDashboard from './pages/FarmerDashboard';
import LabourerDashboard from './pages/LabourerDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'FARMER' ? '/farmer' : '/labourer'} replace />;
  }

  return children;
};

// Home Redirect Component
const HomeRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'FARMER' ? '/farmer' : '/labourer'} replace />;
};

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<HomeRedirect />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/farmer"
                  element={
                    <ProtectedRoute allowedRole="FARMER">
                      <FarmerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/labourer"
                  element={
                    <ProtectedRoute allowedRole="LABOURER">
                      <LabourerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
