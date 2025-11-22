import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import submitTransaction from '@salesforce/apex/MambuController.submitTransaction';

export default class MambuDepositForm extends LightningElement {
    @track accountId = '';
    @track amount = '';
    @track bookingDate = '';
    @track notes = '';

    handleAccountIdChange(event) { this.accountId = event.target.value; }
    handleAmountChange(event) { this.amount = event.target.value; }
    handleDateChange(event) { this.bookingDate = event.target.value; }
    handleNotesChange(event) { this.notes = event.target.value; }

    get isSubmitDisabled() {
        return !this.accountId || !this.amount || !this.bookingDate;
    }

    handleSubmit() {
        const payload = {
            amount: parseFloat(this.amount),
            bookingDate: this.bookingDate,
            notes: this.notes
        };

        submitTransaction({
            type: 'Deposit',
            data: JSON.stringify(payload),
            accountId: this.accountId
        })
            .then(result => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Deposit submitted for approval. Case ID: ' + result,
                        variant: 'success'
                    })
                );
                // Reset form
                this.accountId = '';
                this.amount = '';
                this.bookingDate = '';
                this.notes = '';
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
