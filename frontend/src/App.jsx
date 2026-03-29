import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ManualEntryPage from './pages/ManualEntryPage';
import OCRUploadPage from './pages/OCRUploadPage';
import ResultsPage from './pages/ResultsPage';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import ErrorBoundary from './components/ErrorBoundary';
import UniversitiesPage from './pages/UniversitiesPage';
import CoursesPage from './pages/CoursesPage';
import ContactPage from './pages/ContactPage';

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

// Admin Route Wrapper
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <Router>
          <div className="min-h-screen bg-[#F8FAFC]">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot" element={<ForgotPassword />} />
                <Route path="/register" element={<Register />} />
                <Route path="/manual-entry" element={<ManualEntryPage />} />
                <Route path="/upload" element={<OCRUploadPage />} />
                <Route path="/results" element={<ResultsPage />} />
                <Route path="/universities" element={<UniversitiesPage />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
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
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;
