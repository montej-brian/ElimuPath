import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Upload, File, X, Loader2, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (selected.size > 5 * 1024 * 1024) {
        setError('File size too large (max 5MB)');
        return;
      }
      setFile(selected);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError('');
    const formData = new FormData();
    formData.append('certificate', file);

    try {
      const res = await api.post('/api/results/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }
      });
      
      // Store result in session storage for the results page
      sessionStorage.setItem('lastResult', JSON.stringify(res.data.data));
      navigate('/results');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process certificate. Please try again or use manual entry.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-20">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary font-bold mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-8 sm:p-12 text-center border-b border-slate-50 bg-slate-50/30">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-4">Upload KCSE Certificate</h1>
          <p className="text-slate-600 max-w-xl mx-auto">
            Upload a clear photo or PDF of your result slip. Our AI will automatically extract your subjects and grades.
          </p>
        </div>

        <div className="p-8 sm:p-12">
          {!file ? (
            <label className="relative group cursor-pointer block">
              <input type="file" className="hidden" onChange={handleFileChange} accept=".jpg,.jpeg,.png,.pdf" />
              <div className="border-4 border-dashed border-slate-200 rounded-3xl p-12 transition-all group-hover:border-primary group-hover:bg-blue-50/50 flex flex-col items-center gap-4">
                <div className="p-5 bg-blue-50 rounded-2xl group-hover:scale-110 transition-transform">
                  <Upload className="w-10 h-10 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-slate-900">Click to upload or drag and drop</p>
                  <p className="text-slate-500 mt-1">PNG, JPG or PDF (max. 5MB)</p>
                </div>
              </div>
            </label>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm">
                    <File className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 truncate max-w-[200px] sm:max-w-md">{file.name}</p>
                    <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                {!uploading && (
                  <button onClick={() => setFile(null)} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-secondary transition-all">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {uploading && (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-bold text-slate-700">
                    <span>{progress < 100 ? 'Uploading...' : 'Processing with AI...'}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-sm justify-center py-2 italic">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Our AI is reading your KCSE results, this may take a few seconds...
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2 text-sm font-medium border border-red-100">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <button 
                onClick={handleUpload}
                disabled={uploading}
                className="w-full bg-primary text-white py-5 rounded-2xl font-bold text-xl hover:bg-primary-dark transition-all shadow-xl shadow-blue-500/25 disabled:opacity-50"
              >
                {uploading ? 'Processing...' : 'Analyze My Results'}
              </button>
            </div>
          )}

          <div className="mt-10 text-center">
            <p className="text-slate-500 font-medium">
              Having trouble uploading? <Link to="/manual-entry" className="text-primary font-bold hover:underline">Enter grades manually</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
