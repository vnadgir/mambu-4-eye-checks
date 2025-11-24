
import { saveTransaction, getTransactionById } from './services/mockDatabase.js';
import { workflowService } from './services/workflowService.js';

// Mock localStorage
global.localStorage = {
    store: {},
    getItem: function (key) { return this.store[key] || null; },
    setItem: function (key, value) { this.store[key] = value; },
    removeItem: function (key) { delete this.store[key]; }
};

// Mock crypto.randomUUID - Node.js has global crypto now, so we might not need this.
// If we do need to mock it, we should use Object.defineProperty or just rely on the built-in one.
// For now, let's assume Node environment has it.


console.log('--- Starting Reproduction Test ---');

// 1. Create a transaction
const user = { email: 'maker@example.com', roles: ['MAKER'] };
// We need a transaction type that has a workflow. 
// Assuming JOURNAL_ENTRY has a workflow.
const approver = { email: 'checker@example.com', roles: ['ACCOUNTING_MANAGER'], username: 'Checker' };

try {
    const txn = saveTransaction('JOURNAL_ENTRY', { amount: 100, accountId: '123' }, user.email);
    console.log('Transaction created:', txn.id, txn.status);

    // 2. Process approval (simulating ApprovalDashboard)
    // This is where the bug is: ApprovalDashboard calls processApproval but doesn't save back to DB
    // processApproval modifies the txn object in place
    const updatedTxnInMemory = workflowService.approveTransaction(txn.id, approver, 'APPROVE', 'Looks good');
    console.log('Transaction approved in memory:', updatedTxnInMemory.status);

    // 3. Check database
    // getTransactionById reads from localStorage
    const txnInDb = getTransactionById(txn.id);
    console.log('Transaction in DB:', txnInDb.status);

    // 4. Assert
    if (txnInDb.status === updatedTxnInMemory.status && txnInDb.status !== 'PENDING_APPROVAL') {
        // Note: The status might be different depending on workflow config, but it should change from initial state
        // If it's still the initial state (and different from updated), it failed.
        console.log('SUCCESS: Database was updated.');
    } else if (txnInDb.status !== updatedTxnInMemory.status) {
        console.error('FAILURE: Database was NOT updated!');
        console.error(`Expected ${updatedTxnInMemory.status}, got ${txnInDb.status}`);
        process.exit(1);
    } else {
        console.log('Ambiguous result, but likely failed if status didn\'t change.');
    }

} catch (e) {
    console.error('Error running test:', e);
    process.exit(1);
}
