import React, { useState, useEffect } from 'react';
import { getTransactionChannels, createTransaction } from '../services/mambuApi';
import { Loader2, DollarSign } from 'lucide-react';
import { TRANSACTION_TYPES } from '../config/workflowConfig';
import Notification from './Notification';

const DepositForm = ({ user }) => {
    const [channels, setChannels] = useState([]);
    const [loadingChannels, setLoadingChannels] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [notification, setNotification] = useState(null);

    const [formData, setFormData] = useState({
        accountId: '',
        amount: '',
        transactionChannelId: '',
        notes: ''
    });

    useEffect(() => {
        const fetchChannels = async () => {
            try {
                const data = await getTransactionChannels();
                setChannels(data);
                if (data.length > 0) {
                    setFormData(prev => ({ ...prev, transactionChannelId: data[0].id }));
                }
            } catch (error) {
                console.error("Failed to load channels", error);
                setNotification({ type: 'error', message: 'Failed to load transaction channels', details: error.message });
            } finally {
                setLoadingChannels(false);
            }
        };
        fetchChannels();
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
            const depositData = {
                ...formData,
                amount: parseFloat(formData.amount)
            };

            const result = await createTransaction(TRANSACTION_TYPES.DEPOSIT, depositData, user);

            setNotification({
                type: 'success',
                message: 'Deposit Submitted Successfully',
                details: `${result.message} ID: ${result.transactionId}. Workflow: ${result.workflow || 'None'}`
            });

            // Reset form
            setFormData({
                accountId: '',
                amount: '',
                transactionChannelId: channels.length > 0 ? channels[0].id : '',
                notes: ''
            });
        } catch (error) {
            console.error("Deposit failed:", error);
            setNotification({
                type: 'error',
                message: 'Deposit Failed',
                details: error.message || 'An unexpected error occurred while processing the deposit.'
            });
        } finally {
            setSubmitting(false);
        }
    };

    const isFormValid = formData.accountId && formData.amount && formData.transactionChannelId;

    return (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8 border border-slate-100">
            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    details={notification.details}
                    onClose={() => setNotification(null)}
                />
            )}

            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800">New Deposit</h2>
                <p className="text-slate-500 text-sm mt-1">Initiate a deposit transaction for approval.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Account ID</label>
                    <input
                        type="text"
                        name="accountId"
                        value={formData.accountId}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-mambu-green outline-none"
                        placeholder="e.g. ABCD-12345"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                    <div className="relative">
                        <span className="absolute left-3 top-2 text-slate-400"><DollarSign size={18} /></span>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            step="0.01"
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-mambu-green outline-none"
                            placeholder="0.00"
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
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-mambu-green outline-none appearance-none bg-white"
                            required
                        >
                            {channels.map(channel => (
                                <option key={channel.id} value={channel.id}>
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
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-mambu-green outline-none resize-none"
                        placeholder="Optional notes..."
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={!isFormValid || submitting}
                    className={`w-full py-2.5 px-4 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-all ${!isFormValid || submitting
                        ? 'bg-slate-300 cursor-not-allowed'
                        : 'bg-mambu-green hover:bg-green-600 shadow-md hover:shadow-lg'
                        }`}
                >
                    {submitting ? (
                        <>
                            <Loader2 className="animate-spin" size={18} />
                            Processing...
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
