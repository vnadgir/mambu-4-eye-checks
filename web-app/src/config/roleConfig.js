// Role configuration with granular permissions and metadata

export const DEPARTMENTS = {
    DEPOSITS: 'DEPOSITS',
    ACCOUNTING: 'ACCOUNTING',
    TREASURY: 'TREASURY',
    FINANCE: 'FINANCE'
};

export const SENIORITY_LEVELS = {
    JUNIOR: 1,
    STANDARD: 2,
    SENIOR: 3,
    MANAGER: 4,
    DIRECTOR: 5,
    EXECUTIVE: 6
};

export const ROLES = {
    // Deposit Department
    DEPOSIT_MAKER: {
        name: 'Deposit Maker',
        department: DEPARTMENTS.DEPOSITS,
        seniority: SENIORITY_LEVELS.STANDARD,
        permissions: {
            canCreate: ['DEPOSIT'],
            canApprove: []
        }
    },
    SENIOR_DEPOSIT_MAKER: {
        name: 'Senior Deposit Maker',
        department: DEPARTMENTS.DEPOSITS,
        seniority: SENIORITY_LEVELS.SENIOR,
        permissions: {
            canCreate: ['DEPOSIT'],
            canApprove: []
        }
    },
    DEPOSIT_CHECKER_L1: {
        name: 'Deposit Checker (Level 1)',
        department: DEPARTMENTS.DEPOSITS,
        seniority: SENIORITY_LEVELS.STANDARD,
        permissions: {
            canCreate: [],
            canApprove: ['DEPOSIT']
        }
    },
    DEPOSIT_CHECKER_L2: {
        name: 'Deposit Checker (Level 2)',
        department: DEPARTMENTS.DEPOSITS,
        seniority: SENIORITY_LEVELS.SENIOR,
        permissions: {
            canCreate: [],
            canApprove: ['DEPOSIT']
        }
    },
    SENIOR_DEPOSIT_CHECKER: {
        name: 'Senior Deposit Checker',
        department: DEPARTMENTS.DEPOSITS,
        seniority: SENIORITY_LEVELS.SENIOR,
        permissions: {
            canCreate: ['DEPOSIT'],
            canApprove: ['DEPOSIT']
        }
    },

    // Accounting Department
    JOURNAL_MAKER: {
        name: 'Journal Entry Maker',
        department: DEPARTMENTS.ACCOUNTING,
        seniority: SENIORITY_LEVELS.JUNIOR,
        permissions: {
            canCreate: ['JOURNAL_ENTRY'],
            canApprove: []
        }
    },
    ACCOUNTANT: {
        name: 'Accountant',
        department: DEPARTMENTS.ACCOUNTING,
        seniority: SENIORITY_LEVELS.STANDARD,
        permissions: {
            canCreate: ['JOURNAL_ENTRY'],
            canApprove: []
        }
    },
    SENIOR_ACCOUNTANT: {
        name: 'Senior Accountant',
        department: DEPARTMENTS.ACCOUNTING,
        seniority: SENIORITY_LEVELS.SENIOR,
        permissions: {
            canCreate: ['JOURNAL_ENTRY'],
            canApprove: ['JOURNAL_ENTRY']
        }
    },
    ACCOUNTING_MANAGER: {
        name: 'Accounting Manager',
        department: DEPARTMENTS.ACCOUNTING,
        seniority: SENIORITY_LEVELS.MANAGER,
        permissions: {
            canCreate: ['JOURNAL_ENTRY'],
            canApprove: ['JOURNAL_ENTRY']
        }
    },

    // Treasury Department
    PAYMENT_MAKER: {
        name: 'Payment Maker',
        department: DEPARTMENTS.TREASURY,
        seniority: SENIORITY_LEVELS.STANDARD,
        permissions: {
            canCreate: ['PAYMENT'],
            canApprove: []
        }
    },
    TREASURY_OFFICER: {
        name: 'Treasury Officer',
        department: DEPARTMENTS.TREASURY,
        seniority: SENIORITY_LEVELS.STANDARD,
        permissions: {
            canCreate: ['PAYMENT'],
            canApprove: []
        }
    },
    PAYMENT_CHECKER: {
        name: 'Payment Checker',
        department: DEPARTMENTS.TREASURY,
        seniority: SENIORITY_LEVELS.STANDARD,
        permissions: {
            canCreate: [],
            canApprove: ['PAYMENT']
        }
    },
    TREASURY_MANAGER: {
        name: 'Treasury Manager',
        department: DEPARTMENTS.TREASURY,
        seniority: SENIORITY_LEVELS.MANAGER,
        permissions: {
            canCreate: ['PAYMENT'],
            canApprove: ['PAYMENT']
        }
    },

    // Loan Department
    LOAN_OFFICER: {
        name: 'Loan Officer',
        department: DEPARTMENTS.LOANS,
        seniority: SENIORITY_LEVELS.JUNIOR,
        permissions: {
            canCreate: ['LOAN_DISBURSEMENT'],
            canApprove: [],
            isAdmin: false
        }
    },
    LOAN_MANAGER: {
        name: 'Loan Manager',
        department: DEPARTMENTS.LOANS,
        seniority: SENIORITY_LEVELS.MANAGER,
        permissions: {
            canCreate: [],
            canApprove: ['LOAN_DISBURSEMENT'],
            isAdmin: false
        }
    },
    RISK_MANAGER: {
        name: 'Risk Manager',
        department: DEPARTMENTS.RISK,
        seniority: SENIORITY_LEVELS.MANAGER,
        permissions: {
            canCreate: [],
            canApprove: ['LOAN_DISBURSEMENT'],
            isAdmin: false
        }
    },

    // Senior Management
    SENIOR_MANAGER: {
        name: 'Senior Manager',
        department: DEPARTMENTS.MANAGEMENT,
        seniority: SENIORITY_LEVELS.SENIOR,
        permissions: {
            canCreate: [],
            canApprove: ['DEPOSIT'],
            isAdmin: false
        }
    },
    FINANCE_DIRECTOR: {
        name: 'Finance Director',
        department: DEPARTMENTS.MANAGEMENT,
        seniority: SENIORITY_LEVELS.DIRECTOR,
        permissions: {
            canCreate: [],
            canApprove: ['DEPOSIT', 'JOURNAL_ENTRY'],
            isAdmin: false
        }
    },
    CFO: {
        name: 'Chief Financial Officer',
        department: DEPARTMENTS.MANAGEMENT,
        seniority: SENIORITY_LEVELS.EXECUTIVE,
        permissions: {
            canCreate: [],
            canApprove: ['JOURNAL_ENTRY', 'PAYMENT'],
            isAdmin: true
        }
    },

    // Admin
    ADMIN: {
        name: 'System Administrator',
        department: DEPARTMENTS.IT,
        seniority: SENIORITY_LEVELS.EXECUTIVE,
        permissions: {
            canCreate: ['DEPOSIT', 'JOURNAL_ENTRY', 'PAYMENT', 'LOAN_DISBURSEMENT'],
            canApprove: ['DEPOSIT', 'JOURNAL_ENTRY', 'PAYMENT', 'LOAN_DISBURSEMENT'],
            isAdmin: true
        }
    }
};

// Helper function to get role by key
export const getRole = (roleKey) => ROLES[roleKey];

// Helper function to check if role can create transaction type
export const canRoleCreate = (roleKey, transactionType) => {
    const role = ROLES[roleKey];
    return role && role.permissions.canCreate.includes(transactionType);
};

// Helper function to check if role can approve transaction type
export const canRoleApprove = (roleKey, transactionType) => {
    const role = ROLES[roleKey];
    return role && role.permissions.canApprove.includes(transactionType);
};
