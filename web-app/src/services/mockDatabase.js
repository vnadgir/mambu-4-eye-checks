import { determineWorkflow } from './workflowEngine';

const DB_KEY = 'mambu_transactions';

export const getTransactions = () => {
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : [];
};

export const saveTransaction = (transactionType, transactionData, createdBy) => {
    const transactions = getTransactions();

    // Determine workflow for this transaction
    const workflow = determineWorkflow(transactionType, transactionData);

    const newTransaction = {
        id: 'TXN-' + Date.now(),
        type: transactionType,
        data: transactionData,
        amount: transactionData.amount || 0,
        status: workflow.steps.length > 0 ? `PENDING_${workflow.steps[0].stage}` : 'APPROVED',
        workflowName: workflow.name,
        workflowStages: workflow.steps,
        currentStageIndex: 0,
        createdBy: createdBy,
        createdAt: new Date().toISOString(),
        history: [
            {
                action: 'SUBMITTED',
                user: createdBy,
                userName: createdBy.split('@')[0],
                timestamp: new Date().toISOString(),
                comments: `Transaction submitted via ${transactionType} form`
            }
        ]
    };

    transactions.push(newTransaction);
    localStorage.setItem(DB_KEY, JSON.stringify(transactions));
    return newTransaction;
};

export const getTransactionById = (id) => {
    const transactions = getTransactions();
    return transactions.find(t => t.id === id);
};

export const updateTransaction = (id, updates) => {
    const transactions = getTransactions();
    const index = transactions.findIndex(t => t.id === id);

    if (index !== -1) {
        transactions[index] = { ...transactions[index], ...updates };
        localStorage.setItem(DB_KEY, JSON.stringify(transactions));
        return transactions[index];
    }

    throw new Error('Transaction not found');
};

export const updateTransactionStatus = (id, status, response = null) => {
    const transactions = getTransactions();
    const index = transactions.findIndex(t => t.id === id);

    if (index !== -1) {
        transactions[index].status = status;
        if (response) {
            transactions[index].mambuResponse = response;
        }
        localStorage.setItem(DB_KEY, JSON.stringify(transactions));
        return transactions[index];
    }

    throw new Error('Transaction not found');
};

export const getPendingTransactions = () => {
    return getTransactions().filter(t =>
        t.status !== 'APPROVED' && t.status !== 'REJECTED'
    );
};

export const getPendingTransactionsForUser = (user) => {
    const allPending = getPendingTransactions();

    // Filter to only transactions where user can approve at current stage
    return allPending.filter(txn => {
        const currentStage = txn.workflowStages[txn.currentStageIndex];
        if (!currentStage || currentStage.status !== 'PENDING') {
            return false;
        }

        // Check if user has already approved this stage
        const hasAlreadyApproved = currentStage.approvals.some(
            approval => approval.userId === user.email
        );

        if (hasAlreadyApproved) {
            return false;
        }

        // Check if user created the transaction
        if (txn.createdBy === user.email) {
            return false;
        }

        // Check if user has required role
        return user.roles.some(role => currentStage.roles.includes(role));
    });
};

export const getTransactionsByType = (transactionType) => {
    return getTransactions().filter(t => t.type === transactionType);
};

export const getTransactionsByCreator = (userEmail) => {
    return getTransactions().filter(t => t.createdBy === userEmail);
};

export const clearAllTransactions = () => {
    localStorage.removeItem(DB_KEY);
};
