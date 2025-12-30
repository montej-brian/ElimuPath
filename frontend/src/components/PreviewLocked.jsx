import React from 'react';
import { Lock } from 'lucide-react';

const PreviewLocked = ({ preview, onPay, onBack }) => (
    <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
            <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6">
                <button onClick={onBack} className="text-blue-600 hover:text-blue-700 mb-2">
                    ← Back
                </button>
                <h1 className="text-2xl font-bold">Your Results Preview</h1>
            </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Academic Summary</h2>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Mean Grade:</span>
                        <span className="font-bold text-lg">{preview.meanGrade}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Mean Points:</span>
                        <span className="font-bold text-lg">{preview.meanPoints}</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 relative overflow-hidden">
                <div className="absolute inset-0 backdrop-blur-sm bg-white/50 z-10 flex items-center justify-center">
                    <div className="text-center p-8 bg-white rounded-lg shadow-xl max-w-md">
                        <Lock className="mx-auto text-gray-400 mb-4" size={48} />
                        <h3 className="text-2xl font-bold mb-2">Unlock Full Analysis</h3>
                        <p className="text-gray-600 mb-6">
                            Get your complete cluster points, course eligibility, and career pathway recommendations
                        </p>
                        <div className="text-3xl font-bold text-green-600 mb-6">KES 200</div>
                        <button
                            onClick={onPay}
                            className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all"
                        >
                            Pay with M-PESA
                        </button>
                    </div>
                </div>

                <div className="blur-sm select-none">
                    <h2 className="text-xl font-bold mb-4">Cluster Points</h2>
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div className="p-4 bg-gray-50 rounded">
                            <div className="text-sm text-gray-600">Cluster 1 (Science)</div>
                            <div className="text-2xl font-bold">XX.XX</div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded">
                            <div className="text-sm text-gray-600">Cluster 2 (Arts)</div>
                            <div className="text-2xl font-bold">XX.XX</div>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold mb-4">Eligible Courses</h2>
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="p-4 border rounded-lg">
                                <div className="font-semibold">Course Name Example</div>
                                <div className="text-sm text-gray-600">University Name</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default PreviewLocked;
