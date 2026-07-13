# Domain 1: Salesforce Fundamentals (Exam Weighting: ~7%)

## 1. Multi-Tenant Architecture & Cloud Computing
Salesforce operates on a **multi-tenant cloud architecture**, meaning multiple customers (tenants) share common physical infrastructure and application instances while maintaining strict logical isolation of their data and customizations.

### Key Characteristics:
- **Metadata-Driven Architecture:** Everything you build (custom objects, fields, Apex classes, page layouts, workflows) is stored as **metadata** alongside the actual application data. When a user interacts with Salesforce, the system uses this metadata to dynamically render the exact customized application for that specific tenant.
- **Resource Sharing & Protection:** Because computing resources (CPU time, database memory, network bandwidth) are shared among all tenants on an instance, Salesforce enforces **Governor Limits** to ensure no single tenant can monopolize shared resources or degrade performance for others.
- **Automatic Upgrades:** Salesforce delivers three major seasonal releases every year (Spring, Summer, Winter). All tenants on an instance upgrade simultaneously without breaking existing customizations because customizations are cleanly isolated via metadata APIs.

---

## 2. Model-View-Controller (MVC) in Salesforce
Salesforce maps directly to the standard MVC architectural pattern:

```
+-------------------------------------------------------------+
|                        VIEW LAYER                           |
|  Lightning Web Components (HTML/CSS), Aura, Visualforce     |
+-------------------------------------------------------------+
                               ^  |
                User Actions / |  | Data & State
                Events         |  v Updates
+-------------------------------------------------------------+
|                      CONTROLLER LAYER                       |
|  Apex Controllers, LWC JavaScript, Declarative Flows        |
+-------------------------------------------------------------+
                               ^  |
                SOQL/SOSL      |  | DML Operations
                Queries        |  v (Insert/Update/Delete)
+-------------------------------------------------------------+
|                        MODEL LAYER                          |
|  Standard & Custom Objects (sObjects), Fields, Relationships|
+-------------------------------------------------------------+
```

### MVC Breakdown:
1. **Model (Data & Schema):**
   - Represents the database structure and data.
   - Includes Standard Objects (`Account`, `Contact`, `Opportunity`), Custom Objects (`Invoice__c`), Fields (`Status__c`), and Relationships (`Lookup`, `Master-Detail`).
   - Represented programmatically in Apex as **`sObject`** (Salesforce Object).

2. **View (User Interface):**
   - Represents the visual interface presented to the end user.
   - Built with **Lightning Web Components (LWC)** (`.html`, `.css`), **Aura Components**, or legacy **Visualforce Pages** (`.page`).

3. **Controller (Business Logic):**
   - Processes user actions from the View, enforces business rules, interacts with the Model via SOQL/DML, and returns updated data to the View.
   - **Client-Side Controllers:** LWC JavaScript (`.js`) or Aura Controller/Helper (`.js`).
   - **Server-Side Controllers:** Apex Classes (`@AuraEnabled` methods, Custom Controllers, Controller Extensions).
   - **Declarative Controllers:** Lightning Flows, Validation Rules.

---

## 3. Declarative vs. Programmatic Customization Boundaries
One of the most heavily tested concepts on the PD1 exam is deciding **when to use declarative (clicks) vs. programmatic (code)** tools.

> [!IMPORTANT]
> **Golden Rule of Salesforce Development:** *Always use declarative tools (Clicks) before reaching for programmatic tools (Code).* Only use code when declarative automation cannot meet the business requirements!

### Declarative Tools (Clicks):
- **Validation Rules:** Enforce data integrity before a record is saved to the database. Can use complex formulas (`VLOOKUP`, `REGEX`, `ISCHANGED`, `PRIORVALUE`).
- **Lightning Flows:**
  - **Screen Flows:** Multi-step guided UI wizards for users.
  - **Record-Triggered Flows:** Execute before or after record create/update/delete. Can perform DML, send emails, make callouts (via actions), and update related records.
  - **Schedule-Triggered Flows:** Run on a set batch schedule for matching records.
  - **Autolaunched Flows:** Invoked by Apex, Process Builder, or REST API.
- **Rollup Summary Fields:** Automatically calculate `COUNT`, `SUM`, `MIN`, `MAX` of child records (Requires **Master-Detail** relationship!).
- **Formula Fields:** Read-only calculated fields computed dynamically at query time.

