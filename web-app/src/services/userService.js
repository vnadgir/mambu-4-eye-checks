// Mock user database for testing
// In production, this would come from Azure AD or another auth provider

export const MOCK_USERS = {
    // Deposit Department Users
    'maker1@test.com': {
        email: 'maker1@test.com',
        username: 'Deposit Maker 1',
        roles: ['DEPOSIT_MAKER']
    },
    'checker1@test.com': {
        email: 'checker1@test.com',
        username: 'Deposit Checker L1',
        roles: ['DEPOSIT_CHECKER_L1']
    },
    'checker2@test.com': {
        email: 'checker2@test.com',
        username: 'Deposit Checker L2',
        roles: ['DEPOSIT_CHECKER_L2']
    },

    // Accounting Department Users
    'accountant@test.com': {
        email: 'accountant@test.com',
        username: 'Accountant',
        roles: ['ACCOUNTANT']
    },
    'accounting-mgr@test.com': {
        email: 'accounting-mgr@test.com',
        username: 'Accounting Manager',
        roles: ['ACCOUNTING_MANAGER']
    },

    // Treasury Department Users
    'payment-maker@test.com': {
        email: 'payment-maker@test.com',
        username: 'Payment Maker',
        roles: ['PAYMENT_MAKER']
    },
    'payment-checker@test.com': {
        email: 'payment-checker@test.com',
        username: 'Payment Checker',
        roles: ['PAYMENT_CHECKER']
    },
    'treasury-mgr@test.com': {
        email: 'treasury-mgr@test.com',
        username: 'Treasury Manager',
        roles: ['TREASURY_MANAGER']
    },

    // Senior Management
    'senior-mgr@test.com': {
        email: 'senior-mgr@test.com',
        username: 'Senior Manager',
        roles: ['SENIOR_MANAGER']
    },
    'finance-dir@test.com': {
        email: 'finance-dir@test.com',
        username: 'Finance Director',
        roles: ['FINANCE_DIRECTOR']
    },

    // Multi-role users (for testing)
    'multi-role@test.com': {
        email: 'multi-role@test.com',
        username: 'Multi-Role User',
        roles: ['DEPOSIT_MAKER', 'DEPOSIT_CHECKER_L1', 'JOURNAL_MAKER']
    },

    // Admin (basic auth)
    'admin': {
        email: 'admin@mambu.com',
        username: 'Administrator',
        roles: ['ADMIN']
    }
};

/**
 * Authenticates a user with username/password
 * @param {string} username - Username or email
 * @param {string} password - Password
 * @returns {object} User object or null if invalid
 */
export const authenticateUser = (username, password) => {
    const user = MOCK_USERS[username];

    // In a real app, we would hash the password and compare
    // For this mock, we'll just check if the user exists and password is 'mambu'
    // This avoids storing passwords in the code
    if (user && password === 'mambu') {
        return { ...user };
    }

    return null;
};

/**
 * Gets user by email
 * @param {string} email - User email
 * @returns {object} User object or null
 */
export const getUserByEmail = (email) => {
    const user = MOCK_USERS[email];
    if (user) {
        return { ...user };
    }
    return null;
};

/**
 * Gets all available test users (for demo purposes)
 * @returns {array} Array of user objects without passwords
 */
export const getAllTestUsers = () => {
    return Object.values(MOCK_USERS).map(user => {
        if (user) {
            return { ...user };
        }
    });
};
