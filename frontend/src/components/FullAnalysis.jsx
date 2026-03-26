import React, { useState, useEffect } from 'react';
import { getFullAnalysis as apiGetFullAnalysis } from '../services/api';
import Logo from './brand/Logo';
import Loader from './brand/Loader';

const FullAnalysis = ({ analysisId, onBack }) => {
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
            } catch (_err) {
                setError('Failed to load analysis results.');
            } finally {
                setLoading(false);
            }
        };
        loadAnalysis();
    }, [analysisId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader text="Generating your career pathway..." />
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
                    <button onClick={onBack} className="text-blue-600 hover:text-blue-700 mb-2">
                        ← Back
                    </button>
                    <Logo className="h-8 mb-2" />
                    <h1 className="text-2xl font-bold">Your Complete Career Analysis</h1>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 space-y-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Academic Summary</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div>
                                <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Core Foundation</div>
                                <div className="space-y-1">
                                    {results.subjects.filter(s => s.group === 'Core Foundation').map((sub, idx) => (
                                        <div key={idx} className="flex justify-between items-center py-1 border-b border-gray-50 last:border-0">
                                            <span className="text-gray-700">{sub.name}</span>
                                            <span className="font-bold text-gray-900">{sub.grade}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Elective / Other Subjects</div>
                                <div className="space-y-1">
                                    {results.subjects.filter(s => s.group !== 'Core Foundation').map((sub, idx) => (
                                        <div key={idx} className="flex justify-between items-center py-1 border-b border-gray-50 last:border-0">
                                            <span className="text-gray-600">{sub.name}</span>
                                            <span className="font-semibold text-gray-800">{sub.grade}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="bg-green-50 rounded-xl p-6 flex flex-col justify-center border border-green-100">
                            <div className="text-sm text-green-800 font-medium mb-1">Overall Performance</div>
                            <div className="text-5xl font-black text-green-600 mb-2">{results.meanGrade}</div>
                            <div className="text-lg font-bold text-gray-700 mb-2">
                                Mean Points: {results.meanPoints}
                                <span className="text-sm font-normal text-gray-500 ml-2">(Aggregate: {results.totalPoints})</span>
                            </div>
                            <p className="text-gray-700 leading-relaxed italic">"{results.interpretation}"</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Cluster Weighted Points</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {results.clusters.map((cluster, idx) => (
                            <div key={idx} className="relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-blue-100/50 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
                                <div className="relative p-5 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <div className="text-xs font-bold text-blue-600 uppercase tracking-widest">{cluster.name}</div>
                                            <div className="text-xs text-gray-500">{cluster.description}</div>
                                        </div>
                                        <div className="text-2xl font-black text-blue-700">{cluster.points}</div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 mt-4">
                                        {cluster.breakdown && Object.entries(cluster.breakdown).map(([key, sub]) => (
                                            <div key={key} className="flex items-center space-x-2 bg-gray-50 px-2 py-1 rounded text-[10px]">
                                                <span className="font-bold text-blue-400">{key}:</span>
                                                <span className="text-gray-600 truncate">{sub.name}</span>
                                                <span className="font-bold text-gray-900 ml-auto">{sub.grade}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
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

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Official Grading System Reference</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3">Grade</th>
                                    <th className="px-4 py-3">Points</th>
                                    <th className="px-4 py-3">KNEC Mean Point Range</th>
                                    <th className="px-4 py-3">Descriptor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { grade: 'A', points: 12, range: '11.5 - 12.0', desc: 'Plain' },
                                    { grade: 'A-', points: 11, range: '10.5 - 11.4', desc: 'Minus' },
                                    { grade: 'B+', points: 10, range: '9.5 - 10.4', desc: 'Plus' },
                                    { grade: 'B', points: 9, range: '8.5 - 9.4', desc: 'Plain' },
                                    { grade: 'B-', points: 8, range: '7.5 - 8.4', desc: 'Minus' },
                                    { grade: 'C+', points: 7, range: '6.5 - 7.4', desc: 'Plus' },
                                    { grade: 'C', points: 6, range: '5.5 - 6.4', desc: 'Plain' },
                                    { grade: 'C-', points: 5, range: '4.5 - 5.4', desc: 'Minus' },
                                    { grade: 'D+', points: 4, range: '3.5 - 4.4', desc: 'Plus' },
                                    { grade: 'D', points: 3, range: '2.5 - 3.4', desc: 'Plain' },
                                    { grade: 'D-', points: 2, range: '1.5 - 2.4', desc: 'Minus' },
                                    { grade: 'E', points: 1, range: '1.0 - 1.4', desc: 'Plain' },
                                ].map((item) => (
                                    <tr key={item.grade} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-2 font-bold text-gray-900">{item.grade}</td>
                                        <td className="px-4 py-2">{item.points}</td>
                                        <td className="px-4 py-2">{item.range}</td>
                                        <td className="px-4 py-2 text-xs">{item.desc}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
