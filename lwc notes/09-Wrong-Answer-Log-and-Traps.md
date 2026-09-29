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

---

## 4. Paper 6 — Attempt 2 New Traps (Wrong Answers from 71% Run)

> These are the remaining 28 wrong answers from the session. Fix these and you hit 80%+.

### H. VF Placement & Context Traps

| Trap Statement | Why Wrong | Correct |
| :--- | :--- | :--- |
| "A search component exists for embedding in page layouts" | Doesn't exist | No standard search component for page layouts. Use a custom VF page or LWC. |
| "VF page can be embedded directly in any Lightning page" | Needs conditions | VF embeds in record page VIA the Visualforce standard component. Matches standard controller object only. |
| "VF tab needed to use VF from App Launcher" | Correct! Not a trap — this IS true | VF page must be added to a tab to appear in App Launcher. |
| "VF pages support PDF rendering → Lightning supports it too" | No | Lightning components do NOT support `renderAs="pdf"`. No PDF in LWC/Aura. |
| "VF overrides work for Delete + Custom Actions in console apps" | WRONG — both are excluded | In console apps, VF overrides supported for: New, Edit, View, Tab, List, Clone. NOT Delete. NOT Custom Actions. |

---

### I. Lightning Framework Facts (Framework Benefits / Architecture)

| Trap Statement | Why Wrong | Correct |
| :--- | :--- | :--- |
| "Custom component ecosystem is only within an org or platform" | ❌ WRONG | Ecosystem is OPEN — components can be on AppExchange, shared globally, used across LEX/mobile/Communities |
| "Lightning supports all VF functionalities" | ❌ WRONG | Lightning does NOT support PDF rendering, ReactJS/AngularJS integration |
| "LWC can contain Aura components as child" | ❌ WRONG | LWC CANNOT contain Aura. But AURA CAN contain LWC. One direction only. |
| "Developer Console is used to build LWC" | ❌ WRONG | LWC requires external IDE (VSCode). Developer Console does NOT support LWC development. |
| "Aura app can be added to another Aura app" | ❌ WRONG | Aura apps CANNOT nest inside other Aura apps. Only components can be nested. |

---

### J. `$ContentAsset` Global Value Provider

**Rule:** `$ContentAsset` is used to reference **images, CSS files, and JavaScript files** stored as content assets. It is NOT for HTML files or font files.

| Can Reference | Cannot Reference |
| :--- | :--- |
| ✅ Images | ❌ HTML files |
| ✅ CSS files | ❌ Font files (.woff, .ttf) |
| ✅ JavaScript files | ❌ Apex classes |

```javascript
// In LWC or Aura
import LOGO from '@salesforce/resourceUrl/myLogo'; // ← Static Resource
// $ContentAsset is used in Aura markup:
// {!$ContentAsset.myImage + '/path/to/image.png'}
```

**Mnemonic:** "`$ContentAsset` = Images, CSS, JS. No HTML. No fonts."

---

### K. `<ltng:require>` in Aura (Third-Party JS Libraries)

**Rule:** To include an external JS library in Aura, use `<ltng:require>`. NOT `<lightning:script>`.

```html
<!-- ✅ CORRECT -->
<ltng:require scripts="{!$Resource.ChartJS}" 
              afterScriptsLoaded="{!c.init}"/>

<!-- ❌ WRONG — this tag does NOT exist -->
<lightning:script src="{!$Resource.ChartJS}"/>
```

**Key Rules:**
- Library MUST be uploaded as a **static resource** first
- `scripts` attribute = comma-separated list for multiple libraries
- `afterScriptsLoaded` = the handler to call AFTER libraries are loaded (NOT the `init` handler — scripts load async!)
- `$Resource.resourceName` = references the static resource

**Trap:** "Use the `init` event handler to access the scripts."
→ ❌ WRONG. Scripts load **asynchronously**. By the time `init` fires, scripts likely aren't ready. Use `afterScriptsLoaded`.

**Mnemonic:** "`<ltng:require>` = load static resources in Aura. `afterScriptsLoaded` = when ready."

---

### L. Aura Event Phase — Buried Component to Root

**Rule:**
- Component at SAME level as sibling → Use **Application Event**
- Component buried DEEP needs root component → Use **Component Event** (bubble phase goes UP)
- Application event for deep-buried → Works but is OVERKILL and bad practice

**Exam trap:**
> "A button is buried 5 levels deep and needs to notify the ROOT component."
> ❌ Application Event (overkill)
> ✅ **Component Event with Bubble phase** — it bubbles UP all the way to root

