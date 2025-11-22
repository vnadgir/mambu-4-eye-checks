public with sharing class MambuController {

    /**
     * Submits a transaction for approval by creating a Case.
     * @param type The type of transaction ('Journal Entry' or 'Deposit').
     * @param data The JSON payload of the transaction.
     * @param accountId Optional Account ID for deposits.
     * @return The ID of the created Case.
     */
    @AuraEnabled
    public static Id submitTransaction(String type, String data, String accountId) {
        try {
            Case newCase = new Case();
            newCase.Subject = 'Approval Request: Mambu ' + type;
            newCase.Status = 'New';
            newCase.Origin = 'Web';
            newCase.Mambu_Transaction_Type__c = type;
            newCase.Mambu_Transaction_Data__c = data;
            newCase.Mambu_Transaction_Status__c = 'Pending';
            
            // If it's a deposit, we might want to store the account ID in the data or a separate field.
            // For now, assuming it's part of the data or handled by the checker reading the data.
            // If accountId is passed separately and needed for the URL, we should ensure it's in the data or a field.
            // Let's append it to the data JSON if it's a deposit and not present, or rely on the JSON having it.
            // Actually, for the makeDeposit call, we need the ID in the URL. 
            // Let's store it in the Description or a dedicated field if needed, 
            // but for simplicity, we'll assume the JSON data contains everything or we extract it.
            // Wait, makeDeposit takes accountId as a separate arg. We should store it.
            // Let's add it to the JSON object if not present, or just trust the JSON has it if we parse it later.
            // Better: Store it in the Description for visibility, or rely on the JSON.
            // Let's wrap the data if needed, but the requirement said "wraps the API".
            // We will assume the 'data' string contains the 'depositAccountId' if needed, or we add it.
            // Let's just save the raw data. The checker will parse it.
            
            // If accountId is provided (for deposits), let's ensure it's available. 
            // We can store it in a map in the JSON if the UI sends it separately.
            if (String.isNotBlank(accountId)) {
                // Quick hack to ensure accountId is preserved if not in the body
                // But the UI should probably send the full body expected by Mambu + the ID.
                // Let's assume the 'data' is the Body. We need to store AccountId somewhere.
                // We'll prepend it to the Description or use a delimiter in the Data? 
                // No, let's use a JSON wrapper for the stored data if we need extra metadata.
                // Or just assume the user puts it in the 'externalId' or similar? No.
                // Let's add a property to the JSON 'mambu_account_id' which we strip before sending?
                // Or just use the Description field.
                newCase.Description = 'Target Mambu Account ID: ' + accountId;
            }

            insert newCase;
            return newCase.Id;
        } catch (Exception e) {
            throw new AuraHandledException('Error submitting transaction: ' + e.getMessage());
        }
    }

    /**
     * Approves the transaction and executes the Mambu API call.
     * @param caseId The ID of the Case to approve.
     */
    @AuraEnabled
    public static void approveTransaction(Id caseId) {
        Case c = [SELECT Id, Mambu_Transaction_Type__c, Mambu_Transaction_Data__c, Description, Mambu_Transaction_Status__c FROM Case WHERE Id = :caseId LIMIT 1];
        
        if (c.Mambu_Transaction_Status__c == 'Processed') {
            throw new AuraHandledException('Transaction already processed.');
        }

        try {
            String response;
            if (c.Mambu_Transaction_Type__c == 'Journal Entry') {
                response = MambuService.createJournalEntry(c.Mambu_Transaction_Data__c);
            } else if (c.Mambu_Transaction_Type__c == 'Deposit') {
                // Extract Account ID from Description or Data
                // Implementation detail: We stored "Target Mambu Account ID: ..." in Description
                String accountId = '';
                if (c.Description != null && c.Description.startsWith('Target Mambu Account ID: ')) {
                    accountId = c.Description.substringAfter('Target Mambu Account ID: ').trim();
                }
                
                if (String.isBlank(accountId)) {
                     throw new AuraHandledException('Deposit Account ID not found in Case Description.');
                }
                
                response = MambuService.makeDeposit(accountId, c.Mambu_Transaction_Data__c);
            }

            c.Mambu_Transaction_Status__c = 'Processed';
            c.Status = 'Closed';
            c.Mambu_Response__c = response;
            update c;

        } catch (Exception e) {
            c.Mambu_Transaction_Status__c = 'Error';
            c.Mambu_Response__c = e.getMessage();
            update c;
            throw new AuraHandledException('Error processing transaction: ' + e.getMessage());
        }
    }

    /**
     * Rejects the transaction.
     * @param caseId The ID of the Case to reject.
     */
    @AuraEnabled
    public static void rejectTransaction(Id caseId) {
        try {
            Case c = [SELECT Id FROM Case WHERE Id = :caseId LIMIT 1];
            c.Mambu_Transaction_Status__c = 'Rejected';
            c.Status = 'Closed'; // Or some other status
            update c;
        } catch (Exception e) {
            throw new AuraHandledException('Error rejecting transaction: ' + e.getMessage());
        }
    }
}
