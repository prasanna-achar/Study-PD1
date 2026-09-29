# Objective 2: Visualforce Controllers & Extensions (Deep Dive)

> Format: Rule → Syntax → Trap → Example → Mnemonic

---

## 1. Custom Controller: System Mode Explained

**Rule:** Custom controllers run in **system mode** — they bypass CRUD, FLS, and sharing rules entirely, unless you explicitly add `with sharing`.

| Keyword | CRUD/FLS? | Sharing Rules? |
| :--- | :--- | :--- |
| No keyword (default) | ❌ Ignored | ❌ Ignored |
| `with sharing` | ❌ Ignored | ✅ Enforced |
| `without sharing` | ❌ Ignored | ❌ Ignored |
| `inherited sharing` | ❌ Ignored | Inherited from caller |

**Critical point:** `with sharing` only enforces **record-level sharing** (OWD, role hierarchy). It does NOT enforce CRUD or FLS. For CRUD/FLS, use `WITH SECURITY_ENFORCED` in SOQL or `Security.stripInaccessible()`.

**Syntax:**
```apex
public with sharing class MyController {
    // Queries only return records the user CAN see (sharing enforced)
    // But ALL fields are still accessible (FLS NOT enforced)
    public List<Account> getAccounts() {
        return [SELECT Id, Name, AnnualRevenue FROM Account];
    }
}
```

**Trap:** People think `with sharing` = full security. It only enforces sharing rules, NOT FLS.

**Mnemonic:** "`with sharing` = sharing only. For FLS, you need more."

---

## 2. Custom Controller: Constructor Rule

**Rule:** A custom controller's constructor takes **ZERO parameters**. Period.

**Syntax:**
```apex
public class MyAccountController {
    private Account acc;

    public MyAccountController() {  // ← ZERO params
        this.acc = new Account();
    }

    public Account getAccount() { return acc; }
}
```

**Trap:**
```apex
// ❌ WRONG — this is what an EXTENSION looks like, not a custom controller
public class MyController {
    public MyController(ApexPages.StandardController sc) { }
}
```

**Mnemonic:** "Custom controller = self-made, self-started. No handshake with anyone."

---

## 3. Controller Extension: Constructor Rule

**Rule:** An extension's constructor takes **exactly one parameter** — the controller it extends.

| Extended | Constructor Parameter Type |
| :--- | :--- |
| Standard Controller | `ApexPages.StandardController` |
| Standard Set Controller | `ApexPages.StandardSetController` |
| Custom Controller | The custom controller class name |

**Syntax:**
```apex
// Extending a STANDARD controller
public class AccountExtension {
    private ApexPages.StandardController sc;

    public AccountExtension(ApexPages.StandardController sc) {
        this.sc = sc;
        Account a = (Account) sc.getRecord(); // access the record
    }
}

// Extending a CUSTOM controller
public class MyExtension {
    public MyExtension(MyCustomController ctrl) {
        // ctrl is the custom controller instance
    }
}
```

**Using multiple extensions:**
```xml
<apex:page standardController="Account" extensions="ExtA,ExtB">
```
> **Order matters!** `ExtA` is evaluated first. If both define a method with the same name, `ExtA` wins.

**Trap:** You cannot put the extension BEFORE the controller in the `extensions` attribute and expect it to control the page — extensions always complement, never replace.

**Mnemonic:** "Extension always extends something. Always takes a controller parameter."

---

## 4. Extensions: What They Can and Cannot Do

**Rule:**
- ✅ Extensions CAN override standard actions (`save`, `edit`, etc.)
- ✅ Extensions CAN add new action methods
- ❌ Extensions CANNOT replace the standard controller entirely
- ❌ Extensions CANNOT use a different sObject than what the standard controller binds to

**Trap (Classic Exam Question):**
> "To override the standard 'View' button on Opportunity, use a controller extension."

This is **wrong**. You MUST use:
```xml
<apex:page standardController="Opportunity" extensions="MyExt">
```
The **`standardController="Opportunity"`** is required to override Opportunity's standard buttons. You cannot override an object's standard buttons using a different object's controller or a pure custom controller.

**Mnemonic:** "To override an object's button, use that object's StandardController. Extension rides along."

