import { LightningElement, api, wire, track } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import approveTransaction from '@salesforce/apex/MambuController.approveTransaction';
import rejectTransaction from '@salesforce/apex/MambuController.rejectTransaction';

const FIELDS = [
    'Case.Mambu_Transaction_Type__c',
    'Case.Mambu_Transaction_Data__c',
    'Case.Mambu_Transaction_Status__c',
    'Case.Mambu_Response__c'
];

export default class MambuTransactionApprover extends LightningElement {
    @api recordId;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    caseRecord;

    get transactionType() {
        return getFieldValue(this.caseRecord.data, 'Case.Mambu_Transaction_Type__c');
    }

    get transactionData() {
        return getFieldValue(this.caseRecord.data, 'Case.Mambu_Transaction_Data__c');
    }

    get transactionStatus() {
        return getFieldValue(this.caseRecord.data, 'Case.Mambu_Transaction_Status__c');
    }

    get responseMessage() {
        return getFieldValue(this.caseRecord.data, 'Case.Mambu_Response__c');
    }

    get isPending() {
        return this.transactionStatus === 'Pending';
    }

    get formattedData() {
        try {
            if (this.transactionData) {
                return JSON.stringify(JSON.parse(this.transactionData), null, 4);
            }
        } catch (e) {
            return this.transactionData;
        }
        return '';
    }

    handleApprove() {
        approveTransaction({ caseId: this.recordId })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Transaction Approved and Processed.',
                        variant: 'success'
                    })
                );
                // Refresh view? Usually handled by record data service automatically updating, 
                // but we might need notifyRecordUpdateAvailable if we want instant refresh.
                // For now, simple toast.
                // We can also use getRecordNotifyChange
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

    handleReject() {
        rejectTransaction({ caseId: this.recordId })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Transaction Rejected.',
                        variant: 'success'
                    })
                );
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
