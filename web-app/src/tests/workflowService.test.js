/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { workflowService } from '../services/workflowService';
import { saveTransaction, getTransactionById, clearAllTransactions } from '../services/mockDatabase';

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString(); },
        removeItem: (key) => { delete store[key]; },
        clear: () => { store = {}; }
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

// Mock crypto.randomUUID if not available in test environment
if (!global.crypto) {
    global.crypto = {
        randomUUID: () => 'test-uuid-' + Math.random()
    };
}

describe('workflowService', () => {
    beforeEach(() => {
        localStorageMock.clear();
        clearAllTransactions();
    });

    it('should approve a transaction and persist changes to the database', () => {
        const maker = { email: 'maker@example.com', roles: ['MAKER'] };
        const checker = { email: 'checker@example.com', roles: ['ACCOUNTING_MANAGER'], username: 'Checker' };

        // Create a transaction that requires approval
        // JOURNAL_ENTRY < 50000 requires ACCOUNTING_MANAGER
        const txn = saveTransaction('JOURNAL_ENTRY', { amount: 1000, accountId: '123' }, maker.email);

        expect(txn.status).toBe('PENDING_MANAGER_APPROVAL');

        // Approve via service
        const updatedTxn = workflowService.approveTransaction(txn.id, checker, 'APPROVE', 'Approved via test');

        // Verify return value
        expect(updatedTxn.status).toBe('APPROVED');

        // Verify persistence
        const txnInDb = getTransactionById(txn.id);
        expect(txnInDb.status).toBe('APPROVED');
        expect(txnInDb.history).toHaveLength(2); // SUBMITTED + APPROVED
        expect(txnInDb.history[1].action).toBe('APPROVED_MANAGER_APPROVAL');
    });

    it('should reject a transaction and persist changes', () => {
        const maker = { email: 'maker@example.com', roles: ['MAKER'] };
        const checker = { email: 'checker@example.com', roles: ['ACCOUNTING_MANAGER'], username: 'Checker' };

        const txn = saveTransaction('JOURNAL_ENTRY', { amount: 1000 }, maker.email);

        const updatedTxn = workflowService.approveTransaction(txn.id, checker, 'REJECT', 'Rejected via test');

        expect(updatedTxn.status).toBe('REJECTED');

        const txnInDb = getTransactionById(txn.id);
        expect(txnInDb.status).toBe('REJECTED');
    });

    it('should throw error if transaction not found', () => {
        const checker = { email: 'checker@example.com', roles: ['CHECKER'] };

        expect(() => {
            workflowService.approveTransaction('non-existent-id', checker, 'APPROVE');
        }).toThrow('Transaction not found');
    });

    it('should throw error if user not authorized', () => {
        const maker = { email: 'maker@example.com', roles: ['MAKER'] };
        const unauthorizedUser = { email: 'random@example.com', roles: ['GUEST'] };

        const txn = saveTransaction('JOURNAL_ENTRY', { amount: 1000 }, maker.email);

        expect(() => {
            workflowService.approveTransaction(txn.id, unauthorizedUser, 'APPROVE');
        }).toThrow('User not authorized');
    });
});
