import { ROLES } from '../config/roleConfig';
import { workflowConfig } from '../config/workflowConfig';

/**
 * Gets all roles for a user
 * @param {object} user - User object with roles array
 * @returns {array} Array of role keys
 */
export const getUserRoles = (user) => {
    return user.roles || [];
};

/**
 * Checks if user can create a specific transaction type
 * @param {object} user - User object
 * @param {string} transactionType - Transaction type to check
 * @returns {boolean} True if user can create this type
 */
export const canCreateTransaction = (user, transactionType) => {
    const userRoles = getUserRoles(user);

    // Check if any of user's roles can create this transaction type
    return userRoles.some(roleKey => {
        const role = ROLES[roleKey];
        return role && role.permissions.canCreate.includes(transactionType);
    });
};

/**
 * Checks if user can approve a specific transaction type
 * @param {object} user - User object
 * @param {string} transactionType - Transaction type to check
 * @returns {boolean} True if user can approve this type
 */
export const canApproveTransactionType = (user, transactionType) => {
    const userRoles = getUserRoles(user);

    // Check if any of user's roles can approve this transaction type
    return userRoles.some(roleKey => {
        const role = ROLES[roleKey];
        return role && role.permissions.canApprove.includes(transactionType);
    });
};

/**
 * Gets list of transaction types user can create
 * @param {object} user - User object
 * @returns {array} Array of transaction type keys
 */
export const getAvailableTransactionTypes = (user) => {
    const userRoles = getUserRoles(user);
    const transactionTypes = new Set();

    userRoles.forEach(roleKey => {
        const role = ROLES[roleKey];
        if (role && role.permissions.canCreate) {
            role.permissions.canCreate.forEach(type => transactionTypes.add(type));
        }
    });

    return Array.from(transactionTypes);
};

/**
 * Gets list of transaction types user can approve
 * @param {object} user - User object
 * @returns {array} Array of transaction type keys
 */
export const getApprovableTransactionTypes = (user) => {
    const userRoles = getUserRoles(user);
    const transactionTypes = new Set();

    userRoles.forEach(roleKey => {
        const role = ROLES[roleKey];
        if (role && role.permissions.canApprove) {
            role.permissions.canApprove.forEach(type => transactionTypes.add(type));
        }
    });

    return Array.from(transactionTypes);
};

/**
 * Checks if user is admin
 * @param {object} user - User object
 * @returns {boolean} True if user has admin role
 */
export const isAdmin = (user) => {
    const userRoles = getUserRoles(user);
    return userRoles.some(roleKey => {
        const role = ROLES[roleKey];
        return role && role.permissions.isAdmin;
    });
};

/**
 * Gets user's highest seniority level
 * @param {object} user - User object
 * @returns {number} Highest seniority level
 */
export const getUserSeniorityLevel = (user) => {
    const userRoles = getUserRoles(user);
    let maxSeniority = 0;

    userRoles.forEach(roleKey => {
        const role = ROLES[roleKey];
        if (role && role.seniority > maxSeniority) {
            maxSeniority = role.seniority;
        }
    });

    return maxSeniority;
};

/**
 * Gets user's departments
 * @param {object} user - User object
 * @returns {array} Array of department keys
 */
export const getUserDepartments = (user) => {
    const userRoles = getUserRoles(user);
    const departments = new Set();

    userRoles.forEach(roleKey => {
        const role = ROLES[roleKey];
        if (role && role.department) {
            departments.add(role.department);
        }
    });

    return Array.from(departments);
};
