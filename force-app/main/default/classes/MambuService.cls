public with sharing class MambuService {
    
    private static final String NAMED_CREDENTIAL = 'callout:MambuAPI';
    
    public class MambuException extends Exception {}

    /**
     * Creates a Journal Entry in Mambu.
     * @param jsonBody The JSON payload for the journal entry.
     * @return The response body from Mambu.
     */
    public static String createJournalEntry(String jsonBody) {
        HttpRequest req = new HttpRequest();
        req.setEndpoint(NAMED_CREDENTIAL + '/gljournalentries');
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/json');
        req.setHeader('Accept', 'application/vnd.mambu.v2+json');
        // Idempotency key could be added here if needed
        req.setBody(jsonBody);

        Http http = new Http();
        HttpResponse res = http.send(req);

        if (res.getStatusCode() >= 200 && res.getStatusCode() < 300) {
            return res.getBody();
        } else {
            throw new MambuException('Error creating Journal Entry: ' + res.getStatus() + ' ' + res.getBody());
        }
    }

    /**
     * Makes a Deposit Transaction in Mambu.
     * @param accountId The Mambu Deposit Account ID.
     * @param jsonBody The JSON payload for the deposit transaction.
     * @return The response body from Mambu.
     */
    public static String makeDeposit(String accountId, String jsonBody) {
        HttpRequest req = new HttpRequest();
        // Construct endpoint with accountId
        req.setEndpoint(NAMED_CREDENTIAL + '/deposits/' + accountId + '/deposit-transactions');
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/json');
        req.setHeader('Accept', 'application/vnd.mambu.v2+json');
        req.setBody(jsonBody);

        Http http = new Http();
        HttpResponse res = http.send(req);

        if (res.getStatusCode() >= 200 && res.getStatusCode() < 300) {
            return res.getBody();
        } else {
            throw new MambuException('Error making Deposit: ' + res.getStatus() + ' ' + res.getBody());
        }
    }

    /**
     * Fetches all transaction channels from Mambu.
     * @return The response body containing the list of transaction channels.
     */
    public static String getTransactionChannels() {
        HttpRequest req = new HttpRequest();
        req.setEndpoint(NAMED_CREDENTIAL + '/organization/transactionchannels');
        req.setMethod('GET');
        req.setHeader('Accept', 'application/vnd.mambu.v2+json');

        Http http = new Http();
        HttpResponse res = http.send(req);

        if (res.getStatusCode() >= 200 && res.getStatusCode() < 300) {
            return res.getBody();
        } else {
            throw new MambuException('Error fetching Transaction Channels: ' + res.getStatus() + ' ' + res.getBody());
        }
    }
}
