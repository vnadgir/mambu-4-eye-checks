import React, { useState } from 'react';
import { createTransaction } from '../services/mambuApi';
import { Loader2, CreditCard } from 'lucide-react';
import { TRANSACTION_TYPES } from '../config/workflowConfig';
import Notification from './Notification';

const PaymentForm = ({ user }) => {
    const [submitting, setSubmitting] = useState(false);
    const [notification, setNotification] = useState(null);

    const [formData, setFormData] = useState({
        beneficiary: '',
        iban: '',
        amount: '',
        reference: '',
        notes: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setNotification(null);

        try {
            const paymentData = {
                ...formData,
                amount: parseFloat(formData.amount)
            };

            const result = await createTransaction(TRANSACTION_TYPES.PAYMENT, paymentData, user);

            setNotification({
                type: 'success',
                message: 'Payment Initiated',
                details: `${result.message} ID: ${result.transactionId}. Workflow: ${result.workflow || 'None'}`
            });

            // Reset form
            setFormData({
                beneficiary: '',
                iban: '',
                amount: '',
                reference: '',
                notes: ''
            });
        } catch (error) {
            setNotification({
                type: 'error',
                message: 'Payment Failed',
                details: error.message || 'An unexpected error occurred.'
            });
        } finally {
            setSubmitting(false);
        }
    };

    const isFormValid = formData.beneficiary && formData.iban && formData.amount;

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
                <h2 className="text-2xl font-bold text-slate-800">Outgoing Payment</h2>
                <p className="text-slate-500 text-sm mt-1">Initiate a wire transfer or bill payment.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Beneficiary Name</label>
                    <input
                        type="text"
                        name="beneficiary"
                        value={formData.beneficiary}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-mambu-green outline-none"
                        placeholder="e.g. Acme Corp"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">IBAN / Account Number</label>
                    <input
                        type="text"
                        name="iban"
                        value={formData.iban}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-mambu-green outline-none"
                        placeholder="DE89 3704 0044 0532 0130 00"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                    <div className="relative">
                        <span className="absolute left-3 top-2 text-slate-400"><CreditCard size={18} /></span>
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
                    <label className="block text-sm font-medium text-slate-700 mb-1">Reference</label>
                    <input
                        type="text"
                        name="reference"
                        value={formData.reference}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-mambu-green outline-none"
                        placeholder="Invoice #12345"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                        placeholder="Payment reference..."
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
                        'Submit Payment'
                    )}
                </button>
            </form>
        </div>
    );
};

export default PaymentForm;
