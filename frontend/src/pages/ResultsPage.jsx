import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Search, Filter, CheckCircle2, XCircle, MapPin, Building2, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ResultsPage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [lastResult, setLastResult] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      const storedResult = JSON.parse(sessionStorage.getItem('lastResult'));
      if (!storedResult) {
        setLoading(false);
        return;
      }
      setLastResult(storedResult);

      try {
        const res = await api.get(`/api/matches/${storedResult.id}/matches`);
        setMatches(res.data);
      } catch (err) {
        console.error('Failed to fetch matches', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const filteredMatches = matches.filter(m => {
    const matchesFilter = filter === 'all' || m.eligibility_status === filter;
    const matchesSearch = m.course_name.toLowerCase().includes(search.toLowerCase()) || 
                          m.university_name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <h2 className="text-xl font-bold text-slate-900">Calculating your future...</h2>
        <p className="text-slate-500">Matching your grades with university requirements</p>
      </div>
    );
  }

  if (!lastResult && !loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">No Results Found</h2>
        <p className="text-slate-600 mb-8 text-xl">Please upload your certificate or enter grades manually first.</p>
        <Link to="/upload" className="bg-primary text-white px-8 py-4 rounded-2xl font-bold">Get Started</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fade-in">
      {/* Header Summary */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 mb-12 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <CheckCircle2 className="w-40 h-40" />
        </div>
        <div className="relative z-10">
          <p className="text-blue-300 font-bold mb-2 tracking-widest uppercase text-sm">Analysis Complete</p>
          <h1 className="text-4xl font-extrabold mb-6">Your Eligibility Report</h1>
          <div className="flex flex-wrap gap-6">
            <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10">
              <p className="text-slate-300 text-sm font-medium">Mean Grade</p>
              <p className="text-3xl font-black">{lastResult.mean_grade}</p>
            </div>
            <div className="bg-blue-500/20 backdrop-blur-md px-6 py-4 rounded-2xl border border-blue-400/20">
              <p className="text-blue-200 text-sm font-medium">Total Points</p>
              <p className="text-3xl font-black">{lastResult.total_points}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search for courses or universities..."
            className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-primary/10 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 p-1 bg-white border border-slate-200 rounded-2xl shrink-0">
          {['all', 'eligible', 'ineligible'].map(opt => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`px-6 py-3 rounded-xl font-bold capitalize transition-all ${filter === opt ? 'bg-primary text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {opt === 'all' ? 'All' : opt === 'eligible' ? 'Eligible' : 'Not Eligible'}
            </button>
          ))}
        </div>
      </div>

      {/* Results List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredMatches.map((match, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group bg-white rounded-3xl border border-slate-100 p-6 hover:shadow-2xl hover:shadow-slate-200/50 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <Building2 className="w-4 h-4" />
                  {match.university_name}
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-primary transition-colors">{match.course_name}</h3>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${match.eligibility_status === 'eligible' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {match.eligibility_status}
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-500 text-sm mb-6 pb-6 border-b border-slate-50">
              <MapPin className="w-4 h-4" />
              {match.university_location}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Requirement Status</p>
                <p className={`text-sm font-medium ${match.eligibility_status === 'eligible' ? 'text-slate-600' : 'text-red-500'}`}>
                  {match.reason}
                </p>
              </div>
              <Link to={`/course/${match.course_id}`} className="p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ResultsPage;
