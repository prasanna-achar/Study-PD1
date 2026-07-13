# Domain 2: Data Modeling and Management (Exam Weighting: ~13%)

## 1. Object Relationships in Salesforce
Understanding how objects connect to each other and the exact behavioral differences between relationship types is critical for the PD1 exam.

### Comparison Table: Lookup vs. Master-Detail vs. Junction

| Feature / Behavior | Lookup Relationship | Master-Detail Relationship | Many-to-Many (Junction Object) |
| :--- | :--- | :--- | :--- |
| **Relationship Coupling** | **Loose coupling** (Child can exist independently of parent). | **Tight coupling** (Child cannot exist without a parent Master record). | Created using a custom object with two separate **Master-Detail** fields pointing to two different parent objects. |
| **Required on Child?** | Optional (unless checked as required on field level). | **Always Required** (`MasterDetail` field cannot be null). | Both Master-Detail lookup fields on the junction object are strictly required. |
| **Deletion Behavior** | **Clear the value** (default), restrict delete, or cascade delete (only if custom-to-custom with Salesforce support enabled). | **Cascade Delete:** Deleting the Master record automatically deletes all child detail records. | Deleting *either* of the two Master records automatically deletes the intermediate junction record. |
| **Security & Sharing** | Child has its own independent **Organization-Wide Default (OWD)** sharing and security rules. | **Inherited from Master:** Child detail record inherits security, sharing, and owner from the parent Master record. | Inherits security from **both** Master records. A user must have read access to both Masters to read the junction record. |
| **Owner Field** | Child record has its own `OwnerId` field. | **No independent Owner field:** `OwnerId` is inherited directly from the Master record. | No independent Owner field on the junction record. |
| **Rollup Summary Fields** | **NOT Supported** directly (requires Apex trigger or Declarative Flow). | **Supported:** Parent Master can have Rollup Summaries (`COUNT`, `SUM`, `MIN`, `MAX`) of children. | Both Master parent objects can have Rollup Summary fields summing/counting the junction object records. |
| **Reparenting Allowable?** | Yes, lookup values can be changed easily anytime. | **Disabled by default.** Can be enabled via checking *"Allow reparenting"* on the Master-Detail field definition. | Yes, if *"Allow reparenting"* is enabled on the Master-Detail fields. |
| **Max Limits per Object** | Up to **40 lookup relationships** per custom object. | Up to **2 Master-Detail relationships** per custom object. | A custom object can act as a junction object if it has exactly two Master-Detail fields. |

---

## 2. Schema Builder & Schema Metadata APIs
### Schema Builder (UI Tool)
- Drag-and-drop interface to view data models, create objects, fields, and relationships without clicking through Object Manager tabs.
- **Can create:** Custom Objects, Custom Fields, Lookup Relationships, Master-Detail Relationships.
- **Cannot create:** Page Layouts, Record Types, Validation Rules, Apex Triggers, or Security settings.

### Apex Schema Reflection (`Schema` Namespace)
Apex provides programmatic access to metadata about objects and fields at runtime via **Tokens** and **Describe Results**. This is essential for building dynamic SOQL queries and checking field-level security (`isAccessible()`, `isUpdateable()`, `isCreateable()`).

```apex
// 1. Get sObjectType token directly from sObject
Schema.sObjectType accountType = Account.sObjectType;

// 2. Get DescribeSObjectResult for deep inspection
Schema.DescribeSObjectResult describeAccount = accountType.getDescribe();
System.debug('Is Account Custom? ' + describeAccount.isCustom());
System.debug('Is Account Accessible by current user? ' + describeAccount.isAccessible());

// 3. Inspect specific Field Describe Results
Map<String, Schema.SObjectField> fieldMap = describeAccount.fields.getMap();
Schema.DescribeFieldResult statusField = fieldMap.get('Active__c').getDescribe();

if (statusField.isUpdateable()) {
    System.debug('Current user has permission to update Active__c!');
}
```

---

## 3. Data Import, Export, & Schema Manipulation Tools
Knowing when to use **Data Import Wizard** vs. **Data Loader** is a guaranteed exam topic:

