/**
 * Service to manage the active user session.
 * This simulates a server-side session store.
 * In a real application, this would handle JWT tokens or session cookies.
 */

let currentUser = null;

export const sessionService = {
    /**
     * Logs in a user and creates a session
     * @param {object} user - User object
     */
    login: (user) => {
        if (!user) {
            throw new Error('Invalid user');
        }
        currentUser = { ...user };
        // Persist to sessionStorage to survive refreshes (simulating session cookie)
        sessionStorage.setItem('mambu_session_user', JSON.stringify(currentUser));
    },

    /**
     * Logs out the current user and destroys the session
     */
    logout: () => {
        currentUser = null;
        sessionStorage.removeItem('mambu_session_user');
    },

    /**
     * Gets the currently authenticated user
     * @returns {object|null} User object or null if not logged in
     */
    getCurrentUser: () => {
        if (!currentUser) {
            // Try to restore from session storage
            const stored = sessionStorage.getItem('mambu_session_user');
            if (stored) {
                currentUser = JSON.parse(stored);
            }
        }
        // Return a copy to prevent mutation of the session object
        return currentUser ? { ...currentUser } : null;
    },

    /**
     * Checks if a user is currently logged in
     * @returns {boolean} True if logged in
     */
    isAuthenticated: () => {
        return !!sessionService.getCurrentUser();
    }
};
