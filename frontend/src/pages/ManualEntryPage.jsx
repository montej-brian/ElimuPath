import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { FileText, Plus, Trash2, Save, ArrowLeft, GraduationCap, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const grades = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'E'];
const commonSubjects = [
  { code: 'ENG', name: 'English' },
  { code: 'KIS', name: 'Kiswahili' },
  { code: 'MAT', name: 'Mathematics' },
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
  const [selectedSubjects, setSelectedSubjects] = useState([
    { code: 'ENG', grade: '' },
    { code: 'KIS', grade: '' },
    { code: 'MAT', grade: '' },
    { code: 'BIO', grade: '' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const addSubject = () => {
    setSelectedSubjects([...selectedSubjects, { code: '', grade: '' }]);
  };

  const removeSubject = (index) => {
    const fresh = [...selectedSubjects];
    fresh.splice(index, 1);
    setSelectedSubjects(fresh);
  };

  const updateSubject = (index, field, value) => {
    const fresh = [...selectedSubjects];
    fresh[index][field] = value;
    setSelectedSubjects(fresh);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedSubjects.length < 7) {
      setError('KCSE requires at least 7 subjects for a valid mean grade');
      return;
    }
    
    const incomplete = selectedSubjects.some(s => !s.code || !s.grade);
    if (incomplete) {
      setError('Please select both subject and grade for all entries');
      return;
    }

    setLoading(true);
    setError('');

    // Transform to backend format: { subjects: { ENG: "A", MAT: "B+" } }
    const subjectsObj = {};
    selectedSubjects.forEach(s => subjectsObj[s.code] = s.grade);

    try {
      const res = await api.post('/api/results/manual', { subjects: subjectsObj });
      sessionStorage.setItem('lastResult', JSON.stringify(res.data));
      navigate('/results');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save results');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary font-bold mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-8 sm:p-12 text-center border-b border-slate-50 bg-slate-50/30">
          <div className="inline-flex p-3 bg-blue-50 rounded-2xl text-primary mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Manual Grade Entry</h1>
          <p className="text-slate-600">Enter at least 7 subjects from your KCSE result slip.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 sm:p-12">
          {error && (
            <div className="mb-8 bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2 text-sm font-medium border border-red-100">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <AnimatePresence>
              {selectedSubjects.map((subject, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-3 sm:gap-4"
                >
                  <div className="flex-1">
                    <select 
                      value={subject.code}
                      onChange={(e) => updateSubject(index, 'code', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-semibold"
                    >
                      <option value="">Select Subject</option>
                      {commonSubjects.map(s => (
                        <option key={s.code} value={s.code}>{s.name} ({s.code})</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-32">
                    <select 
                      value={subject.grade}
                      onChange={(e) => updateSubject(index, 'grade', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold text-center"
                    >
                      <option value="">Grade</option>
                      {grades.map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <button 
                    type="button"
                    onClick={() => removeSubject(index)}
                    className="p-3 text-slate-400 hover:text-secondary hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button 
              type="button"
              onClick={addSubject}
              className="flex-1 flex items-center justify-center gap-2 py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 font-bold hover:border-slate-400 hover:text-slate-700 transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Another Subject
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-white py-4 rounded-2x border-2 border-primary l font-bold text-lg hover:bg-primary-dark transition-all shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Saving...' : 'Compare Eligibility'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManualEntryPage;
