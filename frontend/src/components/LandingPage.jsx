import React from 'react';
import { ArrowRight, CheckCircle, Smartphone, TrendingUp } from 'lucide-react';

const LandingPage = ({ onGetStarted }) => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                            <TrendingUp className="text-white" size={24} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">ElimuPath</h1>
                    </div>
                </div>
            </div>
        </header>

        <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                    Turn Your KCSE Results Into<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                        Clear Career Pathways
                    </span>
                </h2>
                <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                    Paste your KCSE SMS results and instantly discover your cluster points,
                    eligible courses, and personalized career recommendations.
                </p>
                <button
                    onClick={onGetStarted}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white text-lg font-semibold rounded-lg hover:from-green-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                >
                    Analyze My KCSE Results
                    <ArrowRight className="ml-2" size={20} />
                </button>
            </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 bg-white rounded-2xl shadow-lg my-8">
            <h3 className="text-3xl font-bold text-center mb-12">How It Works</h3>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-green-600">1</span>
                    </div>
                    <h4 className="text-xl font-semibold mb-2">Paste Your Results</h4>
                    <p className="text-gray-600">
                        Copy your KCSE SMS results and paste them directly into our analyzer
                    </p>
                </div>
                <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-blue-600">2</span>
                    </div>
                    <h4 className="text-xl font-semibold mb-2">Pay Once via M-PESA</h4>
                    <p className="text-gray-600">
                        One-time payment of KES 200 to unlock your complete analysis
                    </p>
                </div>
                <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-purple-600">3</span>
                    </div>
                    <h4 className="text-xl font-semibold mb-2">Get Your Pathway</h4>
                    <p className="text-gray-600">
                        Receive cluster points, eligible courses, and career recommendations
                    </p>
                </div>
            </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <h3 className="text-3xl font-bold text-center mb-12">What You Get</h3>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {[
                    'Complete cluster points calculation',
                    'Degree program eligibility',
                    'Diploma and certificate options',
                    'Career pathway recommendations',
                    'Institution suggestions across Kenya',
                    'Alternative routes (TVET, bridging programs)'
                ].map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                        <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                        <span className="text-gray-700">{item}</span>
                    </div>
                ))}
            </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-green-600 to-blue-600 rounded-2xl p-8 text-white text-center">
                <h3 className="text-3xl font-bold mb-4">One-Time Payment</h3>
                <div className="text-5xl font-bold mb-4">KES 200</div>
                <p className="text-xl mb-6 opacity-90">
                    Pay once per student. Full analysis. No subscriptions.
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm opacity-90">
                    <Smartphone size={16} />
                    <span>Secure M-PESA payment via Safaricom Daraja API</span>
                </div>
            </div>
        </section>

        <footer className="bg-gray-900 text-white py-8 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-sm text-gray-400">
                    <strong>Disclaimer:</strong> ElimuPath provides guidance based on KCSE results.
                    This does not replace official KUCCPS placement or institutional admission decisions.
                </p>
                <p className="text-sm text-gray-500 mt-4">
                    © 2024 ElimuPath. All rights reserved.
                </p>
            </div>
        </footer>
    </div>
);

export default LandingPage;
