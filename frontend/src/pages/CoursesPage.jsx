import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { BookOpen, Clock, Building, Loader2, Search, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/api/public/courses');
        setCourses(res.data);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const types = ['All', 'Degree', 'Diploma', 'Certificate'];

  const filtered = courses.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.university_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'All' || (c.type && c.type.toLowerCase().includes(activeFilter.toLowerCase()));
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-[calc(100vh-80px)] py-16 px-4 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-50 text-indigo-600 font-black text-xs uppercase tracking-widest border border-indigo-100/50">
             <BookOpen className="w-4 h-4" />
             <span>Programs</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 leading-tight">Available Courses</h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">Browse thousands of accredited Degree, Diploma, and Certificate programs recognized nationwide.</p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="flex bg-white p-1.5 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-50 w-full md:w-auto overflow-x-auto">
               {types.map(t => (
                  <button 
                     key={t}
                     onClick={() => setActiveFilter(t)}
                     className={`px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap ${activeFilter === t ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                     {t}
                  </button>
               ))}
            </div>

            <div className="w-full md:w-96 relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Search programs or universities..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-indigo-600 focus:shadow-xl focus:shadow-indigo-600/10 transition-all font-bold text-slate-700"
              />
            </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
            <Loader2 className="w-16 h-16 animate-spin text-indigo-600 mb-6" />
            <p className="font-black text-slate-600 uppercase tracking-widest text-sm">Loading Curriculums...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
               {filtered.map(course => (
                  <motion.div
                     layout
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     key={course.id}
                     className="bg-white p-8 rounded-[40px] shadow-xl shadow-slate-200/30 border border-slate-50 flex flex-col hover:shadow-2xl hover:border-indigo-100 transition-all group"
                  >
                     <div className="flex items-start justify-between mb-6">
                        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                           <GraduationCap className="w-7 h-7" />
                        </div>
                        <span className="px-3 py-1 bg-slate-50 text-slate-500 font-bold text-[10px] uppercase tracking-widest rounded-lg border border-slate-100">
                           {course.type || 'Course'}
                        </span>
                     </div>
                     
                     <h3 className="text-2xl font-black text-slate-900 leading-tight mb-4 group-hover:text-indigo-600 transition-colors">{course.name}</h3>
                     
                     {course.description && (
                        <p className="text-sm font-medium text-slate-500 line-clamp-2 mb-6">{course.description}</p>
                     )}

                     <div className="mt-auto space-y-3 pt-6 border-t border-slate-50">
                        <div className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                           <Building className="w-5 h-5 text-slate-400" />
                           {course.university_name}
                        </div>
                        <div className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                           <Clock className="w-5 h-5 text-secondary" />
                           {course.duration || 'Duration varies'}
                        </div>
                     </div>
                  </motion.div>
               ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && filtered.length === 0 && (
           <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
             <p className="text-xl font-bold text-slate-400">No courses found matching your criteria.</p>
           </div>
        )}

      </div>
    </div>
  );
};

export default CoursesPage;
