# Lightning Web Components (LWC) — Complete PD1 Notes

LWC is the **primary UI framework** for Salesforce development. Built on modern web standards (Custom Elements, Shadow DOM, ES Modules). This is where the majority of UI exam questions come from.

---

## 1. File Structure

Every LWC lives in a folder. The folder name IS the component name.

```
myComponent/
├── myComponent.html          ← Template (required)
├── myComponent.js            ← JavaScript class (required)
├── myComponent.js-meta.xml   ← Configuration (required)
├── myComponent.css           ← Scoped styles (optional)
├── myComponent.svg           ← Custom icon (optional)
└── __tests__/                ← Jest unit tests (optional)
```

### Rules:
- Folder name must be **camelCase** starting with a **lowercase letter**.
- In HTML markup, components are referenced with **kebab-case** and a namespace prefix:
  - `myComponent` → `<c-my-component>` (default namespace `c`)
  - `lightning-button` → maps to the standard `lightning` namespace

---

## 2. Decorators — @api, @track, @wire

| Decorator | Purpose | Reactivity |
| :--- | :--- | :--- |
| **`@api`** | Makes a property or method **public** (parent can set it or call it) | Reactive — re-renders when parent changes the value |
| **`@track`** | Deep reactivity for **objects and arrays** | Only needed when mutating a nested property (e.g., `this.obj.name = 'x'`) |
| **`@wire`** | Connects to a **wire adapter** (LDS or Apex) for reactive data fetching | Auto-fetches when reactive parameters (prefixed `$`) change |

### Important:
- Since **Spring '20**, all primitive properties (`String`, `Number`, `Boolean`) are **reactive by default** — you do NOT need `@track` for them.
- `@track` is only needed for deep mutations inside objects/arrays.
- `@api` properties are **read-only inside the component** — the child cannot modify its own `@api` property.

---

## 3. Lifecycle Hooks

```
constructor() → connectedCallback() → [render()] → renderedCallback()
                                                          ↕ (re-renders)
                                      disconnectedCallback() ← on removal
```

| Hook | When It Fires | Use For | Pitfall |
| :--- | :--- | :--- | :--- |
| `constructor()` | Component instantiated | Super basic setup | Cannot access `this.template` or child elements |
| `connectedCallback()` | Inserted into the DOM | Initialize data, subscribe to LMS, fetch data | Fires only once per insertion |
| `renderedCallback()` | After every render/re-render | DOM manipulation, third-party JS init | ⚠️ Setting reactive properties here causes **infinite loops**! Use a boolean guard. |
| `disconnectedCallback()` | Removed from the DOM | Cleanup: unsubscribe from LMS, remove listeners | — |
| `errorCallback(error, stack)` | Descendant throws an error | Error boundary — catch child errors | Only catches errors from **children**, not from itself |

---

## 4. Standard Lightning Base Components

These are the pre-built UI components provided by Salesforce. They live in the `lightning` namespace.

### Form & Input Components

| Component | Purpose | Key Attributes |
| :--- | :--- | :--- |
| `<lightning-input>` | General input field (text, number, email, date, checkbox, toggle, etc.) | `type`, `label`, `value`, `name`, `required`, `min`, `max`, `pattern` |
| `<lightning-textarea>` | Multi-line text input | `label`, `value`, `max-length` |
| `<lightning-combobox>` | Dropdown picklist (single select) | `label`, `value`, `options` (array of `{label, value}`), `placeholder` |
| `<lightning-dual-listbox>` | Two-panel multi-select (available → selected) | `label`, `source-label`, `selected-label`, `options`, `value` |
| `<lightning-checkbox-group>` | Group of checkboxes | `label`, `options`, `value` (array of selected values) |
| `<lightning-radio-group>` | Group of radio buttons | `label`, `options`, `value`, `type` (`radio` or `button`) |
| `<lightning-slider>` | Horizontal slider for numeric input | `label`, `min`, `max`, `value`, `step` |
| `<lightning-input-rich-text>` | Rich text editor (bold, italic, lists, etc.) | `value`, `label`, `formats` |
| `<lightning-file-upload>` | File upload component | `label`, `record-id`, `accept`, `multiple` |

