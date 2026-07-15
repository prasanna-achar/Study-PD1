# 🟡 Phase 2 Notes: Database Interaction (SOQL, SOSL & DML)

> **Apex Mastery Roadmap — Phase 2 Study Guide**
> Master how Apex safely queries, searches, and manipulates Salesforce multi-tenant database records (`sObjects`) while respecting governor limits, transaction boundaries, and security enforcement.

---

## 📑 Table of Contents
1. [SOQL Fundamentals & Syntax](#1-soql-fundamentals--syntax)
2. [Relationship Queries (Multi-Object SOQL)](#2-relationship-queries-multi-object-soql)
3. [Aggregate SOQL & Grouping (`AggregateResult`)](#3-aggregate-soql--grouping-aggregateresult)
4. [Dynamic SOQL & SOSL (Full-Text Search)](#4-dynamic-soql--sosl-full-text-search)
5. [DML Operations & Database Methods (`partial success`)](#5-dml-operations--database-methods-partial-success)
6. [Transaction Management & Savepoints](#6-transaction-management--savepoints)
7. [PD1 Exam & Technical Interview Gotchas](#7-pd1-exam--technical-interview-gotchas)

---

## 1. SOQL Fundamentals & Syntax

**SOQL (Salesforce Object Query Language)** is used to retrieve data from a single sObject table or multiple related sObject tables inside Salesforce. Unlike SQL, SOQL is strictly designed for structured querying in a multi-tenant environment (no `JOIN *` or arbitrary table join statements).

### 📐 Anatomy of a SOQL Query

```apex
List<Account> accList = [
    SELECT Id, Name, AccountNumber, AnnualRevenue, CreatedDate
    FROM Account
    WHERE Industry = 'Technology' AND AnnualRevenue >= 500000
    ORDER BY AnnualRevenue DESC NULLS LAST
    LIMIT 50
    OFFSET 0
];
```

| Clause | Purpose & Behavior | Example / Rule |
| :--- | :--- | :--- |
| `SELECT` | Specifies the exact fields to retrieve. **There is no `SELECT *` in standard SOQL!** (However, `FIELDS(STANDARD)`, `FIELDS(CUSTOM)`, or `FIELDS(ALL)` can be used with strict `LIMIT` restrictions). | `SELECT Id, Name, Status__c` |
| `FROM` | Specifies the primary sObject to query. | `FROM Contact` |
| `WHERE` | Filters rows based on conditions (`=`, `!=`, `<`, `>`, `LIKE`, `IN`, `NOT IN`, `INCLUDES`, `EXCLUDES`). | `WHERE StageName IN :closedStages` |
| `ORDER BY` | Sorts results by one or more fields. Default is `ASC NULLS FIRST`. Use `DESC NULLS LAST` for high-to-low sorting. | `ORDER BY CreatedDate DESC` |
| `LIMIT` | Restricts the maximum number of records returned. | `LIMIT 1` (often used when assigning to a single sObject variable) |
| `OFFSET` | Skips the first *N* rows before returning results (maximum offset is `2,000`). Used for pagination. | `OFFSET 20` |
| `FOR UPDATE` | **Locking clause:** Locks the queried records against concurrent updates until the current transaction completes. | `SELECT Id FROM Account WHERE Id = :id FOR UPDATE` |

---

### 🔗 Binding Variables (`:myVariable`) & Injection Prevention
In Apex, you can dynamically bind in-memory variables directly into inline SOQL queries using the **colon (`:`) prefix**. This is the **most secure** way to query because Salesforce automatically sanitizes bind variables, preventing **SOQL Injection**.

```apex
Set<String> targetIndustries = new Set<String>{'Finance', 'Healthcare', 'Retail'};
Decimal minRevenue = 1000000;

// ✅ BEST PRACTICE: Using bind variables cleanly inside SOQL
List<Account> accounts = [
    SELECT Id, Name, Industry, AnnualRevenue 
    FROM Account 
    WHERE Industry IN :targetIndustries 
      AND AnnualRevenue > :minRevenue
    WITH USER_MODE
];
```

---

### 📅 SOQL Date Literals
Salesforce provides built-in date literals to filter records relative to the current execution date/time without hardcoding date calculations.

| Date Literal | Description | Example Query |
| :--- | :--- | :--- |
| `TODAY` | Exactly today's date (local time zone of running user). | `WHERE CreatedDate = TODAY` |
| `YESTERDAY` / `TOMORROW` | Exactly yesterday or tomorrow. | `WHERE CloseDate = YESTERDAY` |
| `LAST_N_DAYS:n` | The previous *n* days up to and including today. | `WHERE LastModifiedDate >= LAST_N_DAYS:30` |
| `NEXT_N_DAYS:n` | The next *n* days starting from today. | `WHERE ActivityDate = NEXT_N_DAYS:7` |
| `THIS_WEEK` / `LAST_WEEK` | The current calendar week (Sunday–Saturday). | `WHERE CreatedDate = THIS_WEEK` |
| `THIS_MONTH` / `LAST_MONTH` | The current calendar month. | `WHERE CloseDate = THIS_MONTH` |
| `THIS_FISCAL_YEAR` | Current fiscal year (based on Org setup). | `WHERE CloseDate = THIS_FISCAL_YEAR` |

---

### 🛡️ Summer '26 (API v67.0) Best Practice: `WITH USER_MODE`
By default, Apex runs in **System Mode** (ignoring Object-Level Security / CRED and Field-Level Security / FLS). To strictly enforce the running user's permissions when retrieving data, always append `WITH USER_MODE` to your SOQL query.

```apex
// ✅ Summer '26 Standard: Enforces CRED and FLS natively at query runtime
List<Opportunity> userVisibleOpps = [
    SELECT Id, Name, Amount, StageName 
    FROM Opportunity 
    WHERE IsClosed = false 
    WITH USER_MODE
];
```
> **Exam Note:** If a user does not have `Read` access to the `Amount` field due to FLS, querying with `WITH USER_MODE` throws a `QueryException` (or strips the field depending on context), preventing unauthorized data exposure!

---

## 2. Relationship Queries (Multi-Object SOQL)

Salesforce relationships (`Lookup` and `Master-Detail`) allow traversing up to **5 levels up** (parent/grandparent) and querying **1 level down** (child subqueries) within a single SOQL statement.

### ⬆️ Child-to-Parent Queries (Traversing Up using Dot Notation)
When querying a child record and traversing up to its parent or grandparent, use **dot notation (`Parent.Field`)**.

```apex
// Traversing up standard relationships (Contact -> Account -> Owner)
List<Contact> contacts = [
    SELECT Id, FirstName, LastName, Account.Name, Account.Industry, Account.Owner.Email
    FROM Contact
    WHERE Account.Industry = 'Energy'
];

// Traversing up custom relationships (Notice the __r suffix instead of __c!)
// Invoice__c -> Project__c -> Client_Account__c
List<Invoice__c> invoices = [
    SELECT Id, Amount__c, Project__r.Name, Project__r.Client_Account__r.Name
    FROM Invoice__c
    WHERE Project__r.Status__c = 'Active'
];
```

> [!IMPORTANT]
> **Relationship Naming Rule:**
> - For **Standard relationships**, use the relationship name without `Id` (`Account.Name` from `Contact`).
> - For **Custom lookup fields** (e.g., `Project__c`), replace `__c` with **`__r`** when traversing up (`Project__r.Name`).

---

### ⬇️ Parent-to-Child Queries (Subqueries / Nested Queries)
When querying a parent record and retrieving its related child records at the exact same time, put a **nested `SELECT` statement inside parentheses** within the main field selection list using the **Plural Relationship Name**.

```apex
// Standard Parent-to-Child (Account -> Contacts & Opportunities)
List<Account> accountsWithChildren = [
    SELECT Id, Name, Industry,
           (SELECT Id, FirstName, LastName, Email FROM Contacts WHERE IsActive__c = true),
           (SELECT Id, Name, Amount, StageName FROM Opportunities WHERE IsClosed = false)
    FROM Account
    WHERE AnnualRevenue > 1000000
];

// Iterating over subquery results in Apex
for (Account acc : accountsWithChildren) {
    System.debug('Account: ' + acc.Name);
    // acc.Contacts returns a List<Contact> directly attached to the Account!
    for (Contact con : acc.Contacts) {
        System.debug('  -> Contact: ' + con.FirstName + ' ' + con.LastName);
    }
}
```

#### Custom Child Relationship Names:
To find the exact child relationship name for a custom object (`Project_Task__c` child of `Project__c`), look at the field definition in Object Manager. If the Child Relationship Name is `Project_Tasks`, append **`__r`** in the subquery:
```apex
List<Project__c> projects = [
    SELECT Id, Name, (SELECT Id, Title__c, Status__c FROM Project_Tasks__r)
    FROM Project__c
];
```

---

### 🔀 Polymorphic Queries (`TYPEOF`)
When working with polymorphic lookup fields (such as `Task.WhoId` pointing to *either* `Contact` *or* `Lead`, or `Event.WhatId` pointing to `Account`, `Opportunity`, `Case`, etc.), use the **`TYPEOF`** clause to select object-specific fields.

```apex
List<Task> tasks = [
    SELECT Id, Subject,
        TYPEOF Who
            WHEN Contact THEN FirstName, LastName, Department
            WHEN Lead THEN FirstName, LastName, Company, LeadSource
        END
    FROM Task
    WHERE WhoId != null
];
```

---

## 3. Aggregate SOQL & Grouping (`AggregateResult`)

Aggregate SOQL allows computing mathematical summaries directly inside the database engine without pulling thousands of records into Apex heap memory.

### 🧮 Aggregate Functions
| Function | Description | Example |
| :--- | :--- | :--- |
| `COUNT()` | Returns total number of rows matching criteria (no field parameter allowed). | `SELECT COUNT() FROM Account` |
| `COUNT(fieldName)` | Returns total number of non-null values in `fieldName`. | `SELECT COUNT(Industry) FROM Account` |
| `COUNT_DISTINCT(field)` | Returns total number of **unique non-null** values in `fieldName`. | `SELECT COUNT_DISTINCT(Company) FROM Lead` |
| `SUM(fieldName)` | Calculates the total sum of a numeric (`Decimal`, `Integer`, `Double`) field. | `SELECT SUM(Amount) FROM Opportunity` |
| `AVG(fieldName)` | Calculates the mathematical average. | `SELECT AVG(Probability) FROM Opportunity` |
| `MIN(field)` / `MAX(field)` | Returns minimum or maximum value (supports numbers, dates, and strings). | `SELECT MAX(CreatedDate) FROM Contact` |

---

### 📊 `GROUP BY`, `HAVING`, and `AggregateResult`
Whenever you use `GROUP BY` or any aggregate function besides `SELECT COUNT()`, SOQL returns an array of **`AggregateResult`** objects rather than concrete sObjects (`Account` / `Opportunity`).

```apex
// Grouping Opportunities by StageName and filtering grouped totals using HAVING
List<AggregateResult> results = [
    SELECT StageName stage, COUNT(Id) totalDeals, SUM(Amount) totalRevenue, AVG(Amount) avgDealSize
    FROM Opportunity
    WHERE CreatedDate = THIS_FISCAL_YEAR
    GROUP BY StageName
    HAVING SUM(Amount) > 500000
    ORDER BY SUM(Amount) DESC
];

// Processing AggregateResult variables using .get('alias') and explicit type casting!
for (AggregateResult ar : results) {
    String stage = (String) ar.get('stage');
    Integer totalDeals = (Integer) ar.get('totalDeals');
    Decimal revenue = (Decimal) ar.get('totalRevenue');
    Decimal avgSize = (Decimal) ar.get('avgDealSize');
    
    System.debug(stage + ' | Deals: ' + totalDeals + ' | Revenue: $' + revenue);
}
```

> [!WARNING]
> **Crucial Rule on `AggregateResult` Casting:**
> `ar.get('alias')` always returns an `Object` data type. You **must explicitly cast** it to the correct primitive type (`(Integer)`, `(Decimal)`, `(String)`, `(Date)`) before assigning or performing arithmetic!

---

## 4. Dynamic SOQL & SOSL (Full-Text Search)

### ⚙️ Dynamic SOQL (`Database.query`)
When fields, object types, or filter criteria must be determined at runtime (such as building custom search screens or dynamic field exporters), construct the SOQL string dynamically and pass it to `Database.query()`.

```apex
public static List<sObject> queryRecordsDynamically(String objectName, List<String> fields, String searchCity) {
    // Preventing SOQL Injection using variable binding inside dynamic query strings
    String fieldString = String.join(fields, ', ');
    
    // Using bind variables with Database.queryWithBinds (or inline variable resolution)
    String queryString = 'SELECT ' + fieldString + ' FROM ' + String.escapeSingleQuotes(objectName) + 
                         ' WHERE BillingCity = :searchCity WITH USER_MODE';
                         
    return Database.query(queryString);
}
```

#### Prevent SOQL Injection (`String.escapeSingleQuotes`):
If user input is concatenated directly into a query string (`'WHERE Name = \'' + userInput + '\''`), an attacker can pass `' OR Name LIKE '%' --` to dump the entire database! Always either:
1. Use **colon bind variables (`:variable`)** inside the string (`Database.query('WHERE Name = :userInput')`), OR
2. Wrap external string input in `String.escapeSingleQuotes(userInput)`.

---

### 🔍 SOSL (Salesforce Object Search Language)
While SOQL queries one specific object table exact matches, **SOSL** is a **full-text search engine** that searches across text, email, and phone indexes across **multiple distinct objects simultaneously**.

#### When to use SOSL vs. SOQL:
- Use **SOQL** when you know which object table contains the data (`SELECT Id FROM Account WHERE Name = 'Acme'`).
- Use **SOSL** when searching for a keyword across multiple unknown tables (`Account`, `Contact`, `Lead`, and `Case` at once).

#### SOSL Syntax & Return Type (`List<List<sObject>>`):
```apex
// Searching for 'Smith' across Accounts, Contacts, and Leads
String searchKeyword = 'Smith*';

List<List<sObject>> searchResults = [
    FIND :searchKeyword 
    IN ALL FIELDS 
    RETURNING 
        Account(Id, Name, Industry WHERE Active__c = 'Yes'),
        Contact(Id, FirstName, LastName, Email),
        Lead(Id, Name, Company, Status)
];

// Unpacking the List<List<sObject>> result array by object order in RETURNING clause
List<Account> foundAccounts = (List<Account>) searchResults[0];
List<Contact> foundContacts = (List<Contact>) searchResults[1];
List<Lead> foundLeads = (List<Lead>) searchResults[2];

System.debug('Found Accounts: ' + foundAccounts.size());
System.debug('Found Contacts: ' + foundContacts.size());
```

---

## 5. DML Operations & Database Methods (`partial success`)

**DML (Data Manipulation Language)** allows persisting in-memory sObject changes to the database. There are two distinct ways to execute DML: **Standalone DML statements** and **`Database` Class Methods**.

### ⚡ Standalone DML vs. Database Methods Comparison

| Feature | Standalone DML Statement (`insert accList;`) | Database Class Method (`Database.insert(accList, false);`) |
| :--- | :--- | :--- |
| **All-or-None Behavior** | **Always `true` (All-or-None).** If 1 record out of 200 fails validation, the *entire* list rolls back instantly and throws `DmlException`. | **Configurable via `allOrNone` parameter.** If `false`, valid records commit successfully while invalid records return specific error objects. |
| **Error Handling** | Requires `try-catch(DmlException e)` around the block. | Returns `Database.SaveResult[]`, `Database.DeleteResult[]`, or `Database.UpsertResult[]` for granular inspection. |
| **Security Enforcement** | Always runs in default context (System Mode) unless restricted. | Can explicitly accept `AccessLevel.USER_MODE` or `AccessLevel.SYSTEM_MODE` parameter (`Database.insert(list, false, AccessLevel.USER_MODE)`). |
| **When to Use** | When any failure should completely abort the transaction (e.g., banking/payment records). | Bulk data processing, integrations, or multi-record batches where 1 bad record should not stop the remaining 199 records. |

---

### 🔄 The `upsert` Operation & External IDs
`upsert` performs an `insert` or `update` automatically on a list of records based on matching keys:
1. If the sObject has no record `Id` or matching External ID assigned, it is **inserted**.
2. If the sObject has a matching `Id` or External ID that exists once in the database, it is **updated**.
3. If the External ID matches **multiple existing records**, the upsert **fails** with an error!

```apex
List<Account> accountsToUpsert = new List<Account>();

Account newAcc = new Account(Name = 'Global Tech', ERP_External_Id__c = 'ERP-9988');
Account existingAcc = new Account(ERP_External_Id__c = 'ERP-1122', AnnualRevenue = 5000000);

accountsToUpsert.add(newAcc);
accountsToUpsert.add(existingAcc);

// Upserting using custom External ID field as the unique match index
upsert accountsToUpsert ERP_External_Id__c;
```

---

### 📥 Handling Partial Success (`Database.SaveResult`)
When executing bulk DML with `allOrNone = false`, you must loop through the returned result array to inspect successes and log exact errors.

```apex
List<Contact> contactsToInsert = new List<Contact>();
contactsToInsert.add(new Contact(FirstName = 'John', LastName = 'Doe', Email = 'john@example.com'));
contactsToInsert.add(new Contact(FirstName = 'NoLastName')); // ❌ Missing required LastName!

// Execute Database.insert with allOrNone = false
Database.SaveResult[] saveResults = Database.insert(contactsToInsert, false, AccessLevel.USER_MODE);

for (Integer i = 0; i < saveResults.size(); i++) {
    Database.SaveResult sr = saveResults[i];
    if (sr.isSuccess()) {
        System.debug('✅ Successfully inserted record ID: ' + sr.getId());
    } else {
        // Inspect individual errors on failed record
        for (Database.Error err : sr.getErrors()) {
            System.debug('❌ Error on Record #' + i + ' [' + contactsToInsert[i].FirstName + ']:');
            System.debug('   Status Code: ' + err.getStatusCode());
            System.debug('   Message: ' + err.getMessage());
            System.debug('   Fields causing error: ' + err.getFields());
        }
    }
}
```

---

## 6. Transaction Management & Savepoints

A **Transaction** in Salesforce is an atomic unit of work that executes synchronously or asynchronously. If any uncaught exception occurs anywhere during the transaction execution (or if a governor limit is exceeded), **all database changes made prior in that transaction are automatically rolled back**.

You can also programmatically create **Savepoints** inside Apex to roll back to a specific checkpoint without aborting the entire Apex method.

```apex
public static void processOrderWithSavepoint(Order__c newOrder, List<Order_Line_Item__c> items) {
    // 1. Create a Savepoint before performing multi-step database changes
    Savepoint sp = Database.setSavepoint();
    
    try {
        // Step A: Insert header record
        insert newOrder;
        
        // Step B: Link and insert child items
        for (Order_Line_Item__c item : items) {
            item.Order__c = newOrder.Id;
        }
        insert items;
        
        // Step C: Call external or complex billing verification logic
        if (items.size() == 0) {
            throw new CustomValidationException('Order must contain at least 1 line item.');
        }
    } catch (Exception e) {
        System.debug('Error occurred during order processing: ' + e.getMessage());
        
        // 2. Roll back ALL database inserts/updates made after Database.setSavepoint()!
        Database.rollback(sp);
        
        // Optional: Re-throw or log error safely
    }
}
```

### ⚠️ Crucial Gotcha: Savepoint ID Persistence Bug
When an sObject is inserted into the database (`insert newOrder;`), Salesforce immediately populates the `Id` property on the in-memory Apex variable (`newOrder.Id = '0015g00000XyZ12'`).
If you subsequently call **`Database.rollback(sp);`**, the record is removed from the database tables, **BUT the `Id` value on your in-memory variable (`newOrder.Id`) remains populated in RAM and is NOT cleared out!** Attempting to update or re-insert `newOrder` later in the same code without setting `newOrder.Id = null;` will throw an invalid ID or record not found error.

---

## 7. PD1 Exam & Technical Interview Gotchas

| # | Question / Scenario | Exact Answer & Technical Rule |
| :---: | :--- | :--- |
| **1** | **Can you put a SOQL query or DML inside a `for` loop if you know the loop only runs 5 times?** | **Never.** Even if tested with small data, bulk updates (e.g., Data Loader inserting 200 records at once) will trigger the trigger/loop 200 times, hitting Governor Limit **#101 SOQL queries** or **#151 DML statements**. Always query outside loops into `Map<Id, sObject>` and DML once outside loops. |
| **2** | **Why might a formula field not be searchable or filterable in a SOQL `WHERE` clause?** | If the formula references **cross-object lookup fields (`Account.Parent.Name`)**, **dynamic date functions (`TODAY()`, `NOW()`)**, or **encrypted fields**, the system cannot create a deterministic database index, causing full table scans or query failures. |
| **3** | **What happens when you run `Database.insert(records, false)` and hit Governor Limit #151 (Too many DML statements)?** | **The entire transaction rolls back immediately.** `allOrNone = false` only handles data/validation errors (`REQUIRED_FIELD_MISSING`, `FIELD_CUSTOM_VALIDATION_EXCEPTION`). It **cannot** catch or survive hard **Governor Limit exceptions** (`System.LimitException`). |
| **4** | **What is the return data type of a SOSL (`FIND`) query versus a SOQL (`SELECT`) query?** | SOQL returns a flat **`List<sObject>`** (or a single sObject / `Integer` for count). SOSL always returns a two-dimensional array: **`List<List<sObject>>`**, where each inner list corresponds to an object type requested in the `RETURNING` clause. |
| **5** | **How many child records can a Parent-to-Child subquery (`SELECT Name, (SELECT Id FROM Contacts) FROM Account`) return before throwing an error?** | Across the entire query, subqueries can retrieve up to **50,000 total child records** cumulative across all parent rows. If an Account has 60,000 Contacts, the subquery will throw `System.LimitException: Too many SOQL queries / records retrieved: 50001`. |
| **6** | **Can you use `SELECT * FROM Account` in SOQL to get every custom and standard field?** | **No.** Unlike SQL, `SELECT *` is invalid in SOQL. You must explicitly specify field names (`SELECT Id, Name, Status__c`) or use modern field sets (`FIELDS(STANDARD)` / `FIELDS(CUSTOM)`) with strict `LIMIT 200` constraints. |
| **7** | **What happens if a SOQL query returns 0 rows when assigned directly to a single sObject variable (`Account a = [SELECT Id FROM Account WHERE Name = 'NoMatch' LIMIT 1];`)?** | It throws a **`System.QueryException: List has no rows for assignment to SObject`**. To avoid this exception, always assign query results to a **`List<Account>`** and check `if (!accList.isEmpty()) { Account a = accList[0]; }`. |
| **8** | **Does `Database.rollback(Savepoint)` restore changes made to static variables or in-memory collection lists?** | **No.** `Database.rollback(sp)` strictly undoes **database table DML changes**. Any static variables modified (`AccountTriggerHandler.isFirstRun = true;`) or items added to `List<String>` in memory remain exactly as modified after rollback! |
| **9** | **Can you perform DML inside an `@AuraEnabled(cacheable=true)` controller method?** | **No!** Methods marked `cacheable=true` are strictly read-only for client-side performance. Any `insert`, `update`, or `delete` statement inside a cacheable method throws an immediate `AuraHandledException` runtime error. |
| **10** | **What is the difference between `SOQL FOR UPDATE` vs standard querying?** | `FOR UPDATE` places a **database-level row lock** on all retrieved records while the current transaction runs. This prevents other concurrent transactions or users from updating those exact records until your transaction commits or rolls back, preventing race conditions. |

---
*Next Step: Proceed to [Phase 3: Triggers & The Order of Execution](file:///c:/Users/karth/Desktop/PD1/apex%20notes/Apex-Mastery-Roadmap.md#L74) to learn how to hook this database logic into automated record lifecycle events!*
