# Deployment Instructions

This project contains Salesforce metadata for the Mambu 4-Eyes Check integration.

## Prerequisites

1.  **Salesforce CLI**: Ensure you have the [Salesforce CLI](https://developer.salesforce.com/tools/sfdxcli) installed.
2.  **Named Credential**: You must create a Named Credential in your target Salesforce org with the name `MambuAPI`.
    *   **Name**: `MambuAPI`
    *   **URL**: Your Mambu API base URL (e.g., `https://yourtenant.mambu.com/api`)
    *   **Identity Type**: Named Principal
    *   **Authentication Protocol**: Password Authentication (or as required by your Mambu setup)
    *   **Username/Password**: Your Mambu API credentials.

## Deployment Steps

### Option 1: Using Salesforce CLI (Recommended)

1.  **Authorize your Sandbox**:
    ```bash
    sf org login web --alias my-sandbox --instance-url https://test.salesforce.com
    ```

2.  **Deploy the Source**:
    Run the following command from the root of this project:
    ```bash
    sf project deploy start --target-org my-sandbox
    ```
    
    Or using the older `sfdx` command:
    ```bash
    sfdx force:source:deploy -p force-app -u my-sandbox
    ```

### Option 2: Using Metadata API (Workbench / Ant)

If you cannot use the CLI, you can deploy using the `manifest/package.xml` file.

1.  **Zip the files**:
    Zip the `force-app` directory contents or use a tool that accepts the source format. 
    *Note: Standard Metadata API deployments usually require converting source format to metadata format first.*
    
    To convert to metadata format (if needed for Ant/Workbench):
    ```bash
    sf project convert source --output-dir mdapi_output --manifest manifest/package.xml
    ```
    Then deploy the `mdapi_output` directory.

## Included Metadata

*   **Apex Classes**: `MambuController`, `MambuService`, `MambuServiceTest`
*   **LWC**: `mambuDepositForm`, `mambuJournalEntryForm`, `mambuTransactionApprover`
*   **Custom Application**: `Mambu_Finance`
*   **Custom Fields on Case**:
    *   `Mambu_Transaction_Type__c`
    *   `Mambu_Transaction_Data__c`
    *   `Mambu_Transaction_Status__c`
    *   `Mambu_Response__c`
