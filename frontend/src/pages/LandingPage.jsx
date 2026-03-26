import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, FileText, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 sm:pt-32 sm:pb-24">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-primary text-sm font-bold mb-6">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Career Guidance</span>
            </div>
            <h1 className="text-5xl sm:text-7xl font-extrabold text-slate-900 tracking-tight mb-8">
              Shape Your Future with <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">ElimuPath</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-slate-600 mb-10 leading-relaxed">
              Find the perfect university courses in Kenya based on your KCSE results. 
              Upload your certificate or enter grades manually to get started instantly.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/upload" 
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-primary-dark transition-all shadow-xl shadow-blue-500/25 hover:scale-105"
              >
                <Upload className="w-5 h-5" />
                Upload Results
              </Link>
              <Link 
                to="/manual-entry" 
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-slate-700 px-8 py-4 rounded-2xl font-bold text-lg border-2 border-slate-200 hover:border-primary hover:text-primary transition-all hover:scale-105"
              >
                <FileText className="w-5 h-5" />
                Enter Manually
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<FileText className="w-8 h-8 text-blue-500" />}
              title="Instant OCR Parsing"
              description="Upload your KCSE result slip and our AI extracts your subjects and grades in seconds."
            />
            <FeatureCard 
              icon={<CheckCircle className="w-8 h-8 text-green-500" />}
              title="Eligibility Matching"
              description="We cross-reference your results with the latest KUCCPS and university requirements."
            />
            <FeatureCard 
              icon={<ArrowRight className="w-8 h-8 text-purple-500" />}
              title="Career Mapping"
              description="Get recommendations for degree, diploma, and certificate courses tailored to you."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
    <div className="mb-6 p-3 bg-slate-50 rounded-2xl inline-block group-hover:scale-110 transition-transform">{icon}</div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{description}</p>
  </div>
);

export default LandingPage;
