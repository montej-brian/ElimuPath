import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { LayoutDashboard, History, PlusCircle, ArrowRight, BookOpen, User as UserIcon, Calendar, Clock, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this result? This action cannot be undone.')) return;
    try {
      await api.delete(`/api/results/history/${id}`);
      setResults(prev => prev.filter(r => r.id !== id));
    } catch (_err) {
      console.error('Failed to delete result', _err);
      alert('Failed to delete the result. Please try again.');
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/api/results/history'); // Note: Need this endpoint in backend
        setResults(res.data);
      } catch (_err) {
        console.error('Failed to fetch history', _err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchHistory();
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar / Profile Summary */}
        <aside className="w-full md:w-80 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
              <UserIcon className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">{user?.name}</h2>
            <p className="text-slate-500 font-medium mb-6">{user?.email}</p>
            <div className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-slate-600 font-bold text-sm">
              <Calendar className="w-4 h-4" />
              Joined {new Date(user?.created_at).toLocaleDateString()}
            </div>
          </div>

          <Link to="/manual-entry" className="flex items-center justify-center gap-2 w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-500/25 hover:bg-primary-dark transition-all">
            <PlusCircle className="w-5 h-5" />
            New Analysis
          </Link>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
              <History className="w-8 h-8 text-primary" />
              Analysis History
            </h1>
          </div>

          {loading ? (
             <div className="bg-white rounded-3xl p-12 border border-slate-100 text-center flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 font-bold">Loading your history...</p>
             </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {results.map((result, idx) => (
                <motion.div 
                  key={result.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-6 rounded-3xl border border-slate-100 flex flex-col sm:flex-row items-center justify-between hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
                >
                  <div className="flex items-center gap-6 w-full sm:w-auto mb-4 sm:mb-0">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex flex-col items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-primary transition-colors">
                      <p className="text-xs font-black uppercase">Grade</p>
                      <p className="text-xl font-black">{result.mean_grade}</p>
                    </div>
                    <div>
                      <h3 className="font-extrabold text-lg text-slate-900">Analysis #{result.id.slice(0, 8)}</h3>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1 font-medium"><Clock className="w-4 h-4" /> {new Date(result.created_at).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1 font-medium text-primary"><BookOpen className="w-4 h-4" /> {Object.keys(result.subjects).length} Subjects</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                    <button 
                      onClick={() => {
                        sessionStorage.setItem('lastResult', JSON.stringify(result));
                        window.location.href = '/results';
                      }}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-50 rounded-xl font-bold text-slate-700 hover:bg-primary hover:text-white transition-all overflow-hidden relative"
                    >
                      View Report
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(result.id)}
                      className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-100"
                      title="Delete Result"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-16 border border-slate-100 text-center space-y-4 shadow-sm">
              <div className="p-4 bg-slate-50 rounded-full inline-block">
                <PlusCircle className="w-12 h-12 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">No results found</h3>
              <p className="text-slate-500 max-w-xs mx-auto">You haven't uploaded or entered any KCSE results yet.</p>
              <Link to="/manual-entry" className="inline-block text-primary font-bold hover:underline">Start your first analysis</Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
