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

## 6. Lightning Data Service (LDS) Wire Adapters

LDS provides **pre-built wire adapters** so you can read/write records without writing Apex.

### Key Wire Adapters for PD1

| Adapter | Module | Purpose | DML? |
| :--- | :--- | :--- | :---: |
| `getRecord` | `lightning/uiRecordApi` | Get a single record's fields | Read |
| `getRecords` | `lightning/uiRecordApi` | Get multiple records | Read |
| `getFieldValue` | `lightning/uiRecordApi` | Extract field value from getRecord result | Read |
| `createRecord` | `lightning/uiRecordApi` | Create a new record (imperative only) | Write |
| `updateRecord` | `lightning/uiRecordApi` | Update an existing record (imperative only) | Write |
| `deleteRecord` | `lightning/uiRecordApi` | Delete a record (imperative only) | Write |

```javascript
import { LightningElement, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';

export default class AccountDetail extends LightningElement {
    @api recordId;

    @wire(getRecord, { recordId: '$recordId', fields: [NAME_FIELD, INDUSTRY_FIELD] })
    account;

    get accountName() {
        return getFieldValue(this.account.data, NAME_FIELD);
    }
}
```

### refreshApex — Force Wire to Re-fetch

After performing DML (imperative Apex), wired data becomes stale. Use `refreshApex()`:

```javascript
import { refreshApex } from '@salesforce/apex';

// Store the wired result reference
wiredAccountResult;

@wire(getActiveAccounts)
wiredAccounts(result) {
    this.wiredAccountResult = result; // Store the FULL result (data + error)
    if (result.data) {
        this.accounts = result.data;
    }
}

handleSave() {
    updateSomething({ ... })
        .then(() => {
            return refreshApex(this.wiredAccountResult); // Force re-fetch
        });
}
```

> **Exam trap:** `refreshApex()` requires the **full provisioned value** (the object with `{data, error}`), not just `this.accounts`.

---

## 7. Navigation Service & Toast Notifications

### Navigation (`NavigationMixin`)

Used to navigate to records, pages, URLs, and custom tabs.

```javascript
import { NavigationMixin } from 'lightning/navigation';

export default class MyComponent extends NavigationMixin(LightningElement) {

    navigateToAccount() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.accountId,
                objectApiName: 'Account',
                actionName: 'view'     // 'view', 'edit', 'clone'
            }
        });
    }

    navigateToList() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Contact',
                actionName: 'list'
            }
        });
    }

    navigateToWebPage() {
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: 'https://www.salesforce.com'
            }
        });
    }
}
```

**Key `type` values for PD1:**

| Type | What It Opens |
| :--- | :--- |
| `standard__recordPage` | Record detail page (view/edit/clone) |
| `standard__objectPage` | Object home / list view |
| `standard__webPage` | External URL |
| `standard__namedPage` | Named page (e.g., 'home') |
| `standard__navItemPage` | Custom tab |

### Toast Notifications (`ShowToastEvent`)

```javascript
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

handleSuccess() {
    this.dispatchEvent(new ShowToastEvent({
        title: 'Success',
        message: 'Account updated successfully!',
        variant: 'success'    // 'success', 'error', 'warning', 'info'
    }));
}
```

| Variant | Color | Use For |
| :--- | :--- | :--- |
| `success` | Green | Record saved/created |
| `error` | Red | Errors/failures |
| `warning` | Yellow | Caution notices |
| `info` | Grey | Informational |

---

## 8. `.js-meta.xml` Configuration

This XML file controls **where** your LWC can be used and what properties are exposed.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>67.0</apiVersion>
    <isExposed>true</isExposed>
    <masterLabel>My Account Card</masterLabel>
    <description>Displays account details</description>
    <targets>
        <target>lightning__RecordPage</target>
        <target>lightning__AppPage</target>
        <target>lightning__HomePage</target>
        <target>lightning__FlowScreen</target>
    </targets>
    <targetConfigs>
        <targetConfig targets="lightning__RecordPage">
            <objects>
                <object>Account</object>
            </objects>
            <property name="showRevenue" type="Boolean" default="true"
                      label="Show Revenue" description="Toggle revenue display"/>
        </targetConfig>
    </targetConfigs>