```
Root Component       ← handles event (bubble reaches here)
  └── Container
        └── Parent
              └── Child
                    └── BUTTON fires event ← Component event bubbles UP
```

**Mnemonic:** "Bubble = goes UP from source to root. No need for Application event just because it's deep."

---

### M. CustomEvent: `bubbles` and `composed`

**Rule:** Two flags control how a LWC custom event propagates:

| `bubbles` | `composed` | Behavior |
| :---: | :---: | :--- |
| `false` | `false` | Default. Event stays at dispatch point only. |
| `true` | `false` | Bubbles within component but STOPS at shadow boundary. Internal event — only ancestors within same component tree get it. |
| `true` | `true` | Bubbles AND crosses shadow boundary → parent component can receive it. |
| `false` | `true` | ❌ NOT SUPPORTED in LWC. |

**When `this.template.querySelector('button').dispatchEvent(event)` is used:**
- The event is fired from an element INSIDE the shadow root
- `bubbles: true, composed: false` → stays inside the shadow. Only ancestors of the button within the component see it. Parent does NOT see it.
- `bubbles: true, composed: true` → crosses shadow boundary. Parent component sees it.

**Exam question pattern:**
> "Only ancestors within the child component should handle the event (not the parent)."
> ✅ `bubbles: true, composed: false`

**Mnemonic:** "`composed: true` = crosses the shadow wall. `composed: false` = stays inside."

---

### N. `createRecord()` — NOT a method, It's an Imported Function

**Rule:** `createRecord` is imported from `lightning/uiRecordApi`. Call it DIRECTLY — no `this.` prefix.

```javascript
import { createRecord } from 'lightning/uiRecordApi';

// ✅ CORRECT — imported function, called directly
createRecord(recordInput).then(() => { ... });

// ❌ WRONG — this.createRecord() implies it's a class method
this.createRecord(recordInput).then(() => { ... });

// ❌ WRONG — createRecord() requires the argument first
createRecord().then((recordInput) => { ... });
```

**Same rule applies to:**
- `updateRecord(recordInput)` → called directly, no `this.`
- `deleteRecord(recordId)` → called directly, no `this.`
- `getRecord` → used as wire adapter, not called directly

**Mnemonic:** "Imported functions are NOT class methods. No `this.` for LDS functions."

---

### O. `refreshApex()` — Pass the Wired Property

**Rule:** `refreshApex()` takes the **wired property reference** (the cached value object), not the function or the data.

```javascript
import { refreshApex } from '@salesforce/apex';

@wire(getJobApplications, { positionId: '$recordId' })
wiredGetJobApplications(value) {
    this.jobApplications = value; // ← store the WHOLE value object
}

reloadTable() {
    refreshApex(this.jobApplications); // ← pass the stored value object ✅
    // NOT: refreshApex(getJobApplications) ← the function ❌
    // NOT: refreshApex(this.data) ← just the data ❌
}
```

**Mnemonic:** "refreshApex = refresh the whole wire result. Pass `this.wiredProperty`, not `this.data`."

---

### P. NBA: ONE Flow for Both Accept and Reject

**Rule:** A recommendation can only have **ONE flow**. The SAME flow runs for both Accept and Reject. Inside the flow, use a Decision element with `isRecommendationAccepted` boolean variable to branch.

```
Recommendation → Action Reference → ONE FLOW
                                         │
                                    Decision Element
                                    (isRecommendationAccepted?)
                                    ├── TRUE → Accept logic
                                    └── FALSE → Reject logic
```

**Configuration:**
- Enable "Launch Flow on Rejection" in the NBA component settings in App Builder.
- Build ONE flow that handles both paths internally.

**Trap:**
- ❌ "Create one flow for accept and another for reject" — WRONG. ONE flow only.
- ❌ "Select flows for accept/reject in the recommendation settings" — NO such setting per-recommendation.

**Mnemonic:** "One recommendation = one flow. Branch inside for accept vs. reject."

---

### Q. NBA: Non-Recommendation Objects in Strategy Builder

**Rule:** You can use objects OTHER than the Recommendation standard object in NBA. Use the **Map element** (Strategy Builder) or **Recommendation Assignment element** (Flow Builder) to map fields from a custom/standard object to display as recommendations.

**Example:**
> "Display Product records as recommendations."
> → Use the **Map element** to map Product fields to Recommendation fields in Strategy Builder.

