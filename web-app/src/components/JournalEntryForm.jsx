import React, { useState } from 'react';
import { createTransaction } from '../services/mambuApi';
import { Loader2, CheckCircle, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { TRANSACTION_TYPES } from '../config/workflowConfig';

const JournalEntryForm = ({ user }) => {
    const [submitting, setSubmitting] = useState(false);
    const [notification, setNotification] = useState(null);

    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        notes: '',
        entries: [
            { type: 'DEBIT', glAccount: '', amount: '', notes: '' },
            { type: 'CREDIT', glAccount: '', amount: '', notes: '' }
        ]
    });

    const handleEntryChange = (index, field, value) => {
        const newEntries = [...formData.entries];
        newEntries[index][field] = value;
        setFormData({ ...formData, entries: newEntries });
    };

    const addEntry = () => {
        setFormData({
            ...formData,
            entries: [...formData.entries, { type: 'DEBIT', glAccount: '', amount: '', notes: '' }]
        });
    };

    const removeEntry = (index) => {
        if (formData.entries.length <= 2) return; // Minimum 2 entries
        const newEntries = formData.entries.filter((_, i) => i !== index);
        setFormData({ ...formData, entries: newEntries });
    };

    const calculateTotal = () => {
        let debitTotal = 0;
        let creditTotal = 0;

        formData.entries.forEach(entry => {
            const amount = parseFloat(entry.amount) || 0;
            if (entry.type === 'DEBIT') debitTotal += amount;
            else creditTotal += amount;
        });

        return { debitTotal, creditTotal, isBalanced: Math.abs(debitTotal - creditTotal) < 0.01 };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setNotification(null);

        const { debitTotal, isBalanced } = calculateTotal();

        if (!isBalanced) {
            setNotification({ type: 'error', message: 'Journal Entry is not balanced. Debits must equal Credits.' });
            setSubmitting(false);
            return;
        }

        try {
            const journalData = {
                date: formData.date,
                notes: formData.notes,
                entries: formData.entries.map(e => ({
                    ...e,
                    amount: parseFloat(e.amount)
                })),
                // Use total debit amount for workflow routing
                amount: debitTotal
            };

            const result = await createTransaction(TRANSACTION_TYPES.JOURNAL_ENTRY, journalData, user);

            setNotification({
                type: 'success',
                message: `${result.message} ID: ${result.transactionId}`,
                details: result.workflow ? `Workflow: ${result.workflow}` : null
            });

            // Reset form
            setFormData({
                date: new Date().toISOString().split('T')[0],
                notes: '',
                entries: [
                    { type: 'DEBIT', glAccount: '', amount: '', notes: '' },
                    { type: 'CREDIT', glAccount: '', amount: '', notes: '' }
                ]
            });
        } catch (error) {
            setNotification({ type: 'error', message: 'Failed to submit journal entry.' });
        } finally {
            setSubmitting(false);
        }
    };

    const { debitTotal, creditTotal, isBalanced } = calculateTotal();
    const isFormValid = formData.date && formData.entries.every(e => e.glAccount && e.amount) && isBalanced;

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8 border border-slate-100">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800">New Journal Entry</h2>
                <p className="text-slate-500 text-sm mt-1">Create manual accounting adjustments.</p>
            </div>

            {notification && (
                <div className={`p-4 mb-6 rounded-lg flex items-start gap-3 ${notification.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {notification.type === 'success' ? <CheckCircle size={20} className="mt-0.5" /> : <AlertCircle size={20} className="mt-0.5" />}
                    <div>
                        <div className="text-sm font-medium">{notification.message}</div>
                        {notification.details && <div className="text-xs mt-1 opacity-80">{notification.details}</div>}
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Entry Date</label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description / Notes</label>
                        <input
                            type="text"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="Reason for adjustment..."
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <label className="block text-sm font-medium text-slate-700">Journal Lines</label>
                        <button
                            type="button"
                            onClick={addEntry}
                            className="text-sm text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-1"
                        >
                            <Plus size={16} /> Add Line
                        </button>
                    </div>

                    <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-100 text-slate-600 font-medium border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-2 w-24">Type</th>
                                    <th className="px-4 py-2">GL Account</th>
                                    <th className="px-4 py-2 w-32">Amount</th>
                                    <th className="px-4 py-2">Line Notes</th>
                                    <th className="px-4 py-2 w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {formData.entries.map((entry, index) => (
                                    <tr key={index}>
                                        <td className="p-2">
                                            <select
                                                value={entry.type}
                                                onChange={(e) => handleEntryChange(index, 'type', e.target.value)}
                                                className="w-full p-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500 outline-none bg-white"
                                            >
                                                <option value="DEBIT">Debit</option>
                                                <option value="CREDIT">Credit</option>
                                            </select>
                                        </td>
                                        <td className="p-2">
                                            <input
                                                type="text"
                                                value={entry.glAccount}
                                                onChange={(e) => handleEntryChange(index, 'glAccount', e.target.value)}
                                                className="w-full p-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500 outline-none"
                                                placeholder="e.g. 1001"
                                                required
                                            />
                                        </td>
                                        <td className="p-2">
                                            <input
                                                type="number"
                                                value={entry.amount}
                                                onChange={(e) => handleEntryChange(index, 'amount', e.target.value)}
                                                className="w-full p-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500 outline-none"
                                                placeholder="0.00"
                                                step="0.01"
                                                required
                                            />
                                        </td>
                                        <td className="p-2">
                                            <input
                                                type="text"
                                                value={entry.notes}
                                                onChange={(e) => handleEntryChange(index, 'notes', e.target.value)}
                                                className="w-full p-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500 outline-none"
                                            />
                                        </td>
                                        <td className="p-2 text-center">
                                            {formData.entries.length > 2 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeEntry(index)}
                                                    className="text-slate-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-slate-50 font-medium text-slate-700 border-t border-slate-200">
                                <tr>
                                    <td colSpan="2" className="px-4 py-2 text-right">Totals:</td>
                                    <td className="px-4 py-2">
                                        <div className="flex flex-col text-xs">
                                            <span className="text-slate-500">Dr: {debitTotal.toFixed(2)}</span>
                                            <span className="text-slate-500">Cr: {creditTotal.toFixed(2)}</span>
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
                            </tfoot>
                        </table>
                    </div>
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
                        'Submit Journal Entry'
                    )}
                </button>
            </form>
        </div>
    );
};

export default JournalEntryForm;
