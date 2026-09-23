# Priority 3: Schema Describe API — Complete Method Reference

*You understand the concepts but pick the wrong method names. This cheat sheet gives you the exact names.*

---

## Class Hierarchy

```
Schema (namespace)
├── Schema.getGlobalDescribe()          → Map<String, Schema.SObjectType>
├── Schema.describeSObjects(String[])   → DescribeSObjectResult[]
│
├── Schema.SObjectType (token)
│   └── .getDescribe()                  → DescribeSObjectResult
│
├── Schema.DescribeSObjectResult
│   ├── Object Info Methods
│   │   ├── .getName()                  → String (API name: "Account")
│   │   ├── .getLabel()                 → String (UI label: "Account")
│   │   ├── .getKeyPrefix()             → String ("001")
│   │   ├── .isCustom()                 → Boolean
│   │   ├── .isSearchable()             → Boolean
│   │   └── .getSObjectType()           → Schema.SObjectType (for creating new instances)
│   │
│   ├── Permission Methods
│   │   ├── .isAccessible()             → Boolean (user can READ object)
│   │   ├── .isCreateable()             → Boolean (user can CREATE)
│   │   ├── .isUpdateable()             → Boolean (user can UPDATE)
│   │   ├── .isDeletable()              → Boolean (user can DELETE)
│   │   └── .isUndeletable()            → Boolean (user can UNDELETE)
│   │
│   ├── Field Methods
│   │   └── .fields.getMap()            → Map<String, Schema.SObjectField>
│   │
│   └── RecordType Methods ⭐ (YOU MISSED THESE)
│       ├── .getRecordTypeInfos()             → List<Schema.RecordTypeInfo>
│       ├── .getRecordTypeInfosById()         → Map<Id, Schema.RecordTypeInfo>
│       ├── .getRecordTypeInfosByDeveloperName() → Map<String, Schema.RecordTypeInfo>
│       └── .getRecordTypeInfosByName()       → Map<String, Schema.RecordTypeInfo>
│
├── Schema.SObjectField (token)
│   └── .getDescribe()                  → DescribeFieldResult
│
├── Schema.DescribeFieldResult
│   ├── Info Methods
│   │   ├── .getName()                  → String (API name)
│   │   ├── .getLabel()                 → String (UI label)
│   │   ├── .getType()                  → Schema.DisplayType (STRING, PICKLIST, etc.)
│   │   ├── .getLength()                → Integer (max Unicode characters)
│   │   ├── .getDigits()                → Integer (max digits for Integer fields) ⭐
│   │   ├── .getScale()                 → Integer (decimal places for Double fields)
│   │   ├── .getPicklistValues()        → List<Schema.PicklistEntry>
│   │   ├── .getReferenceTo()           → List<Schema.SObjectType> (related objects)
│   │   └── .getSObjectType()           → Schema.SObjectType
│   │
│   └── Permission Methods
│       ├── .isAccessible()             → Boolean (user can READ field)
│       ├── .isCreateable()             → Boolean (user can set on CREATE)
│       ├── .isUpdateable()             → Boolean (user can EDIT field)
│       └── .isFilterable()             → Boolean (can be used in WHERE clause)
│
└── Schema.RecordTypeInfo
    ├── .getName()                      → String (UI label of record type)
    ├── .getDeveloperName()             → String (API/developer name) ⭐
    ├── .getRecordTypeId()              → Id
    ├── .isAvailable()                  → Boolean
    ├── .isDefaultRecordTypeMapping()   → Boolean
    └── .isMaster()                     → Boolean
```

---

## The Exam Traps & How to Avoid Them

### Trap 1: getRecordTypeInfos() vs getRecordTypeInfosById()

| Method | Returns | When to Use |
| :--- | :--- | :--- |
| `getRecordTypeInfos()` | **List**<RecordTypeInfo> | When you need to iterate through all record types |
| `getRecordTypeInfosById()` | **Map<Id**, RecordTypeInfo> | When you have a record type **Id** and need its info |
| `getRecordTypeInfosByDeveloperName()` | **Map<String**, RecordTypeInfo> | When you have the **developer name** |
| `getRecordTypeInfosByName()` | **Map<String**, RecordTypeInfo> | When you have the **UI label** |

**Memory trick:** The method name tells you the return type's key:
- "ById" → key is `Id`
- "ByDeveloperName" → key is `String` (developer name)
- "ByName" → key is `String` (UI label)
- No suffix → returns a `List`

### Trap 2: getDigits() vs getLength() vs getScale()

| Method | What It Returns | Valid For |
| :--- | :--- | :--- |
| `getDigits()` | Max number of digits | **Integer** fields only |
| `getLength()` | Max Unicode characters | **String/Text** fields |
| `getScale()` | Digits after decimal point | **Double/Currency** fields |

### Trap 3: Object-level vs Field-level isAccessible()

| Check | Class | What It Checks |
| :--- | :--- | :--- |
| "Can user access this **object**?" | `DescribeSObjectResult.isAccessible()` | Object-level CRED |
| "Can user see this **field**?" | `DescribeFieldResult.isAccessible()` | Field-Level Security |

Both methods have the **same name** (`isAccessible`), but are on **different classes**. The exam will try to trick you with the wrong class name.

### Trap 4: Methods That DON'T Exist

The exam loves to include fake method names. These are **NOT real**:

```
❌ isViewable()          — use isAccessible() instead
❌ isReadable()          — use isAccessible() instead
❌ canDelete()           — use isDeletable() instead
❌ Deletable()           — use isDeletable() instead
❌ getRecordTypes()      — use getRecordTypeInfos() instead
❌ getRecordTypeIds()    — not a real method
❌ getGlobalSObjects()   — use getGlobalDescribe() instead
❌ getSObjectName()      — use getName() instead
❌ getSize()             — use getLength() instead
❌ Database.execute()    — use Database.query() instead
❌ SOQL.execute()        — not a real class/method
❌ Database.search()     — not a real method (use Search.query())
```

---

## Global Describe vs describeSObjects

| Method | What It Does | Returns |
| :--- | :--- | :--- |
| `Schema.getGlobalDescribe()` | Returns ALL sObjects in the org | `Map<String, Schema.SObjectType>` |
| `Schema.describeSObjects(String[])` | Returns describe info for **specific** named sObjects | `DescribeSObjectResult[]` |

**Q12 Trap:** You chose `describeSObjects()` when the question asked about "all sObjects in an organization" → the answer is `getGlobalDescribe()`.

---

## Dynamic SOQL — The Only Valid Method

```apex
// ✅ CORRECT — The only way to execute dynamic SOQL
List<Account> accs = Database.query('SELECT Id, Name FROM Account WHERE Name = :searchTerm');

// ❌ WRONG — These methods DO NOT EXIST:
Database.execute(queryString);   // FAKE
SOQL.execute(queryString);       // FAKE
Database.search(queryString);    // FAKE (for SOSL, use Search.query())
```

For dynamic SOSL:
```apex
List<List<SObject>> results = Search.query('FIND :searchTerm IN ALL FIELDS RETURNING Account(Id, Name)');
```
