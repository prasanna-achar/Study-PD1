# 🟠 Phase 3: Triggers & The Order of Execution

*Automating complex business rules without hitting multi-tenant governor limits.*

## 1. Trigger Events & Contexts

Apex triggers enable you to perform custom actions before or after changes to Salesforce records, such as insertions, updates, or deletions.

### Trigger Events
A trigger executes before or after the following types of operations:
*   `before insert`
*   `before update`
*   `before delete`
*   `after insert`
*   `after update`
*   `after delete`
*   `after undelete`

**Syntax:**
```apex
trigger AccountTrigger on Account (before insert, before update, after update) {
    // Trigger logic here
}
```

### Context Variables
All triggers define implicit variables that allow developers to access run-time context.
*   `Trigger.new`: Returns a list of the new versions of the sObject records. Note that this sObject list is only available in insert, update, and undelete triggers, and the records can only be modified in before triggers.
*   `Trigger.newMap`: A map of IDs to the new versions of the sObject records. Available in before update, after insert, after update, and after undelete triggers.
*   `Trigger.old`: Returns a list of the old versions of the sObject records. Available in update and delete triggers.
*   `Trigger.oldMap`: A map of IDs to the old versions of the sObject records. Available in update and delete triggers.
*   `Trigger.isInsert`, `Trigger.isUpdate`, `Trigger.isDelete`, `Trigger.isUndelete`: Returns true if the trigger was fired due to the respective operation.
*   `Trigger.isBefore`, `Trigger.isAfter`: Returns true if the trigger was fired before/after any record was saved.
*   `Trigger.isExecuting`: Returns true if the current context for the Apex code is a trigger.

## 2. When to use `Before` vs `After`

Understanding when to use before and after triggers is crucial for performance and avoiding unnecessary DML statements.

### Before Triggers
*   **Purpose:** Use to update or validate record values *before* they are saved to the database.
*   **Key Advantage:** **Zero DML statements required.** Modifying fields on the records in `Trigger.new` automatically updates the database during the save.
*   **Example:** Setting a default status on a newly created Case or formatting a phone number on a Contact.

```apex
// Example: Modifying the record in a before insert trigger
for (Account acc : Trigger.new) {
    if (acc.Industry == 'Technology') {
        acc.Rating = 'Hot'; // No DML statement needed!
    }
}
```

### After Triggers
*   **Purpose:** Use to access system-set field values (such as the `Id` or `CreatedDate`), and to affect changes in other records.
*   **Note:** The records in `Trigger.new` are read-only in after triggers. You must use DML to modify related records.
*   **Example:** Creating a default Opportunity when an Account is created, or updating the parent Account when a Contact is updated.

```apex
// Example: Modifying related records in an after insert trigger
List<Contact> contactsToInsert = new List<Contact>();
for (Account acc : Trigger.new) {
    Contact c = new Contact(
        LastName = 'Default Contact',
        AccountId = acc.Id // Id is available in 'after' context
    );
    contactsToInsert.add(c);
}
// DML statement required for related records
if (!contactsToInsert.isEmpty()) {
    insert contactsToInsert; 
}
```

## 3. Bulkification Patterns (Core Rule #1)

Salesforce runs in a multi-tenant environment with strict governor limits. **Triggers operate on batches of records (up to 200 at a time), not single records.** Therefore, all triggers must be bulkified.

### The Golden Rule
**Never put SOQL queries or DML operations inside loops!**

### The Bulkification Pattern
1.  **Iterate** through `Trigger.new` to collect IDs or keys into a `Set<Id>` or `Set<String>`.
2.  **Query** outside the loop into a `List` or `Map<Id, sObject>` using the collected keys.
3.  **Process** the data in memory. Iterate through `Trigger.new` again if necessary, looking up related data from the Map. Create new lists of objects to be updated/inserted.
4.  **Execute** 1 DML statement outside the loop on the newly created lists.

**Example: Bulkified Trigger (The Right Way)**
```apex
// We want to update all parent Accounts when their related Contacts are updated.
trigger ContactTrigger on Contact (after update) {
    
    // 1. Collect IDs
    Set<Id> accountIds = new Set<Id>();
    for (Contact c : Trigger.new) {
        if (c.AccountId != null) {
            accountIds.add(c.AccountId);
        }
    }
    
    // 2. Query Outside Loop
    Map<Id, Account> accountsToUpdate = new Map<Id, Account>([
        SELECT Id, Description FROM Account WHERE Id IN :accountIds
    ]);
    
    List<Account> finalUpdateList = new List<Account>();
    
    // 3. Process In Memory
    for (Contact c : Trigger.new) {
        if (c.AccountId != null) {
            Account parentAcc = accountsToUpdate.get(c.AccountId);
            parentAcc.Description = 'Updated by Contact: ' + c.LastName;
            finalUpdateList.add(parentAcc);
        }
    }
    
    // 4. DML Outside Loop
    if (!finalUpdateList.isEmpty()) {
        // Need to convert List to a Map or Set to deduplicate if multiple contacts point to same Account, 
        // or just use a Map<Id, Account> for final updates to prevent duplicate ID errors in DML.
        Map<Id, Account> dedupedUpdates = new Map<Id, Account>();
        dedupedUpdates.putAll(finalUpdateList);
        update dedupedUpdates.values();
    }
}
```

