# Aura Components — Complete PD1 Notes

Aura is Salesforce's **client-side component framework** that preceded LWC. It is still widely used and the exam WILL have questions on it. Know the bundle structure, event system, interfaces, and how it differs from LWC.

---

## 1. Bundle File Structure

Every Aura component lives in a **bundle** — a folder containing multiple files.

```
myAuraComponent/
├── myAuraComponent.cmp          ← Markup / Template (required)
├── myAuraComponentController.js ← Client-side event handlers (optional)
├── myAuraComponentHelper.js     ← Shared reusable logic (optional)
├── myAuraComponentRenderer.js   ← Custom rendering logic (optional)
├── myAuraComponent.css          ← Scoped styles (optional)
├── myAuraComponent.design       ← App Builder configuration (optional)
├── myAuraComponent.auradoc      ← Documentation (optional)
├── myAuraComponent.svg          ← Custom icon (optional)
```

### File Roles

| File | Purpose | Key Point |
| :--- | :--- | :--- |
| `.cmp` | The markup template. Starts with `<aura:component>`. | **Required.** All markup, attributes, and handlers go here. |
| `Controller.js` | Event handler functions. Called from the `.cmp` via `{!c.myHandler}`. | Each function receives `(component, event, helper)`. |
| `Helper.js` | Shared, reusable logic. Called from the Controller or other Helper methods. | **Best practice**: Put complex logic HERE, not in Controller. Controller should just delegate. |
| `Renderer.js` | Override default rendering (rare). | Has `render()`, `rerender()`, `afterRender()`, `unrender()`. |
| `.design` | Exposes attributes to admins in Lightning App Builder. | Like LWC's `<property>` in `.js-meta.xml`. |
| `.css` | Scoped CSS styles. | Styles are scoped to the component. |

---

## 2. Attributes

Defined in the `.cmp` file. Think of them as the component's "properties."

```html
<aura:attribute name="accountName" type="String" default="Acme Corp" 
                description="Name of the account" access="public"/>
```

| Property | Values | Purpose |
| :--- | :--- | :--- |
| `name` | Any valid identifier | The attribute name |
| `type` | `String`, `Integer`, `Boolean`, `Date`, `List`, `Map`, `Object`, `Aura.Component[]`, sObject types (`Account`), etc. | Data type |
| `default` | Any valid value | Default value if not set |
| `access` | `private`, `public`, `global` | Visibility. `public` = other components can set it. `global` = accessible across namespaces. |
| `required` | `true` / `false` | Whether the attribute must be provided |

### Accessing Attributes
```javascript
// In Controller.js or Helper.js
var name = component.get("v.accountName");   // GET
component.set("v.accountName", "New Name");  // SET
```

### Value Binding

| Syntax | Type | Behavior |
| :--- | :--- | :--- |
| `{!v.attributeName}` | **Two-way binding** | Changes flow both directions (parent ↔ child). Changes in child update parent. |
| `{#v.attributeName}` | **One-way binding** | Value set once at initialization. Changes in parent do NOT update child after first render. |

> **Exam Trap**: If the question says "the child component should NOT be able to update the parent's value," the answer is **one-way binding `{#v.attr}`**.

---

## 3. Standard Aura Components

### Core / Structure

| Component | Purpose | Key Attributes |
| :--- | :--- | :--- |
| `<aura:component>` | **Root tag** of every Aura component | `implements` (interfaces), `controller` (Apex class), `access` |
| `<aura:application>` | Root tag for a standalone Aura application (`.app`) | `extends`, `access` |
| `<aura:attribute>` | Declares a component attribute (property) | `name`, `type`, `default`, `access`, `required` |
| `<aura:set>` | Sets an attribute value on a parent component | `attribute` |
| `<aura:if>` | Conditional rendering | `isTrue="{!v.showDetails}"`. Contains `<aura:set attribute="else">` for else block. |
| `<aura:iteration>` | Loops over a collection to render repeated markup | `items="{!v.accounts}"`, `var="acc"`, `indexVar="idx"` |
| `<aura:renderIf>` | Deprecated — use `<aura:if>` instead | — |
| `<aura:text>` | Renders plain text | `value` |
| `<aura:unescapedHtml>` | Renders raw HTML (⚠️ XSS risk) | `value` |
| `<aura:html>` | Renders a dynamic HTML tag | `tag`, `body` |
| `<aura:expression>` | Evaluates an expression | `value` |

### Event Components

| Component | Purpose | Key Attributes |
| :--- | :--- | :--- |
| `<aura:event>` | Defines a custom event (in its own `.evt` file) | `type` (`COMPONENT` or `APPLICATION`) |
| `<aura:registerEvent>` | Declares that a component can fire an event | `name`, `type` (event reference) |
| `<aura:handler>` | Listens for an event | `name` (for component events), `event` (for application events), `action="{!c.handleEvent}"` |

