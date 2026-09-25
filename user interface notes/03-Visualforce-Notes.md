# Visualforce — Complete PD1 Notes

Visualforce is a **server-side** markup framework. Pages are rendered on the Salesforce server and sent as full HTML to the browser. It is NOT dead — it is still the **only way** to generate PDFs natively, and the exam WILL test you on it.

---

## 1. Page Structure

Every Visualforce page starts with `<apex:page>` and uses standard Salesforce tags (the `apex:` namespace).

```html
<apex:page standardController="Account">
    <apex:form>
        <apex:pageBlock title="Account Details">
            <apex:pageBlockSection>
                <apex:inputField value="{!Account.Name}"/>
                <apex:inputField value="{!Account.Industry}"/>
            </apex:pageBlockSection>
            <apex:pageBlockButtons>
                <apex:commandButton action="{!save}" value="Save"/>
            </apex:pageBlockButtons>
        </apex:pageBlock>
    </apex:form>
</apex:page>
```

---

## 2. Controller Types

### Standard Controller
```html
<apex:page standardController="Account">
```
- Auto-generated for every standard and custom object.
- Provides: `save()`, `edit()`, `delete()`, `cancel()`, `list()` actions.
- Provides field access: `{!Account.Name}`, `{!Account.Industry}`.
- Runs in **user mode** — respects sharing rules, CRUD, and FLS.

### Standard List Controller
```html
<apex:page standardController="Contact" recordSetVar="contacts">
```
- Works with a **set of records** instead of a single record.
- Adds pagination actions: `first()`, `last()`, `next()`, `previous()`.
- `{!contacts}` gives you the list of records.
- `recordSetVar` is **required** to activate list controller mode.

### Custom Controller
```html
<apex:page controller="MyCustomController">
```
- Fully custom Apex class — **you** define all logic, queries, and actions.
- Runs in **system mode** by default (ignores sharing, CRUD, FLS).
- To enforce sharing: add `with sharing` to the Apex class.
- Cannot use `standardController` and `controller` on the same page.

### Controller Extension
```html
<apex:page standardController="Account" extensions="MyAccountExtension">
```
- **Adds custom logic** on top of a standard controller.
- Constructor **must** accept `ApexPages.StandardController` as a parameter:
  ```apex
  public class MyAccountExtension {
      private ApexPages.StandardController stdCtrl;
      
      public MyAccountExtension(ApexPages.StandardController controller) {
          this.stdCtrl = controller;
      }
      
      public PageReference customSave() {
          // Custom logic before saving
          return stdCtrl.save();
      }
  }
  ```
- You can have **multiple extensions** (comma-separated). The **leftmost** extension's method wins if there are conflicts.
- Runs in **user mode** (inherits from the standard controller).

---

## 3. Standard Visualforce Components (Complete Reference)

### Page Structure Components

| Component | Purpose | Key Attributes |
| :--- | :--- | :--- |
| `<apex:page>` | **Root element** of every VF page | `standardController`, `controller`, `extensions`, `renderAs`, `sidebar`, `showHeader`, `lightningStylesheets` |
| `<apex:form>` | HTML form wrapper — **required** for any input/button to work | — |
| `<apex:pageBlock>` | Styled container section with header | `title`, `mode` (`edit`, `detail`, `maindetail`) |
| `<apex:pageBlockSection>` | Two-column section within a pageBlock | `title`, `columns` (default 2) |
| `<apex:pageBlockSectionItem>` | Custom item within a section (for custom layout control) | — |
| `<apex:pageBlockButtons>` | Button area (top/bottom) of a pageBlock | `location` (`top`, `bottom`, `both`) |
| `<apex:pageBlockTable>` | Data table bound to a collection variable | `value` (list), `var` (iterator variable) |
| `<apex:sectionHeader>` | Page-level header with icon and title | `title`, `subtitle` |
| `<apex:detail>` | Renders the standard detail page layout for a record | `subject` (record ID) |
| `<apex:relatedList>` | Displays a related list (e.g., Contacts on Account) | `list` (relationship name, e.g., `Contacts`) |
| `<apex:enhancedList>` | Displays an enhanced list view for an object | `type` (object API name), `height` |

### Input Components

