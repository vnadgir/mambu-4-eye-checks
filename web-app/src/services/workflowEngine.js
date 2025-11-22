import { workflowConfig, TRANSACTION_TYPES } from '../config/workflowConfig';

/**
 * Determines the appropriate workflow for a transaction based on its type and data
 * @param {string} transactionType - Type of transaction (DEPOSIT, JOURNAL_ENTRY, etc.)
 * @param {object} transactionData - Transaction data including amount and other attributes
 * @returns {object} Workflow configuration with stages
 */
export const determineWorkflow = (transactionType, transactionData) => {
    const typeConfig = workflowConfig[transactionType];

    if (!typeConfig) {
        throw new Error(`Unknown transaction type: ${transactionType}`);
    }

    // Find the first workflow whose condition matches
    const matchedWorkflow = typeConfig.workflows.find(workflow =>
        workflow.condition(transactionData)
    );

    if (!matchedWorkflow) {
        throw new Error(`No workflow matched for transaction type ${transactionType}`);
    }

    return {
        name: matchedWorkflow.name,
        steps: matchedWorkflow.steps.map((step, index) => ({
            ...step,
            stageIndex: index,
            status: index === 0 ? 'PENDING' : 'NOT_STARTED',
            approvals: []
        }))
    };
};

/**
 * Gets the current active stage for a transaction
 * @param {object} transaction - Transaction object with workflowStages
 * @returns {object} Current stage or null if complete
 */
export const getCurrentStage = (transaction) => {
    if (!transaction.workflowStages || transaction.workflowStages.length === 0) {
        return null;
    }

    const currentStage = transaction.workflowStages[transaction.currentStageIndex];
    return currentStage && currentStage.status === 'PENDING' ? currentStage : null;
};

/**
 * Gets the next stage after current one
 * @param {object} transaction - Transaction object
 * @returns {object} Next stage or null if at end
 */
export const getNextStage = (transaction) => {
    const nextIndex = transaction.currentStageIndex + 1;
    if (nextIndex < transaction.workflowStages.length) {
        return transaction.workflowStages[nextIndex];
    }
    return null;
};

/**
 * Checks if a user can approve a transaction at its current stage
 * @param {object} user - User object with roles array
 * @param {object} transaction - Transaction object
 * @returns {boolean} True if user can approve
 */
export const canUserApprove = (user, transaction) => {
    const currentStage = getCurrentStage(transaction);

    if (!currentStage) {
        return false; // No active stage
    }

    // Check if user has already approved this stage
    const hasAlreadyApproved = currentStage.approvals.some(
        approval => approval.userId === user.email
    );

    if (hasAlreadyApproved) {
        return false; // User already approved this stage
    }

    // Check if user created the transaction (maker can't approve own transaction)
    if (transaction.createdBy === user.email) {
        return false;
    }

    // Check if user has any role that's allowed for this stage
    const hasRequiredRole = user.roles.some(userRole =>
        currentStage.roles.includes(userRole)
    );

    return hasRequiredRole;
};

/**
 * Processes an approval or rejection decision
 * @param {object} transaction - Transaction object
 * @param {object} user - User making the decision
 * @param {string} decision - 'APPROVE' or 'REJECT'
 * @param {string} comments - Optional comments
 * @returns {object} Updated transaction
 */
export const processApproval = (transaction, user, decision, comments = '') => {
    const currentStage = getCurrentStage(transaction);

    if (!currentStage) {
        throw new Error('No active stage to approve');
    }

    if (!canUserApprove(user, transaction)) {
        throw new Error('User not authorized to approve this transaction');
    }

    // Add approval to current stage
    const approval = {
        userId: user.email,
        userName: user.username,
        decision,
        timestamp: new Date().toISOString(),
        comments
    };

    currentStage.approvals.push(approval);

    // Add to history
    transaction.history.push({
        action: decision === 'APPROVE' ? `APPROVED_${currentStage.stage}` : `REJECTED_${currentStage.stage}`,
        user: user.email,
        userName: user.username,
        timestamp: approval.timestamp,
        comments
    });

    // Handle rejection
    if (decision === 'REJECT') {
        transaction.status = 'REJECTED';
        currentStage.status = 'REJECTED';
        return transaction;
    }

    // Check if stage is complete (has enough approvals)
    if (currentStage.approvals.filter(a => a.decision === 'APPROVE').length >= currentStage.required) {
        currentStage.status = 'COMPLETED';

        // Move to next stage or mark as approved
        const nextStage = getNextStage(transaction);
        if (nextStage) {
            transaction.currentStageIndex++;
            nextStage.status = 'PENDING';
            transaction.status = `PENDING_${nextStage.stage}`;
        } else {
            // All stages complete
            transaction.status = 'APPROVED';
        }
    }

    return transaction;
};

/**
 * Checks if workflow is complete (all stages approved or rejected)
 * @param {object} transaction - Transaction object
 * @returns {boolean} True if workflow is complete
 */
export const isWorkflowComplete = (transaction) => {
    return transaction.status === 'APPROVED' || transaction.status === 'REJECTED';
};

/**
 * Gets workflow progress summary
 * @param {object} transaction - Transaction object
 * @returns {object} Progress information
 */
export const getWorkflowProgress = (transaction) => {
    const totalStages = transaction.workflowStages.length;
    const completedStages = transaction.workflowStages.filter(s => s.status === 'COMPLETED').length;
    const currentStage = getCurrentStage(transaction);

    return {
        totalStages,
        completedStages,
        currentStage: currentStage ? currentStage.stageIndex + 1 : totalStages,
        percentComplete: (completedStages / totalStages) * 100,
        isComplete: isWorkflowComplete(transaction)
    };
};