</LightningComponentBundle>
```

### Key Elements for PD1

| Element | Purpose |
| :--- | :--- |
| `<isExposed>true</isExposed>` | **Required** to make the component available in App Builder, Flow, etc. |
| `<targets>` | Where the component can be placed |
| `<targetConfigs>` | Object-specific settings and design-time properties |
| `<property>` | Exposes configurable attributes in Lightning App Builder |

### Target Values

| Target | Where It Appears |
| :--- | :--- |
| `lightning__RecordPage` | Record detail page |
| `lightning__AppPage` | Lightning App page (single-page app) |
| `lightning__HomePage` | Home page |
| `lightning__FlowScreen` | Screen Flow (as a flow screen component) |
| `lightning__UtilityBar` | Utility bar |
| `lightningCommunity__Page` | Experience Cloud (community) page |

---

## 9. Visualforce Essentials (Expanded)

Although Visualforce is considered legacy, it is still tested on the PD1 exam. You need to understand controllers, limits, and how Visualforce handles state.

### Controller Types & Syntax

| Concept | Syntax | Details |
| :--- | :--- | :--- |
| **Standard Controller** | `<apex:page standardController="Account">` | Auto-generated. Provides standard CRUD, navigation, and fields. |
| **Standard List Controller**| `<apex:page standardController="Account" recordSetVar="accounts">` | Allows working with a list of records. Provides pagination (`next()`, `previous()`). |
| **Custom Controller** | `<apex:page controller="MyCustomController">` | Fully custom Apex class. Runs in **system mode** by default (ignores object/field security unless using `with sharing`). |
| **Controller Extension** | `<apex:page standardController="Account" extensions="MyExt">` | Adds logic to a standard controller. Constructor **must** take `ApexPages.StandardController` as an argument. Runs in **user mode** (respects sharing). |

### Getters, Setters, and Action Methods
- **Getters (`getRecords()`)**: Read values from Apex to the VF page (`{!records}`).
- **Setters (`setRecords()`)**: Pass values from the VF page back to Apex.
- **Action Methods**: Invoked by buttons/links (e.g., `<apex:commandButton action="{!save}">`). Return a `PageReference` to navigate, or `null` to refresh the current page.

### The View State & `transient`
- **View State**: A hidden form field that maintains the state of the database and components between server requests. 
- **Limit**: Maximum view state size is **135 KB**.
- **`transient` Keyword**: Use `transient` in your Apex controller for variables that do **not** need to be saved in the view state (e.g., temporary lists, large queries used once for rendering).

### AJAX and Apex Invocation
- `<apex:actionFunction>`: Allows calling an Apex method directly from JavaScript.
- `<apex:actionSupport>`: Adds AJAX support (like `onclick` or `onchange`) to another VF component.
- `<apex:actionPoller>`: Periodically sends an AJAX request to call an Apex method.

### Page Messages
- `<apex:pageMessages>`: Displays ALL error messages generated on the page (e.g., from `ApexPages.addMessage()`).
- `<apex:pageMessage>`: Displays a single, hardcoded custom message on the page.

### Security
- Protect against **Cross-Site Scripting (XSS)** when rendering user input via JavaScript by using functions like `{!JSENCODE(userInput)}` or `HTMLENCODE()`.

---

## 10. Aura Components Reference (Expanded)

Aura is the precursor to LWC. Expect questions on events, interfaces, and how it compares to LWC.

### Component Structure & Attributes
- **Attributes**: Defined using `<aura:attribute name="accName" type="String" default="Acme" access="global" />`.
- **Value Binding**: 
  - `{!v.accName}` = Two-way binding (changes in UI update JS, changes in JS update UI).
  - `{#v.accName}` = One-way binding (updates in JS do not reflect in UI after initial render).

### Aura Bundle Files

| File | Extension | Purpose |
| :--- | :--- | :--- |
| Component | `.cmp` | Markup (HTML-like template). Starts with `<aura:component>`. |
| Controller | `Controller.js` | Client-side event handler functions. |
| **Helper** | `Helper.js` | **Reusable shared functions**. Keep logic here to share across controller methods. |
| Style | `.css` | Component styling (scoped). |
| Design | `.design` | Exposes attributes for configuration in Lightning App Builder. |

### Aura Interfaces (Where can it be used?)
To use an Aura component in specific places, it must implement interfaces:
- `force:appHostable`: Custom tab.
- `flexipage:availableForAllPageTypes`: App Builder (App/Home/Record pages).
- `force:hasRecordId`: Automatically provides the ID of the current record (no attribute definition needed).

### Aura Event Types & Propagation

| Type | Syntax | Scope / Propagation |
| :--- | :--- | :--- |
| **Component Event** | Register: `<aura:registerEvent>`<br>Fire: `cmp.getEvent("myEvent").fire()` | Parent-child hierarchy only. Follows **Capture** (root to source) and **Bubble** (source to root) phases. |
| **Application Event** | Register: `<aura:registerEvent>`<br>Fire: `$A.get("e.c:MyAppEvent").fire()` | **ALL components on the page** (broadcasting). Follows Capture, Bubble, and Default phases. |

> **Exam rule:** "May or may not be in the same parent" → **Application event**.

### Lightning Data Service for Aura
- `<force:recordData>` is the Aura equivalent to LWC's `@wire(getRecord)`. It performs CRUD operations without Apex.

### Aura Server Calls (`$A.enqueueAction`)
To call Apex, the Apex method must be `@AuraEnabled`.

```javascript
// Aura Controller.js
({
    loadAccounts : function(component, event, helper) {
        var action = component.get("c.getAccounts");  // Server action mapping
        action.setParams({ industry: "Technology" });
        
        // Define callback
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.accounts", response.getReturnValue());
            } else if (state === "ERROR") {
                // Handle error
            }
        });
        // Add to execution queue
        $A.enqueueAction(action);
    }
})
```

### Aura Rendering Lifecycle
```
init → render → afterRender
```
- `init`: Component initialization complete (Fetch initial data).
- `afterRender`: Rendering complete, DOM ready (DOM manipulation, third-party JS).
*(❌ "start" and "load" are **NOT** valid Aura lifecycle events.)*

### LWC ↔ Aura Interop
- **LWC can be wrapped inside an Aura component.**
- **Aura CANNOT be placed inside LWC.**
- Events: LWC fires standard DOM `CustomEvent`. Aura parent listens using standard `onmyevent="{!c.handleEvent}"` syntax.

---

## 11. Notes & Summer '26 (API v67.0) Release Updates (PD1 Syllabus Alignment)

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

