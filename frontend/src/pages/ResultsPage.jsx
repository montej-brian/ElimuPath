import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import { GraduationCap, MapPin, Clock, BookOpen, CheckCircle, XCircle, AlertCircle, Filter, Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ResultsPage = () => {
  const [searchParams] = useSearchParams();
  const [matches, setMatches] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const resultId = searchParams.get('id');

  const fetchMatches = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/matches/${resultId}/matches?page=${page}&limit=10`);
      // res.data is now { total, page, limit, data }
      setMatches(res.data.data);
      setTotal(res.data.total);
    } catch (_err) {
      console.error('Failed to fetch matches', _err);
    } finally {
      setLoading(false);
    }
  }, [resultId, page]);

  useEffect(() => {
    if (resultId) {
      fetchMatches();
    }
  }, [resultId, page, fetchMatches]);

  const filteredMatches = matches.filter(m => {
    if (filter === 'all') return true;
    return m.eligibility_status === filter;
  });

  if (loading && page === 1) return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 bg-[#F8FAFC]">
      <Loader2 className="w-16 h-16 animate-spin text-primary mb-6" />
      <p className="text-xl font-black text-slate-900 animate-pulse uppercase tracking-widest">Finding your perfect match...</p>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-80px)] py-12 px-4 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-slate-900">Your Eligibility Paths</h1>
            <p className="text-slate-500 font-medium">We've found {total} potential courses for you.</p>
          </div>
          <div className="flex gap-2 p-1 bg-white rounded-2xl border border-slate-100 shadow-sm">
            {['all', 'eligible', 'ineligible'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${filter === f ? 'bg-primary text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredMatches.map((match) => (
              <motion.div
                key={match.course_id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white p-8 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-50 group hover:border-primary/20 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-primary">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">{match.university_name}</p>
                        <h3 className="text-2xl font-black text-slate-900 group-hover:text-primary transition-colors">{match.course_name}</h3>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-6 text-sm font-bold text-slate-500">
                      <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-secondary" /> {match.university_location || match.location || 'Distributed'}</div>
                      <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> {match.duration || '4 Years'}</div>
                      <div className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-accent" /> Degree Program</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 lg:border-l lg:border-slate-50 lg:pl-8">
                    <div className="text-right hidden sm:block">
                       <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Status</p>
                       <span className={`text-sm font-black uppercase tracking-widest ${match.eligibility_status === 'eligible' ? 'text-green-500' : 'text-secondary'}`}>
                          {match.eligibility_status}
                       </span>
                    </div>

                    <div className={`w-16 h-16 rounded-3xl flex items-center justify-center ${match.eligibility_status === 'eligible' ? 'bg-green-50 text-green-500 shadow-xl shadow-green-500/10' : 'bg-red-50 text-secondary shadow-xl shadow-secondary/10'}`}>
                      {match.eligibility_status === 'eligible' ? <CheckCircle className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
                    </div>

                    <div className="flex flex-col gap-2 min-w-[200px]">
                      {match.eligibility_status === 'ineligible' && (
                        <div className="flex items-start gap-2 p-3 bg-red-50 rounded-xl border border-red-100">
                          <AlertCircle className="w-4 h-4 text-secondary mt-0.5" />
                          <p className="text-[10px] font-bold text-secondary leading-tight">{match.reason}</p>
                        </div>
                      )}
                      <button className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${match.eligibility_status === 'eligible' ? 'bg-primary text-white shadow-xl shadow-primary/30 hover:bg-primary-dark' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Pagination Controls */}
        {total > 10 && (
          <div className="mt-16 flex items-center justify-center gap-4">
            <button
              disabled={page === 1 || loading}
              onClick={() => setPage(p => p - 1)}
              className="px-8 py-4 bg-white rounded-2xl font-black text-xs uppercase tracking-widest border border-slate-100 shadow-sm hover:border-primary disabled:opacity-30 disabled:hover:border-slate-100 transition-all"
            >
              Previous
            </button>
            <span className="text-sm font-black text-slate-400 uppercase tracking-widest">
              Page {page} of {Math.ceil(total / 10)}
            </span>
            <button
              disabled={page >= Math.ceil(total / 10) || loading}
              onClick={() => setPage(p => p + 1)}
              className="px-8 py-4 bg-white rounded-2xl font-black text-xs uppercase tracking-widest border border-slate-100 shadow-sm hover:border-primary disabled:opacity-30 disabled:hover:border-slate-100 transition-all"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;