### Record-Level Form Components

| Component | Purpose | Key Points |
| :--- | :--- | :--- |
| `<lightning-record-form>` | Editable or read-only record form. **Simplest** — handles layout automatically. | `record-id`, `object-api-name`, `fields`, `mode` (`edit`, `view`, `readonly`) |
| `<lightning-record-edit-form>` | Customizable edit form. Gives full control over layout. | Wrap `<lightning-input-field>` inside it. Must include `<lightning-button>` for submit. |
| `<lightning-record-view-form>` | Read-only record display with full layout control. | Wrap `<lightning-output-field>` inside it. |
| `<lightning-input-field>` | An editable field inside `<lightning-record-edit-form>` | `field-name` — automatically picks up field type, label, validation |
| `<lightning-output-field>` | A read-only field inside `<lightning-record-view-form>` | `field-name` |

> **Exam Trap**: `<lightning-record-form>` does NOT require you to manually add `<lightning-input-field>` — it auto-generates the form layout. But `<lightning-record-edit-form>` DOES require you to add `<lightning-input-field>` tags manually for each field.

### Buttons & Actions

| Component | Purpose | Key Attributes |
| :--- | :--- | :--- |
| `<lightning-button>` | Standard button | `label`, `variant` (`brand`, `destructive`, `neutral`, `success`), `onclick` |
| `<lightning-button-group>` | Groups multiple buttons together | Wrap `<lightning-button>` children inside |
| `<lightning-button-icon>` | Icon-only button (no label) | `icon-name`, `variant`, `alternative-text` |
| `<lightning-button-menu>` | Dropdown menu button | Contains `<lightning-menu-item>` children |
| `<lightning-menu-item>` | Individual item in a dropdown menu | `label`, `value` |
| `<lightning-button-stateful>` | Toggle button (e.g., Follow/Unfollow) | `label-when-off`, `label-when-on`, `label-when-hover`, `selected` |

### Layout & Structure

| Component | Purpose | Key Attributes |
| :--- | :--- | :--- |
| `<lightning-card>` | Container with header, body, and footer sections | `title`, `icon-name` |
| `<lightning-layout>` | Flexible horizontal row layout (like flexbox) | `horizontal-align`, `vertical-align`, `multiple-rows` |
| `<lightning-layout-item>` | Column within `<lightning-layout>` | `size` (1-12), `small-device-size`, `medium-device-size`, `padding` |
| `<lightning-tabset>` | Tab navigation container | Contains `<lightning-tab>` children |
| `<lightning-tab>` | Individual tab | `label`, `value`, `icon-name` |
| `<lightning-accordion>` | Collapsible sections | `active-section-name`, `allow-multiple-sections-open` |
| `<lightning-accordion-section>` | Individual collapsible section | `name`, `label` |
| `<lightning-tile>` | Compact information display | `label`, `href` |
| `<lightning-vertical-navigation>` | Side navigation menu | Contains `<lightning-vertical-navigation-item>` |

### Data Display

