import React, { useState } from 'react';
import { createTransaction } from '../services/mambuApi';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { TRANSACTION_TYPES } from '../config/workflowConfig';
import Notification from './Notification';

const JournalEntryForm = ({ user }) => {
    const [submitting, setSubmitting] = useState(false);
    const [notification, setNotification] = useState(null);

    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        notes: '',
        entries: [
            { type: 'DEBIT', account: '', amount: '' },
            { type: 'CREDIT', account: '', amount: '' }
        ]
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEntryChange = (index, field, value) => {
        const newEntries = [...formData.entries];
        newEntries[index][field] = value;
        setFormData(prev => ({ ...prev, entries: newEntries }));
    };

    const addEntry = () => {
        setFormData(prev => ({
            ...prev,
            entries: [...prev.entries, { type: 'DEBIT', account: '', amount: '' }]
        }));
    };

    const removeEntry = (index) => {
        if (formData.entries.length <= 2) return;
        const newEntries = formData.entries.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, entries: newEntries }));
    };

    const calculateTotals = () => {
        let debitTotal = 0;
        let creditTotal = 0;
        formData.entries.forEach(entry => {
            const amount = parseFloat(entry.amount) || 0;
            if (entry.type === 'DEBIT') debitTotal += amount;
            else creditTotal += amount;
        });
        return { debitTotal, creditTotal, balanced: Math.abs(debitTotal - creditTotal) < 0.01 };
    };

    const { debitTotal, creditTotal, balanced } = calculateTotals();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!balanced) {
            setNotification({ type: 'error', message: 'Unbalanced Entry', details: 'Debits must equal Credits.' });
            return;
        }

        setSubmitting(true);
        setNotification(null);

        try {
            const journalData = {
                date: formData.date,
                notes: formData.notes,
                entries: formData.entries.map(e => ({ ...e, amount: parseFloat(e.amount) })),
                amount: debitTotal // Use total debit amount for workflow threshold
            };

            const result = await createTransaction(TRANSACTION_TYPES.JOURNAL_ENTRY, journalData, user);

            setNotification({
                type: 'success',
                message: 'Journal Entry Submitted',
                details: `${result.message} ID: ${result.transactionId}. Workflow: ${result.workflow || 'None'}`
            });

            // Reset form
            setFormData({
                date: new Date().toISOString().split('T')[0],
                notes: '',
                entries: [
                    { type: 'DEBIT', account: '', amount: '' },
                    { type: 'CREDIT', account: '', amount: '' }
                ]
            });
        } catch (error) {
            setNotification({
                type: 'error',
                message: 'Submission Failed',
                details: error.message || 'An unexpected error occurred.'
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8 border border-slate-100">
            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    details={notification.details}
                    onClose={() => setNotification(null)}
                />
            )}

            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Journal Entry</h2>
                    <p className="text-slate-500 text-sm mt-1">Create a manual journal entry.</p>
                </div>
                <div className={`text-sm font-medium px-3 py-1 rounded-full ${balanced ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {balanced ? 'Balanced' : 'Unbalanced'}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Entry Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-mambu-green outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                        <input
                            type="text"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-mambu-green outline-none"
                            placeholder="Adjustment description..."
                            required
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium text-slate-700">Line Items</h3>
                        <button type="button" onClick={addEntry} className="text-sm text-mambu-green hover:text-green-700 flex items-center gap-1">
                            <Plus size={16} /> Add Line
                        </button>
                    </div>
                </div>
            </td>
            <td colSpan="2" className="px-4 py-2">
                {isBalanced ? (
                    <span className="text-green-600 flex items-center gap-1 text-xs">
                        <CheckCircle size={14} /> Balanced
                    </span>
                ) : (
                    <span className="text-red-600 flex items-center gap-1 text-xs">
                        <AlertCircle size={14} /> Unbalanced ({Math.abs(debitTotal - creditTotal).toFixed(2)})
                    </span>
                )}
            </td>
        </tr>
                            </tfoot >
                        </table >
                    </div >
                </div >

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
            'Submit Journal Entry'
        )}
    </button>
            </form >
        </div >
    );
};

export default JournalEntryForm;
