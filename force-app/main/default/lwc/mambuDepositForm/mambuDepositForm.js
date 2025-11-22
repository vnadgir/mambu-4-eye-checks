import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import submitTransaction from '@salesforce/apex/MambuController.submitTransaction';
import getTransactionChannels from '@salesforce/apex/MambuController.getTransactionChannels';

export default class MambuDepositForm extends LightningElement {
    @track accountId = '';
    @track amount = '';
    @track bookingDate = '';
    @track bookingDate = '';
    @track notes = '';
    @track transactionChannels = [];
    @track selectedChannelId = '';

    connectedCallback() {
        this.fetchTransactionChannels();
    }

    fetchTransactionChannels() {
        getTransactionChannels()
            .then(result => {
                const channels = JSON.parse(result);
                this.transactionChannels = channels.map(channel => ({
                    label: channel.name,
                    value: channel.encodedKey
                }));
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error loading channels',
                        message: error.body ? error.body.message : error.message,
                        variant: 'error'
                    })
                );
            });
    }

    handleAccountIdChange(event) { this.accountId = event.target.value; }
    handleAmountChange(event) { this.amount = event.target.value; }
    handleDateChange(event) { this.bookingDate = event.target.value; }
    handleNotesChange(event) { this.notes = event.target.value; }
    handleChannelChange(event) { this.selectedChannelId = event.target.value; }

    get isSubmitDisabled() {
        return !this.accountId || !this.amount || !this.bookingDate || !this.selectedChannelId;
    }

    handleSubmit() {
        const payload = {
            amount: parseFloat(this.amount),
            bookingDate: this.bookingDate,
            notes: this.notes,
            transactionDetails: {
                transactionChannelId: this.selectedChannelId
            }
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
                this.selectedChannelId = '';
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
