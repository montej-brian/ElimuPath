import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, FileText, CheckCircle, ArrowRight, Star, Users, BookOpen, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
  return (
    <div className="bg-[#F8FAFC] overflow-x-hidden">
      {/* 1. Hero Section */}
      <section className="relative min-h-[85vh] flex items-center pt-10 pb-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8 relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-100 shadow-sm text-secondary font-bold text-sm uppercase tracking-widest">
              <Star className="w-4 h-4 fill-secondary" />
              <span>Personalized Guidance</span>
            </div>
            <h1 className="text-5xl sm:text-7xl font-black text-slate-900 leading-[1.1]">
              Come Along <br />
              As We Begin Our <br />
              <span className="text-primary italic relative">
                Learning Journey
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 15C50 5 150 5 295 15" stroke="#F58220" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>
            <p className="text-lg text-slate-500 max-w-lg leading-relaxed font-medium">
              ElimuPath uses AI to analyze your KCSE results and match you with the best university courses in Kenya. Your future starts here.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/register" className="bg-secondary text-white px-10 py-5 rounded-full font-black text-lg hover:bg-secondary-dark transition-all shadow-2xl shadow-secondary/30 hover:scale-105">
                Try for free
              </Link>
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-14 h-14 rounded-full border-2 border-slate-200 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                  <ArrowRight className="w-6 h-6 text-slate-400 group-hover:text-white" />
                </div>
                <span className="font-bold text-slate-900 uppercase tracking-widest text-sm">How it works</span>
              </div>
            </div>
            {/* Decorative Vector */}
            <div className="absolute -left-20 -bottom-20 opacity-10 pointer-events-none">
               <Zap className="w-64 h-64 text-primary" />
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative z-10 rounded-[60px_60px_200px_60px] overflow-hidden shadow-2xl border-[12px] border-white max-w-xl mx-auto lg:ml-auto">
              <img src="/assets/hero.png" alt="Student Learning" className="w-full h-full object-cover" />
            </div>
            {/* Blue splash background */}
            <div className="absolute -bottom-10 -right-10 w-full h-full bg-primary -z-10 rounded-[100px_60px_60px_200px] opacity-90 transform rotate-3 scale-95"></div>
            {/* Floating items */}
            <div className="absolute -top-10 right-10 bg-white p-4 rounded-3xl shadow-2xl animate-bounce">
               <BookOpen className="w-8 h-8 text-secondary" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. About Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left Visuals */}
          <div className="relative flex justify-center lg:justify-start">
            <div className="w-80 h-80 rounded-full border-[10px] border-slate-50 overflow-hidden shadow-xl z-10 relative">
              <img src="/assets/about.png" alt="Group of Students" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-2xl z-20 flex items-center gap-4 border border-slate-100">
               <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl">+230</div>
               <div className="text-xs font-black uppercase text-slate-400">Awesome <br/> Awards</div>
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-8">
            <div className="flex items-center gap-2 text-secondary font-black uppercase tracking-widest text-sm">
               <span>About Us</span>
               <div className="flex gap-1 text-accent">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
               </div>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight">
               Establishing a Community that <br />
               Encourages Lifelong Learning
            </h2>
            <p className="text-slate-500 font-medium leading-relaxed">
               ElimuPath is more than just a matching tool. We are building a platform that empowers Kenyan students to make data-driven decisions about their higher education.
            </p>
            
            <div className="bg-[#FFF4E8] p-4 rounded-xl border-l-4 border-secondary">
               <p className="text-slate-700 italic font-medium">"Our mission is to ensure every student finds their path to success through personalized educational insights."</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {[
                  'Free OCR Result Analysis',
                  'KUCCPS Alignment',
                  'Expert Course Guidance',
                  'Lifetime result access'
               ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                     <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white">
                        <CheckCircle className="w-4 h-4" />
                     </div>
                     <span className="font-bold text-slate-700">{item}</span>
                  </div>
               ))}
            </div>

            <button className="bg-primary text-white px-10 py-5 rounded-full font-black text-lg hover:bg-primary-dark transition-all shadow-2xl shadow-primary/20">
               Discover More
            </button>
          </div>
        </div>
      </section>

      {/* 3. Services Section */}
      <section className="py-24 px-4 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto text-center space-y-4 mb-16">
          <p className="text-primary font-black uppercase tracking-widest text-sm italic">Our Service</p>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight">
             Creating a Lifelong Learning <br/> Best Community
          </h2>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           <ServiceCard 
              icon={<Users className="w-10 h-10" />}
              title="Exclusive Coach"
              description="Personalized AI matching for individual career goals."
           />
           <ServiceCard 
              icon={<Sparkles className="w-10 h-10" />}
              title="Creative Minds"
              description="Discover unique interdisciplinary course combinations."
              active
           />
           <ServiceCard 
              icon={<Zap className="w-10 h-10" />}
              title="Fast Processing"
              description="Get your results parsed and matched in seconds."
           />
           <ServiceCard 
              icon={<ShieldCheck className="w-10 h-10" />}
              title="Secure Data"
              description="Your KCSE results and profile are kept strictly private."
           />
        </div>
      </section>

      {/* 4. Stats Section */}
      <section className="py-20 bg-white border-t border-slate-100">
         <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 px-4">
            <StatItem count="30.3K" label="Students Enrolled" />
            <StatItem count="40.5K" label="Courses Matched" />
            <StatItem count="88.9%" label="Satisfaction Rate" />
            <StatItem count="6.3+" label="Academic Instructors" />
         </div>
      </section>
    </div>
  );
};

const ServiceCard = ({ icon, title, description, active }) => (
  <div className={`p-10 rounded-[40px] border-2 transition-all group ${active ? 'bg-white border-secondary shadow-2xl relative z-10' : 'bg-transparent border-slate-100 hover:border-primary hover:bg-white'}`}>
    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 ${active ? 'bg-secondary text-white' : 'bg-slate-50 text-primary group-hover:bg-primary group-hover:text-white'}`}>
       {icon}
    </div>
    <h3 className="text-xl font-black text-slate-900 mb-4">{title}</h3>
    <p className="text-slate-500 font-medium mb-8 leading-relaxed">{description}</p>
    <button className={`font-black text-xs uppercase tracking-widest flex items-center gap-2 ${active ? 'text-secondary' : 'text-slate-400 group-hover:text-primary'}`}>
       Read More <ArrowRight className="w-4 h-4" />
    </button>
  </div>
);

const StatItem = ({ count, label }) => (
  <div className="text-center p-8 rounded-3xl border-2 border-dashed border-slate-100 hover:border-secondary transition-all group">
     <h4 className="text-4xl font-black text-slate-800 mb-2 group-hover:text-secondary transition-colors">{count}</h4>
     <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{label}</p>
  </div>
);

const Sparkles = ({ className }) => (
   <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L15 8L21 9L16.5 14L18 20L12 17L6 20L7.5 14L3 9L9 8L12 2Z" fill="currentColor"/>
   </svg>
);

export default LandingPage;
