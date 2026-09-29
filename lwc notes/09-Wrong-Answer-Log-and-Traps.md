# Objective 9: Wrong Answer Log & Quick-Fire Traps

> This file is your personal trap-detector. Every entry = one thing you got wrong on a mock exam.
> Review this file the NIGHT BEFORE your exam.

---

## 1. The Master Trap List (Organized by Topic)

### A. StandardSetController Traps

| Trap Statement | Why Wrong | Correct |
| :--- | :--- | :--- |
| "List > 10k throws exception" | Lists truncate silently | List TRUNCATES. Locator THROWS. |
| "getChecked() returns selected items" | Method doesn't exist | `getSelected()` |
| "getCompleteResult() = true means truncated" | Opposite | FALSE = incomplete. TRUE = all done. |
| "standardSetController attribute exists in VF" | No such attribute | You instantiate SSC in Apex code |
| "Set<sObject> is a valid constructor arg" | Only List or QueryLocator | `new SSC(list)` or `new SSC(ql)` |

---

### B. VF Controller Traps

| Trap Statement | Why Wrong | Correct |
| :--- | :--- | :--- |
| "Custom controller has no-arg constructor like extension" | Extension takes param, not custom ctrl | Custom ctrl: no args. Extension: takes controller. |
| "DML is allowed in getter methods" | Never | DML only in action methods & setters |
| "Setters fire AFTER the action" | They fire first | Setter → Action → Getter |
| "with sharing enforces FLS" | No — sharing only | FLS needs `WITH SECURITY_ENFORCED` or `stripInaccessible` |
| "ApexPages.Page().existingPage works" | That API doesn't exist | Use `Page.existingPage` |
| "getUrlParameters() reads URL params" | Fake method | `getParameters().get('key')` |

---

### C. Security Traps

| Trap Statement | Why Wrong | Correct |
| :--- | :--- | :--- |
| "JSENCODE prevents SOQL injection" | JSENCODE = XSS, not SOQL | Bind vars / `escapeSingleQuotes()` for SOQL |
| "WITH SECURITY_ENFORCED goes after LIMIT" | Placement wrong | Goes AFTER WHERE, BEFORE ORDER BY/LIMIT |
| "stripInaccessible throws if field missing" | It strips silently | Use `WITH SECURITY_ENFORCED` if you WANT an exception |
| "update as user doesn't affect queries, only DML" | Correct behavior | Queries still use class-level sharing. `as user` only for DML. |
| "Security Token = CSRF protection" | WRONG type | Security Token = API access (DataLoader). Anti-CSRF Token = CSRF. |
| "HTMLENCODEINJS() is a valid function" | Doesn't exist! | `JSINHTMLENCODE()` |
| "$Resource.name = untrusted HTML" | Risk: XSS in same domain | Use `$IFrameResource.name` for untrusted HTML |
| "IMAGEURL() proxies external images" | Doesn't exist | `IMAGEPROXYURL(url)` |

---

### D. LWC Traps

| Trap Statement | Why Wrong | Correct |
| :--- | :--- | :--- |
| "@track makes all properties reactive" | Only for nested object mutations | Primitives are auto-reactive. `@track` = nested only. |
| "constructor() can access @api" | Not yet set at construction | `@api` values available only after `connectedCallback` |
| "connectedCallback has child DOM ready" | Children not fully rendered yet | Use `renderedCallback` for 3rd party lib init |
| "renderedCallback fires only once" | Fires on EVERY render | Always use an init guard flag! |
| "Subscribe to LMS in constructor" | Wrong hook | `subscribe` goes in `connectedCallback()` |
| "`$recordId` without $ fires reactively" | The `$` prefix is required | With `$` = reactive. Without `$` = static string. |
| "Import LMS from '@salesforce/messageService'" | Wrong module path | `from 'lightning/messageService'` |
| "Message channel: `@salesforce/messageChannel/Name`" | Missing `__c` | `@salesforce/messageChannel/Name__c` |
| "Child can mutate @api property from inside" | Violation of unidirectional data flow | Parent sets `@api`, child must not mutate it |

---

### E. Aura Traps

| Trap Statement | Why Wrong | Correct |
| :--- | :--- | :--- |
| "Helper.js can call Controller.js" | One-way only | Controller → Helper. Helper cannot → Controller. |
| "Application event handler has 'name' attribute" | Name = component events | App event handler has NO name. Component event handler HAS name. |
| "component.get('v.methodName') for Apex" | Wrong prefix | Apex = `c.methodName` in Aura. Attribute = `v.propName` |
| "response.getState() returns 'COMPLETE'" | Wrong state name | States: `'SUCCESS'`, `'ERROR'`, `'INCOMPLETE'` |
| "Aura events fire in LWC with dispatchEvent" | Different systems | Aura events use `event.fire()`. LWC uses `dispatchEvent(new CustomEvent(...))`. |
| "Controller can override Component event" | Nothing to override | Events bubble up naturally |
| "init handler fires after children are ready" | init fires FIRST | init fires before children. Use `render` handler for post-child logic. |

---

### F. Navigation / LEX Traps

| Trap Statement | Why Wrong | Correct |
| :--- | :--- | :--- |
| "window.location navigates LEX from VF" | VF is in iframe — only moves within VF | Use `sforce.one.navigateToSObject()` etc. |
| "sforce.one.back('refresh')" | String arg is wrong | `sforce.one.back(true)` — boolean `true` |
| "NavigationMixin extends directly from it" | Must pass LightningElement | `extends NavigationMixin(LightningElement)` |
| "PageReference type: 'namedPage'" | Missing prefix | `'standard__namedPage'` |
| "PageReference type: 'record'" | Incomplete | `'standard__recordPage'` |

