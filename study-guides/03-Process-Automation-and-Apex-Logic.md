# Domain 3: Process Automation and Apex Logic (Exam Weighting: ~38%)

This is the **largest and most critical section** of the Platform Developer I exam. Mastery of Apex collections, SOQL/SOSL queries, DML operations, Triggers, Order of Execution, and Asynchronous Apex guarantees exam success.

---

## 1. Apex Language Fundamentals & Collections
Apex is a strongly typed, object-oriented, case-insensitive programming language executed on Salesforce multi-tenant servers.

### Core Collections: List, Set, and Map

| Collection | Definition | Key Characteristics | Common Methods |
| :--- | :--- | :--- | :--- |
| **`List<T>`** | Ordered collection of elements. | Allows **duplicates**. Accessed by 0-based integer index. | `.add(elem)`, `.get(index)`, `.size()`, `.clear()`, `.sort()` |
| **`Set<T>`** | Unordered collection of **unique** elements. | **No duplicates allowed.** Ideal for collecting `Id`s before querying (`Set<Id>`). | `.add(elem)`, `.contains(elem)`, `.remove(elem)`, `.size()` |
| **`Map<K, V>`** | Collection of **Key-Value pairs**. | Keys must be **unique** (e.g., `Map<Id, Account>`). Values can be duplicated. | `.put(key, val)`, `.get(key)`, `.keySet()`, `.values()`, `.containsKey(key)` |

```apex
// Common Exam Pattern: Using Map<Id, sObject> constructor from a SOQL query or List
List<Account> accList = [SELECT Id, Name FROM Account WHERE Active__c = 'Yes'];
Map<Id, Account> accMap = new Map<Id, Account>(accList); // Automatically maps Id -> Account!

// Extracting keys to use in child query bind variables (:bindVar)
Set<Id> accountIds = accMap.keySet();
List<Contact> childContacts = [SELECT Id, LastName, AccountId FROM Contact WHERE AccountId IN :accountIds];
```

---

## 2. SOQL (Salesforce Object Query Language) & SOSL

### SOQL vs. SOSL Comparison

| Feature | SOQL (Salesforce Object Query Language) | SOSL (Salesforce Object Search Language) |
| :--- | :--- | :--- |
| **Target Scope** | Queries **one specific object** and its related parents/children at a time. | Searches across **multiple distinct objects** simultaneously using full-text search indexes. |
| **Return Type** | `List<sObject>`, single `sObject`, or `Integer` (for `COUNT()`). | `List<List<sObject>>` (List of lists of objects matching search term). |
| **Where to use** | When you know the exact object and filtering criteria (`WHERE Status__c = 'Open'`). | When searching for a text string across multiple fields/objects (`FIND 'Acme*' IN ALL FIELDS`). |
| **Governor Limit** | Up to **100 queries** per synchronous transaction (up to 50,000 records). | Up to **20 queries** per synchronous transaction (up to 2,000 records). |

### Relationship Queries in SOQL
1. **Child-to-Parent (Lookup/Master-Detail - Use Dot Notation):**
   ```apex
   // Custom relationship uses __r for the relationship name!
   List<Contact> contacts = [SELECT Id, FirstName, Account.Name, Account.CustomParent__r.Status__c FROM Contact];
   ```
2. **Parent-to-Child (Subquery in SELECT clause):**
   ```apex
   // Subquery uses the plural Child Relationship Name (e.g., Contacts or CustomChildren__r)
   List<Account> accountsWithContacts = [SELECT Id, Name, (SELECT Id, LastName, Email FROM Contacts) FROM Account];
   
   for (Account acc : accountsWithContacts) {
       for (Contact c : acc.Contacts) {
           System.debug('Child Contact: ' + c.LastName);
       }
   }
   ```

---

## 3. DML Operations & Database Methods

### Standard DML Statements (`insert`, `update`, `upsert`, `delete`, `undelete`)
- If any single record in a standard DML list fails validation or triggers an exception, the **entire DML operation fails and rolls back completely**.

