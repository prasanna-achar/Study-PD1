# 04 — System.runAs() & Permissions Testing

---

## What `System.runAs()` Does

It allows you to run a block of code **as a specific user**, testing whether your code respects sharing rules, field-level security, and profile permissions.

```apex
@isTest
private class SharingTest {
    @isTest
    static void testRecordAccess() {
        // Create a standard user
        Profile p = [SELECT Id FROM Profile WHERE Name = 'Standard User'];
        User stdUser = new User(
            Alias = 'suser',
            Email = 'stduser@test.com',
            EmailEncodingKey = 'UTF-8',
            LastName = 'Standard',
            LanguageLocaleKey = 'en_US',
            LocaleSidKey = 'en_US',
            ProfileId = p.Id,
            TimeZoneSidKey = 'America/Los_Angeles',
            UserName = 'stduser' + DateTime.now().getTime() + '@test.com'
        );
        insert stdUser;

        // Create a record as the running (admin) user
        Account acc = new Account(Name = 'Private Account');
        insert acc;

        // Now run code AS the standard user
        System.runAs(stdUser) {
            try {
                Account queried = [SELECT Id FROM Account WHERE Id = :acc.Id];
                System.assert(false, 'Should not reach here if OWD is Private');
            } catch (QueryException e) {
                // Expected — standard user can't see the record
                System.assert(true);
            }
        }
    }
}
```

### Key Rules
| Rule | Detail |
|---|---|
| Does NOT enforce FLS in Apex | Apex runs in system mode. `runAs` tests **record-level** sharing |
| Resets governor limits | Each `runAs` block gets a fresh set of limits |
| Can be nested | You can have `runAs` inside `runAs` |
| User must be inserted first | The User record must exist in the DB |

---

## Mixed DML Error & The `System.runAs()` Fix

### What Is a Mixed DML Error?
Salesforce does not allow DML on **setup objects** (User, Profile, PermissionSet, Group) and **non-setup objects** (Account, Contact, Opportunity) in the **same transaction**.

```apex
// ❌ THIS WILL FAIL with MIXED_DML_OPERATION error
@isTest
static void testMixedDML_FAILS() {
    User u = new User(/* ... */);
    insert u;                        // Setup object DML

    Account acc = new Account(Name = 'Test');
    insert acc;                      // Non-setup object DML — BOOM! 💥
}
```

### The Fix: Wrap the setup DML in `System.runAs()`
```apex
// ✅ THIS WORKS
@isTest
static void testMixedDML_WORKS() {
    User u = new User(/* ... */);
    insert u;                        // Setup object DML

    System.runAs(u) {
        Account acc = new Account(Name = 'Test');
        insert acc;                  // Non-setup DML in a different context — OK!
        System.assertNotEquals(null, acc.Id);
    }
}
```

### Why Does This Work?
`System.runAs()` starts a **new execution context**. The setup DML (User insert) happened in the outer context, and the non-setup DML (Account insert) happens in the inner `runAs` context. They are in **different transactions** from the platform's perspective.

---

## Setup Objects vs Non-Setup Objects

### Setup Objects (Cannot mix with regular DML)
- `User`
- `Profile`
- `PermissionSet`
- `PermissionSetAssignment`
- `Group`
- `GroupMember`
- `QueueSObject`
- `UserRole`

### Non-Setup Objects (Everything else)
- `Account`, `Contact`, `Opportunity`, `Case`, `Lead`, custom objects, etc.

---

## Quick-Fire Cards

**Q: A test needs to insert a User and an Account. How do you avoid the Mixed DML error?**
> A: Insert the User first, then wrap the Account insert inside `System.runAs(user)`.

**Q: Does `System.runAs()` test field-level security?**
> A: No. Apex always runs in system mode and bypasses FLS. `runAs` only tests **record-level sharing** (OWD, sharing rules).

**Q: Can you call `System.runAs()` outside of a test method?**
> A: No. It is only available in test context.
