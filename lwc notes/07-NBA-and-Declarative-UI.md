# Objective 7: Next Best Action & Declarative UI

> Format: Rule → Syntax → Trap → Example → Mnemonic
> Covers: NBA, Dynamic Forms, Dynamic Actions, Dynamic Related Lists, App Builder targets.

---

## 1. Next Best Action (NBA) — Full Mental Model

**Rule:** NBA surfaces AI-powered recommendations to the user. It has 4 layers — know each one's role.

```
Layer 1: Strategy (Flow)
    ↓ produces
Layer 2: Recommendation (sObject records)
    ↓ displayed via
Layer 3: Einstein Next Best Action component
    ↓ user takes action via
Layer 4: Flow (invoked by the component)
```

### Layer 1: Strategy — What Creates Recommendations?

**Rule:** A **Strategy** is a **Flow** (specifically, a Recommendation Strategy flow). It outputs **Recommendation records**.

- Strategies are built in the **Strategy Builder** UI (Setup → Next Best Action).
- A Strategy generates a **prioritized list of Recommendation records** to show to the user.

### Layer 2: Recommendation sObject

**Rule:** Each Recommendation is an **sObject record** with these key fields:

| Field | Description |
| :--- | :--- |
| `Name` | Title of the recommendation card |
| `Description` | Body text on the card |
| `ActionReference` | Name of the **Flow** to invoke when user accepts |
| `ExternalId` | Optional dedupe ID |

**Key Insight:**
> The **"Accept" action invokes a Flow**. Not an Apex class, not a process — a **Flow**.

### Layer 3: The `lightning:availableForEinsteinAnalytics` Component (Standard Component)

**Rule:** The component for NBA is `<lightning:nextBestAction>` (standard Salesforce component). You do NOT build this — you just configure it in App Builder.

**Configuration:**
- Select the **Strategy** to use
- Set **maximum number of recommendations** to display
- Optionally group into sections

### Layer 4: Flow Invoked on Accept

**Rule:** When the user clicks "Accept" or "Reject" on a Recommendation, the **ActionReference Flow** is invoked automatically.

**Flow Input Variables:**
- When the NBA component invokes a Flow, it passes the **Recommendation record data** as input variables to the Flow.

---

## 2. NBA: Displaying vs Triggering

**Trap — Classic Exam Scenario:**
> "A business wants to show product recommendations to sales reps on the Opportunity page. Which tool is used to DEFINE what recommendations are shown?"

- ❌ Flow → That's what RUNS when user accepts
- ❌ Recommendation record → That's what's DISPLAYED
- ✅ **Strategy (Strategy Builder)** → That DEFINES which recommendations to show and in what order

**Mnemonic:** "Strategy = Boss. Recommendations = employees. Flow = action taken."

---

## 3. Dynamic Forms

**Rule:** Dynamic Forms allow individual **fields and sections** on a Lightning record page to be configured per-profile, per-record-type, or using visibility rules — WITHOUT Apex or component customization.

**Supported Objects (as of current exam):**
- ✅ **Custom objects** — fully supported
- ✅ **Standard objects** (select ones) — Account, Contact, Lead, Opportunity are now generally supported
- ❌ Not all standard objects support Dynamic Forms (check specific doc — exam typically tests the limitation)

**How to Enable:**
1. Go to the record's Lightning page in App Builder
2. Click the **Highlights Panel**
3. Click **"Upgrade Now"** or **"Migrate to Dynamic Forms"**
4. Fields from the page layout are migrated to individual Field components

**Configuration Options per Field Component:**
- **Filter Condition**: Show/hide based on field value, profile, record type, device, etc.
- **Required**: Conditionally mark a field as required

**Trap:**
> "Dynamic Forms replaces the compact layout." → ❌ WRONG. Dynamic Forms replaces the **detail page layout sections** on a record page. Compact layouts are for highlights panels, list views, and related lists.

**Mnemonic:** "Dynamic Forms = individual field components with visibility conditions on record pages."

---

## 4. Dynamic Actions

