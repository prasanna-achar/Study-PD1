# Objective 3: StandardSetController & List Controllers

> Format: Rule → Syntax → Trap → Example → Mnemonic
> **This is the single biggest killer on the exam. Every method must be memorized.**

---

## 1. Constructor: What It Accepts

**Rule:** `ApexPages.StandardSetController` can be instantiated with ONLY two types:

| Accepted | Type |
| :--- | :--- |
| ✅ | `List<sObject>` |
| ✅ | `Database.QueryLocator` |
| ❌ | `Set<sObject>` |
| ❌ | `Map<Id, sObject>` |
| ❌ | Any specific sObject type directly |

**Syntax:**
```apex
// From a List
List<Account> accounts = [SELECT Id, Name FROM Account];
ApexPages.StandardSetController ssc = new ApexPages.StandardSetController(accounts);

// From a QueryLocator
Database.QueryLocator ql = Database.getQueryLocator('SELECT Id, Name FROM Account');
ApexPages.StandardSetController ssc = new ApexPages.StandardSetController(ql);
```

**Trap:** The exam offers `Set<sObject>` as a trick option. It DOES NOT compile.

**Mnemonic:** "List or Locator. Nothing else."

---

## 2. The 10,000 Record Limit — THE Critical Rule

**Rule:** Behavior is COMPLETELY different depending on which constructor you used.

| Constructor | Records > 10,000 | What Happens |
| :--- | :--- | :--- |
| `List<sObject>` | Yes | ✅ **Silently truncated** to 10,000. No error. No warning. |
| `Database.QueryLocator` | Yes | ❌ **`LimitException` thrown** immediately. |

**Example:**
```apex
// Scenario A: List of 11,000 accounts
List<Account> bigList = [SELECT Id FROM Account LIMIT 11000];
ApexPages.StandardSetController ssc1 = new ApexPages.StandardSetController(bigList);
// ssc1 now contains exactly 10,000 records — silently truncated. No error!

// Scenario B: QueryLocator returning 11,000 accounts
Database.QueryLocator ql = Database.getQueryLocator('SELECT Id FROM Account');
ApexPages.StandardSetController ssc2 = new ApexPages.StandardSetController(ql);
// ❌ LimitException thrown here!
```

**Trap — Most Common:**
> "What happens when you instantiate `StandardSetController` with a `List` of 11,000 records?"
> ❌ "An exception is thrown" ← People choose this
> ✅ "The list is truncated to 10,000" ← Correct

**Mnemonic:** "**List truncates. Locator throws.**"

---

## 3. Key Methods — Every Single One

### 3A. `getRecords()`
**Rule:** Returns ALL records on the **current page**.

```apex
List<sObject> pageRecords = ssc.getRecords();
```
```xml
<apex:repeat value="{!records}" var="r">
    {!r.Name}
</apex:repeat>
```

---

### 3B. `getSelected()`
**Rule:** Returns only the records the **user has selected** (via checkboxes, usually with `<apex:inputCheckbox>`).

```apex
List<sObject> selectedRecords = ssc.getSelected();
```

**Trap:** `getChecked()`, `getCheckedList()`, `getSelection()` — **NONE OF THESE EXIST!**

---

### 3C. `getRecord()` (SINGULAR!)
**Rule:** Returns a **prototype sObject** — used for **mass updates**. When you modify this single object and save, the changes apply to ALL **selected records** (`getSelected()`).

```apex
// SINGULAR getRecord() — not getRecords()
sObject prototype = ssc.getRecord();
```

**Example — Mass Update Pattern:**
```apex
// In the controller
public PageReference massUpdate() {
    Account template = (Account) ssc.getRecord(); // get the prototype
    // template.Rating has been set via the VF form
    for (Account a : (List<Account>) ssc.getSelected()) {
        a.Rating = template.Rating; // apply to all selected
    }
    update ssc.getSelected();
    return null;
}
```

**Trap:**
- `getRecord()` (singular) = prototype for mass updates ← What you need for mass update
- `getRecords()` (plural) = current page records ← For displaying data

**Mnemonic:** "One record = `getRecord()`. Many records on page = `getRecords()`. Selected = `getSelected()`."

---

### 3D. `getCompleteResult()`
**Rule:** Returns `true` if the controller was able to process all records. Returns **`false`** if records were truncated or could not all be processed.

```apex
Boolean allProcessed = ssc.getCompleteResult();
// FALSE means: not all records could be processed
// TRUE means: everything was processed
```

**Trap:** People think `TRUE` means "could not process." It is the OPPOSITE. **`FALSE` = incomplete.**

