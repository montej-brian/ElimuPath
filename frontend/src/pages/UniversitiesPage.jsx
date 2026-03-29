import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Building2, MapPin, Globe, Loader2, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UniversitiesPage = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await api.get('/api/public/universities');
        setUniversities(res.data);
      } catch (err) {
        console.error('Failed to fetch universities:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUniversities();
  }, []);

  const filtered = universities.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.location && u.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-[calc(100vh-80px)] py-16 px-4 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-50 text-blue-600 font-black text-xs uppercase tracking-widest border border-blue-100/50">
             <Building2 className="w-4 h-4" />
             <span>Institutions</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 leading-tight">Universities in Kenya</h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">Explore top-tier public and private institutions ready to jumpstart your career.</p>
        </div>

        <div className="max-w-xl mx-auto relative group">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-primary transition-colors" />
           <input 
             type="text"
             placeholder="Search by university name or location..."
             value={searchTerm}
             onChange={e => setSearchTerm(e.target.value)}
             className="w-full bg-white border-2 border-slate-100 rounded-full py-5 pl-16 pr-6 outline-none focus:border-primary focus:shadow-2xl focus:shadow-primary/10 transition-all font-semibold text-lg text-slate-700"
           />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
            <Loader2 className="w-16 h-16 animate-spin text-primary mb-6" />
            <p className="font-black text-slate-600 uppercase tracking-widest text-sm">Loading Institutions...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <AnimatePresence>
                {filtered.map(uni => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={uni.id}
                    className="bg-white p-8 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-50 flex flex-col group hover:-translate-y-2 hover:border-primary/20 transition-all duration-300"
                  >
                    <div className="w-16 h-16 bg-blue-50 text-primary rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all shadow-xl shadow-blue-500/10">
                      <Building2 className="w-8 h-8" />
                    </div>
                    
                    <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight">{uni.name}</h3>
                    
                    <div className="flex items-center gap-2 mb-6">
                       <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black uppercase text-slate-500 tracking-widest">{uni.type || 'Institution'}</span>
                    </div>

                    <div className="mt-auto space-y-4 pt-6 border-t border-slate-50">
                       <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                          <MapPin className="w-5 h-5 text-secondary" />
                          {uni.location || 'Location Not Specified'}
                       </div>
                       
                       {uni.website_url && (
                         <a href={uni.website_url.startsWith('http') ? uni.website_url : `https://${uni.website_url}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-primary hover:text-primary-dark font-bold text-sm transition-colors">
                            <Globe className="w-5 h-5" /> Visit Website
                         </a>
                       )}
                    </div>
                  </motion.div>
                ))}
             </AnimatePresence>
          </div>
        )}

        {!loading && filtered.length === 0 && (
           <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
             <p className="text-xl font-bold text-slate-400">No universities found matching your search.</p>
           </div>
        )}

      </div>
    </div>
  );
};

export default UniversitiesPage;
