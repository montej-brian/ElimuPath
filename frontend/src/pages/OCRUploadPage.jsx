import React, { useState, useRef } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Upload, Camera, Loader2, CheckCircle, AlertTriangle, ChevronRight, Edit3, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const grades = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'E'];

const OCRUploadPage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [extracted, setExtracted] = useState(null); // { subjects, meanGrade, aggregatePoints, confidence }
  const [editedSubjects, setEditedSubjects] = useState({});
  const [editedAggregate, setEditedAggregate] = useState('');
  const [editedMeanGrade, setEditedMeanGrade] = useState('');
  const fileRef = useRef(null);
  const navigate = useNavigate();

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowed.includes(selectedFile.type)) {
      setError('Please upload a JPEG, PNG, WebP, or PDF file.');
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File too large. Maximum is 10MB.');
      return;
    }
    setFile(selectedFile);
    setError('');
    setExtracted(null);
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileSelect(droppedFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('resultSlip', file);

    try {
      const res = await api.post('/api/results/ocr', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const data = res.data.data;
      setExtracted(data);
      setEditedSubjects({ ...data.subjects });
      setEditedAggregate(data.aggregatePoints !== null ? String(data.aggregatePoints) : '');
      setEditedMeanGrade(data.meanGrade || '');
    } catch (err) {
      setError(err.response?.data?.error || 'OCR processing failed. Please try again or use manual entry.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubjectGradeChange = (code, grade) => {
    setEditedSubjects(prev => ({ ...prev, [code]: grade }));
  };

  const handleRemoveSubject = (code) => {
    setEditedSubjects(prev => {
      const copy = { ...prev };
      delete copy[code];
      return copy;
    });
  };

  const handleConfirm = async () => {
    const aggPts = parseInt(editedAggregate, 10);
    if (isNaN(aggPts) || aggPts < 0 || aggPts > 84) {
      setError('Please provide valid aggregate points (0–84).');
      return;
    }
    if (Object.keys(editedSubjects).length < 7) {
      setError('At least 7 subjects are required.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const res = await api.post('/api/results/ocr/confirm', {
        subjects: editedSubjects,
        meanGrade: editedMeanGrade,
        aggregatePoints: aggPts,
      });
      const resultData = res.data.data || res.data;
      sessionStorage.setItem('lastResult', JSON.stringify(resultData));
      navigate(`/results?id=${resultData.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save results.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setExtracted(null);
    setError('');
    setEditedSubjects({});
    setEditedAggregate('');
    setEditedMeanGrade('');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] py-20 px-4 bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 font-black text-xs uppercase tracking-widest outline outline-1 outline-emerald-200">
             <Camera className="w-4 h-4" />
             <span>AI-Powered OCR</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 leading-tight">Upload Your Result Slip</h1>
          <p className="text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
            Take a photo or upload your KCSE result slip. Our AI will automatically extract your subjects, grades, and aggregate points.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-10 rounded-[50px] shadow-2xl shadow-slate-200/50 border border-slate-50 overflow-hidden relative"
        >
          <Sparkles className="absolute -top-10 -right-10 w-40 h-40 text-emerald-500/5 rotate-12" />

          <div className="relative z-10 space-y-8">
            {/* ───── PHASE 1: UPLOAD ───── */}
            {!extracted && (
              <>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                  className={`border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all ${
                    file
                      ? 'border-emerald-300 bg-emerald-50/50'
                      : 'border-slate-200 bg-slate-50/50 hover:border-primary hover:bg-blue-50/30'
                  }`}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                  />

                  {preview ? (
                    <div className="space-y-4">
                      <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-2xl shadow-lg" />
                      <p className="text-sm font-bold text-emerald-600">{file?.name}</p>
                    </div>
                  ) : file ? (
                    <div className="space-y-3">
                      <Upload className="w-16 h-16 text-emerald-500 mx-auto" />
                      <p className="text-lg font-bold text-slate-700">{file.name}</p>
                      <p className="text-sm text-slate-500">PDF file selected</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Upload className="w-16 h-16 text-slate-300 mx-auto" />
                      <p className="text-lg font-bold text-slate-700">Drag & drop your result slip here</p>
                      <p className="text-sm text-slate-500">or click to browse · JPEG, PNG, WebP, PDF · Max 10MB</p>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-600 font-bold text-sm bg-red-50 p-4 rounded-2xl">
                    <AlertTriangle className="w-5 h-5 shrink-0" /> {error}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className="flex-1 bg-emerald-600 text-white px-12 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-500/30 disabled:opacity-40 disabled:shadow-none"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" /> Scanning with AI...
                      </>
                    ) : (
                      <>
                        <Camera className="w-6 h-6" /> Scan Result Slip
                      </>
                    )}
                  </button>
                </div>
              </>
            )}

            {/* ───── PHASE 2: VERIFY & CONFIRM ───── */}
            <AnimatePresence>
              {extracted && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  {/* Confidence banner */}
                  <div className={`flex items-center gap-3 p-5 rounded-2xl ${
                    extracted.confidence >= 0.8
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {extracted.confidence >= 0.8 ? (
                      <CheckCircle className="w-6 h-6 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 shrink-0" />
                    )}
                    <div>
                      <p className="font-black text-sm">
                        {extracted.confidence >= 0.8
                          ? `Extraction complete · ${Math.round(extracted.confidence * 100)}% confidence`
                          : `Low confidence (${Math.round(extracted.confidence * 100)}%). Please review carefully.`}
                      </p>
                      <p className="text-xs font-medium opacity-80">Verify all subjects and grades below before confirming.</p>
                    </div>
                  </div>

                  {/* Aggregate Points Input */}
                  <div className="bg-slate-50/80 p-6 rounded-3xl border border-blue-100">
                    <label className="block text-xs font-black uppercase text-slate-500 tracking-widest mb-2 pl-2">
                      Official KCSE Aggregate Points (Max 84)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 74"
                      min="0"
                      max="84"
                      value={editedAggregate}
                      onChange={(e) => setEditedAggregate(e.target.value)}
                      className="w-full max-w-xs bg-white border-2 border-slate-200 rounded-2xl py-4 px-5 outline-none focus:border-primary font-black text-xl text-slate-900 transition-all placeholder:text-slate-300"
                      required
                    />
                    {!editedAggregate && (
                      <p className="mt-2 text-xs font-bold text-amber-600 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Required — enter this from your certificate
                      </p>
                    )}
                  </div>

                  {/* Extracted Subjects Table */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                        <Edit3 className="w-5 h-5 text-primary" /> Extracted Subjects
                      </h3>
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                        {Object.keys(editedSubjects).length} subjects
                      </span>
                    </div>

                    {Object.entries(editedSubjects).map(([code, grade]) => (
                      <div
                        key={code}
                        className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-primary/20 transition-all"
                      >
                        <span className="flex-1 font-black text-slate-700 text-sm">{code}</span>
                        <select
                          value={grade}
                          onChange={(e) => handleSubjectGradeChange(code, e.target.value)}
                          className="w-full sm:w-28 bg-white border border-slate-200 rounded-xl py-2 px-3 outline-none focus:border-primary font-bold text-slate-700 text-sm"
                        >
                          {grades.map((g) => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleRemoveSubject(code)}
                          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-red-600 font-bold text-sm bg-red-50 p-4 rounded-2xl">
                      <AlertTriangle className="w-5 h-5 shrink-0" /> {error}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
                    <button
                      onClick={handleReset}
                      className="px-8 py-4 rounded-2xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={handleConfirm}
                      disabled={saving}
                      className="flex-1 bg-primary text-white px-12 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-primary-dark transition-all shadow-2xl shadow-primary/30 disabled:opacity-50"
                    >
                      {saving ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <>
                          Confirm & Match <ChevronRight className="w-6 h-6" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OCRUploadPage;
