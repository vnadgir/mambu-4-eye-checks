const DB_KEY = 'mambu_transactions';

export const getTransactions = () => {
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : [];
};

export const saveTransaction = (transaction) => {
    const transactions = getTransactions();
    const newTransaction = {
        ...transaction,
        id: 'TXN-' + Date.now(), // Simple unique ID
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        history: [{ action: 'SUBMITTED', timestamp: new Date().toISOString() }]
    };
    transactions.push(newTransaction);
    localStorage.setItem(DB_KEY, JSON.stringify(transactions));
    return newTransaction;
};

export const updateTransactionStatus = (id, status, response = null) => {
    const transactions = getTransactions();
    const index = transactions.findIndex(t => t.id === id);
    if (index !== -1) {
        transactions[index].status = status;
        transactions[index].mambuResponse = response;
        transactions[index].history.push({ action: status, timestamp: new Date().toISOString() });
        localStorage.setItem(DB_KEY, JSON.stringify(transactions));
        return transactions[index];
    }
    throw new Error('Transaction not found');
};

export const getPendingTransactions = () => {
    return getTransactions().filter(t => t.status === 'PENDING');
};