| Criteria | Data Import Wizard | Salesforce Data Loader |
| :--- | :--- | :--- |
| **Maximum Record Limit** | Up to **50,000 records** per batch. | Up to **5,000,000 records** per batch. |
| **Supported Objects** | Standard Objects (`Account`, `Contact`, `Lead`, `Solution`, `Campaign Member`) + **All Custom Objects**. *(Note: Does NOT support `Opportunity` or `Case`!)* | **ALL Standard & Custom Objects** (`Opportunity`, `Case`, `Attachment`, `ContentVersion`, etc.). |
| **Operations Supported** | Insert, Update, Upsert. | Insert, Update, Upsert, **Delete**, **Hard Delete** (bypasses Recycle Bin), Export, Export All. |
| **Duplicate Prevention** | Built-in duplicate detection rules matching by Name, Email, or External ID. | No built-in duplicate detection UI; requires exact External IDs or record IDs. |
| **Automation / CLI** | Manual UI tool only inside Salesforce Setup. | Can be automated via **Command Line Interface (CLI)** using configuration files (`process-conf.xml`). |

---

## 4. Formula Fields vs. Rollup Summary Fields

### Formula Fields
- Read-only fields whose value is calculated dynamically at query/render time based on expressions.
- Can reference fields on the current record or fields from related parent records via lookup chain (`Account.Parent.Owner.Email`) up to **10 levels deep**.
- **Important Restrictions:**
  - Cannot be searched in global search or SOSL.
  - Cannot reference fields on child detail records.
  - Can trigger governor limit issues or query performance bottlenecks if used inside `WHERE` clauses in SOQL without proper deterministic indexation.

### Rollup Summary Fields
- Read-only fields that calculate `SUM`, `MIN`, `MAX`, or `COUNT` of child records in a **Master-Detail relationship**.
- Values are **stored directly in the parent database record** and updated automatically whenever a child record is inserted, updated, deleted, or undeleted!
- Because values are stored on the parent, Rollup Summaries **can** be indexed and used efficiently in SOQL filtering (`WHERE Child_Count__c > 5`).

---

## 5. Data Security Hierarchy: Org to Field Level

Salesforce enforces data access through a strict, multi-layered security funnel:

```
[ 1. Org-Level ]  ----> IP Restrictions, Login Hours, MFA, Profiles/Permission Sets
       |
[ 2. Object-Level ] --> CRED (Create, Read, Edit, Delete) via Profiles & Permission Sets
       |
[ 3. Field-Level ] ---> Field-Level Security (FLS) via Profiles & Permission Sets
       |
[ 4. Record-Level ] --> Organization-Wide Defaults (OWD) -> Role Hierarchy -> Sharing Rules -> Manual Sharing -> Apex Managed Sharing
```

### Record-Level Security Breakdown:
1. **Organization-Wide Defaults (OWD):** Sets the baseline level of access (`Private`, `Public Read Only`, `Public Read/Write`, `Controlled by Parent`) for records users do not own.
2. **Role Hierarchy:** Automatically grants access to users higher in the role tree above the record owner (always enabled for standard objects; optional for custom objects via *"Grant Access Using Hierarchies"*).
3. **Sharing Rules:** Exceptions to OWD to share specific records with Roles, Public Groups, or Queue based on record ownership or criteria (`Rating__c == 'Hot'`).
4. **Apex Managed Sharing (`ObjectShare`):** Programmatic sharing enforced via Apex (`AccountShare`, `CustomObject__Share`). Enables complex sharing algorithms when declarative rules fall short. Access level options: `Read`, `Edit`, `All`.

---

## 6. Notes & Summer '26 (API v67.0) Release Updates (PD1 Syllabus Alignment)

### Syllabus Alignment Note (Domain Weighting: ~13%)
Data Modeling & Management covers ~8 questions on the exam. Questions frequently test your ability to choose between `Lookup` and `Master-Detail`, understand when Schema Describe methods (`isAccessible()`, `isUpdateable()`) are required vs. declarative security, and how OWD interacts with programmatic sharing.

### Summer '26 (API v67.0) Key Updates for Domain 2:
1. **Enforcing CRED/FLS via User Mode (`AccessLevel.USER_MODE`):** Rather than writing complex loops over `Schema.DescribeFieldResult` calls before every DML statement to check `isCreateable()` or `isUpdateable()`, Summer '26 promotes using `Database.insert(records, false, AccessLevel.USER_MODE)` which natively enforces Object-Level and Field-Level Security based on the running user's profile and permission sets.
2. **Enhanced Schema Describe Caching in Apex:** Salesforce has optimized runtime schema token (`Schema.sObjectType`) resolution and describe map lookups (`getDescribe().fields.getMap()`), reducing CPU overhead when performing dynamic field inspection across large custom object hierarchies.
3. **External Data & MCP Metadata Access:** With the General Availability of Model Context Protocol (MCP) servers in Summer '26, custom object schemas and relationships (`Master-Detail` vs `Lookup`) can be exposed directly to Agentforce AI models while respecting baseline OWD and sharing rule restrictions automatically.