### Programmatic Tools (Code):
When should you write **Apex Triggers, Classes, or LWC** instead of using Flows/Declarative tools?
1. **High-Volume Transaction Processing:** When processing thousands of records in batch or high-throughput integrations where Flows would hit CPU or SOQL limits.
2. **Complex Custom UI:** Interactive dashboards, custom drag-and-drop interfaces, or reactive single-page applications (use **LWC**).
3. **External System Callouts & Synchronous Web Services:** Consuming REST/SOAP APIs with custom authentication headers, XML/JSON parsing, or building custom Apex REST endpoints (`@RestResource`).
4. **Complex Transactional Logic & Savepoints:** When business rules require explicit transaction rollback (`Database.rollback(sp)`) or exact error handling (`try-catch` across multiple objects).
5. **Cross-Object Operations Without Direct Relationships:** Querying and updating objects that share no relationship in the database hierarchy, or requiring complex `AggregateResult` SOQL queries (`GROUP BY`, `HAVING`).
6. **Custom Email Processing & Inbound Email Handlers:** Intercepting incoming emails (`Messaging.InboundEmailHandler`) to parse attachments and create records dynamically.

---

## 4. Governor Limits & Multi-Tenant Protection
Governor limits are hard execution boundaries checked at runtime during a single **transaction** (a synchronous request or asynchronous execution unit).

| Limit Type | Synchronous Limit | Asynchronous Limit (`@future`, Batch, Queueable) |
| :--- | :--- | :--- |
| **Total SOQL Queries** | 100 queries | 200 queries |
| **Total Records Retrieved by SOQL** | 50,000 records | 50,000 records |
| **Total SOSL Queries** | 20 queries | 20 queries |
| **Total DML Statements** | 150 statements | 150 statements |
| **Total Records Processed by DML** | 10,000 records | 10,000 records |
| **Maximum CPU Time** | 10,000 milliseconds (10s) | 60,000 milliseconds (60s) |
| **Maximum Heap Size** | 6 MB | 12 MB |
| **Total Callouts (HTTP/Web Service)** | 100 callouts | 100 callouts |
| **Maximum Callout Timeout** | 120 seconds cumulative | 120 seconds cumulative |
| **Total Email Invocations** | 10 invocations | 10 invocations |

---

## 5. High-Yield Exam Tips & Common Traps
- **Trap 1:** *Can a Record-Triggered Flow delete related records?* Yes! Record-Triggered Flows can perform Create, Update, and Delete operations.
- **Trap 2:** *When do formula fields calculate?* Formula fields are calculated dynamically every time they are accessed (queried or viewed). They do **not** store their calculated value directly in the database table.
- **Trap 3:** *Why might a formula field not be searchable or filterable in SOQL?* If the formula references cross-object fields, dynamic date functions (`TODAY()`, `NOW()`), or encrypted fields, it cannot be indexed.
- **Trap 4:** *If a transaction exceeds a governor limit (`System.LimitException`), what happens?* The entire transaction is **rolled back instantly**. You **cannot** catch a `System.LimitException` inside a `try-catch` block!

---

## 6. Notes & Summer '26 (API v67.0) Release Updates (PD1 Syllabus Alignment)

### Syllabus Alignment Note (Domain Weighting: ~7%)
While this domain carries ~7% of the exam questions (~4-5 questions), understanding multi-tenant architecture, MVC boundaries, and governor limits is critical foundational knowledge for Domain 3 (Apex Logic) and Domain 4 (LWC UI).

### Summer '26 (API v67.0) Key Updates for Domain 1:
1. **User-Mode Execution Defaults:** Summer '26 emphasizes building custom applications that adhere natively to tenant security boundaries using `WITH USER_MODE` in SOQL and `AccessLevel.USER_MODE` in DML, preventing data leakage between multi-tenant users.
2. **Headless 360 & MCP Servers (GA):** Salesforce Hosted Model Context Protocol (MCP) Servers allow programmatic AI agents (like Agentforce) to securely access tenant metadata and records via OAuth without violating shared multi-tenant resource boundaries or governor limits.
3. **Structured Debug Log Filtering:** When tracking governor limits (`LIMIT_USAGE`) across multi-tenant executions, Summer '26 structured log filtering in VS Code and Developer Console allows developers to isolate CPU and heap limit warnings instantly without parsing uncompressed RAW logs.

