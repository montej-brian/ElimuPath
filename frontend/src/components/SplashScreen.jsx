import React, { useState, useEffect } from 'react';
import Logo from './brand/Logo';
import { ChevronRight, X } from 'lucide-react';

const steps = [
    {
        title: "Welcome to ElimuPath",
        description: "Your personalized guide to higher education and career success in Kenya. Discover your potential today.",
        icon: "🎓"
    },
    {
        title: "Paste Your Results",
        description: "Simply copy-paste your KCSE result SMS. Our AI automatically identifies your grades and calculates points.",
        icon: "📱"
    },
    {
        title: "Instant Analysis",
        description: "Get immediate cluster weighted points for all degree groups and a detailed breakdown of your performance.",
        icon: "📊"
    },
    {
        title: "Explore Pathways",
        description: "Find eligible degree courses and career recommendations that perfectly match your academic profile.",
        icon: "🚀"
    }
];

const SplashScreen = ({ onFinish }) => {
    const [phase, setPhase] = useState('logo'); // logo, onboarding
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setPhase('onboarding');
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onFinish();
        }
    };

    if (phase === 'logo') {
        return (
            <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white animate-in fade-in duration-700">
                <div className="relative">
                    <div className="absolute inset-0 bg-blue-400 blur-2xl opacity-20 animate-pulse rounded-full"></div>
                    <div className="relative animate-bounce-slow">
                        <Logo className="h-24" showText={false} />
                    </div>
                </div>
                <div className="mt-8 overflow-hidden">
                    <h1 className="text-4xl font-black tracking-tight text-gray-900 animate-slide-up">
                        Elimu<span className="text-blue-600">Path</span>
                    </h1>
                </div>
                <footer className="fixed bottom-10 font-mono text-gray-400 text-sm tracking-widest animate-pulse">
                    Built by MONTEJ&lt;/&gt;
                </footer>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col font-sans">
            <div className="flex-1 max-w-lg mx-auto w-full px-8 flex flex-col justify-center relative">
                {/* Skip button top right */}
                <button
                    onClick={onFinish}
                    className="absolute top-10 right-8 p-2 text-gray-400 hover:text-gray-900 transition-colors flex items-center space-x-1 group"
                >
                    <span className="text-sm font-medium">Skip</span>
                    <X size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>

                {/* Content Area */}
                <div key={currentStep} className="animate-in slide-in-from-right-8 fade-in duration-500 fill-mode-forwards">
                    <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center text-5xl mb-10 shadow-sm border border-blue-100">
                        {steps[currentStep].icon}
                    </div>
                    <h2 className="text-4xl font-extrabold text-gray-900 leading-tight mb-6 tracking-tight">
                        {steps[currentStep].title}
                    </h2>
                    <p className="text-xl text-gray-600 leading-relaxed font-medium">
                        {steps[currentStep].description}
                    </p>
                </div>

                {/* Progress Indicators */}
                <div className="mt-16 flex items-center space-x-2">
                    {steps.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentStep
                                    ? 'w-10 bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.3)]'
                                    : idx < currentStep
                                        ? 'w-2 bg-blue-200'
                                        : 'w-2 bg-gray-100'
                                }`}
                        />
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="mt-16 flex space-x-4">
                    <button
                        onClick={handleNext}
                        className="flex-1 bg-gray-900 text-white py-5 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-black transition-all shadow-xl active:scale-95 group"
                    >
                        <span className="text-lg">
                            {currentStep === steps.length - 1 ? 'Start Exploring' : 'Continue'}
                        </span>
                        <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Sticky Footer */}
            <footer className="py-10 text-center text-gray-400 font-mono text-xs tracking-widest border-t border-gray-50 bg-gray-50/50">
                Built by MONTEJ&lt;/&gt;
            </footer>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(-5%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }
                    50% { transform: translateY(0); animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }
                }
                @keyframes slide-up {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-bounce-slow { animation: bounce-slow 2s infinite; }
                .animate-slide-up { animation: slide-up 0.8s ease-out forwards; }
            `}} />
        </div>
    );
};

export default SplashScreen;
