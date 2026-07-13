# Domain 5: Testing, Debugging, and Deployment (Exam Weighting: ~17%)

---

## 1. Apex Unit Testing Fundamentals (`@isTest`)
Salesforce enforces a strict quality gate: before any Apex code (`.cls` or `.trigger`) can be deployed to a **Production** environment, you must meet two non-negotiable requirements:
1. **At least 75% overall code coverage** across all custom Apex code in the org.
2. Every single unit test method must execute and pass without throwing unhandled exceptions or failing assertions (`Assert.areEqual`).

### Anatomy of an Apex Test Class
- Annotated with `@isTest` (or `@isTest(SeeAllData=false)` by default).
- Test methods must be `@isTest static void myTestMethod()`.
- Test classes have **access to NO existing org data** by default (`SeeAllData=false`). All test data must be created from scratch inside the test or loaded via static resources (`Test.loadData()`).

```apex
@isTest
private class AccountTriggerTest {

    // @TestSetup methods run once before any test methods in the class execute!
    @TestSetup
    static void setupTestData() {
        List<Account> testAccs = new List<Account>();
        for (Integer i = 0; i < 200; i++) {
            testAccs.add(new Account(Name = 'Test Account ' + i, Active__c = 'Yes'));
        }
        insert testAccs;
    }

    @isTest
    static void testBulkAccountUpdate() {
        // Query the data created in @TestSetup
        List<Account> accountsToUpdate = [SELECT Id, AnnualRevenue FROM Account];
        for (Account acc : accountsToUpdate) {
            acc.AnnualRevenue = 100000;
        }

        // Test.startTest() gives a fresh set of governor limits!
        Test.startTest();
        update accountsToUpdate;
        Test.stopTest(); // Forces any asynchronous code (@future, Queueable) to finish synchronously!

        // Assert our expected outcomes
        List<Account> updatedAccounts = [SELECT Id, AnnualRevenue FROM Account WHERE AnnualRevenue = 100000];
        Assert.areEqual(200, updatedAccounts.size(), 'All 200 accounts should have updated revenue.');
    }
}
```

---

## 2. Key Testing Utilities Table

| Utility / Annotation | Purpose | Key Exam Rules |
| :--- | :--- | :--- |
| **`Test.startTest()` / `Test.stopTest()`** | Resets governor limits for the execution block inside `startTest/stopTest`, and forces asynchronous jobs (`@future`, `Queueable`, `Batchable`) to complete synchronously when `stopTest()` is called. | Can only be called **once per test method**! |
| **`@TestSetup`** | Method runs once before any individual test method in the class starts, generating common test records in the rollback sandbox. | Modifying `@TestSetup` records inside one test method does **not** affect other test methods (changes are rolled back after each test). |
| **`System.runAs(User u)`** | Executes the enclosed block of code as a specific test User record. | Used to test **Profile permissions, Role hierarchies, and Record Sharing rules** (`with sharing`). Does not enforce user license limits. |
| **`Test.setMock(HttpCalloutMock.class, mock)`** | Intercepts HTTP/REST callouts made from Apex during a unit test and returns fake canned HTTP responses (`HttpResponse`). | **Mandatory for callout testing!** Salesforce blocks real HTTP callouts to external servers during unit tests (`CalloutException`). |
| **`Test.loadData(Account.sObjectType, 'StaticResourceName')`** | Loads CSV data pre-uploaded as a Static Resource directly into test sObjects. | Returns a `List<sObject>` of inserted records. |

---

## 3. Debugging: Logs, Log Levels, and Checkpoints
When troubleshooting Apex logic or checking governor limit consumption, developers use the **Developer Console** and **Debug Logs**.

### System.debug() & Log Levels
You can inject diagnostic messages using `System.debug(LoggingLevel.INFO, 'My Message')`.
The available Logging Levels (ordered from lowest verbosity to highest) are:
1. `NONE`
2. `ERROR`
3. `WARN`
4. `INFO` *(Default when calling `System.debug('msg')` without specifying level)*
5. `DEBUG`
6. `FINE`
7. `FINER`
8. `FINEST`

