import React, { useState, useEffect } from 'react';
import { initiatePayment as apiInitiatePayment, getPaymentStatus as apiGetPaymentStatus } from '../services/api';

const Payment = ({ analysisId, onSuccess, onBack }) => {
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isPolling, setIsPolling] = useState(false);

    const handlePay = async () => {
        if (!phone.match(/^254\d{9}$/)) {
            setError('Please enter a valid phone number (format: 254XXXXXXXXX)');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await apiInitiatePayment(analysisId, phone);
            setIsPolling(true);
        } catch (err) {
            setError(err.response?.data?.error || 'Payment initiation failed. Please try again.');
            setLoading(false);
        }
    };

    useEffect(() => {
        let interval;
        if (isPolling) {
            interval = setInterval(async () => {
                try {
                    const response = await apiGetPaymentStatus(analysisId);
                    if (response.data.isPaid) {
                        clearInterval(interval);
                        onSuccess();
                    }
                } catch (err) {
                    console.error('Polling error:', err);
                }
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [isPolling, analysisId, onSuccess]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                {!isPolling ? (
                    <>
                        <button onClick={onBack} className="text-blue-600 hover:text-blue-700 mb-4">
                            ← Back
                        </button>
                        <h2 className="text-2xl font-bold mb-6">Complete Payment</h2>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                M-PESA Phone Number
                            </label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="254712345678"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">Format: 254XXXXXXXXX</p>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg mb-6">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Analysis Fee:</span>
                                <span className="font-bold">KES 200</span>
                            </div>
                            <div className="text-xs text-gray-600">
                                One-time payment. Instant unlock after confirmation.
                            </div>
                        </div>

                        <button
                            onClick={handlePay}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Sending STK Push...' : 'Pay KES 200'}
                        </button>
                    </>
                ) : (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                        <h3 className="text-xl font-bold mb-2">Waiting for Payment</h3>
                        <p className="text-gray-600 mb-4">
                            Please check your phone for the M-PESA prompt and enter your PIN.
                        </p>
                        <p className="text-sm text-gray-500">
                            This page will automatically refresh once payment is confirmed.
                        </p>
                    </div>
                )}

                <p className="text-xs text-gray-500 mt-4 text-center">
                    Secure M-PESA payment via Safaricom Daraja API
                </p>
            </div>
        </div>
    );
};

export default Payment;
