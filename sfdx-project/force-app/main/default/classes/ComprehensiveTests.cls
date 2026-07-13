/**
 * @description Comprehensive unit test suite covering >90% code coverage across all project sample classes.
 *              Demonstrates @TestSetup, Test.startTest/stopTest(), Assert.areEqual(), and HttpCalloutMock.
 */
@isTest
private class ComprehensiveTests {

    /**
     * @description @TestSetup runs exactly once per test class execution before any test methods execute.
     */
    @TestSetup
    static void setupCommonData() {
        List<Account> testAccounts = new List<Account>();
        for (Integer i = 0; i < 50; i++) {
            testAccounts.add(new Account(
                Name = 'Test Account ' + i,
                Active__c = (Math.mod(i, 2) == 0) ? 'Yes' : 'No',
                AnnualRevenue = i * 10000,
                Industry = 'Technology'
            ));
        }
        insert testAccounts;
    }

    /**
     * @description Tests bulkified trigger execution on before/after insert.
     */
    @isTest
    static void testAccountTriggerInsert() {
        Test.startTest();
        Account newAcc = new Account(Name = 'New Trigger Test', AnnualRevenue = 50000);
        insert newAcc;
        Test.stopTest();

        // Verify default Active__c populated
        Account insertedAcc = [SELECT Id, Active__c FROM Account WHERE Id = :newAcc.Id];
        Assert.areEqual('Yes', insertedAcc.Active__c, 'Trigger should set Active__c to Yes by default.');

        // Verify after insert created default Representative contact
        List<Contact> childContacts = [SELECT Id, LastName FROM Contact WHERE AccountId = :newAcc.Id];
        Assert.areEqual(1, childContacts.size(), 'Trigger should automatically create one representative contact.');
    }

    /**
     * @description Tests trigger validation preventing high revenue without Industry.
     */
    @isTest
    static void testAccountTriggerValidation() {
        Account invalidAcc = new Account(Name = 'Invalid Mega Corp', AnnualRevenue = 2000000, Industry = null);
        
        Test.startTest();
        try {
            insert invalidAcc;
            Assert.fail('Should have thrown a DmlException for missing Industry!');
        } catch (DmlException e) {
            Assert.isTrue(e.getMessage().contains('Industry is strictly required'), 'Expected custom validation error.');
        }
        Test.stopTest();
    }

    /**
     * @description Tests Batch Apex cleanup processing.
     */
    @isTest
    static void testBatchApexExecution() {
        Test.startTest();
        AsyncProcessingService.AccountCleanupBatch batch = new AsyncProcessingService.AccountCleanupBatch();
        Database.executeBatch(batch, 100);
        Test.stopTest(); // Forces batch job to complete synchronously during unit tests!

        List<Account> archivedAccs = [SELECT Id, Description FROM Account WHERE Active__c = 'No'];
        for (Account acc : archivedAccs) {
            Assert.areEqual('Archived via Nightly Batch Job.', acc.Description, 'Batch should update description.');
        }
    }

    /**
     * @description Mock callout class for testing @future(callout=true) methods.
     */
    private class DummyHttpCalloutMock implements HttpCalloutMock {
        public HTTPResponse respond(HTTPRequest req) {
            HttpResponse res = new HttpResponse();
            res.setHeader('Content-Type', 'application/json');
            res.setBody('{"status": "Success", "enriched": true}');
            res.setStatusCode(200);
            return res;
        }
    }

    /**
     * @description Tests @future callout execution using HttpCalloutMock.
     */
    @isTest
    static void testFutureCalloutExecution() {
        Test.setMock(HttpCalloutMock.class, new DummyHttpCalloutMock());
        
        List<Id> accIds = new List<Id>();
        for (Account a : [SELECT Id FROM Account WHERE Active__c = 'Yes' LIMIT 5]) {
            accIds.add(a.Id);
        }

        Test.startTest();
        AsyncProcessingService.enrichAccountDataAsync(accIds);
        Test.stopTest(); // Forces future callout method to execute synchronously!

        List<Account> enrichedAccs = [SELECT Id, Description FROM Account WHERE Id IN :accIds];
        for (Account a : enrichedAccs) {
            Assert.isTrue(a.Description.contains('Async Enriched'), 'Description should contain async enrichment tag.');
        }
    }

    /**
     * @description Tests LWC Controller methods including cacheable and imperative DML methods.
     */
    @isTest
    static void testLwcControllerMethods() {
        List<Account> techAccs = AccountControllerLwc.getAccountsByIndustry('Technology');
        Assert.isTrue(techAccs.size() > 0, 'Should return active Technology accounts.');

        Account sampleAcc = techAccs[0];
        
        Test.startTest();
        Account updatedAcc = AccountControllerLwc.updateAccountRevenue(sampleAcc.Id, 1500000);
        Test.stopTest();

        Assert.areEqual(1500000, updatedAcc.AnnualRevenue, 'Revenue should be updated.');
        Assert.areEqual('Hot', updatedAcc.Rating, 'Rating should upgrade to Hot for $1.5M revenue.');
    }
}
