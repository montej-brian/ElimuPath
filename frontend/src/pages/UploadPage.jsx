import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, FileText, CheckCircle, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && (selected.type === 'application/pdf' || selected.type.startsWith('image/'))) {
      setFile(selected);
      setError('');
    } else {
      setError('Please upload a PDF or Image file.');
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(10);
    
    const formData = new FormData();
    formData.append('certificate', file);

    try {
      setProgress(40);
      const res = await api.post('/api/results/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(Math.max(40, percentCompleted));
        }
      });
      
      setProgress(90);
      sessionStorage.setItem('lastResult', JSON.stringify(res.data.data));
      setTimeout(() => navigate(`/results?id=${res.data.data.id}`), 500);
    } catch (_err) {
      setError(_err.response?.data?.error || 'Upload failed. Please try again.');
      setUploading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] py-20 px-4 bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-primary font-black text-xs uppercase tracking-widest outline outline-1 outline-primary/20">
             <UploadIcon className="w-4 h-4" />
             <span>AI Recognition</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 leading-tight">Upload Your Results</h1>
          <p className="text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
            Upload your KCSE secondary school certificate (PDF or Image). Our AI will automatically extract your grades and match you with eligible courses.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-12 rounded-[50px] shadow-2xl shadow-slate-200/50 border border-slate-50 relative"
        >
          <div 
            className={`relative group border-4 border-dashed rounded-[40px] p-16 transition-all flex flex-col items-center justify-center text-center cursor-pointer ${file ? 'border-primary bg-blue-50/50' : 'border-slate-100 hover:border-primary hover:bg-slate-50'}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const droppedFile = e.dataTransfer.files[0];
              if (droppedFile) handleFileChange({ target: { files: [droppedFile] } });
            }}
            onClick={() => document.getElementById('file-upload').click()}
          >
            <input 
              id="file-upload"
              type="file" 
              className="hidden" 
              accept=".pdf,image/*"
              onChange={handleFileChange}
              disabled={uploading}
            />
            
            <AnimatePresence mode="wait">
              {!file ? (
                <motion.div key="empty" className="space-y-6">
                  <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                    <UploadIcon className="w-10 h-10 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-900">Drag & Drop Here</p>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">or click to browse files</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="file" className="space-y-6">
                  <div className="w-24 h-24 bg-primary text-white rounded-3xl shadow-2xl shadow-primary/30 flex items-center justify-center mx-auto">
                    <FileText className="w-10 h-10" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-900 truncate max-w-xs mx-auto">{file.name}</p>
                    <p className="text-primary font-black text-xs uppercase tracking-widest mt-2 flex items-center justify-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Ready to parse
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {uploading && (
                <div className="absolute inset-x-8 bottom-12 space-y-3">
                   <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-primary"
                      />
                   </div>
                   <p className="text-xs font-black uppercase text-primary tracking-widest flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing Certificate... {progress}%
                   </p>
                </div>
            )}
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-8 p-4 bg-red-50 border-l-4 border-secondary rounded-xl flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-secondary" />
                <p className="text-secondary font-bold text-sm">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6">
             <div className="text-slate-400 font-bold text-sm flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                Secure & Encrypted Processing
             </div>
             <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="w-full sm:w-auto bg-primary text-white px-12 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-primary-dark transition-all shadow-2xl shadow-primary/30 disabled:opacity-50 disabled:shadow-none"
              >
                Analyze Results <ArrowRight className="w-6 h-6" />
              </button>
          </div>
        </motion.div>

        <div className="mt-12 text-center">
           <button 
             onClick={() => navigate('/manual')}
             className="text-slate-500 font-bold hover:text-secondary group flex items-center justify-center gap-2 mx-auto"
           >
              OCR not working? <span className="text-secondary font-black group-hover:underline">Enter results manually</span>
           </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