| Component | Purpose | Key Attributes |
| :--- | :--- | :--- |
| `<lightning-datatable>` | Full-featured data table with sorting, row selection, inline editing | `data`, `columns`, `key-field`, `sorted-by`, `sorted-direction` |
| `<lightning-tree>` | Hierarchical tree view | `items` (array with `label`, `name`, `items` for children) |
| `<lightning-tree-grid>` | Tree + table hybrid (expandable rows) | `data`, `columns`, `key-field` |
| `<lightning-badge>` | Small label/tag (e.g., "New", "Active") | `label`, `icon-name` |
| `<lightning-icon>` | Displays a Lightning Design System icon | `icon-name` (e.g., `standard:account`), `size`, `variant` |
| `<lightning-avatar>` | User profile image/initials | `src`, `initials`, `fallback-icon-name` |
| `<lightning-formatted-text>` | Renders text with link detection | `value`, `linkify` |
| `<lightning-formatted-number>` | Formats numbers (currency, percent, decimal) | `value`, `format-style` (`currency`, `percent`, `decimal`) |
| `<lightning-formatted-date-time>` | Formats date/time values | `value`, `year`, `month`, `day`, `hour`, `minute` |
| `<lightning-formatted-url>` | Renders a clickable URL | `value`, `label`, `target` |
| `<lightning-formatted-email>` | Renders a clickable email link | `value` |
| `<lightning-formatted-phone>` | Renders a clickable phone link | `value` |
| `<lightning-formatted-rich-text>` | Renders HTML rich text safely | `value` |
| `<lightning-progress-bar>` | Horizontal progress bar | `value` (0-100), `variant` |
| `<lightning-progress-indicator>` | Step-by-step progress (wizard) | `current-step`, `type` (`base` or `path`) |
| `<lightning-spinner>` | Loading spinner animation | `alternative-text`, `size` (`small`, `medium`, `large`) |

### Utility Components

| Component | Purpose | Key Attributes |
| :--- | :--- | :--- |
| `<lightning-helptext>` | Tooltip icon with hover text | `content` |
| `<lightning-pill>` | Removable selection tag (e.g., selected filter) | `label`, `href`, `onremove` |
| `<lightning-pill-container>` | Container for multiple pills | `items` |
| `<lightning-breadcrumb>` | Navigation breadcrumb item | `label`, `href` |
| `<lightning-breadcrumbs>` | Container for breadcrumbs | Contains `<lightning-breadcrumb>` children |
| `<lightning-map>` | Embedded map with markers | `map-markers`, `zoom-level` |
| `<lightning-carousel>` | Image carousel/slider | Contains `<lightning-carousel-image>` children |

---

## 5. Connecting to Apex

### Rule: Apex method MUST be `static` and annotated with `@AuraEnabled`.

### Wire Service (Reactive, Read-Only)
```javascript
import getAccounts from '@salesforce/apex/AccountController.getAccounts';

@wire(getAccounts, { industry: '$selectedIndustry' })
wiredAccounts;   // Returns { data, error }
```
- Apex method MUST have `@AuraEnabled(cacheable=true)`.
- **NO DML allowed** inside cacheable methods.
- Automatically re-fetches when `$selectedIndustry` changes.

### Imperative Apex (On-Demand, Supports DML)
```javascript
import saveAccount from '@salesforce/apex/AccountController.saveAccount';

handleSave() {
    saveAccount({ acc: this.account })
        .then(result => { /* success */ })
        .catch(error => { /* error */ });
}
```
- Can use `cacheable=true` or `cacheable=false`.
- Required for DML, button clicks, conditional calls.

### refreshApex
After imperative DML, wired data is stale. Force a re-fetch:
```javascript
import { refreshApex } from '@salesforce/apex';

// You must store the FULL provisioned result
wiredResult;
@wire(getAccounts)
wiredHandler(result) {
    this.wiredResult = result;  // { data, error }
    if (result.data) this.accounts = result.data;
}

handleSave() {
    saveAccount({...}).then(() => refreshApex(this.wiredResult));
}
```
> ⚠️ `refreshApex()` needs the **full provisioned object** (`{data, error}`), NOT just `this.accounts`.

---

## 6. LDS Wire Adapters (No Apex Needed)

All imported from `lightning/uiRecordApi`.

| Adapter | Purpose | Read/Write |
| :--- | :--- | :---: |
| `getRecord` | Get a single record | Read |
| `getRecords` | Get multiple records | Read |
| `getFieldValue(record, FIELD)` | Extract a field value from `getRecord` result | Read |
| `getFieldDisplayValue(record, FIELD)` | Get formatted display value (e.g., currency symbol) | Read |
| `createRecord(recordInput)` | Create a record | Write (imperative) |
| `updateRecord(recordInput)` | Update a record | Write (imperative) |
| `deleteRecord(recordId)` | Delete a record | Write (imperative) |

