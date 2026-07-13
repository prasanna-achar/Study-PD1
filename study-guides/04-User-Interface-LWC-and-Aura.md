# Domain 4: User Interface - Lightning Web Components (LWC), Aura, & Visualforce (Exam Weighting: ~25%)

While standard UI customization relies heavily on declarative Lightning App Builder layouts, complex interactive requirements require custom code using **Lightning Web Components (LWC)**, **Aura Components**, or **Visualforce**.

---

## 1. UI Technologies Evolution & Comparison

| Technology | Core Foundation | Execution Environment | When to Use on PD1 Exam |
| :--- | :--- | :--- | :--- |
| **Lightning Web Components (LWC)** | Modern W3C Web Standards (Custom Elements, Shadow DOM, ES6+ JavaScript). | Runs primarily in the client browser with direct DOM manipulation and high performance. | **Default choice** for all new custom UI development in Lightning Experience! |
| **Aura Components** | Legacy Salesforce proprietary component framework (`.cmp`, `.js` controller/helper). | Client-side JavaScript framework wrapping proprietary event channels. | Legacy maintenance or specific edge cases not yet supported directly by LWC (though wrappers exist). |
| **Visualforce** | Server-centric HTML/XML tag library (`<apex:page>`, `<apex:form>`). | Rendered on Salesforce servers and sent as full HTML payload to the browser. | Generating custom **PDF documents** (`renderAs="pdf"`), custom email templates, or legacy Salesforce Classic pages. |

---

## 2. Lightning Web Components (LWC) Architecture

Every LWC consists of at least three core files inside a folder matching the component name (`myComponent/`):

1. **`myComponent.html`**: Template wrapping the DOM (`<template>...</template>`).
2. **`myComponent.js`**: ES6 JavaScript class extending `LightningElement`.
3. **`myComponent.js-meta.xml`**: Configuration file defining API version, component exposure (`<isExposed>true</isExposed>`), and target targets (`lightning__AppPage`, `lightning__RecordPage`, etc.).
4. *(Optional)* **`myComponent.css`**: Scoped CSS styles automatically isolated inside the component's **Shadow DOM**.

### Essential LWC Decorators (`@api`, `@track`, `@wire`)

