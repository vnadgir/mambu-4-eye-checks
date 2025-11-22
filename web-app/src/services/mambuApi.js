import { saveTransaction, updateTransaction, getTransactionById } from './mockDatabase';
import { processApproval } from './workflowEngine';

// Mock data for Transaction Channels
const MOCK_CHANNELS = [
    { encodedKey: 'chan_001', name: 'Cash' },
    { encodedKey: 'chan_002', name: 'Bank Transfer' },
    { encodedKey: 'chan_003', name: 'Cheque' },
    { encodedKey: 'chan_004', name: 'Online Payment' },
];

export const getTransactionChannels = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_CHANNELS);
        }, 500); // Simulate network delay
    });
};

export const createTransaction = (transactionType, data, user) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Submitting Transaction to DB:', transactionType, data);
            const txn = saveTransaction(transactionType, data, user.email);
            resolve({
                success: true,
                transactionId: txn.id,
                message: 'Transaction submitted for approval.',
                workflow: txn.workflowName
            });
        }, 800);
    });
};

export const approveTransaction = (transactionId, user, comments = '') => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                console.log('Approving Transaction:', transactionId);

                const transaction = getTransactionById(transactionId);
                if (!transaction) {
                    reject(new Error('Transaction not found'));
                    return;
                }

                // Process approval through workflow engine
                const updatedTransaction = processApproval(transaction, user, 'APPROVE', comments);

                // Update in database
                updateTransaction(transactionId, updatedTransaction);

                // If fully approved, simulate Mambu API call
                if (updatedTransaction.status === 'APPROVED') {
                    updatedTransaction.mambuResponse = {
                        mambuId: 'MAMBU-' + Math.floor(Math.random() * 10000),
                        processedAt: new Date().toISOString()
                    };
                    updateTransaction(transactionId, updatedTransaction);
                }

                resolve({
                    success: true,
                    status: updatedTransaction.status,
                    message: updatedTransaction.status === 'APPROVED' ? 'Transaction fully approved and processed' : 'Approval recorded, awaiting additional approvals'
                });
            } catch (error) {
                reject(error);
            }
        }, 1000);
    });
};

export const rejectTransaction = (transactionId, user, comments = '') => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                const transaction = getTransactionById(transactionId);
                if (!transaction) {
                    reject(new Error('Transaction not found'));
                    return;
                }

                // Process rejection through workflow engine
                const updatedTransaction = processApproval(transaction, user, 'REJECT', comments);
                updateTransaction(transactionId, updatedTransaction);

                resolve({ success: true, message: 'Transaction rejected' });
            } catch (error) {
                reject(error);
            }
        }, 500);
    });
};