### Checkpoints
- Can be set in the Developer Console on specific lines of Apex code.
- Unlike traditional IDE breakpoints that freeze live server execution, **Salesforce checkpoints do NOT pause code execution**. Instead, when execution hits a checkpoint, it captures a detailed snapshot of the exact heap memory, local variables, and sObject states for later inspection in the Developer Console Checkpoint tab!

---

## 4. Deployment Lifecycle & Environments

### Sandboxes vs. Production
Salesforce provides four distinct sandbox types for development and testing:

| Sandbox Type | Storage Limit | Refresh Interval | Data Copied from Production? | Ideal Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **Developer Sandbox** | 200 MB | 1 day | **Metadata Only** (No records copied). | Individual developer coding, unit tests, initial feature build. |
| **Developer Pro Sandbox** | 1 GB | 1 day | **Metadata Only** (More storage for test datasets). | Integration testing, larger data loading practice. |
| **Partial Copy Sandbox** | 5 GB | 5 days | Metadata + **Sample of data records** (defined via Sandbox Template). | User Acceptance Testing (UAT), QA testing with real-world relationships. |
| **Full Sandbox** | Same as Production | 29 days | Metadata + **100% of all Production data records**. | Performance/Load testing, staging sign-off immediately prior to prod deploy. |

### Deployment Tools Comparison
1. **Salesforce CLI (`sf` / `sfdx`) & Source Tracking:**
   - Modern metadata deployment using source-driven development (`force-app/main/default/`).
   - Supports Scratch Orgs (short-lived ephemeral orgs created from a Dev Hub) and continuous integration (CI/CD) pipelines (`sf project deploy start`).
2. **Change Sets:**
   - Point-and-click deployment tool inside Salesforce Setup.
   - Requires an active deployment connection between connected orgs (e.g., Sandbox -> Production).
   - **Cannot delete or rename metadata components!** (To delete a field or class via deployment, you must use `destructiveChanges.xml` via SFDX/Metadata API).
3. **Unmanaged vs. Managed Packages:**
   - **Unmanaged Packages:** Open-source bundles where code is visible and editable by the target org admin upon installation. Upgrades are NOT supported.
   - **Managed Packages:** IP-protected, obfuscated code bundles distributed via AppExchange by ISVs. Namespaced (`ns__Object__c`) and fully upgradable without breaking subscriber data.

---

## 5. Notes & Summer '26 (API v67.0) Release Updates (PD1 Syllabus Alignment)

### Syllabus Alignment Note (Domain Weighting: ~20% - 22%)
**Testing, Debugging, and Deployment** accounts for roughly a fifth of your exam (~13 questions). You must know the exact rules around `@isTest`, `@TestSetup`, `Test.startTest() / Test.stopTest()`, the mandatory **75% code coverage threshold** for production deployments, and differences between Salesforce CLI (`sf`) and Change Sets.

### Summer '26 (API v67.0) Key Updates for Domain 5:
1. **Structured Log Filtering in VS Code & Developer Console:**
   - Summer '26 introduces structured log filtering directly into the Salesforce VS Code Extension Pack and Developer Console.
   - You can filter log output by category (`APEX_CODE`, `VALIDATION`, `DB`) and severity (`ERROR`, `DEBUG`) without parsing massive RAW debug text files.
2. **Enhanced Exception Stack Traces in Unit Tests:**
   - When a test fails or throws an unhandled exception during `Test.stopTest()` execution, Summer '26 formats stack traces with clean method isolation and clear indicators for trigger context hops (`V-T-V-A-W-P-E`).
3. **Unified Salesforce CLI (`sf`) Standards:**
   - Modern deployment questions focus on unified `sf` commands (e.g., `sf project deploy start`, `sf apex run test`) over legacy `sfdx` commands.
   - Remember that `sf project deploy start` supports `destructiveChanges.xml` for deleting metadata components, which is **NOT possible** via standard point-and-click Change Sets.

