// Mock user database for testing
// In production, this would come from Azure AD or another auth provider

export const MOCK_USERS = {
    // Deposit Department Users
    'maker1@test.com': {
        email: 'maker1@test.com',
        username: 'Deposit Maker 1',
        roles: ['DEPOSIT_MAKER'],
        password: 'mambu'
    },
    'checker1@test.com': {
        email: 'checker1@test.com',
        username: 'Deposit Checker L1',
        roles: ['DEPOSIT_CHECKER_L1'],
        password: 'mambu'
    },
    'checker2@test.com': {
        email: 'checker2@test.com',
        username: 'Deposit Checker L2',
        roles: ['DEPOSIT_CHECKER_L2'],
        password: 'mambu'
    },

    // Accounting Department Users
    'accountant@test.com': {
        email: 'accountant@test.com',
        username: 'Accountant',
        roles: ['ACCOUNTANT'],
        password: 'mambu'
    },
    'accounting-mgr@test.com': {
        email: 'accounting-mgr@test.com',
        username: 'Accounting Manager',
        roles: ['ACCOUNTING_MANAGER'],
        password: 'mambu'
    },

    // Treasury Department Users
    'payment-maker@test.com': {
        email: 'payment-maker@test.com',
        username: 'Payment Maker',
        roles: ['PAYMENT_MAKER'],
        password: 'mambu'
    },
    'payment-checker@test.com': {
        email: 'payment-checker@test.com',
        username: 'Payment Checker',
        roles: ['PAYMENT_CHECKER'],
        password: 'mambu'
    },
    'treasury-mgr@test.com': {
        email: 'treasury-mgr@test.com',
        username: 'Treasury Manager',
        roles: ['TREASURY_MANAGER'],
        password: 'mambu'
    },

    // Senior Management
    'senior-mgr@test.com': {
        email: 'senior-mgr@test.com',
        username: 'Senior Manager',
        roles: ['SENIOR_MANAGER'],
        password: 'mambu'
    },
    'finance-dir@test.com': {
        email: 'finance-dir@test.com',
        username: 'Finance Director',
        roles: ['FINANCE_DIRECTOR'],
        password: 'mambu'
    },

    // Multi-role users (for testing)
    'multi-role@test.com': {
        email: 'multi-role@test.com',
        username: 'Multi-Role User',
        roles: ['DEPOSIT_MAKER', 'DEPOSIT_CHECKER_L1', 'JOURNAL_MAKER'],
        password: 'mambu'
    },

    // Admin (basic auth)
    'admin': {
        email: 'admin@mambu.com',
        username: 'Administrator',
        roles: ['ADMIN'],
        password: 'mambu'
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

    if (user && user.password === password) {
        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
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
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    return null;
};

/**
 * Gets all available test users (for demo purposes)
 * @returns {array} Array of user objects without passwords
 */
export const getAllTestUsers = () => {
    return Object.values(MOCK_USERS).map(user => {
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    });
};
