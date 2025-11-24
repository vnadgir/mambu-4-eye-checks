import { processApproval } from './workflowEngine.js';
import { getTransactionById, updateTransaction } from './mockDatabase.js';

/**
 * Service to handle workflow operations with database persistence
 */
export const workflowService = {
    /**
     * Process an approval decision for a transaction and persist to database
     * @param {string} transactionId - ID of the transaction
     * @param {object} user - User making the decision
     * @param {string} decision - 'APPROVE' or 'REJECT'
     * @param {string} comments - Optional comments
     * @returns {object} Updated transaction
     */
    approveTransaction: (transactionId, user, decision, comments = '') => {
        const transaction = getTransactionById(transactionId);

        if (!transaction) {
            throw new Error(`Transaction not found: ${transactionId}`);
        }

        // Process the approval in memory (this modifies the transaction object)
        const updatedTransaction = processApproval(transaction, user, decision, comments);

        // Persist the changes to the database
        updateTransaction(transactionId, updatedTransaction);

        return updatedTransaction;
    }
};
