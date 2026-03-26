import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import UploadPage from './pages/UploadPage';
import ManualEntryPage from './pages/ManualEntryPage';
import ResultsPage from './pages/ResultsPage';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/manual-entry" element={<ManualEntryPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
              {/* Add more routes as we build them */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <footer className="py-12 bg-white border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 font-medium">
              &copy; {new Date().getFullYear()} ElimuPath - Find Your Way Forward.
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
