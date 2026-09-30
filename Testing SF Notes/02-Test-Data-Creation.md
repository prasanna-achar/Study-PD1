# 02 — Test Data Creation

---

## `@testSetup` Methods

A special method that runs **once** before all test methods in the class. It creates a shared baseline of test data.

```apex
@isTest
private class ContactServiceTest {

    @testSetup
    static void setupData() {
        Account acc = new Account(Name = 'Test Corp');
        insert acc;

        List<Contact> contacts = new List<Contact>();
        for (Integer i = 0; i < 5; i++) {
            contacts.add(new Contact(
                FirstName = 'Test',
                LastName = 'Contact ' + i,
                AccountId = acc.Id
            ));
        }
        insert contacts;
    }

    @isTest
    static void testContactCount() {
        // Data from @testSetup is available here
        List<Contact> contacts = [SELECT Id FROM Contact];
        System.assertEquals(5, contacts.size());
    }

    @isTest
    static void testDeleteContact() {
        // Each test method gets its OWN COPY of the @testSetup data
        Contact c = [SELECT Id FROM Contact LIMIT 1];
        delete c;
        // Only 4 remain in THIS method's context
        System.assertEquals(4, [SELECT Id FROM Contact].size());
    }

    @isTest
    static void testStillHasFive() {
        // The delete in testDeleteContact does NOT affect this method
        // because each method gets a FRESH copy of @testSetup data
        System.assertEquals(5, [SELECT Id FROM Contact].size());
    }
}
```

### Key Rules
| Rule | Detail |
|---|---|
| Runs once per class | NOT once per method |
| Each test method gets its own copy | Modifications are rolled back between methods |
| Must be `static void` | Cannot return values |
| Cannot be used with `SeeAllData=true` | They are mutually exclusive |
| Reduces test execution time | Data is created once, not in every method |

### Trap
> ❌ "@testSetup runs before each test method."
> ✅ It runs **once**. Each method gets a **fresh snapshot** of that data.

---

## `Test.loadData()`

Loads test records from a **Static Resource** (CSV file) into the database during a test.

### Step 1: Create a CSV file and upload as a Static Resource
```csv
Name,Industry,AnnualRevenue
Acme Corp,Technology,50000000
Beta Inc,Finance,30000000
Gamma LLC,Healthcare,10000000
```
Upload this as a Static Resource named `TestAccounts`.

### Step 2: Use `Test.loadData()` in your test
```apex
@isTest
private class AccountBulkTest {
    @isTest
    static void testBulkLoad() {
        List<SObject> accounts = Test.loadData(Account.SObjectType, 'TestAccounts');

        System.assertEquals(3, accounts.size());
        System.assertEquals('Acme Corp', ((Account)accounts[0]).Name);
    }
}
```

### Key Rules
| Rule | Detail |
|---|---|
| First argument | The `SObjectType` token (e.g., `Account.SObjectType`) |
| Second argument | The **name** of the Static Resource (String) |
| Returns `List<SObject>` | You must cast to the specific type if needed |
| Records are inserted | They exist in the DB and have Ids assigned |
| Good for bulk testing | Load 200+ records easily without writing DML loops |

---

## Test Data Factory Pattern (Best Practice)

Create a reusable utility class to generate test data across multiple test classes.

```apex
@isTest
public class TestDataFactory {

    public static Account createAccount(String name) {
        Account acc = new Account(Name = name);
        insert acc;
        return acc;
    }

    public static List<Contact> createContacts(Id accountId, Integer count) {
        List<Contact> contacts = new List<Contact>();
        for (Integer i = 0; i < count; i++) {
            contacts.add(new Contact(
                FirstName = 'Test',
                LastName = 'Contact ' + i,
                AccountId = accountId
            ));
        }
        insert contacts;
        return contacts;
    }

    public static User createStandardUser() {
        Profile p = [SELECT Id FROM Profile WHERE Name = 'Standard User' LIMIT 1];
        User u = new User(
            Alias = 'tuser',
            Email = 'testuser@test.com',
            EmailEncodingKey = 'UTF-8',
            LastName = 'TestUser',
            LanguageLocaleKey = 'en_US',
            LocaleSidKey = 'en_US',
            ProfileId = p.Id,
            TimeZoneSidKey = 'America/Los_Angeles',
            UserName = 'testuser' + DateTime.now().getTime() + '@test.com'
        );
        insert u;
        return u;
    }
}
```

### Why Use a Factory?
- **DRY principle:** Don't repeat data creation logic across 50 test classes.
- **Maintainability:** If a required field changes, you update ONE place.
- **Bulk-friendly:** Easy to create large volumes for governor limit testing.
