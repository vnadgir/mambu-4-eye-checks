@isTest
private class MambuServiceTest {

    private class MockHttpResponseGenerator implements HttpCalloutMock {
        private Integer statusCode;
        private String body;

        public MockHttpResponseGenerator(Integer statusCode, String body) {
            this.statusCode = statusCode;
            this.body = body;
        }

        public HTTPResponse respond(HTTPRequest req) {
            HttpResponse res = new HttpResponse();
            res.setHeader('Content-Type', 'application/json');
            res.setBody(body);
            res.setStatusCode(statusCode);
            return res;
        }
    }

    @isTest
    static void testCreateJournalEntry() {
        Test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator(201, '{"encodedKey": "123"}'));
        
        Test.startTest();
        String res = MambuService.createJournalEntry('{"test": "data"}');
        Test.stopTest();
        
        System.assertEquals('{"encodedKey": "123"}', res);
    }

    @isTest
    static void testMakeDeposit() {
        Test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator(201, '{"encodedKey": "456"}'));
        
        Test.startTest();
        String res = MambuService.makeDeposit('acc123', '{"amount": 100}');
        Test.stopTest();
        
        System.assertEquals('{"encodedKey": "456"}', res);
    }

    @isTest
    static void testSubmitTransaction() {
        Test.startTest();
        Id caseId = MambuController.submitTransaction('Journal Entry', '{"data": "test"}', null);
        Test.stopTest();

        Case c = [SELECT Mambu_Transaction_Type__c, Mambu_Transaction_Data__c FROM Case WHERE Id = :caseId];
        System.assertEquals('Journal Entry', c.Mambu_Transaction_Type__c);
        System.assertEquals('{"data": "test"}', c.Mambu_Transaction_Data__c);
    }

    @isTest
    static void testApproveTransaction_JournalEntry() {
        // Create Case
        Id caseId = MambuController.submitTransaction('Journal Entry', '{"data": "test"}', null);

        Test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator(201, '{"success": true}'));
        
        Test.startTest();
        MambuController.approveTransaction(caseId);
        Test.stopTest();

        Case c = [SELECT Mambu_Transaction_Status__c, Mambu_Response__c FROM Case WHERE Id = :caseId];
        System.assertEquals('Processed', c.Mambu_Transaction_Status__c);
        System.assertEquals('{"success": true}', c.Mambu_Response__c);
    }

    @isTest
    static void testApproveTransaction_Deposit() {
        // Create Case with Account ID
        Id caseId = MambuController.submitTransaction('Deposit', '{"amount": 100}', 'acc999');

        Test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator(201, '{"success": true}'));
        
        Test.startTest();
        MambuController.approveTransaction(caseId);
        Test.stopTest();

        Case c = [SELECT Mambu_Transaction_Status__c, Mambu_Response__c FROM Case WHERE Id = :caseId];
        System.assertEquals('Processed', c.Mambu_Transaction_Status__c);
        System.assertEquals('{"success": true}', c.Mambu_Response__c);
    }

    @isTest
    static void testRejectTransaction() {
        Id caseId = MambuController.submitTransaction('Journal Entry', '{"data": "test"}', null);
        
        Test.startTest();
        MambuController.rejectTransaction(caseId);
        Test.stopTest();

        Case c = [SELECT Mambu_Transaction_Status__c FROM Case WHERE Id = :caseId];
        System.assertEquals('Rejected', c.Mambu_Transaction_Status__c);
    }
}
