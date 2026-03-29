import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Edit2, Trash2, Building, GraduationCap, X, Save, AlertCircle, BookmarkPlus, Loader2, Upload, FileText, History, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const grades = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'E'];
const subjects = ['ENG', 'KIS', 'MAT', 'BIO', 'CHEM', 'PHY', 'HIST', 'GEO', 'CRE', 'AGRI', 'BST'];

const AdminPanel = () => {
  const [universities, setUniversities] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('universities');
  
  // Modal states
  const [showUniModal, setShowUniModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showClusterModal, setShowClusterModal] = useState(false);
  const [showCutoffModal, setShowCutoffModal] = useState(false);
  
  const [editingItem, setEditingItem] = useState(null);
  const [activeCourse, setActiveCourse] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [uRes, cRes] = await Promise.all([
        api.get('/api/admin/universities'),
        api.get('/api/admin/courses')
      ]);
      setUniversities(uRes.data);
      setCourses(cRes.data);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUni = async (id) => {
    if (!window.confirm('Are you sure? This will delete all associated courses.')) return;
    try {
      await api.delete(`/api/admin/universities/${id}`);
      setUniversities(universities.filter(u => u.id !== id));
    } catch (err) { alert('Delete failed'); }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/api/admin/courses/${id}`);
      setCourses(courses.filter(c => c.id !== id));
    } catch (err) { alert('Delete failed'); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[calc(100vh-64px)]"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fade-in text-slate-900">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Data Administration</h1>
          <p className="text-slate-500 font-medium">Manage the core building blocks of ElimuPath</p>
        </div>
        <div className="flex gap-2 p-1 bg-white border border-slate-200 rounded-2xl">
          {['universities', 'courses', 'bulk import'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-bold capitalize transition-all ${activeTab === tab ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'universities' ? (
          <motion.div key="unis" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold flex items-center gap-2"><Building className="w-6 h-6 text-primary" /> Universities</h2>
              <button 
                onClick={() => { setEditingItem(null); setShowUniModal(true); }}
                className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-blue-500/20"
              >
                <Plus className="w-5 h-5" /> Add University
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {universities.map(u => (
                <div key={u.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                  <div className="mb-4">
                    <h3 className="text-xl font-black group-hover:text-primary transition-colors">{u.name}</h3>
                    <p className="text-slate-500 text-sm font-medium">{u.location} • {u.type}</p>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                    <a href={u.website_url} target="_blank" rel="noreferrer" className="text-xs font-bold text-slate-400 hover:text-primary underline">Website</a>
                    <div className="flex gap-1">
                      <button onClick={() => { setEditingItem(u); setShowUniModal(true); }} className="p-2 text-slate-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-all"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteUni(u.id)} className="p-2 text-slate-400 hover:text-secondary hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : activeTab === 'courses' ? (
          <motion.div key="courses" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold flex items-center gap-2"><GraduationCap className="w-6 h-6 text-primary" /> Courses</h2>
              <button 
                onClick={() => { setEditingItem(null); setShowCourseModal(true); }}
                className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-blue-500/20"
              >
                <Plus className="w-5 h-5" /> Add Course
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {courses.map(c => (
                <div key={c.id} className="bg-white p-6 rounded-3xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-lg transition-all">
                  <div className="space-y-1">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{c.university_name}</p>
                    <h3 className="text-xl font-black">{c.name}</h3>
                    <p className="text-sm text-slate-500 font-medium">{c.type} • {c.duration}</p>
                    {c.clusters && c.clusters.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {c.clusters.map((cluster, i) => (
                          <span key={i} className="text-[10px] font-black tracking-widest bg-blue-50 text-primary px-2 py-1 rounded-md">
                            {cluster}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                      <button 
                        onClick={() => { setActiveCourse(c); setShowClusterModal(true); }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-primary rounded-xl font-bold text-sm hover:bg-primary hover:text-white transition-all"
                      >
                        <BookmarkPlus className="w-4 h-4" /> Clusters
                      </button>
                      <button 
                        onClick={() => { setActiveCourse(c); setShowCutoffModal(true); }}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all"
                      >
                        <History className="w-4 h-4" /> Cut-offs
                      </button>
                    <div className="flex gap-1 border-l border-slate-100 pl-2">
                       <button onClick={() => { setEditingItem(c); setShowCourseModal(true); }} className="p-2 text-slate-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-all"><Edit2 className="w-4 h-4" /></button>
                       <button onClick={() => handleDeleteCourse(c.id)} className="p-2 text-slate-400 hover:text-secondary hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : activeTab === 'bulk import' ? (
          <motion.div key="import" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold flex items-center gap-2"><Upload className="w-6 h-6 text-primary" /> Bulk Import CSV</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <BulkImportCard title="Institutions" description="Headers: name, type, location" endpoint="/api/admin/bulk/universities" onSave={fetchData} />
              <BulkImportCard title="Courses" description="Headers: university_name, course_name, type, duration" endpoint="/api/admin/bulk/courses" onSave={fetchData} />
              <BulkImportCard title="Requirements" description="Headers: course_name, weight, subject_1, min_grade_1, subject_2 (opt), min_grade_2 (opt), subject_3 (opt), min_grade_3 (opt)" endpoint="/api/admin/bulk/requirements" onSave={fetchData} />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Modals Implementation (Abbreviated logic for brevity but fully functional in final write) */}
      <UniversityModal show={showUniModal} onClose={() => setShowUniModal(false)} onSave={fetchData} editing={editingItem} />
      <CourseModal show={showCourseModal} onClose={() => setShowCourseModal(false)} onSave={fetchData} universities={universities} editing={editingItem} />
      <ClusterSubjectsModal show={showClusterModal} onClose={() => setShowClusterModal(false)} course={activeCourse} onSave={fetchData} />
      <HistoricalCutoffsModal show={showCutoffModal} onClose={() => setShowCutoffModal(false)} course={activeCourse} />
    </div>
  );
};

// Sub-components for Modals
const Modal = ({ show, title, onClose, children }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-2xl font-black">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-slate-900 transition-all"><X className="w-6 h-6" /></button>
        </div>
        <div className="p-8">{children}</div>
      </motion.div>
    </div>
  );
};

const UniversityModal = ({ show, onClose, onSave, editing }) => {
  const [formData, setFormData] = useState({ name: '', type: 'Public', location: '', website_url: '' });
  
  useEffect(() => {
    if (show) {
      setFormData(editing || { name: '', type: 'Public', location: '', website_url: '' });
    }
  }, [editing, show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) await api.put(`/api/admin/universities/${editing.id}`, formData);
      else await api.post('/api/admin/universities', formData);
      onSave(); onClose();
    } catch (err) { alert('Save failed'); }
  };

  return (
    <Modal show={show} title={editing ? 'Edit University' : 'Add University'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-black uppercase text-slate-400">University Name</label>
          <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:border-primary" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-slate-400">Type</label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
              <option>Public</option><option>Private</option><option>TVET</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-slate-400">Location</label>
            <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-black uppercase text-slate-400">Website URL</label>
          <input className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none" value={formData.website_url} onChange={e => setFormData({...formData, website_url: e.target.value})} />
        </div>
        <button type="submit" className="w-full bg-primary text-white py-4 rounded-xl font-black text-lg shadow-xl shadow-blue-500/20 hover:bg-primary-dark transition-all">Save University</button>
      </form>
    </Modal>
  );
};

const CourseModal = ({ show, onClose, onSave, universities, editing }) => {
  const [formData, setFormData] = useState({ university_id: '', name: '', type: 'Degree', description: '', duration: '', cut_off_points: '' });
  
  useEffect(() => {
    if (show) {
      setFormData(editing || { university_id: universities[0]?.id || '', name: '', type: 'Degree', description: '', duration: '', cut_off_points: '' });
    }
  }, [editing, show, universities]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) await api.put(`/api/admin/courses/${editing.id}`, formData);
      else await api.post('/api/admin/courses', formData);
      onSave(); onClose();
    } catch (err) { alert('Save failed'); }
  };

  return (
    <Modal show={show} title={editing ? 'Edit Course' : 'Add Course'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!editing && (
          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-slate-400">University</label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none" value={formData.university_id} onChange={e => setFormData({...formData, university_id: e.target.value})}>
              {universities.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
        )}
        <div className="space-y-1">
          <label className="text-xs font-black uppercase text-slate-400">Course Name</label>
          <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:border-primary" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-slate-400">Type</label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
              <option>Degree</option><option>Diploma</option><option>Certificate</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-slate-400">Duration</label>
            <input required placeholder="e.g. 4 years" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-black uppercase text-slate-400">KUCCPS Cut-off Points</label>
          <input type="number" step="0.001" min="0" max="84" placeholder="e.g. 42.560" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:border-primary" value={formData.cut_off_points || ''} onChange={e => setFormData({...formData, cut_off_points: e.target.value})} />
        </div>
        <button type="submit" className="w-full bg-primary text-white py-4 rounded-xl font-black text-lg shadow-xl shadow-blue-500/20 hover:bg-primary-dark transition-all">Save Course</button>
      </form>
    </Modal>
  );
};

const KUCCPS_GROUPS = [
  'Mathematics', 'English / Kiswahili', 'Biology / Physics / Chemistry',
  'Any Other Group II Subject', 'Any Other Group III Subject',
  'Any Other Group IV Subject', 'Any Other Group V Subject',
  'Any Other Group II / III / IV / V Subject', 'Any Group III / IV / V Subject', 'Any Subject'
];

const ClusterSubjectsModal = ({ show, onClose, course, onSave }) => {
  const [subjects, setSubjects] = useState(['', '', '', '']);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (show && course) {
      const fetchClusters = async () => {
        try {
          const res = await api.get(`/api/admin/courses/${course.id}/clusters`);
          if (Array.isArray(res.data) && res.data.length === 4) setSubjects(res.data);
          else if (Array.isArray(res.data) && res.data.length > 0) {
            const padded = [...res.data];
            while (padded.length < 4) padded.push('');
            setSubjects(padded.slice(0, 4));
          } else {
            setSubjects(['', '', '', '']);
          }
        } catch (_err) { setSubjects(['', '', '', '']); }
      };
      fetchClusters();
    }
  }, [course, show]);

  const handleChange = (index, value) => {
    const newSubs = [...subjects];
    newSubs[index] = value;
    setSubjects(newSubs);
  };

  const swap = (indexA, indexB) => {
    const newSubs = [...subjects];
    const temp = newSubs[indexA];
    newSubs[indexA] = newSubs[indexB];
    newSubs[indexB] = temp;
    setSubjects(newSubs);
  };

  const handleSave = async () => {
    // Validation
    const trimmed = subjects.map(s => s.trim());
    if (trimmed.some(s => s === '')) {
      alert('All 4 clusters must be populated.');
      return;
    }
    if (new Set(trimmed).size !== 4) {
      alert('Duplicate clusters are not permitted. KUCCPS requires 4 distinct selection pools.');
      return;
    }

    setIsSaving(true);
    try {
      await api.put(`/api/admin/courses/${course.id}/clusters`, { subjects: trimmed });
      if (onSave) onSave();
      onClose();
    } catch (err) {
      alert(err.response?.data?.errors?.[0]?.msg || 'Failed to save cluster properties.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal show={show} title={`Cluster Subjects: ${course?.name}`} onClose={onClose}>
      <datalist id="kuccps_group_suggestions">
        {KUCCPS_GROUPS.map(opt => <option key={opt} value={opt} />)}
      </datalist>

      <div className="space-y-4">
        <p className="text-sm font-medium text-slate-500 mb-6">
          Define exactly 4 subject clusters. Our engine naturally understands KNEC grouping rules (e.g. <span className="text-primary font-bold">Group III</span>). Use standard naming defaults to enable mathematical parsing.
        </p>
        
        <div className="space-y-3">
          {subjects.map((sub, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="w-8 flex justify-center text-xs font-black text-slate-400">#{idx + 1}</span>
              <input
                className="flex-1 bg-white border border-slate-200 rounded-xl py-3 px-4 outline-none focus:border-primary text-sm font-bold shadow-sm"
                placeholder="e.g. Mathematics"
                list="kuccps_group_suggestions"
                value={sub}
                onChange={(e) => handleChange(idx, e.target.value)}
              />
              <div className="flex gap-1 shrink-0">
                 <button disabled={idx === 0} onClick={() => swap(idx, idx - 1)} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-500 disabled:opacity-30 disabled:hover:bg-white transition-all">
                    ↑
                 </button>
                 <button disabled={idx === 3} onClick={() => swap(idx, idx + 1)} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-500 disabled:opacity-30 disabled:hover:bg-white transition-all">
                    ↓
                 </button>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="w-full mt-8 bg-slate-900 text-white py-4 rounded-xl font-black text-lg shadow-xl hover:bg-black disabled:opacity-50 transition-all flex justify-center items-center gap-2"
        >
          {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Save className="w-5 h-5"/> Sync 4-Cluster Rule</>}
        </button>
      </div>
    </Modal>
  );
};

const BulkImportCard = ({ title, description, endpoint, onSave }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setMessage(null);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage(res.data.message);
      setFile(null);
      if (onSave) onSave();
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
      <div className="w-16 h-16 bg-blue-50 text-primary rounded-full flex items-center justify-center">
        <FileText className="w-8 h-8" />
      </div>
      <div>
        <h3 className="text-xl font-black">{title}</h3>
        <p className="text-xs text-slate-500 font-medium mt-1">{description}</p>
      </div>
      <input 
        type="file" 
        accept=".csv"
        onChange={(e) => setFile(e.target.files[0])}
        className="text-sm font-medium file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 w-full"
      />
      
      {error && <div className="text-red-500 text-xs font-bold bg-red-50 px-3 py-2 rounded-lg w-full flex text-left"><AlertCircle className="w-4 h-4 inline mr-2 shrink-0"/>{error}</div>}
      {message && <div className="text-green-600 text-xs font-bold bg-green-50 px-3 py-2 rounded-lg w-full text-left">{message}</div>}
      
      <button 
        onClick={handleUpload}
        disabled={!file || loading}
        className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold flex flex-row items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Upload className="w-4 h-4" /> Import CSV</>}
      </button>
    </div>
  );
};

const HistoricalCutoffsModal = ({ show, onClose, course }) => {
  const [cutoffs, setCutoffs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newCutoff, setNewCutoff] = useState({ year: new Date().getFullYear(), cut_off_points: '' });

  const fetchCutoffs = React.useCallback(async () => {
    if (!course) return;
    setLoading(true);
    try {
      const res = await api.get(`/api/admin/courses/${course.id}/cutoffs`);
      setCutoffs(res.data);
    } catch (_err) {
      console.error('Failed to fetch cutoffs');
    } finally {
      setLoading(false);
    }
  }, [course]);

  useEffect(() => {
    if (show && course) fetchCutoffs();
  }, [show, course, fetchCutoffs]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/admin/courses/${course.id}/cutoffs`, newCutoff);
      setNewCutoff({ year: new Date().getFullYear(), cut_off_points: '' });
      fetchCutoffs();
    } catch (err) {
      alert(err.response?.data?.error || 'Save failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await api.delete(`/api/admin/cutoffs/${id}`);
      fetchCutoffs();
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <Modal show={show} title={`Cut-offs: ${course?.name}`} onClose={onClose}>
      <div className="space-y-6">
        <form onSubmit={handleAdd} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-end gap-3">
          <div className="flex-1 space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400">Year</label>
            <input 
              type="number" 
              required 
              className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 outline-none focus:border-primary font-bold"
              value={newCutoff.year}
              onChange={e => setNewCutoff({...newCutoff, year: parseInt(e.target.value)})}
            />
          </div>
          <div className="flex-1 space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400">Points</label>
            <input 
              type="number" 
              step="0.001" 
              required 
              className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 outline-none focus:border-primary font-bold"
              value={newCutoff.cut_off_points}
              onChange={e => setNewCutoff({...newCutoff, cut_off_points: e.target.value})}
            />
          </div>
          <button type="submit" className="p-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-blue-500/20">
            <Plus className="w-5 h-5" />
          </button>
        </form>

        <div className="space-y-2">
          <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Historical Records</h4>
          {loading ? (
             <div className="py-8 text-center"><p className="text-slate-400 font-bold animate-pulse">Loading records...</p></div>
          ) : cutoffs.length === 0 ? (
             <div className="py-8 text-center"><p className="text-slate-400 font-bold">No historical data available.</p></div>
          ) : (
            <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
              {cutoffs.map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl group hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-4">
                    <span className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center font-black text-slate-600 text-sm">{item.year}</span>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">Cut-off</p>
                      <p className="font-black text-slate-700">{item.cut_off_points}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-300 hover:text-secondary hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AdminPanel;
