# Objective 4: Security & Vulnerabilities

> Format: Rule → Syntax → Trap → Example → Mnemonic
> Covers: Sharing keywords, FLS enforcement, SOQL injection, XSS, CSRF, Crypto, external resources.

---

## 1. Sharing Keywords: What Each One Does

**Rule:** Sharing keywords control **record-level access** only. They do NOT enforce CRUD or FLS.

| Keyword | Sharing Rules | Use Case |
| :--- | :--- | :--- |
| `with sharing` | ✅ Enforced | Standard: use this in VF controllers to respect user visibility |
| `without sharing` | ❌ Ignored | Use when you need admin-level access regardless of the user |
| `inherited sharing` | Inherits from caller | Use when you want the class to behave based on how it's invoked |
| *(no keyword)* | Defaults to `without sharing` in most contexts | Avoid — unpredictable |

**Syntax:**
```apex
public with sharing class MyController {
    public List<Account> getAccounts() {
        return [SELECT Id, Name FROM Account]; // Only returns accounts user can see
    }
}
```

**Trap:** "`with sharing` enforces FLS." → **WRONG.** It only enforces sharing rules (OWD, role hierarchy, sharing rules). FLS requires `WITH SECURITY_ENFORCED` or `stripInaccessible`.

**Mnemonic:** "`with sharing` = sharing only. FLS needs something else."

---

## 2. `WITH SECURITY_ENFORCED` — Throws on Violation

**Rule:** Adds FLS and CRUD enforcement to SOQL inline queries. If the current user **cannot read** any of the queried fields or the object, a `System.QueryException` is thrown immediately.

**Syntax:**
```apex
// Placement: after WHERE, before ORDER BY / LIMIT
List<Contact> contacts = [
    SELECT Name, SSN__c, Phone
    FROM Contact
    WHERE Department = 'Sales'
    WITH SECURITY_ENFORCED    // ← goes HERE
    ORDER BY Name
    LIMIT 100
];
```

**Trap — Placement:**
```apex
// ❌ WRONG placement — after LIMIT
[SELECT Name FROM Contact WHERE Id = :someId LIMIT 10 WITH SECURITY_ENFORCED]

// ✅ CORRECT placement — after WHERE, before LIMIT/ORDER BY
[SELECT Name FROM Contact WHERE Id = :someId WITH SECURITY_ENFORCED LIMIT 10]
```