### Database Class Methods (`Database.insert(records, allOrNone)`)
- Provides partial processing capability by setting the `allOrNone` parameter to **`false`**.
- Returns a list of `Database.SaveResult`, `Database.DeleteResult`, or `Database.UpsertResult` objects to inspect individual successes and errors.

```apex
List<Account> accsToInsert = new List<Account>{
    new Account(Name = 'Valid Account'),
    new Account() // Invalid: Missing required Name field!
};

// Partial processing: allOrNone = false
Database.SaveResult[] results = Database.insert(accsToInsert, false);

for (Database.SaveResult sr : results) {
    if (sr.isSuccess()) {
        System.debug('Successfully inserted Account ID: ' + sr.getId());
    } else {
        for (Database.Error err : sr.getErrors()) {
            System.debug('Error on field: ' + err.getFields() + ' - Message: ' + err.getMessage());
        }
    }
}
```

---

## 4. Apex Triggers: Context Variables & Best Practices

Triggers execute Apex code before or after DML events (`insert`, `update`, `delete`, `undelete`).

### Trigger Context Variables Table

| Context Variable | Type | Description | Available Events |
| :--- | :--- | :--- | :--- |
| **`Trigger.new`** | `List<sObject>` | List of new versions of sObject records. Can be modified directly in `before insert` and `before update` triggers! | `insert`, `update`, `undelete` |
| **`Trigger.old`** | `List<sObject>` | List of old versions of sObject records prior to update or delete. Read-only. | `update`, `delete` |
| **`Trigger.newMap`** | `Map<Id, sObject>` | Map of IDs to new versions of sObject records. | `before update`, `after insert`, `after update`, `after undelete` |
| **`Trigger.oldMap`** | `Map<Id, sObject>` | Map of IDs to old versions of sObject records. | `update`, `delete` |
| **`Trigger.isBefore` / `isAfter`** | `Boolean` | Returns true if trigger was fired before/after record is saved to the database. | All events |
| **`Trigger.isInsert` / `isUpdate` / `isDelete` / `isUndelete`** | `Boolean` | Returns true depending on the exact DML operation triggering the execution. | All events |

### The Golden Trigger Best Practices:
1. **One Trigger Per Object:** Never write multiple triggers on the same sObject (`AccountTrigger1`, `AccountTrigger2`) because the execution order between two triggers on the same object is **undetermined**.
2. **Logicless Triggers (`Trigger Handler Pattern`):** The `.trigger` file should only delegate execution to an external helper class (`AccountTriggerHandler.cls`).
3. **Bulkification:** Always assume `Trigger.new` contains up to 200 records per chunk. **Never put SOQL queries or DML statements inside a `for` loop!**
4. **Recursion Prevention:** Use a static `Set<Id>` or `Boolean` variable inside your Trigger Handler class to ensure triggers don't fire endlessly during cross-object field updates.

---

## 5. Order of Execution (Critical Exam Topic!)
When you save a record with an insert, update, or upsert statement, Salesforce executes events in the following exact order (`V-T-V-A-W-P-E` or standard 15-step sequence):

1. **System Validations 1:** Check required fields, valid data formats, and length restrictions on the server.
2. **Before Triggers:** Execute `before insert` / `before update` Apex triggers.
3. **System Validations 2 & Custom Validation Rules:** Check field uniqueness, custom validation rules (`Rule__c`), and system validation rules again.
4. **Duplicate Rules:** Execute duplicate detection checks.
5. **Save to Database (Not Committed yet):** Record is saved to database table and assigned an `Id` (for insert), but transaction is not yet permanently committed.
6. **After Triggers:** Execute `after insert` / `after update` Apex triggers.
7. **Assignment Rules:** Execute assignment rules (e.g., Lead or Case assignment).
8. **Auto-Response Rules:** Execute auto-response email rules.
9. **Workflow Rules:** Execute workflow rules and immediate field updates. *(Note: If a workflow rule updates a field, `before update` and `after update` triggers fire ONE more time!)*
10. **Escalation Rules:** Execute Case escalation rules.
11. **Flows & Process Builder:** Execute Record-Triggered Flows and Process Builders.
12. **Entitlement Rules:** Execute entitlement rules.
13. **Rollup Summary & Cross-Object Formula Updates:** Parent Master records are updated with calculated rollup summary values (which triggers parent object `before update` / `after update` triggers!).
14. **Criteria-Based Sharing Evaluation:** Re-evaluates sharing rules based on new record values.
15. **DML Commit to Database:** All DML changes are permanently committed to the database table!

