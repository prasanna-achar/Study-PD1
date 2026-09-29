# Objective 8: VF in Lightning Experience + UI Best Practices

> Format: Rule → Syntax → Trap → Example → Mnemonic
> Covers: VF in LEX, sforce.one, lightning:isUrlAddressable, page URL params, browser history.

---

## 1. Visualforce in Lightning Experience (LEX)

**Rule:** VF pages CAN run inside LEX but with specific restrictions and behavioral differences.

### What works:
- ✅ VF pages accessible via Navigation Menu tabs
- ✅ VF pages used as custom overrides for standard actions
- ✅ VF pages in utility bars
- ✅ VF embedded in Lightning Record Pages via `<apex:page>` + Lightning Out OR via a tab

### What does NOT work inside LEX:
- ❌ VF charts when the page is rendered as PDF (`renderAs="pdf"`)
- ❌ Standard Salesforce Classic styling components look "wrong" in LEX — they do not inherit LEX styling
- ❌ VF pages do not get LEX navigation automatically — they run in an iframe

**Important — VF inside LEX is an iFrame:**
> Every VF page shown inside LEX is enclosed in an **iframe** (a separate browsing context). This means:
> - `window.location` in JS refers to the VF page's location, NOT the LEX app's location
> - To navigate in LEX from inside a VF page, you CANNOT use standard JS `window.location` — you must use **`sforce.one`**

---

## 2. `sforce.one` — Navigation in LEX from a VF Page

**Rule:** `sforce.one` is the JavaScript API for navigating the LEX app shell from inside a VF page (which runs in an iframe). It's only available when the VF page is running **inside LEX**.

**How to check if running in LEX:**
```javascript
if (typeof sforce !== 'undefined' && typeof sforce.one !== 'undefined') {
    // Running inside LEX
} else {
    // Running in Salesforce Classic
}
```

### `sforce.one` Navigation Methods:

| Method | Action |
| :--- | :--- |
| `sforce.one.navigateToSObject(recordId)` | Navigate to a record detail page |
| `sforce.one.navigateToSObject(recordId, 'edit')` | Open record edit view |
| `sforce.one.navigateToURL(url)` | Navigate to any URL |
| `sforce.one.navigateToList(listViewId, listViewName, objectName)` | Navigate to a list view |
| `sforce.one.back()` | Go back in browser history |
| `sforce.one.back(true)` | Go back AND force refresh |
| `sforce.one.showToast({...})` | Display a toast notification |
| `sforce.one.createRecord(objectApiName)` | Open quick action to create a new record |
| `sforce.one.editRecord(recordId)` | Open the edit modal for a record |

**Syntax (In a VF page):**
```javascript
// Navigate to a record detail page
sforce.one.navigateToSObject('0011X000XXXXX');

// Navigate to edit
sforce.one.navigateToSObject('0011X000XXXXX', 'edit');

// Go back (no refresh)
sforce.one.back();

// Go back AND refresh the view
sforce.one.back(true);
```

**Trap — The `back()` argument:**
> "What is the argument for `sforce.one.back()` when you want to force refresh?"
> ❌ `sforce.one.back('refresh')` ← String — WRONG
> ✅ `sforce.one.back(true)` ← Boolean `true` — CORRECT

**Mnemonic:** "`sforce.one` = your LEX navigation remote control from inside a VF iframe."

---

## 3. `PageReference` Object — Standard Navigation

**Rule:** In VF controllers, use `PageReference` to navigate programmatically.

**Syntax:**
```apex
// Go to an existing VF page
public PageReference navigate() {
    return new PageReference('/apex/MyOtherPage');
}

// Go to an existing VF page using the Page reference
public PageReference navigateSafe() {
    PageReference pr = Page.MyOtherPage; // ← CORRECT way to reference existing VF pages
    pr.setRedirect(true);
    return pr;
}

// Go to a record detail page
public PageReference gotoRecord() {
    return new PageReference('/' + recordId);
}

// Stay on the same page (no navigation)
public PageReference stayHere() {
    return null; // ← Return null to re-render the current page
}
```

