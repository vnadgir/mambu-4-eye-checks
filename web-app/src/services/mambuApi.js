import { saveTransaction, updateTransaction, getTransactionById } from './mockDatabase';
import { processApproval } from './workflowEngine';
import { sessionService } from './sessionService';

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

export const createTransaction = (transactionType, data) => {
    return new Promise((resolve, reject) => {
        const user = sessionService.getCurrentUser();
        if (!user) {
            reject(new Error('Unauthorized: No active session'));
            return;
        }

        setTimeout(() => {
            // console.log('Submitting Transaction to DB:', transactionType, data); // Removed for security
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

export const approveTransaction = (transactionId, comments = '') => {
    return new Promise((resolve, reject) => {
        const user = sessionService.getCurrentUser();
        if (!user) {
            reject(new Error('Unauthorized: No active session'));
            return;
        }

        setTimeout(() => {
            try {
                // console.log('Approving Transaction:', transactionId); // Removed for security

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
                        mambuId: 'MAMBU-' + crypto.randomUUID(),
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

export const rejectTransaction = (transactionId, comments = '') => {
    return new Promise((resolve, reject) => {
        const user = sessionService.getCurrentUser();
        if (!user) {
            reject(new Error('Unauthorized: No active session'));
            return;
        }

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