**Trap:**
- ❌ "Configure recommendations to use the Product object IS NOT possible" — WRONG, it IS possible.
- ❌ "Build a custom Lightning component to show Product records" — unnecessary.
- ❌ "A Product Recommendations component exists in App Builder" — FAKE. Doesn't exist.

**Mnemonic:** "Strategy Builder Map element = convert any object into a recommendation."

---

### R. `@AuraEnabled` Controller Default Sharing Behavior

**Rule:** An `@AuraEnabled` Apex controller that has **no sharing keyword** defaults to `with sharing`.

> This is the OPPOSITE of regular Apex classes (which default to `without sharing` in most contexts).

```apex
// This is effectively 'with sharing' for @AuraEnabled context
public class MyController {
    @AuraEnabled
    public static List<Account> getAccounts() { ... }
}

// To bypass sharing in an @AuraEnabled method, you must be explicit:
public without sharing class MyController { ... }
```

**Trap:**
- "Default @AuraEnabled behavior = without sharing" ❌
- "Default @AuraEnabled behavior = with sharing" ✅

**Key follow-on rule:** `with sharing` enforces sharing rules but does NOT enforce CRUD/FLS. For FLS, still need `WITH SECURITY_ENFORCED` or `stripInaccessible`.

**Mnemonic:** "@AuraEnabled default = with sharing. Other Apex = without sharing by default."

---

### S. URL-Addressable LWC Parameters Must Be Strings

**Rule:** When passing parameters to a URL-addressable Lightning web component via the `state` object, ALL property values MUST be `String` type. Numbers and booleans are NOT supported.

```javascript
// URL format: /lightning/cmp/c__MyComponent?c__myProp=value

// In source component:
this[NavigationMixin.Navigate]({
    type: 'standard__component',
    attributes: { componentName: 'c__MyComponent' },
    state: {
        c__myProp: 'someStringValue',  // ✅ String only
        // c__count: 5,               // ❌ Number not allowed
        // c__active: true,           // ❌ Boolean not allowed
    }
});
```

**Mnemonic:** "URL = all text. State params = strings only."

---

### T. `<lightning:flow>` in Aura vs `<aura:flow>` (Doesn't Exist)

**Rule:** To embed a flow in an Aura component, use `<lightning:flow>`. Identify it by `aura:id` in the markup and `startFlow()` in the controller.

```html
<!-- ✅ CORRECT — Aura embedding a flow -->
<aura:component>
    <lightning:flow aura:id="myFlow"/>
</aura:component>

<!-- ❌ WRONG — aura:flow doesn't exist -->
<aura:flow aura:id="Property_Tax_Calculator"/>
```

```javascript
// Controller.js
var flow = component.find("myFlow");
flow.startFlow("My_Flow_API_Name");
```

| Context | How to Embed a Flow |
| :--- | :--- |
| LWC | `<lightning-flow flow-api-name="Flow_Name">` |
| Aura | `<lightning:flow aura:id="id">` → `flow.startFlow("Name")` |
| VF | `<flow:interview name="Flow_Name"/>` |

**Mnemonic:** "`<lightning:flow>` = Aura's flow container. `<aura:flow>` = doesn't exist. `<lightning-flow>` = LWC's."

---

### U. Custom Property Editor for Screen Flow Components

**Rule:** To configure a custom property editor for a screen flow component:

1. **Register** it in the screen component's **configuration file** (XML), NOT the JS controller.
2. **`automaticOutputVariables`** must be a `@api` public property in the **property editor's JavaScript controller**, NOT in the configuration file.

```xml
<!-- ScreenComponent.js-meta.xml -->
<LightningComponentBundle>
    <isExposed>true</isExposed>
    <targets>
        <target>lightning__FlowScreen</target>
    </targets>
    <targetConfigs>
        <targetConfig targets="lightning__FlowScreen" 
                      configurationEditor="c-my-property-editor">  <!-- ← registered HERE -->
        </targetConfig>
    </targetConfigs>
</LightningComponentBundle>
```

```javascript
// myPropertyEditor.js (the property editor LWC)
import { LightningElement, api } from 'lwc';
export default class MyPropertyEditor extends LightningElement {
    @api automaticOutputVariables; // ← @api in JS controller, NOT config XML
}
```

**Mnemonic:** "Register editor in XML. `automaticOutputVariables` as `@api` in JS controller."

---

### V. Agentforce: `@InvocableMethod` + `@InvocableVariable` — Complete Rules

**Rule:** For an Apex method to be used as an Agentforce action:

```apex
public class CheckLeadScore {
    // Inner class for structured input
    public class Request {
        @InvocableVariable(required=true description='The Lead record ID')
        public String leadId;
    }

    // Inner class for structured output
    public class Response {
        @InvocableVariable(description='The lead score result')
        public String scoreDescription;
    }

    @InvocableMethod(
        label='Check Lead Score'
        description='Evaluates lead qualification score for sales prioritization'
        // ↑ This description is what LLM reads to know WHEN to invoke this action!
    )
    public static List<Response> getScore(List<Request> requests) {
        List<Response> results = new List<Response>();
        for (Request req : requests) {
            // Process each request (bulkification)
            Response res = new Response();
            res.scoreDescription = LeadScoringService.calculate(req.leadId);
            results.add(res);
        }
        return results;
    }
}
```

**Critical Rules:**
1. Must be `static`
2. Must be annotated with `@InvocableMethod`
3. Input/output MUST use inner classes with `@InvocableVariable` — NOT raw `List<String>`
4. Must be **synchronous** — `@future` is INCOMPATIBLE with Agentforce
5. `@AuraEnabled` is NOT required (and is irrelevant to Agentforce)
6. The `description` in `@InvocableMethod` is what the LLM reads to match user intent — missing keywords = action never triggered
7. Action must be added to the agent's action library in **Agent Builder**

**Why action didn't run (no Apex logs):**
- The action wasn't added to the agent's library in Agent Builder
- The description doesn't contain keywords matching the user's query

**Trap:**
- "Annotate with `@future` for async" ❌ — future is INCOMPATIBLE
- "Annotate with `@AuraEnabled`" ❌ — that's for LWC/Aura, not Agentforce
- Using `List<String>` without inner classes ❌ — `@InvocableVariable` requires inner class
- Accessing index `[0]` without validation ❌ — always loop (bulkify)

**Mnemonic:** "@InvocableMethod = door. @InvocableVariable = labeled mailboxes. Description = the sign on the door telling LLM what it does."

---

## 5. Quick-Fire Cards — 15 New from Paper 6 Attempt 2

**Q21:** What tag loads a 3rd-party JS library in an Aura component?
> A: `<ltng:require scripts="{!$Resource.libName}">`. NOT `<lightning:script>`.

**Q22:** When do scripts loaded by `<ltng:require>` become available?
> A: In `afterScriptsLoaded` handler. NOT the `init` handler (scripts are async).

**Q23:** What files can `$ContentAsset` reference?
> A: Images, CSS, JavaScript. NOT HTML files. NOT font files.

**Q24:** LWC cannot contain Aura. True or False?
> A: TRUE. LWC cannot contain Aura children. But Aura CAN contain LWC children.

**Q25:** In a console app, which standard action can NOT be overridden with VF?
> A: Delete and Custom Actions. VF overrides only: New, Edit, View, Tab, List, Clone.

**Q26:** `bubbles: true, composed: false` — does the parent LWC receive the event?
> A: NO. `composed: false` means the event does not cross the shadow boundary. Parent is outside the shadow.

**Q27:** `bubbles: true, composed: true` — does the parent LWC receive the event?
> A: YES. `composed: true` crosses shadow boundaries.

**Q28:** How do you call `createRecord()` from an imported module?
> A: `createRecord(recordInput).then(...)` — no `this.`. It's an imported function, not a class method.

**Q29:** What's the correct argument to `refreshApex()`?
> A: `refreshApex(this.wiredProperty)` — the whole wire result stored as a property. Not `this.data`.

**Q30:** NBA: How many flows handle accept + reject on one recommendation?
> A: ONE flow. Use a Decision element with `isRecommendationAccepted` variable inside the flow.

**Q31:** Default sharing behavior of an `@AuraEnabled` Apex controller with no sharing keyword?
> A: `with sharing` (enforces sharing rules). This is opposite to regular Apex class default.

**Q32:** URL-addressable LWC state parameters — what data types are allowed?
> A: Strings ONLY. Not numbers. Not booleans.

**Q33:** How to embed a flow in an Aura component?
> A: `<lightning:flow aura:id="id">` + `component.find("id").startFlow("API_Name")`. NOT `<aura:flow>`.

**Q34:** Where is a custom property editor registered for a screen flow component?
> A: In the screen component's configuration file (XML), `configurationEditor` attribute. NOT in the JS controller.

**Q35:** Why would an Agentforce action not be triggered at all (no Apex logs)?
> A: Either (1) action not added to Agent's library in Agent Builder, OR (2) the `@InvocableMethod` description doesn't contain keywords matching the user's query.
