# Domain 6: Quick-Reference Master Cheat Sheet & Exam Hacks

Use this master quick-reference guide for your final 24-hour review before walking into the Salesforce Platform Developer I (PD1) exam.

---

## 1. Must-Memorize Governor Limits Table

| Metric | Synchronous Limit | Asynchronous Limit (`@future`, Queueable, Batch) |
| :--- | :---: | :---: |
| **SOQL Queries per Transaction** | 100 | 200 |
| **SOQL Records Retrieved** | 50,000 | 50,000 |
| **SOSL Queries per Transaction** | 20 | 20 |
| **DML Statements per Transaction** | 150 | 150 |
| **DML Records Processed** | 10,000 | 10,000 |
| **CPU Time per Transaction** | 10,000 ms (10 seconds) | 60,000 ms (60 seconds) |
| **Heap Memory per Transaction** | 6 MB | 12 MB |
| **HTTP/Web Service Callouts** | 100 | 100 |
| **Callout Maximum Timeout** | 120 seconds | 120 seconds |

---

## 2. Trigger Context Variables Availability Matrix

| Context Variable | `before insert` | `before update` | `before delete` | `after insert` | `after update` | `after delete` | `after undelete` |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **`Trigger.new`** | **YES** *(Editable)* | **YES** *(Editable)* | NO | **YES** *(Read-Only)* | **YES** *(Read-Only)* | NO | **YES** *(Read-Only)* |
| **`Trigger.newMap`** | NO | **YES** | NO | **YES** | **YES** | NO | **YES** |
| **`Trigger.old`** | NO | **YES** | **YES** | NO | **YES** | **YES** | NO |
| **`Trigger.oldMap`** | NO | **YES** | **YES** | NO | **YES** | **YES** | NO |

> [!TIP]
> **Quick Memory Trick for `Trigger.newMap`:** Why is `Trigger.newMap` null inside `before insert`? Because the record has **not yet been saved to the database**, so it does not have an `Id` yet to act as the map key!

---

## 3. Order of Execution (V-T-V-A-W-P-E)
1. System Validations (Required fields, formatting)
2. `before` Triggers
3. Custom Validation Rules & System Validations step 2
4. Duplicate Rules
5. Save to Database (No commit yet)
6. `after` Triggers
7. Assignment Rules
8. Auto-Response Rules
9. Workflow Rules *(Triggers `before/after update` ONE more time if field update occurs!)*
10. Escalation Rules
11. Record-Triggered Flows / Process Builders
12. Entitlement Rules
13. Rollup Summary & Formula cross-object field updates
14. Sharing evaluation
15. **DML Database Commit**

---

## 4. Top 10 Exam Gotchas & Trick Questions

1. **"Can you call an `@future` method from an `@future` method?"**
   - **NO!** You cannot invoke asynchronous code (`@future` or `Batchable`) from an `@future` method (`No async in async`). If you need to chain jobs, use **Queueable Apex** (`System.enqueueJob()`).

2. **"Does `@TestSetup` run before every single test method or just once?"**
   - It runs **ONCE per test class** before any individual test methods execute. If Test Method A modifies or deletes a `@TestSetup` record, the platform automatically rolls back those changes so Test Method B sees the pristine setup data.

3. **"Can you perform DML inside an `@AuraEnabled(cacheable=true)` method?"**
   - **NO!** Methods marked `cacheable=true` are strictly **read-only**. Any `insert`, `update`, or `delete` statement will throw an immediate runtime exception.

4. **"What happens when `Database.insert(records, false)` encounters one invalid record among 50?"**
   - The **1 invalid record fails and is skipped**, while the other **49 valid records are successfully inserted** into the database (`allOrNone = false`).

5. **"Why can't a Formula field be indexed or used efficiently in a SOQL `WHERE` clause?"**
   - If the formula field uses dynamic date functions (`TODAY()`, `NOW()`), references cross-object lookup fields (`Account.Parent.Name`), or references encrypted fields, the system cannot build a deterministic database index.

6. **"Can a Lookup relationship field on a child object have a Rollup Summary field on the parent?"**
   - **NO!** Rollup summary fields (`COUNT`, `SUM`, `MIN`, `MAX`) strictly require a **Master-Detail relationship**. If you need rollup summaries on a Lookup relationship, you must write an **Apex Trigger** or a **Record-Triggered Flow**.

7. **"What happens if your synchronous transaction hits query #101 (`System.LimitException`)?"**
   - The **entire transaction is immediately rolled back**, and the user sees a fatal error (`Too many SOQL queries: 101`). You **cannot** catch a `System.LimitException` inside a `try-catch` block!

8. **"Does `Test.startTest()` increase your governor limits?"**
   - **NO!** It gives you a **fresh, separate set of governor limits** specifically for the code between `startTest()` and `stopTest()`, so test setup data creation doesn't consume limits from the actual code being tested.

9. **"Can you delete a field or Apex class using a standard Change Set?"**
   - **NO!** Change Sets can only create or update metadata. To delete components in target orgs, you must use **Salesforce CLI (`sf project deploy start`)** with a `destructiveChanges.xml` manifest.

10. **"What is the difference between `Schema.sObjectType` and `Schema.DescribeSObjectResult`?"**
    - A **Token (`Schema.sObjectType`)** is a lightweight pointer to an object type (`Account.sObjectType`). A **Describe Result (`describeResult = token.getDescribe()`)** is the heavy object containing full metadata (`isAccessible()`, `isCustom()`, `fields.getMap()`).

---

## 5. Notes & Summer '26 (API v67.0) Master Exam & Release Cheat Sheet

### Exact PD1 Syllabus Domain Weightings Quick Reference
*   **Logic and Process Automation:** ~29% – 30% *(Highest Weight!)*
*   **User Interface (LWC / Aura / VF):** ~24% – 25% *(Second Highest Weight!)*
*   **Testing, Debugging, and Deployment:** ~20% – 22%
*   **Data Modeling and Management:** ~13%
*   **Salesforce Fundamentals:** ~7%
*   **Developer Tools:** ~7%

### Summer '26 (API v67.0) Top Developer Updates Cheat Sheet
*   **`WITH USER_MODE` / `AccessLevel.USER_MODE`:** The #1 recommended Summer '26 pattern for enforcing Object-Level (CRED) and Field-Level (FLS) Security across SOQL and DML operations.
*   **String Templates (`f'{var}'` / Interpolation):** Cleaner string concatenation and dynamic SOQL formatting in Apex.
*   **Structured Log Filtering:** Filter log categories (`APEX_CODE`, `DB`) in VS Code/Developer Console without parsing multi-MB raw files.
*   **Headless Experience Layer (HXL) & Vibe Coding:** Generally Available (GA) capability to decouple LWC/UI experiences from backend data, allowing seamless deployment across standard Lightning or AI agent interfaces.
*   **Salesforce Hosted MCP Servers (GA):** Standard OAuth protocol connecting AI models (Agentforce, Claude, ChatGPT) directly to Salesforce schemas and data securely.

