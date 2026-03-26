import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, LogOut, User, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900 italic">edu<span className="text-secondary">Path</span></span>
          </Link>

          {/* Centered Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600 uppercase tracking-widest">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <Link to="/about" className="hover:text-primary transition-colors">Pages</Link>
            <Link to="/matches" className="hover:text-primary transition-colors">Course</Link>
            <Link to="/blog" className="hover:text-primary transition-colors">Blog</Link>
          </div>

          {/* Right Action */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="text-slate-600 hover:text-primary font-bold"><LayoutDashboard className="w-6 h-6" /></Link>
                <div className="h-8 w-[1px] bg-slate-200"></div>
                <button onClick={handleLogout} className="text-secondary hover:scale-110 transition-all"><LogOut className="w-6 h-6" /></button>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <Link to="/login" className="text-slate-900 font-extrabold text-sm uppercase tracking-tighter hover:text-primary">Sign In</Link>
                <Link to="/register" className="bg-primary text-white px-7 py-3 rounded-full font-black text-sm uppercase tracking-widest hover:bg-primary-dark transition-all shadow-xl shadow-primary/30">
                  Try For Free
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
