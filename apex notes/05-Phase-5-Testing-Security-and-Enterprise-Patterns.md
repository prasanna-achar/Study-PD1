# 🟣 Phase 5: Testing, Security & Enterprise Patterns

*Making code secure, resilient, and ready for production deployment.*

## 1. Unit Testing Fundamentals (`@isTest`)
Salesforce requires that at least 75% of your Apex code is covered by unit tests before it can be deployed to production. (Best practice is to aim for 90%+).

### The Purpose of Testing
*   Verify logic works as expected (positive testing).
*   Verify logic handles errors gracefully (negative testing).
*   Ensure code handles bulk data properly (bulk testing).
*   Ensure users only see/edit what they are permitted to (security testing).

### Test Isolation
By default, unit tests do **not** have access to data in the production/sandbox environment (except for setup objects like Profiles, Users, and RecordTypes). You must create all necessary test data within the test itself.

```apex
@isTest
private class AccountTriggerTest {
    @isTest
    static void testAccountInsert() {
        // 1. Setup Test Data
        Account testAcc = new Account(Name = 'Test Data');
        
        // 2. Execute Code
        Test.startTest();
        insert testAcc; // This fires the Account trigger
        Test.stopTest();
        
        // 3. Assert Results
        Account insertedAcc = [SELECT Id, Description FROM Account WHERE Id = :testAcc.Id];
        System.assertEquals('Default Description', insertedAcc.Description, 'Description was not set properly');
    }
}
```

## 2. Test Structure & Lifecycle

### `Test.startTest()` and `Test.stopTest()`
These two methods mark the beginning and end of the actual code you are testing.
*   **Crucial Function:** `Test.startTest()` gives you a fresh set of governor limits. This is vital when your setup code consumes a lot of limits (e.g., DML to create records), leaving you with a clean slate to test the actual logic.
*   **Asynchronous Code:** Any asynchronous code (like `@future`, Batch, or Queueable) queued inside `startTest()`/`stopTest()` will be executed synchronously the moment `Test.stopTest()` is called. This allows you to query the results and assert them immediately.

### Assertions
Always verify the outcome of your code.
*   `System.assertEquals(expected, actual, 'Optional error message')`
*   `System.assertNotEquals(expected, actual)`
*   `System.assert(condition, 'Error message')`

## 3. Test Data Generation

### `@TestSetup` Methods
If you have a test class with multiple test methods that all need the same base data (e.g., 5 Accounts and 10 Contacts), use a `@testSetup` method. It runs once before any tests execute, and the data is available to all test methods, dramatically reducing test execution time.

```apex
@isTest
private class MyLogicTest {
    
    @testSetup
    static void setupData() {
        List<Account> testAccounts = new List<Account>();
        for (Integer i = 0; i < 5; i++) {
            testAccounts.add(new Account(Name = 'Test ' + i));
        }
        insert testAccounts;
    }
    
    @isTest
    static void myTest1() {
        // Data created in @testSetup is available here
        List<Account> accs = [SELECT Id FROM Account];
        System.assertEquals(5, accs.size());
    }
}
```

### Mocking Callouts
Since unit tests cannot make real outbound HTTP requests, you must "mock" the response.
Create a class that implements `HttpCalloutMock` and define what the fake response should look like. Then, in your test, instruct the system to use your mock.

```apex
Test.setMock(HttpCalloutMock.class, new MyCustomCalloutMock());
```

## 4. Apex Security & Enforcement

By default, Apex runs in **System Mode**, meaning it ignores user permissions (Object, Field-Level Security, and Record Sharing). As a developer, you must explicitly enforce security.

### Enforcing Record Sharing
Use the `with sharing` keyword on your classes. This enforces the sharing rules of the user currently executing the code (they will only see records they own or are shared with them).
```apex
public with sharing class SecureDataController { ... }
```

### Enforcing Object and Field-Level Security (FLS)
Even with `with sharing`, Apex can still update fields the user shouldn't see.

**Modern Approach (User Mode for SOQL/DML):**
Use `WITH USER_MODE` in SOQL, or `as user` in database operations.
```apex
// Enforces that the user has read access to the Account object and the Name field.
List<Account> accs = [SELECT Id, Name FROM Account WITH USER_MODE];

// Enforces that the user has create access to Account and edit access to Name.
Database.insert(newAccount, false, AccessLevel.USER_MODE);
```

**Traditional Approach (Security.stripInaccessible):**
Strips out fields from records that the user doesn't have permission to view or modify.
```apex
SObjectAccessDecision decision = Security.stripInaccessible(AccessType.CREATABLE, newAccounts);
insert decision.getRecords();
```

### Preventing SOQL Injection
Always use **bind variables** (`:myVar`) when constructing dynamic SOQL queries. If you must concatenate strings, sanitize the input using `String.escapeSingleQuotes()`.

**Vulnerable:**
```apex
String q = 'SELECT Id FROM Contact WHERE FirstName = \'' + userInput + '\'';
```
*(If `userInput` is `test' OR Name != '`, they can access all contacts!)*

**Secure:**
```apex
// Approach 1: Bind Variables (Best)
String q = 'SELECT Id FROM Contact WHERE FirstName = :userInput';

// Approach 2: Escaping
String sanitizedInput = String.escapeSingleQuotes(userInput);
String q2 = 'SELECT Id FROM Contact WHERE FirstName = \'' + sanitizedInput + '\'';
```
