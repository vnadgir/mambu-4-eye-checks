import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import submitTransaction from '@salesforce/apex/MambuController.submitTransaction';

export default class MambuJournalEntryForm extends LightningElement {
    @track branchId = '';
    @track entryDate = '';
    @track notes = '';
    @track debits = [{ id: 0, glAccount: '', amount: '' }];
    @track credits = [{ id: 0, glAccount: '', amount: '' }];
    
    nextId = 1;

    handleBranchIdChange(event) { this.branchId = event.target.value; }
    handleDateChange(event) { this.entryDate = event.target.value; }
    handleNotesChange(event) { this.notes = event.target.value; }

    handleAddDebit() {
        this.debits.push({ id: this.nextId++, glAccount: '', amount: '' });
    }

    handleAddCredit() {
        this.credits.push({ id: this.nextId++, glAccount: '', amount: '' });
    }

    handleDeleteItem(event) {
        const index = event.target.dataset.index;
        const type = event.target.dataset.type;
        if (type === 'debit') {
            this.debits.splice(index, 1);
        } else {
            this.credits.splice(index, 1);
        }
    }

    handleItemChange(event) {
        const index = event.target.dataset.index;
        const type = event.target.dataset.type;
        const field = event.target.dataset.field;
        const value = event.target.value;

        if (type === 'debit') {
            this.debits[index][field] = value;
        } else {
            this.credits[index][field] = value;
        }
    }

    get isSubmitDisabled() {
        return !this.branchId || !this.entryDate || this.debits.length === 0 || this.credits.length === 0;
    }

    handleSubmit() {
        // Construct Payload
        const payload = {
            branchId: this.branchId,
            date: this.entryDate,
            notes: this.notes,
            debits: this.debits.map(d => ({ glAccount: d.glAccount, amount: parseFloat(d.amount) })),
            credits: this.credits.map(c => ({ glAccount: c.glAccount, amount: parseFloat(c.amount) }))
        };

        submitTransaction({ 
            type: 'Journal Entry', 
            data: JSON.stringify(payload), 
            accountId: null 
        })
        .then(result => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Journal Entry submitted for approval. Case ID: ' + result,
                    variant: 'success'
                })
            );
            // Reset form
            this.branchId = '';
            this.entryDate = '';
            this.notes = '';
            this.debits = [{ id: 0, glAccount: '', amount: '' }];
            this.credits = [{ id: 0, glAccount: '', amount: '' }];
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });
    }
}
