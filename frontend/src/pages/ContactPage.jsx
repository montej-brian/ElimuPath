import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, MapPin, Send } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] py-20 px-4 bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto text-center space-y-4 mb-16">
        <h1 className="text-5xl font-black text-slate-900 leading-tight">Get in Touch</h1>
        <p className="text-xl text-slate-500 font-medium">Have questions or need assistance with your academic path? Reach out to us.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-50"
      >
        <div className="p-12 text-center space-y-8">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-3xl font-black text-slate-900">Email Us directly</h2>
          <p className="text-slate-500 font-medium leading-relaxed">
            We are always happy to help you figure out your academic Journey or answer any specific functionality questions. Send us a direct email!
          </p>
          
          <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-4 bg-slate-50 p-6 rounded-3xl border border-slate-100 w-full">
             <MessageSquare className="w-8 h-8 text-secondary" />
             <a href="mailto:chachixzeedon@gmail.com" className="text-2xl font-black text-primary hover:text-primary-dark hover:underline transition-all">
               chachixzeedon@gmail.com
             </a>
          </div>

          <a 
            href="mailto:chachixzeedon@gmail.com"
            className="inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest hover:bg-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/20"
          >
             <Send className="w-5 h-5" /> Say Hello
          </a>
        </div>
        
        <div className="bg-slate-50 p-8 border-t border-slate-100 flex items-center justify-center gap-3 text-slate-500 font-bold">
           <MapPin className="w-5 h-5 text-slate-400" />
           Based in Kenya, East Africa
        </div>
      </motion.div>
    </div>
  );
};

export default ContactPage;
