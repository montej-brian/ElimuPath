import React, { useState, useEffect } from 'react';
import { getFullAnalysis as apiGetFullAnalysis } from '../services/api';

const FullAnalysis = ({ analysisId }) => {
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Display slices
    const [displayCourses, setDisplayCourses] = useState([]);
    const [displayCareers, setDisplayCareers] = useState([]);

    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const handleRegenerateCourses = () => {
        if (results && results.courses) {
            setDisplayCourses(shuffleArray(results.courses).slice(0, 10));
        }
    };

    const handleRegenerateCareers = () => {
        if (results && results.careers) {
            setDisplayCareers(shuffleArray(results.careers).slice(0, 10));
        }
    };

    useEffect(() => {
        const loadAnalysis = async () => {
            try {
                const response = await apiGetFullAnalysis(analysisId);
                const data = response.data;
                setResults(data);

                // Initial slice
                if (data.courses) setDisplayCourses(shuffleArray(data.courses).slice(0, 10));
                if (data.careers) setDisplayCareers(shuffleArray(data.careers).slice(0, 5));
            } catch (err) {
                setError('Failed to load analysis results.');
            } finally {
                setLoading(false);
            }
        };
        loadAnalysis();
    }, [analysisId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !results) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-600">
                {error || 'Analysis not found.'}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6">
                    <h1 className="text-2xl font-bold">Your Complete Career Analysis</h1>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 space-y-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Academic Summary</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <div className="text-sm text-gray-600 mb-2">Subject Grades</div>
                            <div className="space-y-1">
                                {results.subjects.map((sub, idx) => (
                                    <div key={idx} className="flex justify-between">
                                        <span>{sub.name}:</span>
                                        <span className="font-semibold">{sub.grade}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-600 mb-2">Overall Performance</div>
                            <div className="text-3xl font-bold text-green-600 mb-2">{results.meanGrade}</div>
                            <div className="text-sm font-semibold text-gray-700 mb-2">Total AGP: {results.totalPoints}</div>
                            <p className="text-sm text-gray-600">{results.interpretation}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Cluster Points</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {results.clusters.map((cluster, idx) => (
                            <div key={idx} className="p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg">
                                <div className="text-sm text-gray-600">{cluster.name}</div>
                                <div className="text-3xl font-bold text-green-600">{cluster.points}</div>
                                <div className="text-xs text-gray-500 mt-1">{cluster.subjects}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Eligible Degree Pathways</h2>
                        <button
                            onClick={handleRegenerateCourses}
                            className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                        >
                            Regenerate
                        </button>
                    </div>
                    <div className="space-y-4">
                        {displayCourses.length > 0 ? displayCourses.map((course, idx) => (
                            <div key={idx} className="p-4 border-l-4 border-green-600 bg-gray-50 rounded">
                                <div className="font-bold text-lg">{course.name}</div>
                                <div className="text-sm text-gray-600">
                                    {course.type || 'Degree'} Pathway
                                </div>
                                <p className="text-sm mt-2 text-gray-700">{course.description}</p>
                                <div className="text-xs text-gray-500 mt-2">Requirements: {course.requirements}</div>
                            </div>
                        )) : (
                            <p className="text-sm text-gray-600">No matching pathways found.</p>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Career Recommendations</h2>
                        <button
                            onClick={handleRegenerateCareers}
                            className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                        >
                            Regenerate
                        </button>
                    </div>
                    <div className="space-y-4">
                        {displayCareers.length > 0 ? displayCareers.map((career, idx) => (
                            <div key={idx} className="p-4 bg-blue-50 rounded-lg">
                                <div className="font-bold text-lg">{career.name}</div>
                                <p className="text-sm text-gray-700 mt-2">{career.description}</p>
                                <div className="mt-3">
                                    <div className="text-xs font-semibold text-gray-600 mb-1">Common Degrees:</div>
                                    <div className="text-sm text-gray-600">{career.suggested_courses?.join(', ')}</div>
                                </div>
                                {career.alternatives && (
                                    <div className="mt-2 text-xs text-gray-600">
                                        <strong>Alternative Routes:</strong> {career.alternatives}
                                    </div>
                                )}
                            </div>
                        )) : (
                            <p className="text-sm text-gray-600">No career recommendations available.</p>
                        )}
                    </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                    <p className="text-sm text-gray-700">
                        <strong>Important:</strong> This analysis is for guidance only. Always verify requirements
                        officially and follow KUCCPS placement procedures.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FullAnalysis;