## 4. Trigger Architecture

As your org grows, putting logic directly in the `.trigger` file becomes unmanageable.

### One Trigger Per Object Pattern
*   Create exactly **one** `.trigger` file per sObject.
*   The trigger file should be logic-free. It simply delegates the execution to an Apex class, commonly known as a **Trigger Handler**.

**AccountTrigger.trigger (Logic-Free)**
```apex
trigger AccountTrigger on Account (before insert, before update, after insert, after update) {
    if (Trigger.isBefore) {
        if (Trigger.isInsert) {
            AccountTriggerHandler.handleBeforeInsert(Trigger.new);
        } else if (Trigger.isUpdate) {
            AccountTriggerHandler.handleBeforeUpdate(Trigger.new, Trigger.oldMap);
        }
    } else if (Trigger.isAfter) {
        // Handle after contexts...
    }
}
```

**AccountTriggerHandler.cls (The Logic)**
```apex
public class AccountTriggerHandler {
    public static void handleBeforeInsert(List<Account> newAccounts) {
        for (Account acc : newAccounts) {
            // apply logic
        }
    }
    // other methods...
}
```

### Recursion Prevention
Sometimes a trigger updates a record, which fires the trigger again, leading to an infinite loop and an exception. Prevent this using a static boolean flag in an Apex class.

```apex
public class TriggerControl {
    public static Boolean isFirstRun = true;
}

// In the trigger or handler:
if (TriggerControl.isFirstRun) {
    TriggerControl.isFirstRun = false;
    // Execute logic
}
```
*Note: Advanced orgs use comprehensive Trigger Frameworks (like Kevin O'Hara's or Mitch Spano's) that handle routing, recursion, and bypasses automatically.*

## 5. Salesforce Order of Execution (Full 14-Step)

Understanding the exact sequence of events when a record is saved is vital. If a process isn't working as expected, it's often due to the order of execution.

### The Complete Sequence

```
 1. System Validation (required fields, field formats, max length)
 2. Record-Triggered Flows: BEFORE-SAVE (Fast Field Updates)
 3. Before Triggers execute
 4. Custom Validation Rules execute
 5. Duplicate Rules execute
 6. Record saved to database (NOT committed yet — record gets its Id)
 7. After Triggers execute
 8. Assignment Rules execute
 9. Auto-Response Rules execute
10. Workflow Rules execute
    → If Workflow updates a field:
      - Before & After triggers fire AGAIN
      - Validation rules, duplicate rules do NOT re-fire
11. Escalation Rules execute
12. Record-Triggered Flows: AFTER-SAVE execute
13. Roll-up Summary fields calculated (parent record goes through its own save)
14. DML operations committed to the database
```

### Exam Traps — Most Tested Facts

| Trap | What the Exam Tests |
| :--- | :--- |
| **Validation runs AFTER before triggers** | If you set a field in a before trigger, validation rules see the NEW value |
| **Before-save flows run BEFORE triggers** | Flows (fast field updates) execute at step 2, before Apex triggers at step 3 |
| **Workflow field updates re-fire triggers** | Only before/after triggers re-fire. Validation rules do NOT re-run |
| **Record gets Id at step 6** | `Trigger.new[0].Id` is `null` in before insert, available in after insert |
| **After-save flows run AFTER triggers** | After-save flows (step 12) run after after triggers (step 7) |
| **Roll-ups cascade** | Parent's roll-up recalculation causes the parent to go through its OWN save cycle |

### When Does Each Context Variable Exist?

| Variable | before insert | after insert | before update | after update | before delete | after delete | after undelete |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `Trigger.new` | ✅ | ✅ (read-only) | ✅ | ✅ (read-only) | ❌ | ❌ | ✅ |
| `Trigger.newMap` | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| `Trigger.old` | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ |
| `Trigger.oldMap` | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ |

**Key insight:** `Trigger.newMap` is NOT available in `before insert` because the records don't have IDs yet (IDs are assigned at step 6).

### Common Exam Scenario: Comparing Old and New Values

```apex
trigger OpportunityTrigger on Opportunity (before update) {
    for (Opportunity opp : Trigger.new) {
        Opportunity oldOpp = Trigger.oldMap.get(opp.Id);

        // Only act when Stage changed to 'Closed Won'
        if (opp.StageName == 'Closed Won' && oldOpp.StageName != 'Closed Won') {
            opp.Description = 'Closed on ' + Date.today();
        }
    }
}
```

*Pro-tip: A common exam question involves knowing that Validation Rules run AFTER Before Triggers. Another frequent question tests whether `Trigger.newMap` is available in `before insert` (it's NOT — no IDs yet).*