---

## 5. Web Service Methods: Global Requirement

**Rule:** Any Apex class that contains a `webservice` keyword method **MUST** be declared `global`. Not `public`.

**Syntax:**
```apex
// ✅ Correct
global class MyWebService {
    webservice static String getInfo(String input) {
        return 'Result: ' + input;
    }
}

// ❌ Wrong — 'public' is insufficient for web service methods
public class MyWebService {
    webservice static String getInfo(String input) { ... }
}
```

**Mnemonic:** "Web services speak to the world. They need to be `global`."

---

## 6. Web Service: Security Access Model

**Rule:** Security is checked at the **entry point only**. Once a web service method is invoked, all subsequent internal Apex code runs in **system mode** — it can call any other method, access any field, do any DML.

**Example:**
```apex
global class ServiceClass {
    webservice static void processData() {
        // Security checked here when called externally ✅
        helperMethod(); // This runs in system mode, no further check ✅
    }

    private static void helperMethod() {
        // System mode — can access all records/fields regardless of user permissions
        update [SELECT Id FROM Contact LIMIT 100];
    }
}
```

**Trap:** People assume `helperMethod()` would throw a permission error if the user can't edit Contacts. It won't — internal calls run in system mode.

**Mnemonic:** "Door check happens at the door. Inside the house, you go anywhere."

---

## 7. Parameter Passing: Value vs Reference

**Rule:** This is a basic Apex rule that the exam uses to trick VF/web service questions.

| Data Type | Passed By |
| :--- | :--- |
| `String`, `Integer`, `Boolean`, `Decimal`, `Date`, etc. (primitives) | **Value** (a copy is made) |
| `List<T>`, `Map<K,V>`, `Set<T>`, sObjects | **Reference** (same object in memory) |

**Example:**
```apex
String s = 'hello';
modifyString(s);
// s is still 'hello' — primitive passed by value

List<Integer> nums = new List<Integer>{1, 2, 3};
modifyList(nums);
// nums IS changed — list passed by reference
```

**Trap:** "Both String and List are passed by reference." → **Wrong.** String is by value.

**Mnemonic:** "Primitives are copies. Collections are the real thing."

---

## 8. Overriding Standard Buttons: Rules

**Rule:** Standard action buttons (New, Edit, View, Delete, Clone) can be overridden per-object via **Setup → Object → Buttons, Links, and Actions**.

| Context | Override Option |
| :--- | :--- |
| Salesforce Classic | Visualforce Page |
| Lightning Experience | LWC or Aura Component |
| Mobile | LWC or Aura Component |

**All three contexts** (Classic, LEX, Mobile) can be configured on **the same override screen**.

**What CANNOT be overridden:**
- ❌ Buttons on the **edit page** (Save, Cancel on the edit form)
- ❌ The actual deletion trigger logic (if Delete is overridden with VF, the VF page controls whether deletion happens — the trigger only fires if the VF page actually performs a delete DML)

**Important:**
> Overriding the **View** button affects **all links** throughout Salesforce that navigate to that record's detail page — not just the button on the detail page.

**Mnemonic:** "Override the View button = override every link to that record across the org."

---

## Quick Reference: Constructor Summary

```
Controller Type       | Constructor Signature
──────────────────────────────────────────────────────
Custom Controller     | public MyCtrl() {}
Extension (standard)  | public MyExt(ApexPages.StandardController sc) {}
Extension (custom)    | public MyExt(MyCustomController ctrl) {}
```

## Quick Reference: Mode Summary

```
Keyword              | Sharing Enforced? | CRUD/FLS Enforced?
──────────────────────────────────────────────────────────────
No keyword           | ❌ No             | ❌ No
with sharing         | ✅ Yes            | ❌ No
without sharing      | ❌ No             | ❌ No
inherited sharing    | Inherits          | ❌ No
WITH USER_MODE       | ✅ Yes            | ✅ Yes (SOQL/SOSL only)
WITH SECURITY_ENFORCED | ✅ Yes (throws) | ✅ Yes (throws exception if no access)
stripInaccessible    | N/A               | ✅ Yes (silently strips inaccessible fields)
```