**Mnemonic:** "Complete = TRUE = all done. NOT complete = FALSE = truncated/incomplete."

---

### 3E. `getResultSize()`
**Rule:** Returns the **total count** of records in the StandardSetController.

```apex
Integer totalCount = ssc.getResultSize();
```

---

### 3F. Pagination Methods

```apex
ssc.setPageSize(10);      // Set records per page
ssc.first();              // Go to first page
ssc.last();               // Go to last page
ssc.next();               // Next page
ssc.previous();           // Previous page
Boolean hasNext = ssc.getHasNext();
Boolean hasPrev = ssc.getHasPrevious();
Integer pageNum = ssc.getPageNumber();
```

**VF Pagination Template:**
```xml
<apex:commandButton value="First" action="{!first}" disabled="{!NOT(hasPrevious)}"/>
<apex:commandButton value="Prev" action="{!previous}" disabled="{!NOT(hasPrevious)}"/>
<apex:commandButton value="Next" action="{!next}" disabled="{!NOT(hasNext)}"/>
<apex:commandButton value="Last" action="{!last}" disabled="{!NOT(hasNext)}"/>
Page {!pageNumber}
```

---

## 4. Complete Method Reference Table

| Method | Returns | Use Case |
| :--- | :--- | :--- |
| `getRecords()` | `List<sObject>` | All records on current page |
| `getSelected()` | `List<sObject>` | User-selected records only |
| `getRecord()` | `sObject` (SINGULAR!) | Prototype for mass update |
| `getCompleteResult()` | `Boolean` | `FALSE` = records truncated/incomplete |
| `getResultSize()` | `Integer` | Total record count |
| `setPageSize(n)` | `void` | Set records per page |
| `first()` / `last()` | `void` | Go to first/last page |
| `next()` / `previous()` | `void` | Go to next/prev page |
| `getHasNext()` | `Boolean` | More pages exist after current |
| `getHasPrevious()` | `Boolean` | More pages exist before current |
| `getPageNumber()` | `Integer` | Current page number (1-based) |

**❌ Methods That Do NOT Exist (Exam Traps):**
- `getChecked()` ← FAKE
- `getCheckedList()` ← FAKE
- `getSelection()` ← FAKE
- `getAllRecords()` ← FAKE

---

## 5. Using StandardSetController in VF Markup

**Rule:** There is **no `standardSetController=` attribute** on `<apex:page>`. You instantiate `StandardSetController` in Apex code, NOT in VF markup.

**Trap:**
```xml
<!-- ❌ This attribute does NOT exist! -->
<apex:page standardSetController="Account">
```

**The RIGHT way** — use `standardController` with `recordSetVar` for list views, OR create a custom controller:
```apex
// Custom controller using StandardSetController
public class AccountListController {
    public ApexPages.StandardSetController ssc { get; set; }

    public AccountListController() {
        ssc = new ApexPages.StandardSetController(
            Database.getQueryLocator('SELECT Id, Name FROM Account')
        );
        ssc.setPageSize(10);
    }

    public List<Account> getAccounts() {
        return (List<Account>) ssc.getRecords();
    }
}
```

---

## 6. Filter & List View Options

**Rule:** `StandardSetController` can be configured with list view filters.

```apex
// Get available list view options
List<SelectOption> views = ssc.getListViewOptions();
// Returns list views available to the current user

// Set a specific filter
ssc.setFilterId('00B000000XXXXXX');
```

```xml
<apex:selectList value="{!filterId}" size="1">
    <apex:selectOptions value="{!listViewOptions}"/>
</apex:selectList>
<apex:commandButton value="Go" action="{!apply}"/>
```

---

## Quick Reference Cheat Sheet

```
StandardSetController Constructor:
  ✅ List<sObject>         → truncates silently if > 10,000
  ✅ Database.QueryLocator → LimitException if > 10,000
  ❌ Set<sObject>          → DOES NOT EXIST
  ❌ Map<Id, sObject>      → DOES NOT EXIST

Critical Methods:
  getRecords()       → current PAGE records (plural)
  getSelected()      → checkbox-selected records
  getRecord()        → SINGULAR prototype for mass update
  getCompleteResult() → FALSE = incomplete/truncated
  getResultSize()    → total count

Fake Methods (TRAP OPTIONS):
  getChecked()       → FAKE
  getCheckedList()   → FAKE
  getSelection()     → FAKE
```

**The #1 Mnemonic:**
> "**List truncates. Locator throws.**"
> "**Singular `getRecord()` = mass update prototype. Plural `getRecords()` = page display.**"
> "**`getCompleteResult()` FALSE = problem. TRUE = all good.**"
