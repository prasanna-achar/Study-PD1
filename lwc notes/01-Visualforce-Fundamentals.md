# Objective 1: Visualforce Fundamentals

> Format: Rule → Syntax → Trap → Example → Mnemonic

---

## 1. Controller Types on `<apex:page>`

### 1A. Standard Controller
**Rule:** Binds the page to ONE standard Salesforce sObject. Runs in **user mode** (respects CRUD, FLS, sharing).

**Syntax:**
```xml
<apex:page standardController="Account">
    {!Account.Name}
</apex:page>
```

**Trap:** You cannot use `standardController` and `controller` on the same page. Pick one.

**Mnemonic:** "Standard = one record, one object, user mode."

---

### 1B. Custom Controller
**Rule:** You write the entire controller logic. Runs in **system mode** by default (bypasses CRUD, FLS, sharing). Constructor is **no-argument**.

**Syntax:**
```apex
public class MyController {
    public MyController() {}  // ← NO PARAMETERS
    public String getName() { return 'Hello'; }
}
```
```xml
<apex:page controller="MyController">
    {!name}
</apex:page>
```

**Trap:** People try to pass parameters to the custom controller constructor. There are NONE.

**Mnemonic:** "Custom controller = alone, no args, system mode."

---

### 1C. Controller Extension
**Rule:** Extends a standard OR custom controller. Constructor MUST accept the controller as a parameter.

**Syntax:**
```apex
// Extension on a STANDARD controller
public class MyExtension {
    private ApexPages.StandardController stdCtrl;
    public MyExtension(ApexPages.StandardController stdCtrl) {
        this.stdCtrl = stdCtrl;
    }
}

// Extension on a CUSTOM controller
public class MyExtension {
    public MyExtension(MyCustomController ctrl) { }
}
```
```xml
<apex:page standardController="Account" extensions="MyExtension">
```

**Trap:** The extension constructor parameter type must match. On standard controller → `ApexPages.StandardController`. On custom → the custom class itself.

**Mnemonic:** "Extension needs a hand to hold — takes the controller it extends."

---

## 2. Standard Controller: `recordSetVar`

**Rule:** `recordSetVar` turns the standard controller into a **list controller** (like `StandardSetController`). It binds to a list of records on a list page.

**Syntax:**
```xml
<apex:page standardController="Contact" recordSetVar="contacts">
    <apex:repeat value="{!contacts}" var="c">
        {!c.Name}
    </apex:repeat>
</apex:page>
```

**Trap:** You chose `getAllRecordsVar`. The correct attribute name is **`recordSetVar`**.

**Mnemonic:** "`recordSetVar` = set of records variable."

---

## 3. Valid Standard Controller Actions

**Rule:** Only these 6 actions are valid for standard controllers.

| Action | What It Does |
| :--- | :--- |
| `save` | Inserts/updates the record, redirects to detail page |
| `quickSave` | Saves but stays on the same page |
| `edit` | Navigates to edit page |
| `delete` | Deletes the record |
| `cancel` | Discards changes, goes back |
| `list` | Goes to list view |

**Trap:** `Select`, `Export`, `Abort`, `Close`, `Break` — these do NOT exist!

**Syntax:**
```xml
<apex:commandButton value="Save" action="{!save}" />
<apex:commandButton value="Quick Save" action="{!quickSave}" />
```

**Mnemonic:** "**SQEDCL** — Save, QuickSave, Edit, Delete, Cancel, List. Nothing else."

---

## 4. Getter & Setter Rules

**Rule:** Getters expose controller properties to the page. Setters receive values from the page. Naming convention is strict.

| Pattern | In Controller | In Page |
| :--- | :--- | :--- |
| Getter | `public String getName()` | `{!name}` |
| Setter | `public void setName(String s)` | `<apex:inputText value="{!name}">` |
| Combined (property) | `public String name { get; set; }` | `{!name}` |

**Setter Execution Order:**
```
HTTP POST received
    → Setters fire FIRST (populate values from form)
    → Action method fires SECOND
    → Getters fire LAST (to re-render)
```

**Trap:** Setter is NOT always required. If `<apex:inputField>` is bound to an **sObject field directly** (`{!account.Name}`), the binding is automatic — no setter needed.

**Mnemonic:** "Setters SET before the action. Getters GET after."

---

## 5. DML Restrictions in VF Controllers

**Rule:** This is the #1 rule people miss.

| Location | DML Allowed? |
| :--- | :--- |
| **Getter method** | ❌ NO |
| **Constructor** | ❌ NO |
| **Setter method** | ✅ YES |
| **Action method (button handler)** | ✅ YES |

**Why?** Getters run on every page render (potentially multiple times). DML in a getter would fire uncontrollably.

**Trap:** Also, `@future` methods cannot be called from getters, setters, or constructors — only from action methods.

**Syntax — Wrong:**
```apex
public List<Contact> getContacts() {
    insert new Contact(LastName='Test'); // ❌ NEVER DO THIS
    return [SELECT Id FROM Contact];
}
```

