/**
 * @description Demonstrates high-yield SOQL, SOSL, and DML exam concepts:
 *              1. Relationship Queries (Parent-to-Child & Child-to-Parent)
 *              2. Dynamic SOQL & SOQL Injection Prevention
 *              3. Partial DML Processing with Database.insert(records, allOrNone=false)
 *              4. Transaction Control using Savepoint and Rollback
 */
public with sharing class SoqlAndDmlBestPractices {

    /**
     * @description Demonstrates parent-to-child subquery and child-to-parent lookup traversal.
     */
    public static void executeRelationshipQueries() {
        // 1. Parent-to-Child Subquery (Notice plural 'Contacts' for standard child relationship name)
        List<Account> accountsWithContacts = [
            SELECT Id, Name, AnnualRevenue,
                (SELECT Id, FirstName, LastName, Email FROM Contacts WHERE DoNotCall = false)
            FROM Account
            WHERE Active__c = 'Yes'
            LIMIT 50
        ];

        for (Account acc : accountsWithContacts) {
            System.debug(LoggingLevel.INFO, 'Parent Account: ' + acc.Name + ' has ' + acc.Contacts.size() + ' contacts.');
        }

        // 2. Child-to-Parent Lookup Traversal (Dot notation up to 5 levels deep in SOQL)
        List<Contact> contactsWithAccountInfo = [
            SELECT Id, LastName, Account.Name, Account.Owner.Email
            FROM Contact
            WHERE AccountId != null
            LIMIT 50
        ];
    }

    /**
     * @description Demonstrates Dynamic SOQL and how to prevent SOQL Injection.
     */
    public static List<Account> searchAccountsDynamically(String userInputName, Decimal minRevenue) {
        // Always sanitize user input with String.escapeSingleQuotes() when concatenating into SOQL strings!
        String sanitizedInput = String.escapeSingleQuotes(userInputName);
        
        String queryString = 'SELECT Id, Name, AnnualRevenue FROM Account ' +
                             'WHERE Name LIKE \'%' + sanitizedInput + '%\' ' +
                             'AND AnnualRevenue >= :minRevenue LIMIT 100';
                             
        return (List<Account>)Database.query(queryString);
    }

    /**
     * @description Demonstrates partial processing with Database.insert(records, false).
     */
    public static void processPartialDml(List<Account> accountsToInsert) {
        // Setting allOrNone = false allows valid records to succeed even if some fail validation
        Database.SaveResult[] saveResults = Database.insert(accountsToInsert, false);

        for (Integer i = 0; i < saveResults.size(); i++) {
            Database.SaveResult sr = saveResults[i];
            if (sr.isSuccess()) {
                System.debug(LoggingLevel.INFO, 'Success inserting record ID: ' + sr.getId());
            } else {
                for (Database.Error err : sr.getErrors()) {
                    System.debug(LoggingLevel.ERROR, 'Failed record index ' + i + ': ' +
                        err.getStatusCode() + ' - ' + err.getMessage() + ' on fields: ' + err.getFields());
                }
            }
        }
    }

    /**
     * @description Demonstrates transactional integrity using Savepoints.
     */
    public static Boolean executeWithSavepointAndRollback(Account mainAccount, List<Contact> childContacts) {
        // Establish a Savepoint before performing multiple dependent DML operations
        Savepoint sp = Database.setSavepoint();

        try {
            insert mainAccount;

            for (Contact c : childContacts) {
                c.AccountId = mainAccount.Id;
            }
            insert childContacts;

            return true;
        } catch (Exception e) {
            // Roll back the entire transaction (including mainAccount insertion) if anything fails!
            Database.rollback(sp);
            System.debug(LoggingLevel.ERROR, 'Transaction rolled back due to exception: ' + e.getMessage());
            return false;
        }
    }
}
