import React, { useState, useEffect } from 'react';
import { getTransactionChannels, createDeposit } from '../services/mambuApi';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const DepositForm = () => {
    const [channels, setChannels] = useState([]);
    const [loadingChannels, setLoadingChannels] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [notification, setNotification] = useState(null);

    const [formData, setFormData] = useState({
        accountId: '',
        amount: '',
        bookingDate: '',
        transactionChannelId: '',
        notes: ''
    });

    useEffect(() => {
        getTransactionChannels()
            .then(data => {
                setChannels(data);
                setLoadingChannels(false);
            })
            .catch(err => {
                console.error('Failed to load channels', err);
                setLoadingChannels(false);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setNotification(null);

        try {
            const result = await createDeposit(formData);
            setNotification({ type: 'success', message: `${result.message} Case ID: ${result.caseId}` });
            // Reset form
            setFormData({
                accountId: '',
                amount: '',
                bookingDate: '',
                transactionChannelId: '',
                notes: ''
            });
        } catch (error) {
            setNotification({ type: 'error', message: 'Failed to submit deposit.' });
        } finally {
            setSubmitting(false);
        }
    };

    const isFormValid = formData.accountId && formData.amount && formData.bookingDate && formData.transactionChannelId;

    return (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8 border border-slate-100">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800">New Mambu Deposit</h2>
                <p className="text-slate-500 text-sm mt-1">Enter transaction details below.</p>
            </div>

            {notification && (
                <div className={`p-4 mb-6 rounded-lg flex items-center gap-3 ${notification.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    <span className="text-sm font-medium">{notification.message}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Deposit Account ID</label>
                    <input
                        type="text"
                        name="accountId"
                        value={formData.accountId}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        placeholder="e.g. ABCD123"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-slate-400">$</span>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                step="0.01"
                                className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                placeholder="0.00"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Booking Date</label>
                        <input
                            type="date"
                            name="bookingDate"
                            value={formData.bookingDate}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Transaction Channel</label>
                    <div className="relative">
                        <select
                            name="transactionChannelId"
                            value={formData.transactionChannelId}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all appearance-none bg-white"
                            required
                            disabled={loadingChannels}
                        >
                            <option value="">Select Channel</option>
                            {channels.map(channel => (
                                <option key={channel.encodedKey} value={channel.encodedKey}>
                                    {channel.name}
                                </option>
                            ))}
                        </select>
                        {loadingChannels && (
                            <div className="absolute right-3 top-2.5">
                                <Loader2 className="animate-spin text-slate-400" size={16} />
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                        placeholder="Optional notes..."
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={!isFormValid || submitting}
                    className={`w-full py-2.5 px-4 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-all ${!isFormValid || submitting
                            ? 'bg-slate-300 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'
                        }`}
                >
                    {submitting ? (
                        <>
                            <Loader2 className="animate-spin" size={18} />
                            Submitting...
                        </>
                    ) : (
                        'Submit for Approval'
                    )}
                </button>
            </form>
        </div>
    );
};

export default DepositForm;
