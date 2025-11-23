// Workflow configuration for different transaction types
// Each transaction type has makers, and conditional workflows based on transaction attributes

export const TRANSACTION_TYPES = {
    DEPOSIT: 'DEPOSIT',
    JOURNAL_ENTRY: 'JOURNAL_ENTRY',
    PAYMENT: 'PAYMENT',
    LOAN_DISBURSEMENT: 'LOAN_DISBURSEMENT'
};

export const WORKFLOW_STAGES = {
    L1_APPROVAL: 'L1_APPROVAL',
    L2_APPROVAL: 'L2_APPROVAL',
    SENIOR_APPROVAL: 'SENIOR_APPROVAL',
    FINAL_APPROVAL: 'FINAL_APPROVAL',
    MANAGER_APPROVAL: 'MANAGER_APPROVAL',
    DIRECTOR_APPROVAL: 'DIRECTOR_APPROVAL',
    CHECKER_APPROVAL: 'CHECKER_APPROVAL',
    TREASURY_APPROVAL: 'TREASURY_APPROVAL',
    RISK_APPROVAL: 'RISK_APPROVAL'
};

export const workflowConfig = {
    [TRANSACTION_TYPES.DEPOSIT]: {
        name: 'Deposit Transaction',
        description: 'Deposit funds into a client account',
        makerRoles: ['DEPOSIT_MAKER', 'SENIOR_DEPOSIT_MAKER'], // Retained from original, not in instruction's DEPOSIT block
        workflows: [
            {
                name: 'Standard Deposit',
                condition: (data) => data.amount < 10000,
                steps: [ // Changed from 'stages' to 'steps' to match original structure
                    {
                        stage: WORKFLOW_STAGES.L1_APPROVAL, // Used WORKFLOW_STAGES enum
                        roles: ['DEPOSIT_CHECKER_L1', 'SENIOR_DEPOSIT_CHECKER'], // Retained from original
                        required: 1, // Changed from 'requiredApprovals' to 'required'
                        description: 'Level 1 Approval' // Retained from original
                    }
                ]
            },
            {
                name: 'Medium Deposit',
                condition: (data) => data.amount >= 10000 && data.amount < 100000,
                steps: [ // Changed from 'stages' to 'steps'
                    {
                        stage: WORKFLOW_STAGES.L1_APPROVAL, // Used WORKFLOW_STAGES enum
                        roles: ['DEPOSIT_CHECKER_L1', 'SENIOR_DEPOSIT_CHECKER'], // Retained from original
                        required: 1, // Changed from 'requiredApprovals' to 'required'
                        description: 'Level 1 Approval' // Retained from original
                    },
                    {
                        stage: WORKFLOW_STAGES.L2_APPROVAL, // Used WORKFLOW_STAGES enum
                        roles: ['DEPOSIT_CHECKER_L2', 'SENIOR_DEPOSIT_CHECKER'], // Retained from original
                        required: 1, // Changed from 'requiredApprovals' to 'required'
                        description: 'Level 2 Approval' // Retained from original
                    }
                ]
            },
            {
                name: 'Large Deposit',
                condition: (data) => data.amount >= 100000,
                steps: [ // Changed from 'stages' to 'steps'
                    {
                        stage: WORKFLOW_STAGES.L1_APPROVAL, // Used WORKFLOW_STAGES enum
                        roles: ['DEPOSIT_CHECKER_L1', 'SENIOR_DEPOSIT_CHECKER'], // Retained from original
                        required: 2, // Changed from 'requiredApprovals' to 'required'
                        description: 'Level 1 Approval (2 required)' // Retained from original
                    },
                    {
                        stage: WORKFLOW_STAGES.L2_APPROVAL, // Used WORKFLOW_STAGES enum
                        roles: ['DEPOSIT_CHECKER_L2', 'SENIOR_DEPOSIT_CHECKER'], // Retained from original
                        required: 1, // Changed from 'requiredApprovals' to 'required'
                        description: 'Level 2 Approval' // Retained from original
                    },
                    {
                        stage: WORKFLOW_STAGES.SENIOR_APPROVAL, // Used WORKFLOW_STAGES enum
                        roles: ['SENIOR_MANAGER', 'FINANCE_DIRECTOR'],
                        required: 1, // Changed from 'requiredApprovals' to 'required'
                        description: 'Senior Management Approval' // Retained from original
                    }
                ]
            }
        ]
    },

    [TRANSACTION_TYPES.JOURNAL_ENTRY]: {
        name: 'Journal Entry',
        description: 'Manual accounting adjustments',
        makerRoles: ['JOURNAL_MAKER', 'ACCOUNTANT', 'SENIOR_ACCOUNTANT'], // Retained from original
        workflows: [
            {
                name: 'Standard Journal Entry', // Renamed from 'Standard Journal'
                condition: (data) => Math.abs(data.amount) < 50000, // Retained original condition logic
                steps: [ // Changed from 'stages' to 'steps'
                    {
                        stage: WORKFLOW_STAGES.MANAGER_APPROVAL, // Used WORKFLOW_STAGES enum
                        roles: ['ACCOUNTING_MANAGER', 'SENIOR_ACCOUNTANT'], // Retained from original
                        required: 1, // Changed from 'requiredApprovals' to 'required'
                        description: 'Accounting Manager Approval' // Retained from original
                    }
                ]
            },
            {
                name: 'Large Journal Entry', // Renamed from 'Large Journal'
                condition: (data) => Math.abs(data.amount) >= 50000, // Retained original condition logic
                steps: [ // Changed from 'stages' to 'steps'
                    {
                        stage: WORKFLOW_STAGES.MANAGER_APPROVAL, // Used WORKFLOW_STAGES enum
                        roles: ['ACCOUNTING_MANAGER', 'SENIOR_ACCOUNTANT'], // Retained from original
                        required: 1, // Changed from 'requiredApprovals' to 'required'
                        description: 'Accounting Manager Approval' // Retained from original
                    },
                    {
                        stage: WORKFLOW_STAGES.DIRECTOR_APPROVAL, // Used WORKFLOW_STAGES enum
                        roles: ['FINANCE_DIRECTOR', 'CFO'],
                        required: 1, // Changed from 'requiredApprovals' to 'required'
                        description: 'Finance Director Approval' // Retained from original
                    }
                ]
            }
        ]
    },

    [TRANSACTION_TYPES.PAYMENT]: {
        name: 'Payment Transaction', // Retained original name
        description: 'Outbound payment processing', // Retained original description
        makerRoles: ['PAYMENT_MAKER', 'TREASURY_OFFICER'], // Retained from original
        workflows: [
            {
                name: 'Small Payment', // Retained original name
                condition: (data) => data.amount < 5000, // Retained original condition
                steps: [ // Changed from 'stages' to 'steps'
                    {
                        stage: WORKFLOW_STAGES.CHECKER_APPROVAL, // Used WORKFLOW_STAGES enum
                        roles: ['PAYMENT_CHECKER', 'TREASURY_MANAGER'], // Retained from original
                        required: 1, // Changed from 'requiredApprovals' to 'required'
                        description: 'Payment Verification' // Retained from original
                    }
                ]
            },
            {
                name: 'Medium Payment', // Retained original name
                condition: (data) => data.amount >= 5000 && data.amount < 50000, // Retained original condition
                steps: [ // Changed from 'stages' to 'steps'
                    {
                        stage: WORKFLOW_STAGES.CHECKER_APPROVAL, // Used WORKFLOW_STAGES enum
                        roles: ['PAYMENT_CHECKER', 'TREASURY_MANAGER'], // Retained from original
                        required: 1, // Changed from 'requiredApprovals' to 'required'
                        description: 'Payment Verification' // Retained from original
                    },
                    {
                        stage: WORKFLOW_STAGES.TREASURY_APPROVAL, // Used WORKFLOW_STAGES enum
                        roles: ['TREASURY_MANAGER', 'SENIOR_MANAGER'], // Retained from original
                        required: 1, // Changed from 'requiredApprovals' to 'required'
                        description: 'Treasury Manager Approval' // Retained from original
                    }
                ]
            },
            {
                name: 'Large Payment',
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
    },

    [TRANSACTION_TYPES.LOAN_DISBURSEMENT]: {
        name: 'Loan Disbursement',
        description: 'Disburse funds for approved loans',
        makerRoles: ['LOAN_OFFICER'],
        workflows: [
            {
                name: 'Standard Disbursement',
                condition: (data) => data.amount < 25000,
                steps: [
                    {
                        stage: WORKFLOW_STAGES.MANAGER_APPROVAL,
                        roles: ['LOAN_MANAGER'],
                        required: 1,
                        description: 'Loan Manager Approval'
                    }
                ]
            },
            {
                name: 'Large Disbursement',
                condition: (data) => data.amount >= 25000,
                steps: [
                    {
                        stage: WORKFLOW_STAGES.MANAGER_APPROVAL,
                        roles: ['LOAN_MANAGER'],
                        required: 1,
                        description: 'Loan Manager Approval'
                    },
                    {
                        stage: WORKFLOW_STAGES.RISK_APPROVAL,
                        roles: ['RISK_MANAGER'],
                        required: 1,
                        description: 'Risk Manager Approval'
                    }
                ]
            }
        ]
    }
};
