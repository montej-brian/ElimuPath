import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import { GraduationCap, MapPin, Clock, BookOpen, CheckCircle, XCircle, AlertCircle, Filter, Search, Loader2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RequirementModal = ({ isOpen, onClose, match }) => {
  if (!isOpen) return null;

  const isKUCCPS = Array.isArray(match.detailed_reasons) && match.detailed_reasons.length > 0;
  
  let requirements = [];
  try {
    if (!isKUCCPS) requirements = JSON.parse(match.reason);
  } catch (_e) {
    requirements = [{ subject: 'Points', message: match.reason, status: match.eligibility_status === 'eligible' ? 'met' : 'failed' }];
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8 border-b border-slate-100 flex items-center justify-center relative">
          <div className="text-center">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-2">{match.university_name}</p>
            <h3 className="text-2xl font-black text-slate-900">{match.course_name}</h3>
          </div>
          <button onClick={onClose} className="absolute right-8 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-colors">
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8">
          <div className="mb-6 p-6 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-between">
             <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Calculated Cluster Points</p>
                 <p className="text-4xl font-black text-slate-900">{match.computed_points?.toFixed(3) || '0.000'}</p>
             </div>
             <div className="space-y-1 text-right">
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Required Cut-off</p>
                 <p className="text-2xl font-black text-slate-400">{match.cut_off_points?.toFixed(3) || '0.000'}</p>
             </div>
          </div>

          <div className="space-y-4">
            {isKUCCPS ? (
               match.detailed_reasons.map((reasonStr, idx) => (
                 <div key={idx} className={`p-6 rounded-3xl border transition-all ${reasonStr.includes('Missing') ? 'bg-red-50/50 border-red-100 text-secondary' : 'bg-green-50/50 border-green-100 text-green-700'}`}>
                    <div className="flex items-center gap-3">
                       {reasonStr.includes('Missing') ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                       <p className="text-sm font-bold">{reasonStr}</p>
                    </div>
                 </div>
               ))
            ) : (
               requirements.map((req, idx) => (
                 <div key={idx} className={`p-6 rounded-3xl border transition-all ${req.status === 'met' ? 'bg-green-50/50 border-green-100' : 'bg-red-50/50 border-red-100'}`}>
                   <div className="flex items-center justify-between gap-4">
                     <div className="flex items-center gap-4">
                       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm ${req.status === 'met' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-secondary'}`}>
                         {req.subject}
                       </div>
                       <div>
                         <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Requirement</p>
                         <p className="text-sm font-bold text-slate-700">Minimum Grade: <span className="text-primary font-black uppercase">{req.required || 'N/A'}</span></p>
                       </div>
                     </div>
                     <div className="text-right">
                       <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Your Grade</p>
                       <p className={`text-xl font-black uppercase ${req.status === 'met' ? 'text-green-500' : 'text-secondary'}`}>{req.student || 'N/A'}</p>
                     </div>
                   </div>
                   {req.message && req.status === 'failed' && (
                     <div className="mt-4 pt-4 border-t border-red-100 flex items-center gap-2">
                       <AlertCircle className="w-3 h-3 text-secondary" />
                       <p className="text-[10px] font-bold text-secondary uppercase tracking-wider">{req.message}</p>
                     </div>
                   )}
                 </div>
               ))
            )}
            
            <div className={`mt-6 p-4 rounded-2xl text-center text-xs font-black uppercase tracking-widest ${match.eligibility_status === 'eligible' ? 'text-green-600 bg-green-50' : 'text-secondary bg-red-50'}`}>
                {match.reason}
            </div>
          </div>
        </div>

        <div className="p-8 bg-slate-50/50 flex flex-col sm:flex-row gap-4">
          <button onClick={onClose} className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">
            Close Analysis
          </button>
          {match.eligibility_status === 'eligible' && (
            <button className="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
              Proceed to Application
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const ResultsPage = () => {
  const [searchParams] = useSearchParams();
  const [matches, setMatches] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [selectedMatch, setSelectedMatch] = useState(null);
  const resultId = searchParams.get('id');

  const fetchMatches = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/matches/${resultId}/matches?page=${page}&limit=10`);
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

  const sortedMatches = [...filteredMatches].sort((a, b) => {
    if (sortBy === 'computed_desc') return (b.computed_points || 0) - (a.computed_points || 0);
    if (sortBy === 'computed_asc') return (a.computed_points || 0) - (b.computed_points || 0);
    if (sortBy === 'cutoff_desc') return (b.cut_off_points || 0) - (a.cut_off_points || 0);
    if (sortBy === 'cutoff_asc') return (a.cut_off_points || 0) - (b.cut_off_points || 0);
    return 0;
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
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-white rounded-xl font-bold text-xs uppercase tracking-widest text-slate-600 border border-slate-100 shadow-sm outline-none hover:border-primary transition-all cursor-pointer"
            >
              <option value="default">Default Sort</option>
              <option value="computed_desc">Highest My Score</option>
              <option value="computed_asc">Lowest My Score</option>
              <option value="cutoff_desc">Highest Cut-off</option>
              <option value="cutoff_asc">Lowest Cut-off</option>
            </select>
            
            <div className="flex gap-2 p-1 bg-white rounded-2xl border border-slate-100 shadow-sm">
              {['all', 'eligible', 'ineligible'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 sm:px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${filter === f ? 'bg-primary text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence mode="popLayout">
            {sortedMatches.map((match) => (
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

                  <div className="flex flex-col gap-6 lg:border-l lg:border-slate-50 lg:pl-8 lg:min-w-[300px]">
                    <div className="flex flex-col">
                       <div className="flex items-center justify-between mb-2">
                           <div className="flex items-center gap-1 group/tooltip relative">
                               <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">KUCCPS Score</p>
                               <Info className="w-3 h-3 text-slate-300 cursor-help" />
                               <div className="absolute bottom-full mb-2 left-0 w-64 p-3 bg-slate-800 text-white text-[10px] rounded-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-10 shadow-xl">
                                   <strong className="block mb-1 text-primary-light">Formula: C = (r * t) / 84</strong>
                                   r = Your Best 4 Cluster Subjects<br/>
                                   t = Your Overall KCSE Aggregate<br/>
                                   <em>*Subject to Affirmative Action (PI) adjustments. Max 48 pts.</em>
                               </div>
                           </div>
                           <span className={`text-xs font-black uppercase tracking-widest ${match.eligibility_status === 'eligible' ? 'text-green-500' : 'text-secondary'}`}>
                              {match.eligibility_status}
                           </span>
                       </div>
                       
                       <div className="flex items-end gap-2 mb-2">
                           <span className={`text-3xl font-black leading-none ${match.eligibility_status === 'eligible' ? 'text-slate-900' : 'text-slate-400'}`}>
                              {match.computed_points?.toFixed(3) || '0.000'}
                           </span>
                           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                              / {match.cut_off_points?.toFixed(3) || '0.000'}
                           </span>
                       </div>

                       {/* Progress Bar (Max 48) */}
                       <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden relative">
                           <div 
                               className={`absolute top-0 left-0 h-full rounded-full ${match.eligibility_status === 'eligible' ? 'bg-green-500' : 'bg-red-400'}`} 
                               style={{ width: `${Math.min(100, ((match.computed_points || 0) / 48) * 100)}%` }}
                           />
                           <div 
                               className="absolute top-0 bottom-0 w-0.5 bg-slate-700 z-10" 
                               style={{ left: `${Math.min(100, ((match.cut_off_points || 0) / 48) * 100)}%` }} 
                               title={`Cut-off: ${match.cut_off_points}`}
                           />
                       </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                      <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center ${match.eligibility_status === 'eligible' ? 'bg-green-50 text-green-500 shadow-md shadow-green-500/10' : 'bg-red-50 text-secondary shadow-md shadow-secondary/10'}`}>
                        {match.eligibility_status === 'eligible' ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                      </div>

                      <button 
                        onClick={() => setSelectedMatch(match)}
                        className={`w-full py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${match.eligibility_status === 'eligible' ? 'bg-primary text-white shadow-xl shadow-primary/30 hover:bg-primary-dark' : 'bg-white border-2 border-slate-100 text-slate-600 hover:border-slate-300'}`}
                      >
                        {match.eligibility_status === 'eligible' ? 'Apply Now' : 'Why Ineligible?'}
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

      <AnimatePresence>
        {selectedMatch && (
          <RequirementModal 
            isOpen={!!selectedMatch} 
            match={selectedMatch} 
            onClose={() => setSelectedMatch(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResultsPage;