| Decorator | Purpose & Behavior | Example Usage |
| :--- | :--- | :--- |
| **`@api`** | Marks a property or method as **Public**. Allows parent components to set properties on child components or invoke public methods (`Child -> Parent` communication target). | `@api recordId;` (Receives current record ID from lightning page context). |
| **`@track`** | Marks an object or array property for deep reactivity. *(Note: Since Spring '20, all primitive properties are reactive by default without `@track`! You only need `@track` when mutating properties inside an object or array without assigning a new object reference).* | `@track accountData = { name: 'Acme', status: 'Active' };` |
| **`@wire`** | Connects a property or function to a **Lightning Data Service (LDS)** wire adapter or `@AuraEnabled(cacheable=true)` Apex controller method for reactive data fetching without writing imperative API calls. | `@wire(getRecord, { recordId: '$recordId', fields: [NAME_FIELD] }) account;` |

---

## 3. LWC Lifecycle Hooks
When an LWC is added, updated, or removed from the DOM, the framework fires standard lifecycle hook methods in strict order:

```
constructor() -> connectedCallback() -> renderedCallback() -> disconnectedCallback()
                                              ^
                                    (Fires on every re-render!)
```

1. **`constructor()`**: Fired when the component class is instantiated. Do not access child elements or attributes here!
2. **`connectedCallback()`**: Fired when the component is inserted into the DOM. Ideal place to initialize variables, subscribe to message channels, or perform initial calculations.
3. **`renderedCallback()`**: Fired after the component has finished rendering or re-rendering. Be careful changing reactive properties inside `renderedCallback()`, as it will trigger an **infinite re-render loop**!
4. **`disconnectedCallback()`**: Fired when the component is removed from the DOM. Ideal place to clean up event listeners or unsubscribe from message channels (`unregisterListener`).
5. **`errorCallback(error, stack)`**: Fired when a descendant child component throws an unhandled JavaScript error.

---

## 4. Connecting LWC to Apex Controllers

To invoke Apex methods from LWC, the Apex class method **must** be static and annotated with **`@AuraEnabled`**.

### 1. Wire Service vs. Imperative Apex

| Method | Syntax / Condition | Pros / Cons |
| :--- | :--- | :--- |
| **Wired Apex (`@wire`)** | Apex method MUST be `@AuraEnabled(cacheable=true)`. | Automatically fetches, caches, and updates data when parameters change (`$recordId`). **Read-Only:** You **cannot** perform DML (`insert`/`update`/`delete`) inside a `cacheable=true` Apex method! |
| **Imperative Apex** | Called directly via JavaScript Promise (`myApexMethod().then().catch()`). Can use `cacheable=true` or `cacheable=false`. | Required when performing DML operations, responding to user button clicks (`handleSave()`), or sequential dependent operations. |

```apex
// Apex Controller: AccountControllerLwc.cls
public with sharing class AccountControllerLwc {
    @AuraEnabled(cacheable=true)
    public static List<Account> getActiveAccounts(String industry) {
        return [SELECT Id, Name, AnnualRevenue FROM Account WHERE Industry = :industry AND Active__c = 'Yes'];
    }

    @AuraEnabled
    public static Account updateAccountRevenue(Id accountId, Decimal newRevenue) {
        Account acc = [SELECT Id, AnnualRevenue FROM Account WHERE Id = :accountId LIMIT 1];
        acc.AnnualRevenue = newRevenue;
        update acc;
        return acc;
    }
}
```

```javascript
// LWC JavaScript: accountViewer.js
import { LightningElement, api, wire } from 'lwc';
import getActiveAccounts from '@salesforce/apex/AccountControllerLwc.getActiveAccounts';
import updateAccountRevenue from '@salesforce/apex/AccountControllerLwc.updateAccountRevenue';

export default class AccountViewer extends LightningElement {
    @api industryFilter = 'Technology';
    
    // 1. Wired Apex
    @wire(getActiveAccounts, { industry: '$industryFilter' })
    accounts; // Returns { data: [...], error: undefined }

    // 2. Imperative Apex on button click
    handleRevenueUpdate() {
        updateAccountRevenue({ accountId: '001xx000003DHPxAAO', newRevenue: 500000 })
            .then(updatedAcc => {
                console.log('Successfully updated account revenue:', updatedAcc);
            })
            .catch(error => {
                console.error('Error updating revenue:', error);
            });
    }
}
```

---

## 5. Component Communication Patterns in LWC

1. **Parent-to-Child (Downwards Communication):**
   - Pass data via HTML attributes (`<c-child-card record-id={accId}></c-child-card>`).
   - Call child public methods annotated with `@api` (`this.template.querySelector('c-child-card').refreshData()`).

2. **Child-to-Parent (Upwards Communication - Custom Events):**
   - Child dispatches standard DOM `CustomEvent`:
     ```javascript
     // In Child LWC
     this.dispatchEvent(new CustomEvent('accountselect', { detail: { accountId: this.recordId } }));
     ```
   - Parent listens in HTML (`onaccountselect={handleSelect}`) or JS (`addEventListener('accountselect', ...)`).

3. **Unrelated Components (Cross-DOM / Sibling Communication):**
   - Use **Lightning Message Service (LMS)** with Message Channels (`@salesforce/messageChannel/MyChannel__c`).

---

## 6. Notes & Summer '26 (API v67.0) Release Updates (PD1 Syllabus Alignment)

### Syllabus Alignment Note (Domain Weighting: ~24% - 25%)
The **User Interface** domain is the second largest section (~15 questions). Modern PD1 exams heavily emphasize **Lightning Web Components (LWC)** (`@wire`, lifecycle hooks, props, events) and how LWC integrates with Apex and legacy Aura/Visualforce architectures.

### Summer '26 (API v67.0) Key Updates for Domain 4:
1. **Headless Experience Layer (HXL) & Custom Lightning Types (GA):**
   - Summer '26 brings HXL to General Availability, allowing developers to decouple UI visual layout from backend business logic.
   - This enables **"Vibe Coding"** for custom Lightning experiences across both native Salesforce containers and headless external applications/AI agents.
2. **Enhanced LWC State Managers:**
   - Summer '26 introduces new native state synchronization tools across deeply nested component trees, reducing boilerplate cross-DOM event dispatching while maintaining strict shadow DOM encapsulation.
3. **`@AuraEnabled(cacheable=true)` User-Mode & Cache Rules:**
   - Always remember: methods marked `cacheable=true` are strictly **READ-ONLY**. Performing any DML statement inside a cacheable method will throw an immediate runtime `AuraHandledException`.
   - When returning data to LWC, use `WITH USER_MODE` so the component automatically respects the running user's Field-Level Security without exposing hidden field values to client-side JavaScript.