### Dependency & Method

| Component | Purpose | Key Attributes |
| :--- | :--- | :--- |
| `<aura:dependency>` | Declares a dependency on another component or event | `resource` |
| `<aura:method>` | Exposes a public method that parent components can call | `name`, `action` |
| `<lightning:*>` | All Lightning Base Components are available in Aura too! | Same as LWC base components |

> **Key Point**: ALL `lightning-*` base components (buttons, inputs, cards, datatables, etc.) are available in Aura as `<lightning:button>`, `<lightning:input>`, `<lightning:card>`, etc. (colon instead of dash).

---

## 4. Interfaces (Where Can the Component Be Used?)

An Aura component must **implement** specific interfaces to be used in certain locations.

```html
<aura:component implements="force:appHostable,flexipage:availableForAllPageTypes,force:hasRecordId">
```

| Interface | Allows Component To Be Used In | What It Provides |
| :--- | :--- | :--- |
| `force:appHostable` | **Custom Tab** | — |
| `flexipage:availableForAllPageTypes` | **Lightning App Builder** (App, Home, Record pages) | — |
| `flexipage:availableForRecordHome` | Lightning App Builder — **Record pages only** | — |
| `force:hasRecordId` | Automatically receives the **current record ID** | Injects `v.recordId` attribute (no need to declare it) |
| `force:hasSObjectName` | Automatically receives the **current object API name** | Injects `v.sObjectName` attribute |
| `force:lightningQuickAction` | **Quick Action** (action panel) | — |
| `force:lightningQuickActionWithoutHeader` | Quick Action without header bar | — |
| `forceCommunity:availableForAllPageTypes` | **Experience Cloud** (community) pages | — |
| `clients:availableForMailAppAppPage` | Outlook/Gmail integration | — |

> **Exam Trap**: `force:hasRecordId` does NOT need you to declare `<aura:attribute name="recordId">`. The interface injects it automatically. If you DO declare it manually, you'll get a duplicate attribute error.

---

## 5. Event System (Deep Dive)

### Event Types

| Type | Scope | How to Fire | How to Handle |
| :--- | :--- | :--- | :--- |
| **Component Event** | Only travels up the **containment hierarchy** (child → parent → grandparent) | `component.getEvent("myEvent").fire()` | `<aura:handler name="myEvent" event="c:MyCompEvent" action="{!c.handle}"/>` |
| **Application Event** | Broadcasts to **ALL** components on the page | `$A.get("e.c:MyAppEvent").fire()` | `<aura:handler event="c:MyAppEvent" action="{!c.handle}"/>` (no `name` attribute!) |

### Creating a Custom Event

**Step 1**: Create the event file (`MyCompEvent.evt`):
```xml
<aura:event type="COMPONENT" description="Fires when an account is selected">
    <aura:attribute name="accountId" type="Id"/>
    <aura:attribute name="accountName" type="String"/>
</aura:event>
```

**Step 2**: Register and fire from child:
```html
<!-- Child.cmp -->
<aura:registerEvent name="accountSelected" type="c:MyCompEvent"/>
```
```javascript
// ChildController.js
handleClick: function(component, event, helper) {
    var evt = component.getEvent("accountSelected");
    evt.setParams({
        accountId: "001xxxxxxxxxxxx",
        accountName: "Acme"
    });
    evt.fire();
}
```

**Step 3**: Handle in parent:
```html
<!-- Parent.cmp -->
<c:Child accountSelected="{!c.handleAccountSelected}"/>
```
```javascript
// ParentController.js
handleAccountSelected: function(component, event, helper) {
    var accId = event.getParam("accountId");
    var accName = event.getParam("accountName");
}
```

### Event Propagation Phases

| Phase | Direction | Applies To |
| :--- | :--- | :--- |
| **Capture** | Root → Source (downward) | Component & Application events |
| **Bubble** | Source → Root (upward) | Component & Application events |
| **Default** | No specific direction | Application events **only** |

- Call `event.stopPropagation()` to stop bubbling.
- Call `event.pause()` / `event.resume()` to temporarily halt propagation.

---

## 6. System Events

Aura provides built-in system events that fire automatically:

| Event | When | Use For |
| :--- | :--- | :--- |
| `init` | Component initialization complete | Fetch initial data, set defaults. Handler: `<aura:handler name="init" value="{!this}" action="{!c.doInit}"/>` |
| `change` | An attribute value changes | React to attribute changes. Handler: `<aura:handler name="change" value="{!v.myAttr}" action="{!c.handleChange}"/>` |
| `render` | Component is rendering | Rarely used directly |
| `afterRender` | Rendering complete, DOM ready | DOM manipulation, third-party JS initialization |
| `destroy` | Component is being destroyed | Cleanup |