| Component | Purpose | Key Attributes |
| :--- | :--- | :--- |
| `<apex:inputField>` | **Smart input** — auto-detects field type, label, validation, and picklist values based on the field metadata | `value="{!Account.Name}"` |
| `<apex:inputText>` | Generic text input (no metadata awareness) | `value`, `id`, `size` |
| `<apex:inputTextarea>` | Multi-line text input | `value`, `rows`, `cols` |
| `<apex:inputCheckbox>` | Checkbox input | `value` |
| `<apex:inputSecret>` | Password field (masked input) | `value` |
| `<apex:inputHidden>` | Hidden field | `value` |
| `<apex:inputFile>` | File upload input | `value` (Blob), `fileName`, `contentType` |
| `<apex:selectList>` | Dropdown or multi-select list | `value`, `size`, `multiselect` |
| `<apex:selectOption>` | Individual option inside `<apex:selectList>` | `itemLabel`, `itemValue` |
| `<apex:selectOptions>` | Binds a list of `SelectOption` from Apex | `value="{!options}"` |
| `<apex:selectCheckboxes>` | Group of checkboxes from a list | `value`, contains `<apex:selectOption>` |
| `<apex:selectRadio>` | Group of radio buttons | `value`, contains `<apex:selectOption>` |

> **Exam Trap**: `<apex:inputField>` is "smart" — it knows the field type, shows picklist values, and applies validation rules automatically. `<apex:inputText>` is "dumb" — it's just a plain text box.

### Output / Display Components

| Component | Purpose | Key Attributes |
| :--- | :--- | :--- |
| `<apex:outputField>` | Displays a field value with proper formatting (respects field type) | `value="{!Account.AnnualRevenue}"` |
| `<apex:outputText>` | Renders plain text | `value`, `escape` (default `true` — prevents XSS) |
| `<apex:outputLabel>` | Label for a form field | `value`, `for` |
| `<apex:outputLink>` | Renders an HTML `<a>` link | `value` (URL), `target` |
| `<apex:outputPanel>` | Generic `<div>` or `<span>` container | `id`, `layout` (`block` or `inline`), `rendered` |
| `<apex:image>` | Displays an image | `url`, `width`, `height` |
| `<apex:panelGrid>` | HTML table-based layout (grid) | `columns` |
| `<apex:panelGroup>` | Groups components together (useful inside `<apex:panelGrid>`) | `layout` |

### Button / Action Components

| Component | Purpose | Key Attributes |
| :--- | :--- | :--- |
| `<apex:commandButton>` | Button that calls an Apex action method on click | `action="{!save}"`, `value="Save"`, `reRender` |
| `<apex:commandLink>` | Link that calls an Apex action method | `action="{!deleteRecord}"`, `value="Delete"` |

### Data Iteration

| Component | Purpose | Key Attributes |
| :--- | :--- | :--- |
| `<apex:pageBlockTable>` | Table styled like standard Salesforce layout. Auto-generates column headers. | `value` (list), `var` (iterator) |
| `<apex:dataTable>` | Basic HTML table (no Salesforce styling) | `value`, `var` |
| `<apex:dataList>` | Renders an HTML `<ul>` or `<ol>` list | `value`, `var`, `type` (`disc`, `decimal`, etc.) |
| `<apex:repeat>` | **Generic iterator** — no wrapper HTML. Use when you want full control. | `value`, `var`, `first`, `rows` |
| `<apex:column>` | Defines a column within `<apex:pageBlockTable>` or `<apex:dataTable>` | `value`, `headerValue` |
| `<apex:facet>` | Defines named sub-sections (e.g., custom column headers) | `name` (`header`, `footer`) |

> **Exam Trap**: `<apex:repeat>` does NOT generate any HTML wrapper — it just loops. Perfect for generating `<li>` items or custom markup.

### AJAX Components

| Component | Purpose | Key Attributes |
| :--- | :--- | :--- |
| `<apex:actionFunction>` | Call Apex from JavaScript code. Creates a JS function you can invoke. | `name` (JS function name), `action`, `reRender` |
| `<apex:actionSupport>` | Adds AJAX behavior to another component (e.g., `onchange` on a select) | `event` (`onclick`, `onchange`, etc.), `action`, `reRender` |
| `<apex:actionPoller>` | Periodically calls an Apex method (polling / auto-refresh) | `action`, `interval` (seconds, minimum 5), `reRender` |
| `<apex:actionRegion>` | Limits the form data submitted in an AJAX request (improves performance) | Wrap around specific components |
| `<apex:actionStatus>` | Shows loading indicator during AJAX calls | `startText`, `stopText`, `id` |

### Messaging Components

| Component | Purpose |
| :--- | :--- |
| `<apex:pageMessages>` | Displays **ALL** messages added by `ApexPages.addMessage()` — errors, warnings, info, confirms. **You MUST include this on the page or messages won't show.** |
| `<apex:pageMessage>` | Displays a single, inline custom message. | 
| `<apex:message>` | Displays field-specific error message (tied to a component via `for` attribute). |
| `<apex:messages>` | Displays all messages (less styled than `pageMessages`). |

