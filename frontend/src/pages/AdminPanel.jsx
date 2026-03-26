import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Edit2, Trash2, Building, GraduationCap, X, Save, AlertCircle, BookmarkPlus } from 'lucide-react';
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
  const [showReqModal, setShowReqModal] = useState(false);
  
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
          {['universities', 'courses'].map(tab => (
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
        ) : (
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
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => { setActiveCourse(c); setShowReqModal(true); }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-primary rounded-xl font-bold text-sm hover:bg-primary hover:text-white transition-all"
                    >
                      <BookmarkPlus className="w-4 h-4" /> Requirements
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
        )}
      </AnimatePresence>

      {/* Modals Implementation (Abbreviated logic for brevity but fully functional in final write) */}
      <UniversityModal show={showUniModal} onClose={() => setShowUniModal(false)} onSave={fetchData} editing={editingItem} />
      <CourseModal show={showCourseModal} onClose={() => setShowCourseModal(false)} onSave={fetchData} universities={universities} editing={editingItem} />
      <RequirementsModal show={showReqModal} onClose={() => setShowReqModal(false)} course={activeCourse} />
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
  const [formData, setFormData] = useState({ university_id: '', name: '', type: 'Degree', description: '', duration: '' });
  
  useEffect(() => {
    if (show) {
      setFormData(editing || { university_id: universities[0]?.id || '', name: '', type: 'Degree', description: '', duration: '' });
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
        <button type="submit" className="w-full bg-primary text-white py-4 rounded-xl font-black text-lg shadow-xl shadow-blue-500/20 hover:bg-primary-dark transition-all">Save Course</button>
      </form>
    </Modal>
  );
};

const RequirementsModal = ({ show, onClose, course }) => {
  const [reqs, setReqs] = useState([]);
  const [formData, setFormData] = useState({ subject_code: 'MAT', min_grade: 'C+', cluster_weight: 1.0 });

  const fetchReqs = React.useCallback(async () => {
    if (!course) return;
    const res = await api.get(`/api/admin/courses/${course.id}/requirements`);
    setReqs(res.data);
  }, [course]);

  useEffect(() => {
    if (course && show) fetchReqs();
  }, [course, show, fetchReqs]);

  const handleAdd = async (e) => {
    e.preventDefault();
    await api.post(`/api/admin/courses/${course.id}/requirements`, formData);
    fetchReqs();
  };

  const handleDelete = async (id) => {
    await api.delete(`/api/admin/requirements/${id}`);
    fetchReqs();
  };

  return (
    <Modal show={show} title={`Requirements: ${course?.name}`} onClose={onClose}>
      <div className="space-y-6">
        <form onSubmit={handleAdd} className="p-4 bg-slate-50 rounded-2xl space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <select className="bg-white border rounded-lg p-2" value={formData.subject_code} onChange={e => setFormData({...formData, subject_code: e.target.value})}>
              {subjects.map(s => <option key={s}>{s}</option>)}
            </select>
            <select className="bg-white border rounded-lg p-2" value={formData.min_grade} onChange={e => setFormData({...formData, min_grade: e.target.value})}>
              {grades.map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
          <button type="submit" className="w-full bg-slate-900 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Add Required Subject
          </button>
        </form>

        <div className="space-y-2">
          {reqs.map(r => (
            <div key={r.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
              <div className="flex items-center gap-4">
                <span className="w-12 h-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center font-black">{r.subject_code}</span>
                <span className="font-bold text-slate-700">Min Grade: {r.min_grade}</span>
              </div>
              <button onClick={() => handleDelete(r.id)} className="p-2 text-slate-400 hover:text-secondary rounded-lg"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default AdminPanel;