---

### G. NBA Traps

| Trap Statement | Why Wrong | Correct |
| :--- | :--- | :--- |
| "Strategy defines what Flow to run on Accept" | No — strategy ranks recommendations | `ActionReference` field on Recommendation record names the Flow |
| "Recommendation is displayed by a Process Builder" | No | Standard `lightning:nextBestAction` component |
| "On Accept, an Apex class is invoked" | Not Apex | A **Flow** is invoked on Accept |
| "Dynamic Forms works on ALL standard objects" | Limitation exists | Check specific objects — not universally available |
| "Dynamic Forms replaces compact layout" | No | Dynamic Forms = detail page field sections. Compact layout = highlights, lists. |

---

## 2. Mnemonic Master List

```
StandardSetController:
  "List truncates. Locator throws."
  "getRecord() (singular) = mass update. getRecords() (plural) = page display."
  "getCompleteResult() FALSE = fail. TRUE = all done."

VF Controllers:
  "Custom controller: no args. Extension: takes controller param."
  "Setter → Action → Getter. Setters fire FIRST."
  "Getters & constructors get no DML."

Security:
  "with sharing = sharing only. Not FLS."
  "ENFORCED = strict (throws). stripInaccessible = quiet (removes)."
  "Bind variable > escapeSingleQuotes > allowlist — all prevent SOQL injection."
  "JSENCODE = JS context XSS. HTMLENCODE = HTML context XSS."
  "$IFrameResource = untrusted HTML. IMAGEPROXYURL = untrusted images."

LWC:
  "@track = nested object mutations only now. Primitives = free."
  "$ = reactive (fires when changes). No $ = static string."
  "connectedCallback = subscribe. disconnectedCallback = unsubscribe."
  "renderedCallback = GUARD! Always check isInitialized flag."

Aura:
  "Controller → Helper. Helper does NOT → Controller."
  "Component event = bubbles up. Application event = broadcast."
  "App event handler: no 'name'. Component event handler: has 'name'."

Navigation:
  "sforce.one = LEX remote from inside VF iframe."
  "sforce.one.back(true) = back + refresh."
  "NavigationMixin(LightningElement) — LightningElement in parentheses."

NBA:
  "Strategy = Boss. Recommendation = employee. Flow = action taken on Accept."
  "Dynamic Forms: detail page fields. Compact layout: highlights and lists."
```

---

## 3. The "Quick-Fire" 30-Second Review Cards

> Read each question. Answer in your head. Check.

**Q1:** What happens when you pass a List of 12,000 records to StandardSetController?
> A: Silently truncated to 10,000. No exception.

**Q2:** What method gets user-selected records in SSC?
> A: `getSelected()`. NOT getChecked().

**Q3:** What is `getRecord()` (singular) used for in SSC?
> A: Getting a prototype object for mass updates. Apply changes to ALL selected.

**Q4:** Can you use DML in a VF getter?
> A: NEVER. Only in action methods and setters.

**Q5:** What does `with sharing` enforce?
> A: Record-level sharing rules ONLY. Not CRUD. Not FLS.

**Q6:** `WITH SECURITY_ENFORCED` vs `stripInaccessible` — which throws, which is silent?
> A: `WITH SECURITY_ENFORCED` = throws. `stripInaccessible` = silent removal.

**Q7:** Where does `$` prefix go in a wire adapter?
> A: Before the reactive property name: `{ id: '$recordId' }`. Without `$` = hardcoded string.

**Q8:** Where should you subscribe to LMS?
> A: `connectedCallback()`. Unsubscribe in `disconnectedCallback()`.

**Q9:** Can Helper.js call Controller.js in Aura?
> A: NO. One-way: Controller → Helper only.

**Q10:** What's the difference between Component Event and Application Event in Aura?
> A: Component = bubbles up. Application = broadcast to all. App event handler has no `name` attribute.

**Q11:** How do you navigate from a VF page inside LEX?
> A: Use `sforce.one.navigateToSObject(id)` etc. NOT `window.location`.

**Q12:** What's the correct import for Lightning Message Service?
> A: `from 'lightning/messageService'`. Channel: `from '@salesforce/messageChannel/Name__c'`

**Q13:** What does the Strategy do in NBA?
> A: Produces ranked Recommendation records. Does NOT run the action Flow.

**Q14:** JSENCODE prevents what type of vulnerability?
> A: XSS in JavaScript context. NOT SOQL injection.

**Q15:** In `Crypto.decrypt()`, what type does it return?
> A: `Blob`. Use `.toString()` to get String.

**Q16:** What happens if `update as user` is called and user lacks FLS on a field?
> A: DML throws an exception. The query may still succeed (depends on class sharing keyword).

**Q17:** Can you set an `@api` property from inside the child component?
> A: NO. Parent sets `@api`. Child must dispatch an event to request the change.

**Q18:** Where do you put 3rd-party library initialization that needs the DOM?
> A: `renderedCallback()` with an `isInitialized` guard flag.

**Q19:** What is the correct argument for `sforce.one.back()` to force a page refresh?
> A: `sforce.one.back(true)` — Boolean `true`, not a string.

**Q20:** What makes a custom VF controller's constructor invalid?
> A: Adding parameters. Custom controller constructor = ZERO parameters.