**Key Points:**
- `setRedirect(true)` → HTTP redirect (changes browser URL)
- `setRedirect(false)` (default) → Internal VF re-render (URL doesn't change)
- `return null` → Re-renders current page (most common in action methods that just update data)

**Trap:**
```apex
// ❌ WRONG — ApexPages.Page() doesn't exist
return ApexPages.Page().existingPageName;

// ✅ CORRECT
return Page.existingPageName;
```

---

## 4. URL Parameters in VF

**Rule:** Get URL parameters in a VF controller using `ApexPages.currentPage().getParameters()`.

```apex
// In controller constructor or action method
public class MyController {
    public String selectedId { get; set; }

    public MyController() {
        selectedId = ApexPages.currentPage().getParameters().get('id');
    }
}
```

**Setting parameters on a PageReference:**
```apex
public PageReference goWithParams() {
    PageReference pr = Page.TargetPage;
    pr.getParameters().put('id', someId);
    pr.getParameters().put('mode', 'edit');
    pr.setRedirect(true);
    return pr;
}
```

**Trap:** `ApexPages.currentPage().getUrlParameters()` ← **DOES NOT EXIST!**
Use `getParameters()`, not `getUrlParameters()`.

---

## 5. `lightning:isUrlAddressable` — Deep-Linking in Aura

**Rule:** Implement `lightning:isUrlAddressable` in an Aura component to make it directly accessible via a URL (with parameters). This lets you deep-link to the component with query parameters.

**Component:**
```html
<aura:component implements="lightning:isUrlAddressable,flexipage:availableForAllPageTypes">
    <aura:attribute name="recordId" type="String"/>
    <aura:handler name="init" value="{!this}" action="{!c.doInit}"/>
</aura:component>
```

**Controller — Reading URL Params:**
```javascript
({
    doInit: function(component, event, helper) {
        var pageRef = component.get('v.pageReference');
        var recordId = pageRef.state.recordId; // ← from URL query string
        component.set('v.recordId', recordId);
    }
})
```

**URL Format:**
```
/lightning/cmp/namespace__ComponentName?recordId=0011X00000...
```

**LWC Equivalent:**
```javascript
// In LWC, use NavigationMixin's PageReference
import { NavigationMixin } from 'lightning/navigation';
export default class MyComponent extends NavigationMixin(LightningElement) {
    @api recordId;

    navigate() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: { recordId: this.recordId, actionName: 'view' }
        });
    }
}
```

---

## 6. NavigationMixin (LWC) — Standard Reference

**Rule:** LWC uses `NavigationMixin` from `lightning/navigation` for all navigation.

**Mixin Pattern:**
```javascript
import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class MyNav extends NavigationMixin(LightningElement) {
    goToRecord() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.recordId,
                objectApiName: 'Account',
                actionName: 'view' // 'view' | 'edit' | 'clone'
            }
        });
    }

    goToNewRecord() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Contact',
                actionName: 'new'
            }
        });
    }

    goToAppPage() {
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: { apiName: 'My_Custom_Tab' }
        });
    }
}
```

**`NavigationMixin.GenerateUrl`:**
```javascript
this[NavigationMixin.GenerateUrl]({
    type: 'standard__recordPage',
    attributes: { recordId: this.recordId, actionName: 'view' }
}).then(url => {
    this.generatedUrl = url;
});
```

**Trap:**
```javascript
// ❌ WRONG — NavigationMixin is a mixin, not a direct import
import NavigationMixin from 'lightning/navigation';
export default class MyNav extends NavigationMixin { // ← WRONG, must extend LightningElement

// ✅ CORRECT
export default class MyNav extends NavigationMixin(LightningElement) { // ← pass LightningElement
```

---

## 7. Page Reference Types (LWC Navigation)

**Rule:** Know every PageReference `type` value.

| `type` | Navigates To |
| :--- | :--- |
| `standard__recordPage` | A specific record (view, edit, clone) |
| `standard__objectPage` | Object list page or new record |
| `standard__namedPage` | Named standard pages: home, chatter, etc. |
| `standard__navItemPage` | Custom tab / App Builder page by API name |
| `standard__webPage` | External URL |
| `standard__component` | Specific LWC or Aura component by API name |
| `comm__namedPage` | Experience Cloud standard pages (e.g., home, login) |
| `comm__loginPage` | Experience Cloud login page |

**Trap — `standard__namedPage` values:**
```javascript
// Built-in named pages
{ type: 'standard__namedPage', attributes: { pageName: 'home' } }
{ type: 'standard__namedPage', attributes: { pageName: 'chatter' } }
```

---

## 8. LEX vs Classic Compatibility Matrix

**Rule:** The exam asks about what runs in Classic vs LEX. Memorize this.

| Feature | Salesforce Classic | Lightning Experience |
| :--- | :--- | :--- |
| Visualforce pages | ✅ Native | ✅ Via iframe |
| Aura components | ❌ Not supported | ✅ Native |
| LWC | ❌ Not supported | ✅ Native |
| `sforce.one` JS API | ❌ Not available | ✅ Available in VF iframe |
| Standard Salesforce UI theme | ✅ (Classic theme) | ✅ (SLDS/LEX theme) |
| Lightning Data Service | ❌ Not available | ✅ Available |
| Navigation Menu | ❌ Tabs instead | ✅ Navigation bar |

---

## 9. Toast Messages in LEX

### In LWC:
```javascript
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

this.dispatchEvent(new ShowToastEvent({
    title: 'Success',
    message: 'Record saved!',
    variant: 'success' // success | error | warning | info
}));
```

### In Aura:
```javascript
$A.get('e.force:showToast').setParams({
    title: 'Success',
    message: 'Record saved!',
    type: 'success'
}).fire();
```

### In VF (inside LEX via sforce.one):
```javascript
sforce.one.showToast({
    title: 'Success',
    message: 'Saved',
    type: 'success'
});
```

**Trap:**
- In LWC: event called `ShowToastEvent`, variant field is `variant`
- In Aura: event called `force:showToast`, type field is `type`
- In VF: `sforce.one.showToast()`, type field is `type`

---

## Quick Reference Cheat Sheet

```
VF in LEX:
  Runs in iframe → use sforce.one for navigation
  Standard window.location.href → does NOT navigate LEX app
  sforce.one.back(true) → back AND refresh

sforce.one key methods:
  navigateToSObject(id)        → view record
  navigateToSObject(id,'edit') → edit record
  navigateToURL(url)           → any URL
  back()                       → go back
  back(true)                   → go back + refresh
  showToast({...})             → toast message

PageReference (Apex):
  Page.PageName                → reference existing VF page
  new PageReference('/path')   → manual URL
  return null                  → re-render current page
  setRedirect(true)            → HTTP redirect (URL changes in browser)
  getParameters().get('key')   → read URL params
  getParameters().put('k','v') → add URL params

LWC NavigationMixin:
  extends NavigationMixin(LightningElement)
  this[NavigationMixin.Navigate]({type, attributes})
  this[NavigationMixin.GenerateUrl]({type, attributes}).then(url => ...)

Types:
  standard__recordPage   → record view/edit/clone
  standard__objectPage   → object list/new
  standard__navItemPage  → custom tab
  standard__webPage      → external URL
```