---

## 6. Asynchronous Apex: `@future`, Batchable, Queueable, Schedulable

When heavy processing would exceed synchronous governor limits (or when making external web service callouts from Triggers), delegate processing asynchronously.

| Async Type | Interface / Annotation | Ideal Use Case | Key Rules / Limitations |
| :--- | :--- | :--- | :--- |
| **Future Methods** | `@future` annotation on `static void` method. | Quick async offloading, callouts from triggers (`@future(callout=true)`). | Parameters must be **primitive data types** (`List<Id>`, `String`), NOT sObjects! Cannot chain future methods from another future method (`No async in async`). |
| **Queueable Apex** | `implements Queueable` (`execute(QueueableContext qc)`) | Advanced async operations requiring sObject parameters, custom state preservation across executions, or **job chaining** (`System.enqueueJob()`). | Can pass sObjects freely. Can enqueue exactly ONE child Queueable job from an executing Queueable job. |
| **Batch Apex** | `implements Database.Batchable<sObject>` | Processing massive data volumes (up to 50,000,000 records) in clean manageable chunks (default 200 records per `execute` execution). | Has three mandatory methods: `start(bc)`, `execute(bc, scope)`, and `finish(bc)`. Must use `Database.Stateful` interface to maintain instance variable values across chunks! |
| **Scheduled Apex** | `implements Schedulable` (`execute(SchedulableContext sc)`) | Running tasks on a recurring cron schedule (e.g., nightly cleanup jobs or nightly batch execution). | Scheduled using `System.schedule('Job Name', 'CRON_EXPRESSION', new MySchedulableClass())`. |

### Batch Apex Implementation Skeleton:
```apex
public class AccountCleanupBatch implements Database.Batchable<sObject>, Database.Stateful {
    public Integer recordsProcessed = 0; // Maintained across chunks because of Database.Stateful!

    public Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator([SELECT Id, Status__c FROM Account WHERE Status__c = 'Obsolete']);
    }

    public void execute(Database.BatchableContext bc, List<Account> scope) {
        for (Account acc : scope) {
            acc.Status__c = 'Archived';
            recordsProcessed++;
        }
        update scope;
    }

    public void finish(Database.BatchableContext bc) {
        System.debug('Batch Finished! Total records processed: ' + recordsProcessed);
    }
}
```

---

## 7. Notes & Summer '26 (API v67.0) Release Updates (PD1 Syllabus Alignment)

### Syllabus Alignment Note (Domain Weighting: ~29% - 30%)
In the official 2026 PD1 exam outline, **Logic and Process Automation** is the single highest-weighted section at **~30%** (~18 questions). When combined with core developer logic (`~7%`), over a third of your exam focuses specifically on Apex syntax, Triggers, Order of Execution, Asynchronous Apex, and declarative boundaries (Flow vs. Apex).

### Summer '26 (API v67.0) Key Updates for Domain 3:
1. **User-Mode SOQL/DML Defaults (`WITH USER_MODE`):**
   - Summer '26 makes user-mode enforcement standard practice across modern Apex logic.
   - Always query data using `[SELECT Id, Name FROM Account WITH USER_MODE]` when writing controllers or batch processes where user permissions should strictly apply.
2. **String Templates in Apex:**
   - Summer '26 expands native string templating capabilities in Apex, making dynamic SOQL query construction and string formatting significantly cleaner without brittle `+` concatenation blocks.
3. **Structured Debug Log Filtering & Exception Stack Traces:**
   - When debugging asynchronous Apex (`@future`, `Batchable`, `Queueable`) or trigger execution chains, Summer '26 introduces structured log filtering (by `APEX_CODE` category or error severity) in VS Code and Developer Console.
   - Exception stack traces have been overhauled to clearly demarcate synchronous vs. asynchronous boundary hops and trigger invocations (`V-T-V-A-W-P-E`).