### Import Schema References
```javascript
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';
```

---

## 7. Component Communication

### Parent → Child (Pass Data Down)
```html
<!-- Parent HTML -->
<c-child-component account-name={accName} record-id={recId}></c-child-component>
```
```javascript
// Child JS — receives the value
@api accountName;
@api recordId;
```

### Parent → Child (Call Methods)
```javascript
// Child JS — expose a public method
@api
refreshData() { /* ... */ }

// Parent JS — call the child's method
this.template.querySelector('c-child-component').refreshData();
```

### Child → Parent (Custom Events)
```javascript
// Child JS — fire event
this.dispatchEvent(new CustomEvent('selected', {
    detail: { accountId: this.recordId }
}));
```
```html
<!-- Parent HTML — listen -->
<c-child-component onselected={handleSelected}></c-child-component>
```
```javascript
// Parent JS
handleSelected(event) {
    const accountId = event.detail.accountId;
}
```

### Sibling / Unrelated Components (Lightning Message Service)
```javascript
import { publish, subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import MY_CHANNEL from '@salesforce/messageChannel/MyChannel__c';

@wire(MessageContext) messageContext;

// Publish
publish(this.messageContext, MY_CHANNEL, { recordId: '001xxx' });

// Subscribe (in connectedCallback)
this.subscription = subscribe(this.messageContext, MY_CHANNEL, (message) => {
    this.recordId = message.recordId;
});

// Unsubscribe (in disconnectedCallback)
unsubscribe(this.subscription);
```

---

## 8. Navigation & Toasts

### NavigationMixin
```javascript
import { NavigationMixin } from 'lightning/navigation';

export default class MyComp extends NavigationMixin(LightningElement) {
    navigateToRecord() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.accountId,
                objectApiName: 'Account',
                actionName: 'view'  // 'view', 'edit', 'clone'
            }
        });
    }
}
```

| type Value | Opens |
| :--- | :--- |
| `standard__recordPage` | Record page (view/edit/clone) |
| `standard__objectPage` | Object home / list view |
| `standard__webPage` | External URL |
| `standard__namedPage` | Named page (e.g., `home`) |
| `standard__navItemPage` | Custom tab |

### ShowToastEvent
```javascript
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

this.dispatchEvent(new ShowToastEvent({
    title: 'Success',
    message: 'Record saved!',
    variant: 'success'  // 'success' | 'error' | 'warning' | 'info'
}));
```

---

## 9. js-meta.xml Configuration

```xml
<?xml version="1.0" encoding="UTF-8"?>
<LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>67.0</apiVersion>
    <isExposed>true</isExposed>
    <masterLabel>Account Card</masterLabel>
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
            <property name="showRevenue" type="Boolean" default="true" label="Show Revenue"/>
        </targetConfig>
    </targetConfigs>
</LightningComponentBundle>
```

| Element | Purpose |
| :--- | :--- |
| `<isExposed>true</isExposed>` | **Required** to make component available in App Builder |
| `<targets>` | Where the component can be placed |
| `<property>` | Design-time attribute admins can configure in App Builder |

| Target | Where |
| :--- | :--- |
| `lightning__RecordPage` | Record detail page |
| `lightning__AppPage` | Single-page Lightning app |
| `lightning__HomePage` | Home page |
| `lightning__FlowScreen` | Screen Flow |
| `lightning__UtilityBar` | Utility bar footer |
| `lightningCommunity__Page` | Experience Cloud site |

---

## 10. Security in LWC

- **Locker Service / Lightning Web Security (LWS)**: Enforces strict isolation between components from different namespaces. Components cannot access each other's DOM.
- **Shadow DOM**: Each LWC has its own isolated DOM tree. CSS styles don't leak in or out.
- **CRUD/FLS in Apex**: Always use `WITH USER_MODE` or `WITH SECURITY_ENFORCED` in SOQL, or `Security.stripInaccessible()` before returning data to LWC.