### Special / Miscellaneous

| Component | Purpose | Key Attributes |
| :--- | :--- | :--- |
| `<apex:includeScript>` | Loads an external JavaScript file | `value` (static resource reference) |
| `<apex:stylesheet>` | Loads an external CSS file | `value` |
| `<apex:iframe>` | Embeds an iframe | `src`, `height`, `width` |
| `<apex:tab>` | Tab within a tabPanel | `label` |
| `<apex:tabPanel>` | Tab navigation container | `switchType` (`client`, `server`, `ajax`) |
| `<apex:toolbar>` | Horizontal toolbar | — |
| `<apex:variable>` | Declares a local variable on the page | `var`, `value` |
| `<apex:composition>` | Template composition (insert content into a template) | `template` |
| `<apex:insert>` | Defines a placeholder in a template | `name` |
| `<apex:define>` | Provides content for a template placeholder | `name` |
| `<apex:component>` | Defines a custom VF component (reusable) | — |
| `<apex:attribute>` | Defines a parameter on a custom VF component | `name`, `type`, `description`, `required` |
| `<apex:dynamicComponent>` | Renders a component dynamically from Apex | `componentValue` |

---

## 4. Expression Syntax (Merge Fields)

| Syntax | Purpose | Example |
| :--- | :--- | :--- |
| `{!expression}` | Binds Apex variables, fields, formulas to the page | `{!Account.Name}`, `{!myVariable}` |
| `{!$Resource.myFile}` | References a Static Resource | `<apex:image url="{!$Resource.logo}"/>` |
| `{!$Label.myLabel}` | References a Custom Label | `{!$Label.Welcome_Message}` |
| `{!$User.FirstName}` | References global variables | `{!$User.Email}`, `{!$Profile.Name}` |
| `{!URLFOR($Resource.zip, 'images/pic.png')}` | References a file inside a zipped static resource | — |

---

## 5. View State

- **What**: Encrypted hidden form field that preserves the state of the controller between postbacks (server round-trips).
- **Limit**: **135 KB** maximum.
- **What counts**: All `@AuraEnabled` properties, all controller instance variables, the component tree state.
- **How to reduce**:
  1. Use the **`transient`** keyword on variables that don't need to persist between requests.
  2. Refine SOQL queries to fetch fewer records.
  3. Use `<apex:actionRegion>` to limit the scope of submitted form data.

```apex
public class MyController {
    // This IS saved in the view state
    public List<Account> accounts { get; set; }
    
    // This is NOT saved in the view state — "transient"
    transient List<AggregateResult> tempStats;
}
```

---

## 6. PDF Generation

The primary modern use case for Visualforce:

```html
<apex:page standardController="Account" renderAs="pdf">
    <h1>Invoice for {!Account.Name}</h1>
    <p>Industry: {!Account.Industry}</p>
    <p>Revenue: {!Account.AnnualRevenue}</p>
</apex:page>
```

- `renderAs="pdf"` converts the entire page to a downloadable PDF.
- CSS for print layout applies. JavaScript does NOT run in PDF mode.
- Use `@page` CSS rules for margins, headers, footers.

---

## 7. Security — Preventing XSS

When outputting user-provided data inside JavaScript or HTML, you MUST encode it:

| Function | Use When |
| :--- | :--- |
| `{!JSENCODE(value)}` | Outputting inside JavaScript strings |
| `{!HTMLENCODE(value)}` | Outputting inside HTML attributes |
| `{!JSINHTMLENCODE(value)}` | Outputting inside JavaScript that is inside HTML |
| `{!URLENCODE(value)}` | Outputting inside URLs |

Default behavior: `<apex:outputText escape="true">` escapes HTML by default. But when you use raw `{!variable}` inside `<script>` tags, there is NO automatic escaping — you MUST use `JSENCODE`.

```html
<!-- ❌ VULNERABLE -->
<script>
    var name = '{!Account.Name}';  // If name contains ', XSS attack!
</script>

<!-- ✅ SAFE -->
<script>
    var name = '{!JSENCODE(Account.Name)}';
</script>
```

---

## 8. Visualforce in Lightning Experience

- VF pages appear inside an **iframe** in Lightning Experience.
- To communicate between VF and Lightning, use `sforce.one` JavaScript object:
  - `sforce.one.navigateToSObject(recordId)` — Navigate to a record.
  - `sforce.one.navigateToURL('/apex/MyPage')` — Navigate to a URL.
  - `sforce.one.createRecord('Account')` — Open a new record form.
- Add `lightningStylesheets="true"` to `<apex:page>` to apply Lightning styling to a classic VF page.
