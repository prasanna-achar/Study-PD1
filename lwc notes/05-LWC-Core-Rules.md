# Objective 5: LWC Core Rules

> Format: Rule → Syntax → Trap → Example → Mnemonic
> Focus: Decorators, event system, lifecycle hooks, wire service, component communication.

---

## 1. The Three Decorators

**Rule:** Every LWC class property/method must use the correct decorator.

| Decorator | Purpose | Use On |
| :--- | :--- | :--- |
| `@api` | Expose to parent / make public | Properties & methods |
| `@track` | Make complex object reactive | Properties (objects/arrays — legacy) |
| `@wire` | Connect to Salesforce data | Properties & methods |

### `@api` Rules:
- Exposed to the parent component (HTML, LWC, Aura, or App Builder).
- Properties marked `@api` are **reactive** — when the parent changes the value, the child re-renders.
- Can only be set by the parent. **Must not be mutated from inside the child.**

```javascript
import { LightningElement, api } from 'lwc';
export default class ChildCmp extends LightningElement {
    @api title = 'Default Title'; // parent sets this
    @api greet() { console.log('Hello from parent!'); } // parent can call
}
```

**Trap:** You cannot call `this.title = 'something'` inside the child if it's marked `@api`. The parent sets it. Setting it from inside is a violation.

---

### `@track` Rules (IMPORTANT FOR EXAM):
- **Before Spring '20:** required for any reactive property.
- **After Spring '20 (current):** Primitive values are automatically reactive. You ONLY need `@track` when you have a **nested object or array** and you want mutations to **nested properties** to trigger re-rendering.

**Example — When `@track` is still needed:**
```javascript
import { LightningElement, track } from 'lwc';
export default class MyComponent extends LightningElement {
    @track person = { name: 'Alice', age: 25 };

    updateAge() {
        this.person.age = 30; // ← With @track, this triggers re-render
        // Without @track, this mutation to a nested property does NOT re-render
    }
}
```

**When `@track` is NOT needed:**
```javascript
count = 0; // primitive — automatically reactive, @track not needed
updateCount() { this.count++; } // ✅ triggers re-render automatically
```

**Trap — Exam Classic:**
> "Which decorator makes a property reactive in LWC?"
> - Old answer: `@track`
> - **Current answer: `@api` exposes to parent (and is reactive to changes from parent). Primitives are reactive by default. `@track` is only for nested object mutations.**

**Mnemonic:** "`@track` = only for nested object mutations now. Primitives are free."

---

### `@wire` Rules:
- **Declarative** approach to fetch Salesforce data (Apex, object info, picklist values, etc.).
- The wire adapter fetches data **reactively** when its reactive parameters change.
- Wire result has two properties: `.data` and `.error`.

```javascript
import { LightningElement, wire } from 'lwc';
import getContacts from '@salesforce/apex/ContactController.getContacts';

export default class ContactList extends LightningElement {
    @wire(getContacts)
    contacts; // { data: [...], error: undefined } OR { data: undefined, error: {...} }
}
```

```javascript
// Wire with reactive property as parameter
import { LightningElement, api, wire } from 'lwc';
import getContact from '@salesforce/apex/ContactController.getContact';

export default class ContactDetail extends LightningElement {
    @api recordId; // reactive — when this changes, wire re-fires

    @wire(getContact, { contactId: '$recordId' }) // $ prefix = reactive variable
    contact;
}
```

**`$` prefix in wire:**
- `'$recordId'` → reactive reference to `this.recordId`. Refires when property changes.
- `'recordId'` (no $) → hardcoded string literal `"recordId"`. **Does NOT refire.**

**Wire result — two patterns:**
```javascript
// Pattern 1: Wired property
@wire(getContact, { id: '$recordId' })
wiredContact; // wiredContact.data or wiredContact.error

// Pattern 2: Wired function
@wire(getContact, { id: '$recordId' })
wiredContactHandler({ data, error }) {
    if (data) { this.contact = data; }
    else if (error) { this.error = error; }
}
```

**Mnemonic:** "`$` = reactive (dollar = dynamic). No $ = static."

---

## 2. Lifecycle Hooks — Order & Rules

**Rule:** Lifecycle hooks fire in a specific order. Know the order.

### Parent-only hooks (no children):
```
constructor()    → First. DOM not ready. No child access.
connectedCallback()  → DOM inserted. But child components NOT yet rendered.
disconnectedCallback() → Fired when component is removed from DOM
errorCallback()  → Fires when child throws an error (parent captures it)
```

### After children are rendered:
```
renderedCallback() → Fires every time the component renders (initial + updates)
```

### Full render order with parent + child:
```
1. Parent constructor()
2. Parent connectedCallback()
3. Child constructor()
4. Child connectedCallback()
5. Child renderedCallback()
6. Parent renderedCallback()
```

### Rules per hook:

