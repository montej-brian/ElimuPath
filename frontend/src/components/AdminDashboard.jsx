import React, { useState, useEffect } from 'react';
import { getAdminStats } from '../services/api';
import Logo from './brand/Logo';
import { Users, FileText, DollarSign, RefreshCw, ArrowLeft } from 'lucide-react';

const AdminDashboard = ({ onBack }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchStats = async () => {
        setLoading(true);
        try {
            const response = await getAdminStats();
            setStats(response.data);
            setError('');
        } catch (_err) {
            setError('Failed to load dashboard statistics.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const statCards = [
        {
            label: 'Total Analyses',
            value: stats?.totalRequests || 0,
            icon: <FileText className="text-blue-600" size={24} />,
            color: 'bg-blue-50',
            border: 'border-blue-100'
        },
        {
            label: 'Total Users',
            value: stats?.totalUsers || 0,
            icon: <Users className="text-purple-600" size={24} />,
            color: 'bg-purple-50',
            border: 'border-purple-100'
        },
        {
            label: 'Total Revenue',
            value: `KES ${stats?.totalRevenue?.toLocaleString() || 0}`,
            icon: <DollarSign className="text-green-600" size={24} />,
            color: 'bg-green-50',
            border: 'border-green-100'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <Logo className="h-8" />
                        <h1 className="text-xl font-bold border-l pl-4 border-gray-200">Admin Dashboard</h1>
                    </div>
                    <button
                        onClick={fetchStats}
                        disabled={loading}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-all disabled:opacity-50"
                    >
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        <span className="text-sm font-semibold">Refresh</span>
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-12 sm:px-6">
                {error && (
                    <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg">
                        {error}
                    </div>
                )}

                <div className="grid md:grid-cols-3 gap-8">
                    {statCards.map((card, idx) => (
                        <div
                            key={idx}
                            className={`${card.color} ${card.border} border rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm">
                                    {card.icon}
                                </div>
                            </div>
                            <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">
                                {card.label}
                            </div>
                            <div className="text-4xl font-black text-gray-900">
                                {loading ? '...' : card.value}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Platform Activity</h2>
                    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                        <p className="text-sm">Activity feed coming soon...</p>
                    </div>
                </div>
            </main>

            <footer className="max-w-6xl mx-auto px-4 py-8 text-center text-gray-400 text-xs tracking-widest uppercase">
                ElimuPath Management System • Confidential
            </footer>
        </div>
    );
};

export default AdminDashboard;
