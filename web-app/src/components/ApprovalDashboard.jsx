import React, { useState, useEffect } from 'react';
import { getPendingTransactions } from '../services/mockDatabase';
import { approveDeposit, rejectDeposit } from '../services/mambuApi';
import { CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';

const ApprovalDashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = () => {
        setTransactions(getPendingTransactions());
    };

    const handleApprove = async (id) => {
        setProcessingId(id);
        await approveDeposit(id);
        loadTransactions();
        setProcessingId(null);
    };

    const handleReject = async (id) => {
        setProcessingId(id);
        await rejectDeposit(id);
        loadTransactions();
        setProcessingId(null);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Pending Approvals</h2>
                    <p className="text-slate-500 text-sm mt-1">Review and action deposit requests.</p>
                </div>
                <button onClick={loadTransactions} className="text-indigo-600 text-sm font-medium hover:underline">
                    Refresh List
                </button>
            </div>

            {transactions.length === 0 ? (
                <div className="bg-white p-12 rounded-xl shadow-sm border border-slate-200 text-center">
                    <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="text-green-500" size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-slate-800">All Caught Up!</h3>
                    <p className="text-slate-500 mt-2">No pending transactions to review.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {transactions.map((txn) => (
                        <div key={txn.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-grow">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                        <Clock size={12} /> PENDING
                                    </span>
                                    <span className="text-xs text-slate-400">ID: {txn.id}</span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-xl font-bold text-slate-900">
                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(txn.amount)}
                                    </h3>
                                    <span className="text-slate-500">Deposit to {txn.accountId}</span>
                                </div>
                                <div className="text-sm text-slate-500 mt-1">
                                    Booking Date: {txn.bookingDate} • Channel: {txn.transactionDetails?.transactionChannelId || 'N/A'}
                                </div>
                                {txn.notes && (
                                    <div className="mt-3 bg-slate-50 p-3 rounded-lg text-sm text-slate-600 italic border border-slate-100">
                                        "{txn.notes}"
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                                <button
                                    onClick={() => handleReject(txn.id)}
                                    disabled={processingId === txn.id}
                                    className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {processingId === txn.id ? <Loader2 className="animate-spin" size={16} /> : <XCircle size={18} />}
                                    Reject
                                </button>
                                <button
                                    onClick={() => handleApprove(txn.id)}
                                    disabled={processingId === txn.id}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                                >
                                    {processingId === txn.id ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={18} />}
                                    Approve
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ApprovalDashboard;