**`constructor()`**
- ❌ Cannot access child elements (not yet in DOM)
- ❌ Cannot access `@api` public properties (not yet set by parent)
- ✅ Call `super()` first (MANDATORY)
- ❌ Cannot call `this.template.querySelector()` (DOM not ready)

```javascript
constructor() {
    super(); // ← MANDATORY first line
    // Do NOT touch DOM or @api props here
}
```

**`connectedCallback()`**
- ✅ Component is now in the DOM
- ❌ Child components may NOT be rendered yet (child's `connectedCallback` fires, but their DOM isn't fully built)
- ✅ Good place to subscribe to LMS, add event listeners, fetch initial data without wire

```javascript
connectedCallback() {
    this.subscribeToChannel(); // ✅ LMS subscribe goes here
}
```

**`renderedCallback()`**
- ✅ DOM is fully rendered (parent + children)
- ✅ Good for 3rd party library initialization (e.g., charting library needing DOM)
- ⚠️ **Fires on EVERY render, not just the first!** Always guard with a flag.

```javascript
isChartInitialized = false;

renderedCallback() {
    if (this.isChartInitialized) return; // ← GUARD! Critical!
    this.isChartInitialized = true;
    this.initializeChart();
}
```

**`disconnectedCallback()`**
- ✅ Unsubscribe from LMS here
- ✅ Remove event listeners

**`errorCallback(error, stack)`**
- ✅ Catches errors from child components ONLY (not self)
- Same concept as React's Error Boundary

**Trap — Classic:**
> "Where do you initialize a third-party library that needs the DOM?"
> Answer: `renderedCallback()` with an initialization guard.

**Mnemonic:**
```
constructor → no DOM, no @api
connectedCallback → in DOM, subscribe here
renderedCallback → full DOM, GUARD against re-runs!
disconnectedCallback → leaving DOM, cleanup here
```

---

## 3. Event Communication

### Child → Parent: `CustomEvent` via `dispatchEvent`

**Rule:** To send data UP from child to parent, use `CustomEvent`.

```javascript
// In child component
handleClick() {
    const event = new CustomEvent('myevent', {
        detail: { recordId: this.recordId }
    });
    this.dispatchEvent(event);
}
```

```html
<!-- In parent HTML -->
<c-child-component onmyevent={handleMyEvent}></c-child-component>
```

```javascript
// In parent JS
handleMyEvent(event) {
    const data = event.detail.recordId;
}
```

**Rules about `CustomEvent`:**
- Name must be **lowercase** (no hyphens or camelCase) in HTML — e.g., `onmyevent`.
- `detail` is the payload property.
- ❌ Parent cannot directly call a child method (unless using `@api`).

---

### Parent → Child: `@api` property or `@api` method call

```html
<!-- Parent sets value on child -->
<c-child title={myTitle}></c-child>
```

```javascript
// Parent calls child method (via template ref)
this.template.querySelector('c-child').greet();
```

---

### Unrelated Components: Lightning Message Service (LMS)

**Rule:** For communication between **unrelated components** (different parts of the page, across component trees), use **Lightning Message Service (LMS)**.

**The 4 steps:**

**Step 1 — Create Message Channel (XML file):**
```xml
<!-- myChannel.messageChannel-meta.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<LightningMessageChannel xmlns="http://soap.sforce.com/2006/04/metadata">
    <masterLabel>My Channel</masterLabel>
    <isExposed>true</isExposed>
    <lightningMessageFields>
        <fieldName>recordId</fieldName>
        <description>The record ID to pass</description>
    </lightningMessageFields>
</LightningMessageChannel>
```

**Step 2 — Publisher (sends the message):**
```javascript
import { LightningElement, wire } from 'lwc';
import { MessageContext, publish } from 'lightning/messageService';
import MY_CHANNEL from '@salesforce/messageChannel/myChannel__c';

export default class Publisher extends LightningElement {
    @wire(MessageContext) messageContext; // ← Required for publish

    sendMessage() {
        publish(this.messageContext, MY_CHANNEL, { recordId: '0011X000...' });
    }
}
```

**Step 3 — Subscriber (receives the message):**
```javascript
import { LightningElement, wire } from 'lwc';
import { MessageContext, subscribe, unsubscribe } from 'lightning/messageService';
import MY_CHANNEL from '@salesforce/messageChannel/myChannel__c';

export default class Subscriber extends LightningElement {
    @wire(MessageContext) messageContext;
    subscription = null;

    connectedCallback() {  // ← subscribe in connectedCallback
        this.subscription = subscribe(
            this.messageContext,
            MY_CHANNEL,
            (message) => { this.handleMessage(message); }
        );
    }

    disconnectedCallback() {  // ← unsubscribe in disconnectedCallback
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    handleMessage(message) {
        console.log('Received:', message.recordId);
    }
}
```

