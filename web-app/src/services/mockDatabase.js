import { determineWorkflow } from './workflowEngine.js';
import { sessionService } from './sessionService.js';

const DB_KEY = 'mambu_transactions';

// Simple sanitization to prevent XSS
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input.replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

const sanitizeObject = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    const sanitized = {};
    for (const key in obj) {
        if (typeof obj[key] === 'string') {
            sanitized[key] = sanitizeInput(obj[key]);
        } else if (typeof obj[key] === 'object') {
            sanitized[key] = sanitizeObject(obj[key]);
        } else {
            sanitized[key] = obj[key];
        }
    }
    return sanitized;
};

export const getTransactions = () => {
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : [];
};

export const saveTransaction = (transactionType, transactionData, createdBy) => {
    const transactions = getTransactions();

    // Sanitize input data
    const sanitizedData = sanitizeObject(transactionData);

    // Determine workflow for this transaction
    const workflow = determineWorkflow(transactionType, sanitizedData);

    const newTransaction = {
        id: 'TXN-' + crypto.randomUUID(),
        type: transactionType,
        data: sanitizedData,
        amount: sanitizedData.amount || 0,
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

export const updateTransaction = (id, updatedData) => {
    const transactions = getTransactions();
    const index = transactions.findIndex(t => t.id === id);
    if (index !== -1) {
        transactions[index] = { ...transactions[index], ...updatedData };
        localStorage.setItem(DB_KEY, JSON.stringify(transactions));
        return transactions[index];
    }
    return null;
};

export const updateTransactionStatus = (id, status, mambuResponse = null) => {
    const transaction = getTransactionById(id);
    if (transaction) {
        transaction.status = status;
        if (mambuResponse) {
            transaction.mambuResponse = mambuResponse;
        }
        return updateTransaction(id, transaction);
    }
    return null;
};

export const getPendingTransactions = () => {
    return getTransactions().filter(t => t.status && t.status.startsWith('PENDING'));
};

export const getPendingTransactionsForUser = () => {
    const user = sessionService.getCurrentUser();
    if (!user) return [];

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
