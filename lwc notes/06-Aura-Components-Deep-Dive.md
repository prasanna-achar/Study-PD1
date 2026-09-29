# Objective 6: Aura Components Deep Dive

> Format: Rule → Syntax → Trap → Example → Mnemonic

---

## 1. Aura Component Bundle Files

**Rule:** Know exactly what each file in an Aura bundle does.

| File | Purpose |
| :--- | :--- |
| `MyComponent.cmp` | HTML markup — the component template |
| `MyComponentController.js` | Client-side JS controller — handles UI events |
| `MyComponentHelper.js` | Shared JS utilities — called by Controller and Renderer |
| `MyComponentRenderer.js` | Custom rendering logic — overrides default rendering |
| `MyComponentModel.java` | Server-side Java model (rarely used) |
| `MyComponentProvider.java` | Server-side provider (rarely used) |
| `MyComponent.css` | Component-scoped CSS |
| `MyComponent.design` | Design configuration for App Builder |
| `MyComponent.auradoc` | Documentation |
| `MyComponent.svg` | Custom icon |

**Most tested on exam:**
- Controller.js vs Helper.js distinction
- `.design` file for App Builder

---

## 2. Controller vs Helper (The Classic Trap)

**Rule:** This is one of the most tested distinctions in Aura.

| File | Role | Can call other files? |
| :--- | :--- | :--- |
| `Controller.js` | Handles UI events (button clicks, etc.) | Calls Helper.js |
| `Helper.js` | Business logic, reusable utility functions | Can call itself (recursion), NOT the Controller |
| `Renderer.js` | Overrides Aura rendering lifecycle | Calls Helper.js |

**Why Helper?**
> If 3 different controller actions need the same logic, put it in Helper — not duplicated in Controller.

```javascript
// Controller.js
({
    handleClick: function(component, event, helper) {
        helper.processData(component); // ← Delegates to helper
    }
})

// Helper.js
({
    processData: function(component) {
        // Shared logic lives here
        var records = component.get('v.records');
        // process...
    }
})
```

**Trap:**
- "Helper can call Controller" → ❌ WRONG. One-way only. Controller calls Helper. Helper does NOT call Controller.

**Mnemonic:** "Controller = door. Helper = kitchen. Guests use the door, which goes to kitchen. Kitchen doesn't answer the door."

---

## 3. Aura Attribute Value Providers: `v.` and `c.`

**Rule:** Two value providers exist in Aura markup:

| Provider | Points To | Use For |
| :--- | :--- | :--- |
| `v.` | View attributes (component's own data) | Displaying data, passing data |
| `c.` | Controller actions | Binding to events |

```html
<!-- {!v.name} reads from component attributes -->
<!-- {!c.handleClick} references a controller action -->
<aura:component>
    <aura:attribute name="name" type="String" default="World"/>
    <p>Hello, {!v.name}!</p>
    <lightning:button onclick="{!c.handleClick}" label="Click me"/>
</aura:component>
```

**Trap — LWC vs Aura syntax:**
| Aura | LWC Equivalent |
| :--- | :--- |
| `{!v.propName}` | `{propName}` |
| `{!c.methodName}` | `{methodName}` (without `!`) |
| `<aura:attribute ...>` | Class property + `@api` |

**Mnemonic:** "In Aura, `v.` = value (data), `c.` = controller (action). In LWC, it's all just `{prop}`."

---

## 4. `<aura:attribute>` — Full Rules

**Syntax:**
```html
<aura:attribute 
    name="title"
    type="String" 
    default="Default Title"
    required="true"
    access="public"        <!-- public | private | global -->
    description="Page title"
/>
```

**Valid Primitive Types:**
```
String, Integer, Long, Double, Decimal, Boolean, Date, DateTime, Object
```

**Valid Complex Types:**
```
List, Map, Set, Aura.Component[], Object, SObject types (Account, Contact, etc.)
```

**Trap — Invalid type names:**
```html
<!-- ❌ WRONG — these types don't exist in Aura -->
<aura:attribute name="data" type="array" />   <!-- should be List -->
<aura:attribute name="data" type="number" />  <!-- should be Integer or Decimal -->
<aura:attribute name="data" type="json" />    <!-- FAKE — use Object -->
```

**`access` Values:**
| Value | Means |
| :--- | :--- |
| `public` | Default. Any component can use it. |
| `private` | Only this component can access it. |
| `global` | Accessible from anywhere, including VF pages and external apps. |

---

## 5. `<aura:handler>` — Events & Init

**Rule:** Use `<aura:handler>` to handle:
1. Standard Aura lifecycle events (`init`, `render`, `unrender`, `rerender`)
2. Inherited/standard component events
3. Application events fired by other components

**`init` handler — critical timing:**
```html
<aura:handler name="init" value="{!this}" action="{!c.doInit}"/>
```

**`init` fires BEFORE child components are initialized.** If you need to set up data before children render, `init` is correct.

**`render` handler:**
```html
<aura:handler name="render" value="{!this}" action="{!c.doAfterRender}"/>
```

**Handling a component event from a child:**
```html
<!-- Parent registers to handle child's event -->
<aura:handler name="myEvent" event="c:MyCustomEvent" action="{!c.handleEvent}"/>
```

**Handling an application event:**
```html
<!-- No 'name' attribute for application events -->
<aura:handler event="c:MyApplicationEvent" action="{!c.handleAppEvent}"/>
```

**Trap — init vs render ordering with children:**
```
Aura lifecycle order:
1. Parent init fires
2. Child init fires (child attributes are set from parent)
3. Child render fires
4. Parent render fires

LWC equivalent:
1. Parent constructor → connectedCallback
2. Child constructor → connectedCallback → renderedCallback
3. Parent renderedCallback
```

---

## 6. Aura Event Types: Component vs Application

**Rule:** This is a top-3 most-tested Aura topic.

| Aspect | Component Event | Application Event |
| :--- | :--- | :--- |
| **Scope** | Travels UP the component hierarchy (bubbles up to parent, grandparent) | Broadcast to ALL components on the page |
| **Use When** | Parent-child communication | Completely unrelated components |
| **Fire with** | `event.fire()` | `$A.get("e.c:MyAppEvent").fire()` |
| **Definition** | `type="COMPONENT"` | `type="APPLICATION"` |
| **`aura:handler` syntax** | `name="eventName"` attribute | No `name` attribute |

### Creating a Component Event:

**Event definition file (`MyEvent.evt`):**
```xml
<aura:event type="COMPONENT" description="My component event">
    <aura:attribute name="recordId" type="String"/>
</aura:event>
```

**Registering in the firing component (`cmp`):**
```html
<aura:registerEvent name="myEvent" type="c:MyEvent"/>
```

**Firing in controller:**
```javascript
var event = component.getEvent('myEvent'); // ← 'getEvent' not 'get'
event.setParams({ recordId: component.get('v.recordId') });
event.fire();
```

**Handling in parent:**
```html
<aura:handler name="myEvent" event="c:MyEvent" action="{!c.handleMyEvent}"/>
```

### Creating an Application Event:

**Event definition file:**
```xml
<aura:event type="APPLICATION">
    <aura:attribute name="message" type="String"/>
</aura:event>
```

**Firing an Application Event:**
```javascript
var appEvent = $A.get('e.c:MyApplicationEvent');
appEvent.setParams({ message: 'Hello World' });
appEvent.fire();
```

**Handling an Application Event (in any component):**
```html
<!-- Note: NO name attribute -->
<aura:handler event="c:MyApplicationEvent" action="{!c.handleAppEvent}"/>
```

**Trap:**
```html
<!-- ❌ WRONG for application event — name attribute is for component events only -->
<aura:handler name="myAppEvent" event="c:MyApplicationEvent" action="{!c.handle}"/>

<!-- ✅ CORRECT for application event -->
<aura:handler event="c:MyApplicationEvent" action="{!c.handle}"/>
```

**Mnemonic:** "Component event = bubbles up. Application event = shouts to everyone. No `name` for app events."

---

## 7. Apex from Aura: `@AuraEnabled`

**Rule:** Any Apex method called from an Aura (or LWC) component MUST be:
- `@AuraEnabled`
- `public` or `global`
- `static`

```apex
public class ContactController {
    @AuraEnabled
    public static List<Contact> getContacts() {
        return [SELECT Id, Name FROM Contact];
    }
}
```

**Calling from Aura controller.js:**
```javascript
var action = component.get('c.getContacts'); // ← prefix 'c.' for Apex methods
action.setCallback(this, function(response) {
    var state = response.getState();
    if (state === 'SUCCESS') {
        component.set('v.contacts', response.getReturnValue());
    } else {
        console.error('Error:', response.getError());
    }
});
$A.enqueueAction(action);
```

**Key Points:**
- `component.get('c.methodName')` — creates an action object
- `action.setParams({...})` — sets parameters
- `action.setCallback(scope, callbackFn)` — sets the response handler
- `$A.enqueueAction(action)` — queues the action for execution
- `response.getState()` → `'SUCCESS'`, `'ERROR'`, `'INCOMPLETE'`
- `response.getReturnValue()` → the return value from Apex

**Trap:**
```javascript
// ❌ WRONG — forgetting $A.enqueueAction
var action = component.get('c.getContacts');
action.setCallback(this, function(response) { ... });
// Missing $A.enqueueAction(action)!

// ❌ WRONG — calling directly
ContactController.getContacts(); // This is not how it works in Aura!
```

---

## 8. Storable Actions (Caching)

**Rule:** Mark an action as storable to cache results. Subsequent calls return cached data instantly.

```javascript
action.setStorable(); // ← Call this BEFORE enqueueAction
$A.enqueueAction(action);
```

**Trap:** `setStorable()` is called on the **action object**, NOT on `component` or `$A`.

---

## 9. `$A` Global Functions

**Rule:** `$A` is the Aura framework global. Know these methods:

| Method | Use Case |
| :--- | :--- |
| `$A.get('e.namespace:EventName')` | Get an application event |
| `$A.enqueueAction(action)` | Queue a server-side Apex call |
| `$A.util.isEmpty(value)` | Check if a value is empty/null |
| `$A.util.hasClass(element, 'className')` | Check CSS class |
| `$A.util.addClass(element, 'className')` | Add CSS class |
| `$A.util.removeClass(element, 'className')` | Remove CSS class |
| `$A.util.toggleClass(element, 'className')` | Toggle CSS class |

---

## 10. Aura Design File (`.design`) — App Builder

**Rule:** The `.design` file defines what properties appear in the **Lightning App Builder** property panel.

```xml
<!-- MyComponent.design -->
<design:component label="My Component">
    <design:attribute name="title" label="Title" description="Component title"/>
    <design:attribute name="recordId" label="Record ID" />
</design:component>
```

**Rule:** The `name` in `<design:attribute>` must EXACTLY match the `name` of an `<aura:attribute>` in the `.cmp` file.

---

## 11. Lightning Data Service (LDS) in Aura

**Rule:** LDS allows reading/writing record data WITHOUT writing Apex. Uses `<force:recordData>`.

```html
<aura:component implements="flexipage:availableForAllPageTypes">
    <force:recordData 
        aura:id="recordLoader"
        recordId="{!v.recordId}"
        targetFields="{!v.record}"
        fields="Name,Phone,Email"
        recordUpdated="{!c.handleRecordUpdated}"
        mode="VIEW" />  <!-- VIEW or EDIT -->
    <p>{!v.record.fields.Name.value}</p>
</aura:component>
```

**Trap — Field access:**
```html
<!-- ❌ WRONG -->
{!v.record.Name}

<!-- ✅ CORRECT — LDS wraps field values -->
{!v.record.fields.Name.value}
```

---

## Quick Reference Cheat Sheet

```
Aura Bundle Files:
  .cmp            → template markup
  Controller.js   → event handlers (calls Helper)
  Helper.js       → reusable logic (called by Controller & Renderer)
  Renderer.js     → custom rendering
  .design         → App Builder config
  .evt            → event definition

Value Providers:
  v.propName      → view attribute (data)
  c.methodName    → controller action

Event Types:
  COMPONENT       → bubbles up to parent hierarchy
  APPLICATION     → broadcast to all components
  App handler     → no 'name' attribute in aura:handler

Apex from Aura:
  @AuraEnabled static → required
  component.get('c.methodName') → get action
  $A.enqueueAction(action)      → execute action
  response.getState()           → SUCCESS/ERROR/INCOMPLETE
  response.getReturnValue()     → actual return data

vs LWC:
  Aura: $A.enqueueAction(), component.get('v.prop'), {!v.prop}
  LWC: @wire, this.prop, {prop}
```

```
Controller.js ────→ calls ────→ Helper.js
Renderer.js   ────→ calls ────→ Helper.js
Helper.js     ────→ CANNOT call ────→ Controller.js  ❌
```