**Critical LMS Rules:**
- ✅ `subscribe` goes in `connectedCallback()`
- ✅ `unsubscribe` goes in `disconnectedCallback()`
- ✅ Import: `import { MessageContext, publish } from 'lightning/messageService'`
- ✅ Import channel: `import MY_CHANNEL from '@salesforce/messageChannel/ChannelName__c'`
- ❌ `subscribe` does NOT go in `constructor()`

**Trap — Import paths:**
```javascript
// ❌ WRONG
import MY_CHANNEL from '@salesforce/messageChannel/myChannel';  // missing __c
import { publish } from '@salesforce/messageService';           // wrong module

// ✅ CORRECT
import MY_CHANNEL from '@salesforce/messageChannel/myChannel__c'; // __c at end
import { publish } from 'lightning/messageService';               // 'lightning/', not '@salesforce/'
```

**Mnemonic:** "Publish/Subscribe via LMS. `connectedCallback` = subscribe. `disconnectedCallback` = unsubscribe. Import is `lightning/messageService`."

---

## 4. `@salesforce/` Import Scoped Modules

**Rule:** Know every `@salesforce/` module and its usage.

| Module | What You Get | Example |
| :--- | :--- | :--- |
| `@salesforce/apex/ClassName.methodName` | Apex method | `import getContacts from '@salesforce/apex/ContactCtrl.getContacts'` |
| `@salesforce/messageChannel/Name__c` | LMS Message Channel | `import MY_CHANNEL from '@salesforce/messageChannel/MyChannel__c'` |
| `@salesforce/label/namespace.LabelName` | Custom Label | `import LABEL from '@salesforce/label/c.MyLabel'` |
| `@salesforce/resourceUrl/resourceName` | Static Resource URL | `import LOGO from '@salesforce/resourceUrl/myLogo'` |
| `@salesforce/schema/ObjectName.FieldName` | Schema reference | `import NAME_FIELD from '@salesforce/schema/Account.Name'` |
| `@salesforce/user/Id` | Current user's ID | `import USER_ID from '@salesforce/user/Id'` |
| `@salesforce/id` | Organization ID | Rarely tested — `import ORG_ID from '@salesforce/id'` |

**Trap:**
```javascript
// ❌ WRONG — wrong path format
import label from 'c/MyLabel';        // That's a component path, not a label
import getContacts from 'apex/ContactCtrl.getContacts'; // Missing @salesforce/

// ✅ CORRECT
import label from '@salesforce/label/c.MyLabel';
import getContacts from '@salesforce/apex/ContactCtrl.getContacts';
```

---

## 5. LWC in Community Pages

**Rule:** To expose an LWC component in **Experience Builder (Community Sites)**, you MUST:
1. Add `"targets": { "lightningCommunity__Page": {} }` in `componentName.js-meta.xml`
2. Define `targetConfigs` for the component properties that appear in the Experience Builder property panel

```xml
<!-- componentName.js-meta.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>61.0</apiVersion>
    <isExposed>true</isExposed>
    <targets>
        <target>lightningCommunity__Page</target>
        <target>lightning__AppPage</target>
    </targets>
    <targetConfigs>
        <targetConfig targets="lightningCommunity__Page">
            <property name="title" type="String" label="Title" />
        </targetConfig>
    </targetConfigs>
</LightningComponentBundle>
```

**Trap:** `lightningCommunity__Page` is the exact target key. Not `community__Page`, not `lightning__CommunityPage`.

---

## 6. LWC in VF Pages (iframe)

**Rule:** You CAN embed an LWC in a Visualforce page, but ONLY through a **Lightning App Page** inside an iframe — not natively.

```xml
<!-- In your VF page -->
<apex:page>
    <div style="width:100%;height:100vh;">
        <iframe src="/lightning/r/Account/{!recordId}/view"></iframe>
    </div>
</apex:page>
```

> LWC cannot be directly embedded in `<apex:page>` tags. The workaround is to use a Lightning Out pattern or an iframe to a LEX page.

---

## Quick Reference Cheat Sheet

```
Decorators:
  @api    → public property/method, set by parent, reactive to parent changes
  @track  → only for nested object/array mutations (primitives are auto-reactive)
  @wire   → connect to Salesforce data, $ prefix = reactive param

Lifecycle Order:
  constructor → connectedCallback → (child renders) → renderedCallback

Key Rules:
  constructor: super() first, no DOM, no @api access
  connectedCallback: subscribe to LMS here
  renderedCallback: initialize 3rd-party libs HERE, always use guard!
  disconnectedCallback: unsubscribe from LMS here

LMS:
  Publisher: publish(messageContext, CHANNEL, payload)
  Subscriber: subscribe(messageContext, CHANNEL, handler)
  Import: from 'lightning/messageService'
  Channel: from '@salesforce/messageChannel/Name__c'
  Subscribe in: connectedCallback()
  Unsubscribe in: disconnectedCallback()

Event:
  Child→Parent: new CustomEvent('name', {detail: data}), dispatchEvent()
  Parent→Child: @api property or method call via querySelector
  Unrelated: LMS
```
