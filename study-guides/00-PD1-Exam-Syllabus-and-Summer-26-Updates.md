# PD1 Exam Syllabus & Summer '26 (API v67.0) Release Updates Notes

This master study guide notes section synthesizes the exact **Salesforce Certified Platform Developer I (PD1) Exam Syllabus & Domain Weightings** with the latest **Summer '26 (API v67.0) Developer Release Updates**. Use this document as your primary alignment reference alongside the domain-specific study guides (`01` through `06`).

---

## 1. Official PD1 Exam Syllabus & Domain Weightings (2026 Outline)

The Salesforce Platform Developer I exam tests your ability to develop programmatic and declarative solutions on the Lightning Platform while adhering to multi-tenant best practices and governor limits.

### Exam Overview & Logistics
- **Total Questions:** 60 multiple-choice/multiple-select questions + 5 unscored experimental questions.
- **Time Allotted:** 105 minutes.
- **Passing Score:** ~68% (varies slightly per exam delivery build).
- **Prerequisites:** None required, but *Salesforce Certified Administrator* and *Platform App Builder* concepts form foundational prerequisites.

---

### Domain Breakdown & Study Guide Mapping

| Exam Domain | Official Weighting | Core Topics & Focus Areas | Corresponding Study Guide |
| :--- | :---: | :--- | :--- |
| **Logic and Process Automation** | **29% – 30%** | Apex Language fundamentals, OOP principles, Collections (`List`, `Set`, `Map`), SOQL & SOSL queries, DML operations & savepoints, Apex Triggers & context variables, Order of Execution, Asynchronous Apex (`@future`, Batchable, Queueable, Schedulable), Declarative vs. Programmatic boundaries (Flow vs. Apex). | [03-Process-Automation-and-Apex-Logic.md](file:///c:/Users/karth/Desktop/PD1/study-guides/03-Process-Automation-and-Apex-Logic.md) |
| **User Interface** | **24% – 25%** | **Lightning Web Components (LWC)** architecture (`.html`, `.js`, `.css`), LWC lifecycle hooks (`connectedCallback`, `renderedCallback`), `@wire` service & Lightning Data Service (LDS), Component communication (Props/Events vs. LMS), Aura component integration, and legacy Visualforce controllers. | [04-User-Interface-LWC-and-Aura.md](file:///c:/Users/karth/Desktop/PD1/study-guides/04-User-Interface-LWC-and-Aura.md) |
| **Testing, Debugging, and Deployment** | **20% – 22%** | Apex Unit Testing (`@isTest`, `Test.startTest()`, `Test.stopTest()`), 75% deployment coverage requirements, positive/negative/bulk/restricted-user testing, `@TestSetup` lifecycle, Debug Logs & Log Levels, Checkpoints, Salesforce CLI (`sf`), Change Sets, and Unmanaged vs. Managed packages. | [05-Testing-Debugging-and-Deployment.md](file:///c:/Users/karth/Desktop/PD1/study-guides/05-Testing-Debugging-and-Deployment.md) |
| **Data Modeling and Management** | **13%** | Schema concepts (`sObjects`, Standard vs. Custom objects), Relationship types (`Lookup`, `Master-Detail`, `Junction / Many-to-Many`), Schema Metadata APIs (`Schema.sObjectType`, `getDescribe()`), Rollup Summary vs. Formula fields, and Data Security hierarchy (OWD, Role Hierarchy, Sharing Rules, Apex Managed Sharing). | [02-Data-Modeling-and-Management.md](file:///c:/Users/karth/Desktop/PD1/study-guides/02-Data-Modeling-and-Management.md) |
| **Salesforce Fundamentals** | **7%** | Multi-tenant cloud computing architecture, Metadata-driven engine, Model-View-Controller (MVC) pattern implementation, Governor limits (`#101 SOQL`, `#151 DML`, CPU time, Heap size), and seasonal automatic release upgrades. | [01-Salesforce-Fundamentals.md](file:///c:/Users/karth/Desktop/PD1/study-guides/01-Salesforce-Fundamentals.md) |
| **Developer Tools** | **7%** | Modern developer tooling, Salesforce CLI (`sf project deploy start`), VS Code Salesforce Extension Pack, Scratch Orgs & Dev Hub workflows, and Source-Driven Development (`force-app/main/default`). | Integrated into [05-Testing-Debugging-and-Deployment.md](file:///c:/Users/karth/Desktop/PD1/study-guides/05-Testing-Debugging-and-Deployment.md) and [06-Quick-Reference-Cheat-Sheet.md](file:///c:/Users/karth/Desktop/PD1/study-guides/06-Quick-Reference-Cheat-Sheet.md) |

> [!TIP]
> **Exam Strategy Note:** Together, **Logic & Process Automation (~30%)** and **User Interface (~25%)** account for over **55%** of the exam. Prioritize deep hands-on mastery of Apex collections/queries/triggers and LWC reactive patterns (`@wire`, lifecycle, communication).

---

## 2. Summer '26 (API v67.0) Release Updates for PD1 Developers

The Salesforce Summer '26 release introduces critical platform enhancements centered around **user-mode security defaults**, **LWC state management and Headless 360 ("Vibe Coding")**, **streamlined string templates in Apex**, and **AI / MCP Server integrations**. Below are the key notes and updates you must know for PD1 syllabus alignment and real-world development.

### A. Apex Language & Security Enhancements

#### 1. Apex User-Mode Defaults & Explicit Security Enforcement
- **What Changed:** Summer '26 enforces stricter baseline adherence to user-level security (`AccessLevel.USER_MODE`) when writing Apex code that interacts with database data.
- **Key Concepts:**
  - By default, Apex executes in **System Mode** (ignoring Object-Level Security / CRED and Field-Level Security / FLS).
  - To enforce user security cleanly without verbose `Schema.DescribeFieldResult.isAccessible()` checks, use explicit `WITH USER_MODE` in SOQL/SOSL or pass `AccessLevel.USER_MODE` to Database methods:
    ```apex
    // SOQL with explicit User Mode enforcement (Summer '26 Best Practice)
    List<Account> accList = [SELECT Id, Name, AnnualRevenue FROM Account WITH USER_MODE];

    // DML operation respecting running user's FLS and CRED permissions
    Database.insert(newAccounts, false, AccessLevel.USER_MODE);
    ```
  - **Exam Note:** If an exam question asks for the most secure and concise way to prevent FLS/CRED bypasses in custom Apex controllers or `@AuraEnabled` methods, select **`WITH USER_MODE`** or **`AccessLevel.USER_MODE`**.

#### 2. String Templates & Dynamic Query Formatting
- **What Changed:** Apex in Summer '26 expands support for string templating/interpolation patterns, reducing errors during complex string concatenation.
- **Why It Matters:** When building dynamic SOQL queries or constructing JSON payloads for HTTP callouts, string templating creates cleaner, readable syntax while minimizing SQL injection risks when combined with binding variables (`:variableName`).

#### 3. Enhanced Exception Stack Trace Formatting
- **What Changed:** Summer '26 overhauls how stack traces are formatted in Apex unit tests (`Test.stopTest()`) and asynchronous executions.
- **Developer Impact:** Exception traces now pinpoint exact method boundaries and line numbers with clearer separation of trigger execution steps and class invocations, making root-cause analysis significantly faster during test debugging.

---

### B. Lightning Web Components (LWC) & Headless Experience Layer (HXL)

#### 1. Headless Experience Layer (HXL) & Custom Lightning Types (GA)
- **What Changed:** Summer '26 brings the **Headless Experience Layer (HXL)** and Custom Lightning Types to General Availability (GA), powering decoupled **"Vibe Coding"** architectures.
- **Key Architecture Note:** HXL allows developers to separate core business logic and state management from visual layout presentation. You can define a single decoupled experience definition and render it dynamically across standard Lightning pages, headless external applications, or AI agent interfaces.

#### 2. LWC State Managers & Responsive Interactivity
- **What Changed:** New reactive state management tools are introduced natively for LWC to handle multi-step workflows and complex shared states across deeply nested component trees without relying purely on custom DOM event bubbling (`dispatchEvent`).
- **Exam Note on Component Communication:**
  - **Parent to Child:** Use `@api` public properties or public methods.
  - **Child to Parent:** Use `CustomEvent` (`this.dispatchEvent(new CustomEvent('update'))`).
  - **Unrelated Components / Cross-DOM:** Use **Lightning Message Service (LMS)** with explicit `MessageChannel` definitions or the new Summer '26 state management patterns.

#### 3. `@AuraEnabled(cacheable=true)` Security & Cache Invalidation
- **What Changed:** Stricter enforcement of user-mode caching behavior across `@wire` service adapters.
- **Important Rule:** Any Apex method annotated with `@AuraEnabled(cacheable=true)` must **NEVER perform DML (`insert`, `update`, `delete`)**. Attempting DML inside a cacheable method immediately throws a runtime exception (`AuraHandledException`).

---

### C. Debugging Tools, CLI (`sf`), and AI Integrations

#### 1. Structured Log Filtering in VS Code & Developer Console
- **What Changed:** Summer '26 adds native **structured log filtering** capabilities to the Salesforce VS Code Extension Pack and Developer Console.
- **Developer Impact:** Instead of downloading multi-megabyte `RAW` trace logs and manually searching for `USER_DEBUG` or `LIMIT_USAGE`, developers can apply structured filters to isolate specific categories (`APEX_CODE`, `DB`, `VALIDATION`) and log levels (`DEBUG`, `INFO`, `ERROR`, `FINEST`).

#### 2. Salesforce Hosted MCP (Model Context Protocol) Servers & Agentforce
- **What Changed:** As part of the **Headless 360** initiative, **Salesforce Hosted Model Context Protocol (MCP) Servers** are now Generally Available (GA).
- **Why It Matters:** MCP provides a standardized, secure OAuth-based protocol that allows external and internal AI agents (Agentforce, Claude, ChatGPT) to discover, query, and interact with Salesforce metadata (`sObjects`, flows, custom APIs) programmatically without requiring brittle custom integration wrappers.

---

## 3. High-Yield Summer '26 Alignment Checklist for PD1

When reviewing code questions on your PD1 exam or building production applications in a Summer '26 org, check off these critical rules:
- [x] **Enforce User Mode:** Always prefer `WITH USER_MODE` in SOQL over legacy manual `isAccessible()` field loops.
- [x] **No DML in Cacheable Methods:** Check every `@AuraEnabled(cacheable=true)` method to verify zero DML operations exist.
- [x] **Bulkify All Operations:** Never place SOQL queries or DML statements inside `for` loops. Use `List<sObject>` collections for bulk processing (`Database.insert(list, false)`).
- [x] **Use CLI `sf` Commands:** Remember that `sfdx` CLI syntax has transitioned to the unified `sf` CLI command structure (`sf project deploy start`, `sf apex run test`).
- [x] **Governor Limit Protection:** Remember that synchronous transactions allow up to **100 SOQL queries** and **150 DML statements**, whereas asynchronous transactions (`@future`, Batchable, Queueable) double the SOQL allowance to **200 queries**.
