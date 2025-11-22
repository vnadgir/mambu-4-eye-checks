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
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('Submitting Deposit:', data);
            // Simulate success
            resolve({
                success: true,
                caseId: '500' + Math.floor(Math.random() * 1000),
                message: 'Deposit submitted for approval.'
            });
        }, 1000);
    });
};
