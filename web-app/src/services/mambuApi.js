import { saveTransaction, updateTransactionStatus } from './mockDatabase';

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

export const createDeposit = (data) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Submitting Deposit to DB:', data);
            const txn = saveTransaction(data);
            resolve({
                success: true,
                caseId: txn.id,
                message: 'Deposit submitted for approval.'
            });
        }, 800);
    });
};

export const approveDeposit = (id) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulate calling real Mambu API here
            console.log('Approving Transaction in Mambu:', id);

            // Update DB status
            updateTransactionStatus(id, 'APPROVED', { mambuId: 'MAMBU-' + Math.floor(Math.random() * 10000) });

            resolve({ success: true });
        }, 1000);
    });
};

export const rejectDeposit = (id) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            updateTransactionStatus(id, 'REJECTED');
            resolve({ success: true });
        }, 500);
    });
};
