// Workflow configuration for different transaction types
// Each transaction type has makers, and conditional workflows based on transaction attributes

export const TRANSACTION_TYPES = {
    DEPOSIT: 'DEPOSIT',
    JOURNAL_ENTRY: 'JOURNAL_ENTRY',
    PAYMENT: 'PAYMENT'
};

export const WORKFLOW_STAGES = {
    L1_APPROVAL: 'L1_APPROVAL',
    L2_APPROVAL: 'L2_APPROVAL',
    SENIOR_APPROVAL: 'SENIOR_APPROVAL',
    FINAL_APPROVAL: 'FINAL_APPROVAL'
};

export const workflowConfig = {
    [TRANSACTION_TYPES.DEPOSIT]: {
        name: 'Deposit Transaction',
        description: 'Customer deposit to account',
        makerRoles: ['DEPOSIT_MAKER', 'SENIOR_DEPOSIT_MAKER'],
        workflows: [
            {
                name: 'Standard Deposit',
                condition: (txn) => txn.amount < 10000,
                steps: [
                    {
                        stage: WORKFLOW_STAGES.L1_APPROVAL,
                        roles: ['DEPOSIT_CHECKER_L1', 'SENIOR_DEPOSIT_CHECKER'],
                        required: 1,
                        description: 'Level 1 Approval'
                    }
                ]
            },
            {
                name: 'Medium Deposit',
                condition: (txn) => txn.amount >= 10000 && txn.amount < 100000,
                steps: [
                    {
                        stage: WORKFLOW_STAGES.L1_APPROVAL,
                        roles: ['DEPOSIT_CHECKER_L1', 'SENIOR_DEPOSIT_CHECKER'],
                        required: 1,
                        description: 'Level 1 Approval'
                    },
                    {
                        stage: WORKFLOW_STAGES.L2_APPROVAL,
                        roles: ['DEPOSIT_CHECKER_L2', 'SENIOR_DEPOSIT_CHECKER'],
                        required: 1,
                        description: 'Level 2 Approval'
                    }
                ]
            },
            {
                name: 'Large Deposit',
                condition: (txn) => txn.amount >= 100000,
                steps: [
                    {
                        stage: WORKFLOW_STAGES.L1_APPROVAL,
                        roles: ['DEPOSIT_CHECKER_L1', 'SENIOR_DEPOSIT_CHECKER'],
                        required: 2,
                        description: 'Level 1 Approval (2 required)'
                    },
                    {
                        stage: WORKFLOW_STAGES.L2_APPROVAL,
                        roles: ['DEPOSIT_CHECKER_L2', 'SENIOR_DEPOSIT_CHECKER'],
                        required: 1,
                        description: 'Level 2 Approval'
                    },
                    {
                        stage: WORKFLOW_STAGES.SENIOR_APPROVAL,
                        roles: ['SENIOR_MANAGER', 'FINANCE_DIRECTOR'],
                        required: 1,
                        description: 'Senior Management Approval'
                    }
                ]
            }
        ]
    },

    [TRANSACTION_TYPES.JOURNAL_ENTRY]: {
        name: 'Journal Entry',
        description: 'Manual journal entry for accounting adjustments',
        makerRoles: ['JOURNAL_MAKER', 'ACCOUNTANT', 'SENIOR_ACCOUNTANT'],
        workflows: [
            {
                name: 'Standard Journal Entry',
                condition: (txn) => Math.abs(txn.amount) < 50000,
                steps: [
                    {
                        stage: WORKFLOW_STAGES.L1_APPROVAL,
                        roles: ['ACCOUNTING_MANAGER', 'SENIOR_ACCOUNTANT'],
                        required: 1,
                        description: 'Accounting Manager Approval'
                    }
                ]
            },
            {
                name: 'Large Journal Entry',
                condition: (txn) => Math.abs(txn.amount) >= 50000,
                steps: [
                    {
                        stage: WORKFLOW_STAGES.L1_APPROVAL,
                        roles: ['ACCOUNTING_MANAGER', 'SENIOR_ACCOUNTANT'],
                        required: 1,
                        description: 'Accounting Manager Approval'
                    },
                    {
                        stage: WORKFLOW_STAGES.SENIOR_APPROVAL,
                        roles: ['FINANCE_DIRECTOR', 'CFO'],
                        required: 1,
                        description: 'Finance Director Approval'
                    }
                ]
            }
        ]
    },

    [TRANSACTION_TYPES.PAYMENT]: {
        name: 'Payment Transaction',
        description: 'Outbound payment processing',
        makerRoles: ['PAYMENT_MAKER', 'TREASURY_OFFICER'],
        workflows: [
            {
                name: 'Small Payment',
                condition: (txn) => txn.amount < 5000,
                steps: [
                    {
                        stage: WORKFLOW_STAGES.L1_APPROVAL,
                        roles: ['PAYMENT_CHECKER', 'TREASURY_MANAGER'],
                        required: 1,
                        description: 'Payment Verification'
                    }
                ]
            },
            {
                name: 'Medium Payment',
                condition: (txn) => txn.amount >= 5000 && txn.amount < 50000,
                steps: [
                    {
                        stage: WORKFLOW_STAGES.L1_APPROVAL,
                        roles: ['PAYMENT_CHECKER', 'TREASURY_MANAGER'],
                        required: 1,
                        description: 'Payment Verification'
                    },
                    {
                        stage: WORKFLOW_STAGES.L2_APPROVAL,
                        roles: ['TREASURY_MANAGER', 'SENIOR_MANAGER'],
                        required: 1,
                        description: 'Treasury Manager Approval'
                    }
                ]
            },
            {
                name: 'Large Payment',
                condition: (txn) => txn.amount >= 50000,
                steps: [
                    {
                        stage: WORKFLOW_STAGES.L1_APPROVAL,
                        roles: ['PAYMENT_CHECKER'],
                        required: 2,
                        description: 'Dual Payment Verification'
                    },
                    {
                        stage: WORKFLOW_STAGES.L2_APPROVAL,
                        roles: ['TREASURY_MANAGER'],
                        required: 1,
                        description: 'Treasury Manager Approval'
                    },
                    {
                        stage: WORKFLOW_STAGES.SENIOR_APPROVAL,
                        roles: ['FINANCE_DIRECTOR', 'CFO'],
                        required: 1,
                        description: 'Senior Finance Approval'
                    }
                ]
            }
        ]
    }
};
