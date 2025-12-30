import React, { useState } from 'react';
import { parseResults as apiParseResults } from '../services/api';

const ResultsInput = ({ onAnalyze, onBack }) => {
    const [smsText, setSmsText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAnalyze = async () => {
        if (!smsText.trim()) {
            setError('Please paste your KCSE results SMS');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await apiParseResults(smsText);
            onAnalyze(response.data.analysisId, response.data.preview);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to parse results. Please check the format.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6">
                    <button onClick={onBack} className="text-blue-600 hover:text-blue-700 mb-2">
                        ← Back
                    </button>
                    <h1 className="text-2xl font-bold">Paste Your KCSE Results</h1>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        KCSE Results SMS
                    </label>
                    <textarea
                        value={smsText}
                        onChange={(e) => setSmsText(e.target.value)}
                        placeholder="Paste your complete KCSE result SMS here. Example:

KCSE Results 2024
Index: 12345678
ENG C+, KIS B, MAT B-, BIO B+, CHEM C+, PHY B, HIST B-, GEO C+, CRE B
Mean Grade: B"
                        className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                            <strong>Tip:</strong> Make sure to include all subjects and grades from your SMS.
                            The system will automatically parse your results.
                        </p>
                    </div>
                    <button
                        onClick={handleAnalyze}
                        disabled={loading || !smsText.trim()}
                        className="mt-6 w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Analyzing...' : 'Analyze Results'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResultsInput;