> ❌ `start`, `load`, and `ready` are **NOT** valid Aura lifecycle events!

---

## 7. Server-Side Calls (`$A.enqueueAction`)

To call Apex from Aura, the method must be `@AuraEnabled`.

```javascript
// Controller.js
({
    loadAccounts: function(component, event, helper) {
        // 1. Create the server action
        var action = component.get("c.getAccounts");
        
        // 2. Set parameters
        action.setParams({
            industry: component.get("v.selectedIndustry")
        });
        
        // 3. Define the callback
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.accounts", response.getReturnValue());
            } else if (state === "INCOMPLETE") {
                // Server didn't respond (offline?)
            } else if (state === "ERROR") {
                var errors = response.getError();
                console.error("Error: " + JSON.stringify(errors));
            }
        });
        
        // 4. Enqueue the action
        $A.enqueueAction(action);
    }
})
```

### Response States

| State | Meaning |
| :--- | :--- |
| `SUCCESS` | Server returned successfully |
| `ERROR` | Server threw an exception |
| `INCOMPLETE` | Server is unreachable (e.g., offline) |

### Storable Actions (Client-Side Caching)
```javascript
action.setStorable();  // Cache the server response
```
- Caches the response on the client. Next call with same params returns cached data instantly, then fetches fresh data in background.
- Only works with `@AuraEnabled(cacheable=true)` methods.

---

## 8. Lightning Data Service for Aura (`force:recordData`)

CRUD operations **without writing Apex**:

```html
<aura:component implements="force:hasRecordId">
    <!-- Load record data -->
    <force:recordData aura:id="recordLoader"
        recordId="{!v.recordId}"
        layoutType="FULL"
        targetRecord="{!v.record}"
        targetFields="{!v.simpleRecord}"
        targetError="{!v.recordError}"
        mode="VIEW"
    />
    
    <p>Name: {!v.simpleRecord.Name}</p>
    <p>Industry: {!v.simpleRecord.Industry}</p>
</aura:component>
```

| Attribute | Purpose |
| :--- | :--- |
| `recordId` | The record to load |
| `layoutType` | `FULL` or `COMPACT` — determines which fields to load |
| `fields` | Alternative to `layoutType` — specify exact fields to load |
| `targetRecord` | The raw record (with nested structure) |
| `targetFields` | Simplified flat field access |
| `targetError` | Error object if loading fails |
| `mode` | `VIEW` (read-only), `EDIT` (read-write) |

### Saving Changes
```javascript
// In Controller.js
handleSave: function(component, event, helper) {
    component.find("recordLoader").saveRecord(function(saveResult) {
        if (saveResult.state === "SUCCESS") {
            // Record saved!
        }
    });
}
```

---

## 9. LWC ↔ Aura Interop

### Key Rules
- ✅ **LWC CAN be wrapped inside an Aura component.**
- ❌ **Aura CANNOT be placed inside LWC.**

### How It Works
```html
<!-- AuraWrapper.cmp -->
<aura:component>
    <c:myLwcComponent recordId="{!v.recordId}" onselected="{!c.handleSelected}"/>
</aura:component>
```

- LWC fires standard DOM `CustomEvent`.
- Aura parent listens using `oneventname="{!c.handler}"` (prefix `on` + lowercase event name).
- LWC `@api` properties map directly to Aura attributes.

### When to Use a Wrapper
- When an LWC needs access to an Aura-only feature (e.g., `overlayLibrary` for modals before LWC had `LightningModal`).
- When an existing Aura app needs to gradually adopt LWC components.

---

## 10. Aura vs LWC — Quick Comparison

| Feature | Aura | LWC |
| :--- | :--- | :--- |
| **Template** | `.cmp` (proprietary) | `.html` (standard HTML) |
| **JavaScript** | ES5, proprietary framework | ES6+ standard, extends `LightningElement` |
| **Data Binding** | Two-way `{!v.attr}` + One-way `{#v.attr}` | One-way by default (parent → child via `@api`) |
| **Events** | Component Events + Application Events | Standard DOM `CustomEvent` |
| **Cross-Component** | Application Events | Lightning Message Service (LMS) |
| **Record Access** | `<force:recordData>` | `@wire(getRecord)` or `<lightning-record-form>` |
| **Server Calls** | `$A.enqueueAction(action)` | `@wire` or imperative `import` |
| **Lifecycle** | `init` → `render` → `afterRender` | `constructor` → `connectedCallback` → `renderedCallback` |
| **Performance** | Slower (proprietary framework overhead) | Faster (native browser APIs) |
| **Recommendation** | Legacy maintenance only | **All new development** |