**Rule:** Dynamic Actions allow **page-level actions** (buttons on the record's highlights panel) to be shown/hidden conditionally — just like Dynamic Forms does for fields.

**Requires:** Dynamic Forms must be enabled first (the page must be migrated).

**Conditions for showing/hiding actions:**
- Field value filters
- Form factor (desktop vs. mobile)
- Profile
- Record Type
- User permission

**Trap:**
> "Dynamic Actions works for all objects." → ❌ WRONG. It's limited. Custom objects + select standard objects. **Mobile devices** require Dynamic Actions to be explicitly configured.

---

## 5. Dynamic Related Lists

**Rule:** Dynamic Related Lists let you configure **related list components** on Lightning record pages with column selection, filter conditions, and sort order — without code.

**Key capability:** Admins can add field filters to related lists so only relevant child records are displayed.

**Example:**
> On an Account page, show only Contacts where `Department = 'Sales'`.

**Trap:**
> "Dynamic Related Lists replaces the Related tab." → ❌ WRONG. The Related tab still exists. Dynamic Related Lists gives you custom control WITHIN record pages.

---

## 6. App Builder: Target Types & `<isExposed>`

**Rule:** For a component to appear in the App Builder component palette, `isExposed` must be `true` in the metadata XML.

### LWC Target Values:

| Target | Where Component Appears |
| :--- | :--- |
| `lightning__AppPage` | App pages (custom Lightning apps) |
| `lightning__RecordPage` | Record detail pages |
| `lightning__HomePage` | Home page |
| `lightningCommunity__Page` | Experience Cloud / Community pages |
| `lightning__FlowScreen` | Flow screens |
| `lightning__UtilityBar` | Utility Bar |
| `lightning__Tab` | Navigation tabs |

```xml
<!-- componentName.js-meta.xml -->
<LightningComponentBundle>
    <apiVersion>61.0</apiVersion>
    <isExposed>true</isExposed>
    <targets>
        <target>lightning__RecordPage</target>
        <target>lightning__AppPage</target>
    </targets>
</LightningComponentBundle>
```

**Trap — Casing:**
```xml
<!-- ❌ WRONG casing/naming -->
<target>Lightning__RecordPage</target>       <!-- Uppercase L wrong -->
<target>lightning__Record_Page</target>      <!-- Underscore in wrong place -->
<target>lightning__recordPage</target>       <!-- wrong camelCase -->

<!-- ✅ CORRECT -->
<target>lightning__RecordPage</target>       <!-- Capital P in Page only -->
```

---

## 7. App Builder: `targetConfigs` (Design Properties)

**Rule:** To expose configurable properties in the App Builder property panel, define them in `targetConfigs`.

```xml
<LightningComponentBundle>
    <isExposed>true</isExposed>
    <targets>
        <target>lightning__AppPage</target>
    </targets>
    <targetConfigs>
        <targetConfig targets="lightning__AppPage">
            <property name="title" type="String" label="Component Title" 
                      description="Display title for the component" 
                      default="My Component"/>
            <property name="maxItems" type="Integer" label="Max Items"
                      min="1" max="10" default="5"/>
        </targetConfig>
    </targetConfigs>
</LightningComponentBundle>
```

**Property Types in targetConfigs:**
```
String, Integer, Boolean, Color (Color picker), sobjecttype, ContentReference
```

**Trap — `sobjecttype`:**
```xml
<!-- Special type that renders a sObject picker dropdown in App Builder -->
<property name="objectApiName" type="sobjecttype" label="Select Object"/>
```

---

## 8. Experience Cloud (Community) Considerations

**Rule:** Community pages use the **Experience Builder** (not Lightning App Builder). Components exposed with `lightningCommunity__Page` target appear in Experience Builder.

**Themes:** Experience Cloud pages use Themes for branding (fonts, colors, buttons). Not CSS classes.

**Guest User:** Unauthenticated users accessing a Community page run as the **Guest Site User** — a system user with very limited access. Design Apex controllers with `without sharing` is NOT recommended for public communities (it bypasses all security). Use `with sharing` to enforce access.

**Trap:**
> "Public-facing communities should use `without sharing` in their controllers." → ❌ DANGEROUS. Use `with sharing` to prevent data leakage.

---

## 9. Lightning App Types

**Rule:** Know what each Lightning App type is and when to use it.

| App Type | Builder | Use Case |
| :--- | :--- | :--- |
| **Standard Navigation App** | App Manager | Standard Salesforce tabs + utility bar |
| **Console Navigation App** | App Manager | Customer Service / Sales with split view and pinned tabs |
| **Lightning Page (App Page)** | App Builder | Custom page with components, accessible via navigation tab |
| **Experience Cloud Site** | Experience Builder | External or Partner community pages |

**Trap:**
> "To create a custom Salesforce app for internal users, use Experience Builder." → ❌ WRONG. Experience Builder is for EXTERNAL communities. Use App Manager for internal apps.

---

## Quick Reference Cheat Sheet

```
NBA:
  Strategy (Flow) → produces Recommendation records
  NBA Component → displays them on page
  ActionReference → names the Flow invoked on "Accept"
  Reject flow → different from Accept flow
  Strategy Builder → where you BUILD the strategy

Dynamic Forms:
  Individual field components with visibility rules
  Works on: Custom objects + select standard objects
  NOT: Compact layout (that's highlights panel)
  Enable: App Builder → Upgrade/Migrate to Dynamic Forms

Dynamic Actions:
  Conditional visibility for record page action buttons
  Requires: Dynamic Forms enabled first
  Mobile: Must configure explicitly

App Builder Targets:
  lightning__AppPage
  lightning__RecordPage
  lightning__HomePage
  lightningCommunity__Page
  lightning__FlowScreen
  lightning__UtilityBar
  lightning__Tab
  isExposed: true → appears in palette
  isExposed: false → hidden from palette (programmatic use only)
```
