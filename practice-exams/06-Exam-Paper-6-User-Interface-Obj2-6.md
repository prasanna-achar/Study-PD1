# Exam Paper 6: User Interface (Objectives 2-6) – PD1

**Date**: 2026-09-29  
**Score**: 43/98 (43.88%)  
**Time**: 1h 46m 45s  

---

## 🎯 What You Aced (43 Correct)
- **Apex Security & Crypto**: `Crypto.decrypt()`, `Security.stripInaccessible()`, Schema describe methods, `WITH USER_MODE`, `AccessLevel.USER_MODE`.
- **LWC Events & Shadow DOM**: `bubbles: true, composed: false`, `CustomEvent('name', { detail })`, `$dynamicParam` in `@wire`.
- **Flow Embedding**: `<lightning-flow>` in LWC, `<lightning:flow>` in Aura.
- **Agentforce**: Invocable actions, `@InvocableVariable`, natural language instruction guidelines.
- **Modern Features**: Dynamic Forms, `LightningModal`, `lwc:if` / `lwc:else`.

---

## 🔴 The 5 Trap Clusters (Where You Lost Marks)

### Cluster 1: Lightning Message Service (LMS) Syntax (4 questions lost)

| Rule | Common Trap | Correct Answer |
| :--- | :--- | :--- |
| **Channel Import** | `@salesforce/messageChannel/MyChannel` | Must end with **`__c`**: `@salesforce/messageChannel/MyChannel__c` |
| **Read Payload** | `message.data.field` or `message.dataset.field` | Direct property: **`message.field`** |
| **Channel XML** | `<lightningMessageFields><fieldName>...</fieldName></lightningMessageFields>` | Each field is wrapped in `<lightningMessageFields>` |
| **Scope** | LWC to Aura to Visualforce | LMS works across **LWC, Aura, Visualforce, and Utility Bar** |

---

### Cluster 2: LWC / Aura Syntax Mechanics (8 questions lost)

| Topic | What You Chose | Correct Answer & Rule |
| :--- | :--- | :--- |
| **`refreshApex()`** | Passed the method `refreshApex(getJobApplications)` | Must pass the **wired property**: `refreshApex(this.jobApplications)` |
| **`createRecord()`** | `this.createRecord()` | Standalone import: **`createRecord(recordInput).then(...)`** |
| **`updateRecord()` from Datatable** | Sent only Name & Amount | Must include **`Id`**: `fields['Id'] = event.detail.draftValues[0].Id` |
| **Bulk Datatable Save** | `uiRecordApi.updateRecords` | `updateRecord` is single-record only! Use **Apex controller** for bulk saves |
| **NavigationMixin** | `standard__recordPage` for tab | Navigating to an object tab/home: `type: 'standard__objectPage'`, `actionName: 'home'` |
| **LWC Quick Action XML** | Target only | Target is **`lightning__RecordAction`** with `<actionType>ScreenAction</actionType>` |
| **Aura `init` Order** | App > Parent > Child | **Innermost first**: `Child > Parent > App` |
| **Aura Design File** | Helper/Renderer | Use `<design:attribute>` in `.design` file to expose to App Builder |

---

### Cluster 3: Security & Permissions Nuances (6 questions lost)

| Topic | The Trap | The Rule |
| :--- | :--- | :--- |
| **`WITH SECURITY_ENFORCED` placement** | Placed after `LIMIT` | Must go **AFTER `WHERE`**, but **BEFORE `ORDER BY` / `LIMIT`** |
| **`stripInaccessible` vs `WITH SECURITY_ENFORCED`** | Used `WITH SECURITY_ENFORCED` for hiding sensitive field | `WITH SECURITY_ENFORCED` **throws an exception** if user lacks access. `stripInaccessible` **silently strips** the field so the rest can render! |
| **`update as user`** | Assumed it updates matching records | If user lacks edit access to a field, DML **throws an exception**! |
| **VF External HTML** | `$Resource.name` | External HTML in iframe uses **`$IFrameResource.name`** |
| **VF External Images** | `IMAGEURL` | External untrusted images use **`IMAGEPROXYURL(...)`** |
| **XSS Functions** | `HTMLENCODEINJS()` (fake) | Valid: **`HTMLENCODE()`**, **`JSENCODE()`**, **`JSINHTMLENCODE()`** |
| **Session Settings** | COEP / COOP | Customize URL leakage to external sites: **"Include Referrer-Policy HTTP header"** |
| **Disguised Scripts** | CSRF protection | Prevents malicious files disguised as other types: **"Content Sniffing Protection"** |

---

### Cluster 4: Einstein Next Best Action (NBA) (3 questions lost)

| Question | Rule |
| :--- | :--- |
| **Recommendation Object** | Can map products/custom objects using the **`Map` element** in Strategy Builder (or Recommendation Assignment in Flow). |
| **Flow on Accept/Reject** | A single flow handles both! Check **"Launch Flow on Rejection"** in App Builder; flow uses `isRecommendationAccepted` boolean. |
| **Strategy Builder Elements** | **`Generate`** = runs Apex invocable method; **`Load`** = loads existing recommendations; **`Branch Selector`** = if/else criteria. |

---

### Cluster 5: Visualforce in Lightning Experience (3 questions lost)

| Question | Rule |
| :--- | :--- |
| **Where VF can be used in LEX** | Standard page layout, custom app, navigation bar, quick actions, App Launcher (via tab). *(NOT Setup Home Page)* |
| **Apply LEX styling to VF** | Add attribute **`lightningStylesheets="true"`** to `<apex:page>` *(NOT `<apex:stylesheet>`)* |
| **Actions supported for VF override in Console** | **New, Edit, View, Tab, List, Clone** *(Delete and Custom Actions are NOT supported)* |