**Syntax — Right:**
```apex
public PageReference saveAndProcess() {  // action method
    insert this.contact;  // ✅ OK
    return null;
}
```

**Mnemonic:** "Getters and constructors get no DML. Only action methods act."

---

## 6. View State & Transient

**Rule:** View state stores the component tree between HTTP requests. It has a **135 KB limit**.

| Variable Type | Included in View State? |
| :--- | :--- |
| Normal instance variable | ✅ YES |
| `transient` instance variable | ❌ NO |
| Static variable | ❌ NO |

**Syntax:**
```apex
public transient List<String> tempList; // excluded from view state
```

**Trap:** `transient` variables are NOT transmitted in view state. They reset on every postback.

**Mnemonic:** "Transient = temporary = not transmitted."

---

## 7. VF Iteration Components

**Rule:** Know which component adds Salesforce styling and which doesn't.

| Component | Salesforce Styling? | Use Case |
| :--- | :--- | :--- |
| `<apex:pageBlockTable>` | ✅ YES (standard Salesforce look) | Default styled data table |
| `<apex:dataTable>` | ❌ NO | Custom-styled table |
| `<apex:dataList>` | ❌ NO | Custom-styled list |
| `<apex:repeat>` | ❌ NO | Full custom rendering |

**Trap:** If a question says "custom styled" or "no standard styling" → use `<apex:dataTable>`, `<apex:dataList>`, or `<apex:repeat>`. If it says "standard Salesforce look" → `<apex:pageBlockTable>`.

**Syntax:**
```xml
<!-- Custom styled table -->
<apex:dataTable value="{!accounts}" var="a">
    <apex:column value="{!a.Name}"/>
</apex:dataTable>

<!-- Standard Salesforce styled table -->
<apex:pageBlockTable value="{!accounts}" var="a">
    <apex:column value="{!a.Name}"/>
</apex:pageBlockTable>
```

**Mnemonic:** "PageBlock = Salesforce style. dataTable/dataList/repeat = your own style."

---

## 8. Accessing Related Records in VF

**Rule:** To access child records on a VF page, you MUST traverse from the parent using dot notation.

**Trap:**
```xml
{! Contacts }         <!-- ❌ WRONG — ambiguous/invalid -->
{! account.contacts } <!-- ✅ CORRECT — traverse from parent -->
```

**Syntax:**
```xml
<apex:page standardController="Account">
    <apex:repeat value="{!account.Contacts}" var="c">
        {!c.Name}
    </apex:repeat>
</apex:page>
```

**Mnemonic:** "Always start from the parent. Contacts don't exist alone on a VF page."

---

## 9. Fake VF Components (Common Traps)

**Rule:** These components DO NOT EXIST. The exam lists them to trick you.

| Fake Component | Real Replacement |
| :--- | :--- |
| `<apex:fieldValue>` | `<apex:outputField>` |
| `<apex:userInfo>` | `{!$User.FirstName}` (global variable) |

**Syntax — Real:**
```xml
<apex:outputField value="{!account.Name}"/>
{!$User.FirstName} {!$User.LastName}
```

**Mnemonic:** "If you've never seen it in real Salesforce dev, it's probably fake."

---

## 10. Global Variables in VF

| Variable | Use Case |
| :--- | :--- |
| `{!$User.FirstName}` | Current user's name, email, ID |
| `{!$Resource.myFile}` | Reference a trusted static resource |
| `{!$IFrameResource.myHtml}` | Reference an external/untrusted HTML file in an iframe |
| `{!$Label.MyLabel}` | Custom label |
| `{!$Organization.Name}` | Org name |
| `{!$Page.MyPageName}` | Reference to another VF page |

**Trap:** `ApexPages.Page().existingPageName` does NOT exist. Use `Page.existingPageName` in Apex or `{!$Page.existingPageName}` in VF markup.

---

## 11. VF Charts in PDF

**Rule:** VF charts do **NOT render** when a page uses `renderAs="pdf"`.

**Syntax:**
```xml
<apex:page renderAs="pdf">
    <!-- Charts will NOT appear here -->
    <apex:chart .../>  <!-- ❌ Invisible in PDF -->
</apex:page>
```

**Mnemonic:** "PDF pages can't draw charts. Print doesn't do dynamic graphics."

---

## Quick Reference Cheat Sheet

```
Controller type  |  Constructor         |  Runs as
─────────────────────────────────────────────────────
Standard         |  No code needed      |  User mode
Custom           |  No-arg              |  System mode
Extension        |  Takes ctrl param    |  Inherits from base
```

```
DML Allowed?
─────────────────────────────────────────────────────
Getter           → ❌ NO
Constructor      → ❌ NO
Setter           → ✅ YES
Action method    → ✅ YES
```

```
Styling?
─────────────────────────────────────────────────────
pageBlockTable   → ✅ Salesforce styling
dataTable        → ❌ No default styling
dataList         → ❌ No default styling
repeat           → ❌ No default styling
```