**When to use vs NOT use:**
- ✅ Use when: All users should be able to see the same fields, and you want an error if they can't.
- ❌ Do NOT use when: The page should display for everyone but hide some fields (use `stripInaccessible` instead — it silently strips, doesn't crash).

**Mnemonic:** "`WITH SECURITY_ENFORCED` = strict bouncer. No access = exception thrown."

---

## 3. `Security.stripInaccessible()` — Silent Field Removal

**Rule:** Strips fields from a query result that the current user cannot read. The query succeeds for everyone — inaccessible fields are simply removed from the result set.

**Syntax:**
```apex
List<Employee__c> employees = [SELECT Name, SSN__c, Salary__c FROM Employee__c];

// Strip fields the current user can't read
SObjectAccessDecision decision = Security.stripInaccessible(
    AccessType.READABLE,  // ← first param: what access type to check
    employees             // ← second param: the records
);

List<Employee__c> safeRecords = decision.getRecords();
// SSN__c and Salary__c may have been silently removed if user lacks FLS
```

**AccessType Values:**
| AccessType | Checks |
| :--- | :--- |
| `AccessType.READABLE` | Can the user **view** this field? |
| `AccessType.CREATABLE` | Can the user **create/insert** this field? |
| `AccessType.UPDATABLE` | Can the user **update** this field? |
| `AccessType.UPSERTABLE` | Can the user insert OR update this field? |

**Trap — Argument Order:**
```apex
// ❌ WRONG — order is reversed
Security.stripInaccessible(employees).setAccessType(AccessType.READABLE)

// ✅ CORRECT — AccessType FIRST, records SECOND
Security.stripInaccessible(AccessType.READABLE, employees)
```

**`WITH SECURITY_ENFORCED` vs `stripInaccessible`:**
| Scenario | Use |
| :--- | :--- |
| Component should crash if user can't see fields | `WITH SECURITY_ENFORCED` |
| Component should render for everyone, hiding fields they can't see | `Security.stripInaccessible()` |

**Mnemonic:** "`stripInaccessible` = silently strips. `WITH SECURITY_ENFORCED` = loudly throws."

---

## 4. `update as user` and `Database.update(..., AccessLevel.USER_MODE)`

**Rule:** Executes DML in the **running user's context**, enforcing their CRUD and FLS permissions.

**Syntax:**
```apex
// DML statement in user mode
update as user cases;

// Database class in user mode
Database.update(cases, true, AccessLevel.USER_MODE);

// DML statement in system mode (explicit)
update as system cases;

// Database class in system mode (explicit)
Database.update(cases, true, AccessLevel.SYSTEM_MODE);
```

**What happens if user lacks access?**
> If the user does NOT have edit access to a field that's being updated, the DML operation **throws an exception** immediately.

**Example (Exam Question):**
```apex
public without sharing class MyAccountController {
    public static void updateType() {
        List<Account> records = [SELECT Id, Type FROM Account WHERE Type = ''];
        for (Account a : records) {
            a.Type = 'Prospect';
        }
        update as user records; // User lacks edit access to Type field
        // → DML throws an exception!
    }
}
```

> Notice: Even though the class uses `without sharing` (so ALL accounts are returned by the SOQL), the `update as user` enforces FLS — if the user can't edit `Type`, the DML throws.

**Trap:** "The SOQL query will throw an exception." → **WRONG.** SOQL still runs fine (without sharing class). Only the DML throws.

**Mnemonic:** "`as user` = user's rules apply. No access to a field = DML exception."

---

## 5. `System.runAs()` — Test Classes ONLY

**Rule:** `System.runAs(user)` only works inside `@isTest` annotated methods. Cannot be used in production code.

```apex
@isTest
static void testSecurity() {
    User u = [SELECT Id FROM User WHERE Name = 'Test User' LIMIT 1];
    System.runAs(u) {
        // Code here runs as that specific user
    }
}
```

**Mnemonic:** "`runAs` = test-only. Real code uses `with sharing` and `as user`."

---

## 6. SOQL Injection Prevention

**Rule:** Never concatenate user input directly into a SOQL string. 3 defense methods:

### Method 1: Static Query with Bind Variable (Best)
```apex
String name = ApexPages.currentPage().getParameters().get('name');
String queryName = '%' + name + '%';

// ✅ Bind variable — user input treated as literal, NOT as SOQL
List<Contact> contacts = [SELECT Id FROM Contact WHERE Name LIKE :queryName];
```

### Method 2: `String.escapeSingleQuotes()`
```apex
String name = String.escapeSingleQuotes(
    ApexPages.currentPage().getParameters().get('name')
);
// Escapes single quotes so they can't break out of the SOQL string literal
String query = 'SELECT Id FROM Contact WHERE Name LIKE \'%' + name + '%\'';
List<Contact> contacts = Database.query(query);
```

### Method 3: Allowlisting (Typecasting)
```apex
Set<String> allowlist = new Set<String>{'Sales__c', 'Marketing__c'};
String dep = ApexPages.currentPage().getParameters().get('department');

if (allowlist.contains(dep)) {
    String query = 'SELECT Id FROM ' + dep + ' LIMIT 10';
    Database.query(query);
}
```

**Trap:** `JSENCODE()` prevents **XSS**, not SOQL injection.

**Methods that prevent SOQL injection:**
- ✅ Static queries with bind variables
- ✅ `String.escapeSingleQuotes()`
- ✅ Typecasting / allowlisting

**Methods that do NOT prevent SOQL injection:**
- ❌ `JSENCODE()` — that's for XSS
- ❌ `Lightning Platform ESAPI` — that's for XSS

**Mnemonic:** "Bind variable = safest. Escape = decent. Allowlist = explicit whitelist."

---

## 7. XSS (Cross-Site Scripting) Prevention

**Rule:** XSS happens when malicious scripts are injected into a page and executed in the browser.

**Salesforce's auto-protection:** All standard `<apex:...>` tags **automatically escape** XSS characters by default.

**To disable auto-escaping (dangerous!):**
```xml
<apex:outputText value="{!name}" escape="false" />
<!-- ⚠️ This is vulnerable to XSS if 'name' contains user input -->
```

**Functions to manually encode user output:**
| Function | Use When |
| :--- | :--- |
| `HTMLENCODE()` | Output going into HTML context |
| `JSENCODE()` | Output going into JavaScript context |
| `JSINHTMLENCODE()` | Output going into HTML event handler with JS (e.g., `onclick`) |
| `URLENCODE()` | Output going into a URL parameter |

**Trap — Fake function:**
- `HTMLENCODEINJS()` ← **DOES NOT EXIST!**

**Custom JavaScript is NOT auto-protected:**
```javascript
// ❌ Salesforce cannot protect custom JS blocks or <apex:includeScript>
var name = '{!userInputName}'; // Vulnerable if not encoded!

// ✅ Correct — use JSENCODE inside the JS context
var name = '{!JSENCODE(userInputName)}';
```

**Mnemonic:** "HTML = HTMLENCODE. JS = JSENCODE. JS inside HTML handler = JSINHTMLENCODE."

---

## 8. CSRF (Cross-Site Request Forgery) Protection

**Rule:** CSRF tricks a logged-in user into unknowingly sending malicious requests.

**Salesforce's defense:** Every page includes a hidden **Anti-CSRF Token** — a random string that must match on every postback. Without this token, the request is rejected.

**Trap — naming:**
- "CSRF Protection" → too generic
- "Security Token" → this is the API access token for external apps (like DataLoader), NOT CSRF
- **"Anti-CSRF Token"** ← This is the specific Salesforce term

**Mnemonic:** "Anti-CSRF Token = hidden form field that validates every page request."

---

## 9. External Resources Security

### Untrusted External HTML → `$IFrameResource`
**Rule:** If you have a static HTML resource downloaded from a third-party (potentially untrusted) source, load it in an **iframe on a separate domain** using `$IFrameResource` instead of `$Resource`.

```xml
<!-- ❌ Loads in same domain — untrusted scripts run in your org's context -->
<apex:page>
    {!$Resource.thirdPartyPage}
</apex:page>

<!-- ✅ Isolated in a separate domain — scripts can't access your org's data -->
<apex:page>
    <iframe src="{!$IFrameResource.thirdPartyPage}"></iframe>
</apex:page>
```

### Untrusted External Images → `IMAGEPROXYURL()`
**Rule:** External images can send credentials to malicious servers via HTTP headers. `IMAGEPROXYURL()` fetches the image server-side through Salesforce, so no browser credentials are sent directly to the external server.

```xml
<!-- ❌ Direct external image — can steal credentials -->
<img src="https://malicious-site.com/image.jpg" />

<!-- ✅ Proxied through Salesforce — safe -->
<apex:image value="{!IMAGEPROXYURL('https://external-site.com/image.jpg')}"/>
```

**Trap:** `IMAGEURL` ← does NOT exist.

**Mnemonic:** "`$IFrameResource` = untrusted HTML. `IMAGEPROXYURL` = untrusted images."

---

## 10. Content Sniffing Protection

**Rule:** Content Sniffing Protection prevents browsers from guessing the file type (MIME sniffing) and executing a disguised malicious file (e.g., a `.txt` that's actually JavaScript).

- Enabled by **default** in Salesforce.
- **Cannot be disabled.**

**Mnemonic:** "Sniffing protection = browser won't execute disguised scripts. Always on."

---

## 11. Referrer-Policy HTTP Header

**Rule:** When users click external links from Salesforce pages, the external site can see the Salesforce URL in the HTTP `Referer` header, potentially leaking sensitive info.

**Where to configure:** Setup → Session Settings → Enable **"Include Referrer-Policy HTTP header"**

**Trap options:**
- COEP (Cross-Origin-Embedder-Policy) ← unrelated
- COOP (Cross-Origin-Opener-Policy) ← unrelated
- CSP (Content-Security-Policy) ← for XSS, not URL leakage

**Mnemonic:** "URL leakage to external sites = Referrer-Policy."

---

## 12. Apex Crypto Class

**Rule:** `Crypto.encrypt()` and `Crypto.decrypt()` require 4 parameters each.

**Encrypt:**
```apex
Blob initVector = Blob.valueOf('Example of IV123'); // Must be exactly 16 bytes
Blob key = Crypto.generateAesKey(256);  // 256-bit key
Blob data = Blob.valueOf('sensitive data');

Blob encrypted = Crypto.encrypt('AES256', key, initVector, data);
```

**Decrypt:**
```apex
// Same key, same initVector, same algorithm!
Blob decrypted = Crypto.decrypt('AES256', key, initVector, encrypted);
String result = decrypted.toString(); // Convert Blob back to String
```

**Key Points:**
- `Crypto.decrypt()` returns a **`Blob`** — use `.toString()` to get a `String`.
- The algorithm, key, and initialization vector used to encrypt **MUST match** when decrypting.
- Store the generated key securely in a **Protected Custom Setting or Custom Metadata**.

**Trap:**
```apex
// ❌ WRONG — wrong param order, wrong type
String decrypted = Crypto.decrypt('AES256', key, encryptedData); // Missing IV!

// ✅ CORRECT — all 4 params, returns Blob
Blob decrypted = Crypto.decrypt('AES256', key, initVector, encryptedData);
```

**Mnemonic:** "4 params: Algorithm, Key, IV, Data. Same in, same out."

---

## Quick Reference Security Cheat Sheet

```
Sharing Keywords (record-level only):
  with sharing       → Enforces sharing rules ✅
  without sharing    → Bypasses sharing rules ❌
  inherited sharing  → Takes from caller

FLS/CRUD Enforcement:
  WITH SECURITY_ENFORCED → Throws if no access ⚠️
  stripInaccessible()   → Silently removes fields ✅

SOQL Injection Prevention:
  :bindVariable        → Best option
  escapeSingleQuotes() → Good for dynamic SOQL
  Allowlist            → For object/field names in query

XSS Prevention:
  HTMLENCODE()         → HTML context
  JSENCODE()           → JavaScript context
  JSINHTMLENCODE()     → JS in HTML event handler
  HTMLENCODEINJS()     → ❌ FAKE! Does not exist!

External Resources:
  $Resource.<name>          → Trusted static resource
  $IFrameResource.<name>    → Untrusted HTML (isolated iframe)
  IMAGEPROXYURL(url)        → Untrusted external images

CSRF:
  Anti-CSRF Token → Hidden random field in every Salesforce page

Session Settings:
  Referrer-Policy header → Controls URL info leakage to external sites
  Content Sniffing       → Always on, prevents MIME sniffing attacks
```
