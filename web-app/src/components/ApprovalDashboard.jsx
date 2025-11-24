import React, { useState, useEffect } from 'react';
import { getPendingTransactionsForUser } from '../services/mockDatabase';
import { workflowService } from '../services/workflowService';
import { CheckCircle, XCircle, Clock, DollarSign, FileText, CreditCard, Briefcase, AlertCircle } from 'lucide-react';
import WorkflowVisualization from './WorkflowVisualization';
import Notification from './Notification';

const TRANSACTION_ICONS = {
    DEPOSIT: <DollarSign className="text-blue-500" />,
    JOURNAL_ENTRY: <FileText className="text-purple-500" />,
    PAYMENT: <CreditCard className="text-orange-500" />,
    LOAN_DISBURSEMENT: <Briefcase className="text-indigo-500" />
};

const ApprovalDashboard = ({ user }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const [notification, setNotification] = useState(null);

    const loadTransactions = () => {
        setLoading(true);
        // Simulate network delay
        setTimeout(() => {
            try {
                const pending = getPendingTransactionsForUser();
                setTransactions(pending);
            } catch (error) {
                setNotification({ type: 'error', message: 'Failed to load transactions', details: error.message });
            } finally {
                setLoading(false);
            }
        }, 500);
    };

    useEffect(() => {
        loadTransactions();
        // Set up polling to refresh transactions every 10 seconds
        const interval = setInterval(loadTransactions, 10000);
        return () => clearInterval(interval);
    }, [user]); // Reload when user changes

    const handleDecision = async (transaction, decision) => {
        setProcessingId(transaction.id);
        setNotification(null);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            await workflowService.approveTransaction(transaction.id, user, decision, `Manual ${decision.toLowerCase()} via dashboard`);

            setNotification({
                type: 'success',
                message: `Transaction ${decision === 'APPROVE' ? 'Approved' : 'Rejected'}`,
                details: `Transaction ${transaction.id} has been processed.`
            });

            loadTransactions(); // Refresh list
        } catch (error) {
            setNotification({
                type: 'error',
                message: 'Action Failed',
                details: error.message
            });
        } finally {
            setProcessingId(null);
        }
    };

    if (loading && transactions.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mambu-green"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4">
            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    details={notification.details}
                    onClose={() => setNotification(null)}
                />
            )}

            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800">Pending Approvals</h2>
                <p className="text-slate-500">Transactions requiring your attention</p>
            </div>

            {transactions.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-slate-100">
                    <div className="mx-auto h-16 w-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="h-8 w-8 text-mambu-green" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">All Caught Up!</h3>
                    <p className="mt-2 text-slate-500">You have no pending transactions to approve.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {transactions.map(txn => (
                        <div key={txn.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-50 rounded-lg">
                                            {TRANSACTION_ICONS[txn.type] || <FileText />}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900">{txn.type.replace('_', ' ')}</h3>
                                            <p className="text-xs text-slate-500">ID: {txn.id}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-slate-900">
                                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(txn.amount)}
                                        </div>
                                        <div className="text-xs text-slate-500">{new Date(txn.createdAt).toLocaleDateString()}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between py-1 border-b border-slate-50">
                                            <span className="text-slate-500">Created By</span>
                                            <span className="font-medium">{txn.createdBy}</span>
                                        </div>
                                        {/* Dynamic details based on transaction type */}
                                        {txn.data.accountId && (
                                            <div className="flex justify-between py-1 border-b border-slate-50">
                                                <span className="text-slate-500">Account ID</span>
                                                <span className="font-medium">{txn.data.accountId}</span>
                                            </div>
                                        )}
                                        {txn.data.loanAccountId && (
                                            <div className="flex justify-between py-1 border-b border-slate-50">
                                                <span className="text-slate-500">Loan Account</span>
                                                <span className="font-medium">{txn.data.loanAccountId}</span>
                                            </div>
                                        )}
                                        {txn.data.beneficiary && (
                                            <div className="flex justify-between py-1 border-b border-slate-50">
                                                <span className="text-slate-500">Beneficiary</span>
                                                <span className="font-medium">{txn.data.beneficiary}</span>
                                            </div>
                                        )}
                                        {txn.data.notes && (
                                            <div className="pt-2">
                                                <span className="text-slate-500 block mb-1">Notes</span>
                                                <p className="text-slate-700 bg-slate-50 p-2 rounded text-xs">{txn.data.notes}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-slate-50 rounded-lg p-4">
                                        <h4 className="text-xs font-semibold text-slate-500 uppercase mb-3">Workflow Progress</h4>
                                        <WorkflowVisualization transaction={txn} />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                    <button
                                        onClick={() => handleDecision(txn, 'REJECT')}
                                        disabled={processingId === txn.id}
                                        className="px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {processingId === txn.id ? 'Processing...' : <><XCircle size={16} /> Reject</>}
                                    </button>
                                    <button
                                        onClick={() => handleDecision(txn, 'APPROVE')}
                                        disabled={processingId === txn.id}
                                        className="px-4 py-2 text-white bg-mambu-green hover:bg-green-600 rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {processingId === txn.id ? 'Processing...' : <><CheckCircle size={16} /> Approve</>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
export default ApprovalDashboard;
