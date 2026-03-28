import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, ChevronRight, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const grades = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'E'];
const subjects = [
  { code: 'MAT', name: 'Mathematics' },
  { code: 'ENG', name: 'English' },
  { code: 'KIS', 'name': 'Kiswahili' },
  { code: 'BIO', name: 'Biology' },
  { code: 'CHEM', name: 'Chemistry' },
  { code: 'PHY', name: 'Physics' },
  { code: 'HIST', name: 'History' },
  { code: 'GEO', name: 'Geography' },
  { code: 'CRE', name: 'CRE' },
  { code: 'AGRI', name: 'Agriculture' },
  { code: 'BST', name: 'Business Studies' }
];

const ManualEntryPage = () => {
  const [selectedSubjects, setSelectedSubjects] = useState([{ 
    subject_code: 'MAT', 
    grade: 'C+', 
    id: Math.random().toString(36).substr(2, 9) 
  }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const addSubject = () => {
    setSelectedSubjects([...selectedSubjects, { 
      subject_code: 'ENG', 
      grade: 'C+', 
      id: Math.random().toString(36).substr(2, 9) 
    }]);
  };

  const removeSubject = (id) => {
    if (selectedSubjects.length === 1) return;
    setSelectedSubjects(selectedSubjects.filter(s => s.id !== id));
  };

  const updateSubject = (id, field, value) => {
    setSelectedSubjects(selectedSubjects.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedSubjects.length < 7) {
      setError('Please add at least 7 subjects as per KCSE requirements.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    // Transform data for backend
    const subjectsMap = {};
    selectedSubjects.forEach(s => {
      subjectsMap[s.subject_code] = s.grade;
    });

    try {
      const res = await api.post('/api/results/manual', { subjects: subjectsMap });
      const resultData = res.data.data || res.data;
      sessionStorage.setItem('lastResult', JSON.stringify(resultData));
      navigate(`/results?id=${resultData.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit results.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] py-20 px-4 bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-secondary font-black text-xs uppercase tracking-widest outline outline-1 outline-secondary/20">
             <Plus className="w-4 h-4" />
             <span>Manual Entry</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 leading-tight">Enter Your Grades</h1>
          <p className="text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
            Specify your KCSE subjects and grades manually to see your eligibility matches instantly.
          </p>
        </div>

        <motion.div 
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-white p-10 rounded-[50px] shadow-2xl shadow-slate-200/50 border border-slate-50 overflow-hidden relative"
        >
           {/* Decorative Sparkle */}
           <Sparkles className="absolute -top-10 -right-10 w-40 h-40 text-primary/5 rotate-12" />

           <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              <div className="space-y-4">
                 <AnimatePresence initial={false}>
                    {selectedSubjects.map((s) => (
                       <motion.div 
                          key={s.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="group flex flex-col sm:flex-row gap-4 p-6 bg-slate-50/50 rounded-3xl border border-slate-100 hover:border-primary/30 transition-all hover:bg-white hover:shadow-xl hover:shadow-primary/5"
                       >
                          <div className="flex-1 space-y-1">
                             <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Subject</label>
                             <select 
                                value={s.subject_code}
                                onChange={(e) => updateSubject(s.id, 'subject_code', e.target.value)}
                                className="w-full bg-white border border-slate-100 rounded-xl py-3 px-4 outline-none focus:border-primary font-bold text-slate-700"
                             >
                                {subjects.map(sub => <option key={sub.code} value={sub.code}>{sub.name}</option>)}
                             </select>
                          </div>
                          <div className="w-full sm:w-32 space-y-1">
                             <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Grade</label>
                             <select 
                                value={s.grade}
                                onChange={(e) => updateSubject(s.id, 'grade', e.target.value)}
                                className="w-full bg-white border border-slate-100 rounded-xl py-3 px-4 outline-none focus:border-primary font-bold text-slate-700"
                             >
                                {grades.map(g => <option key={g} value={g}>{g}</option>)}
                             </select>
                          </div>
                          <div className="flex items-end pb-1">
                             <button 
                                type="button"
                                onClick={() => removeSubject(s.id)}
                                className="p-3 text-slate-300 hover:text-secondary hover:bg-red-50 rounded-xl transition-all"
                             >
                                <Trash2 className="w-5 h-5" />
                             </button>
                          </div>
                       </motion.div>
                    ))}
                 </AnimatePresence>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-50">
                 <button 
                    type="button"
                    onClick={addSubject}
                    className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs hover:scale-105 transition-all bg-blue-50/50 px-6 py-3 rounded-full border border-primary/10"
                 >
                    <Plus className="w-4 h-4" /> Add Subject
                 </button>
                 
                 <div className="flex items-center gap-4 w-full sm:w-auto">
                    {error && (
                       <div className="flex items-center gap-2 text-secondary font-bold text-xs">
                          <AlertCircle className="w-4 h-4" /> {error}
                       </div>
                    )}
                    <button
                       type="submit"
                       disabled={loading}
                       className="w-full sm:w-auto bg-primary text-white px-12 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-primary-dark transition-all shadow-2xl shadow-primary/30 disabled:opacity-50"
                    >
                       {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Match My Results <ChevronRight className="w-6 h-6" /></>}
                    </button>
                 </div>
              </div>
           </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ManualEntryPage;
