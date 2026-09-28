# Exam Paper 5: User Interface (Obj 1) – PD1 (Attempt 1)

**Date**: 2026-09-28
**Score**: 38/74 (51.35%) ❌ FAIL
**Time**: 1h 32m 16s

---

## Wrong Answers: 36 total — Grouped by Pattern

---

### PATTERN 1: StandardSetController Methods (6 wrong)

This was the single biggest killer. You mixed up every method.

| What You Chose | Correct Answer | Rule |
| :--- | :--- | :--- |
| Exception thrown (list of 11,000) | **List is truncated** to 10,000 | List → truncate silently |
| Instantiated without issues (queryLocator 11,000) | **LimitException thrown** | QueryLocator → exception |
| `Database.QueryLocator or Set<sObject>` | `List<sObject>` or `Database.QueryLocator` | No `Set<sObject>`! |
| `getCheckedList()` | `getSelected()` | `getChecked()`, `getCheckedList()`, `getSelection()` DON'T EXIST |
| `getCompleteResult() returns TRUE` if can't process | Returns **FALSE** if can't process all records | FALSE = incomplete |
| `getSelected() and getRecords()` for mass update | `getSelected()` and `getRecord()` (SINGULAR) | `getRecord()` returns a prototype object for mass update |

**Memorize this:**
```
StandardSetController:
  Constructor:    List<sObject> OR Database.QueryLocator (nothing else!)
  List > 10,000:  Silently TRUNCATED
  QL > 10,000:    LimitException THROWN
  getSelected():  Returns selected records
  getRecord():    Returns PROTOTYPE sObject for mass updates (SINGULAR!)
  getRecords():   Returns ALL records on current page
  getCompleteResult(): FALSE = can't process all records
```

---

### PATTERN 2: Custom Controller Rules (5 wrong)

| What You Chose | Correct Answer | Rule |
| :--- | :--- | :--- |
| Constructor with `ApexPages.StandardController` param | **No-argument constructor** | Custom controller constructor = `public MyController() {}` — NO params |
| `public` access for web service class | **`global`** | Classes with web service methods MUST be `global` |
| "Both passed by reference" | String = **by value**, List = **by reference** | Primitives = value, Non-primitives = reference |
| "Exception thrown when calling MethodB" | **Executes in system mode** — all fields updated | Web service access checked at entry point only; subsequent code = system mode |
| "Override controller extension actions" | Custom controller runs in **system mode** | That's the main use case for custom controllers |

---

### PATTERN 3: Controller Extensions (4 wrong)

| What You Chose | Correct Answer | Rule |
| :--- | :--- | :--- |
| "Standard controller is extension of extension" | Extensions defined via `extensions` attribute on `<apex:page>` | Extensions extend controllers, NOT the reverse |
| "Replace standard controller entirely" | Extensions **override actions** (edit, view, save) | Extensions ADD to controllers, don't replace them |
| "Use controller extension" to override Opportunity view | Use **Opportunity StandardController** | To override standard buttons, the standard controller for that object MUST be used |
| "standardSetController=" attribute | `Instantiate ApexPages.StandardSetController` in code | There is no `standardSetController` attribute on `<apex:page>` |

---

### PATTERN 4: Fake VF Components That Don't Exist (3 wrong)

| You Chose | Reality |
| :--- | :--- |
| `<apex:fieldValue>` | ❌ Doesn't exist → use `<apex:outputField>` |
| `<apex:userInfo>` | ❌ Doesn't exist → use `{!$User.FirstName}` global variables |
| `ApexPages.Page().existingPageName` | ❌ Doesn't exist → use `Page.existingPageName` |

---

### PATTERN 5: Standard Controller Actions (2 wrong)

**Valid actions**: Save, QuickSave, Edit, Delete, Cancel, List
**NOT valid**: Select ❌, Export ❌, Abort ❌, Close ❌, Break ❌

---

### PATTERN 6: VF Data Display Without Standard Styling (2 wrong)

| Question | What You Chose | Correct |
| :--- | :--- | :--- |
| Custom styled table components | Included `<apex:pageBlockTable>` | `<apex:dataTable>`, `<apex:dataList>`, `<apex:repeat>` — pageBlockTable has STANDARD styling |
| Access child contacts in VF markup | `{! Contacts }` | `{! account.contacts }` — must include the parent reference |

---

### PATTERN 7: Visualforce State & Lifecycle (3 wrong)

| What You Chose | Correct Answer |
| :--- | :--- |
| "Transient variables are transmitted as view state" | Transient variables are **excluded** from view state |
| "Setter methods always required to pass input" | NOT always — if `<apex:inputField>` is bound to sObject field, setter is automatic |
| "VF charts can display in PDF" | ❌ VF charts do NOT render in PDF pages |

---

### PATTERN 8: LWC Best Practices (5 wrong)

| What You Chose | Correct Answer | Rule |
| :--- | :--- | :--- |
| `bubbles:true, composed:true` always | `bubbles:false, composed:false` preferred | Minimize DOM disruption |
| "Preload all data including rare fields" | Use LDS to cache + pass data between components | Lazy load, don't preload everything |
| "Load all in Console sub-tabs" | Standard tabs + `<lightning-tabset>` for lazy loading | Console sub-tabs are NOT lazy-loaded |
| "Multiple small server calls for fresh data" | `@AuraEnabled(cacheable=true)` + custom caching | Fewer calls, more caching |
| `lightning__FlowScreen` for server-side without UI | `lightning__FlowAction` = background logic (no UI), `lightning__FlowScreen` = custom UI | FlowAction = headless, FlowScreen = has UI |

---

### PATTERN 9: Misc Gaps (6 wrong)

| Topic | What You Got Wrong |
| :--- | :--- |
| **recordSetVar** | Chose `getAllRecordsVar` — correct is `recordSetVar` |
| **Unmanaged packages** | Didn't recognize that unmanaged packages can be modified/customized |
| **Getter/setter naming** | Correct: getter = `getVariable`, setter = `setVariable` |
| **Round-robin lead assignment** | No standard controller supports this — find an unmanaged package |
| **VF charts in PDF** | Charts do NOT work in renderAs="pdf" |
| **DML in getters/constructors** | DML NOT allowed in getters or constructors — only in setters and action methods |
