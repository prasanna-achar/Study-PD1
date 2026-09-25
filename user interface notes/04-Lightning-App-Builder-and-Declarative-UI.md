# Lightning App Builder & Declarative UI — PD1 Notes

This file covers what you can do **without code** in the UI domain — Lightning App Builder, page types, Dynamic Forms, and standard components you drag-and-drop.

---

## 1. Lightning App Builder

Lightning App Builder is the **declarative drag-and-drop tool** for creating custom pages in Lightning Experience.

### Page Types You Can Create

| Page Type | Where It Appears | Key Points |
| :--- | :--- | :--- |
| **App Page** | Custom Lightning app (standalone page) | Single-column or multi-column. Can include **global actions** (not object-specific actions). |
| **Home Page** | Lightning Experience Home tab | Customizable per app or org-wide. |
| **Record Page** | Object record detail (Account, Contact, custom objects, etc.) | Can include **object-specific actions** and **Dynamic Forms**. |
| **Email Application Pane** | Outlook/Gmail integration | — |

> **Exam Trap**: App Pages support **global actions** only (e.g., "New Task"). Record Pages support **object-specific actions** (e.g., "New Contact" on Account).

### Page Activation & Assignment
- Record Pages can be assigned at three levels (in priority order):
  1. **App, Record Type, and Profile** (most specific)
  2. **App and Record Type**
  3. **App default**
  4. **Org default** (least specific)

---

## 2. Dynamic Forms

Dynamic Forms allow you to place **individual fields** (not entire page layouts) directly on Record Pages in Lightning App Builder.

### Key Features
- Break the page layout into individual **Field Sections**.
- Set **visibility rules** on individual fields or sections (e.g., show "Discount__c" only when "Stage" = "Negotiation").
- Combine fields from the record AND its **parent object** on the same page.
- Eliminates the need for multiple page layouts for different scenarios.

> **Exam Trap**: If a question says "display parent fields alongside child fields on a record page," the answer is **Dynamic Forms** — NOT formula fields or cross-object formulas.

### Dynamic Actions
- Similar to Dynamic Forms but for the **action bar** (buttons at the top of a record page).
- Show/hide actions based on criteria (e.g., hide "Submit for Approval" if status is already "Approved").

---

## 3. Standard Lightning Components (Drag-and-Drop in App Builder)

These come built-in with Salesforce — no code required:

### Record Page Components

| Component | Purpose |
| :--- | :--- |
| **Record Detail** | Displays the full page layout for the record |
| **Related Lists** | Shows related lists (Contacts, Opportunities, etc.) |
| **Related List - Single** | Shows ONE specific related list with customizable columns |
| **Highlights Panel** | Shows key fields at the top (compact layout) |
| **Path** | Sales Path / guided process bar |
| **Activities** | Activity timeline (tasks, events, emails) |
| **Chatter** | Chatter feed for the record |

### Utility Components

| Component | Purpose |
| :--- | :--- |
| **Rich Text** | Static formatted text, images, links (admin-authored content) |
| **Tabs** | Organizes content into tabs on the page |
| **Accordion** | Collapsible sections |
| **Visualforce** | Embeds a Visualforce page (in an iframe) |
| **Flow** | Embeds a Screen Flow on the page |

---

## 4. Lightning Experience Navigation

### App Types

| Type | Navigation Style | Defined In |
| :--- | :--- | :--- |
| **Standard Navigation** | Horizontal tab bar at the top | App Manager in Setup |
| **Console Navigation** | Split-view with tabs, subtabs, and pinned lists for multitasking | App Manager in Setup |

### Utility Bar
- Fixed footer bar at the bottom of a Lightning app.
- Contains utility items (e.g., Notes, History, Recent Items, or custom LWC/Aura components).
- Configured per app in App Manager → Utility Items.
- Components need `lightning__UtilityBar` target to appear here.

---

## 5. Custom Labels, Static Resources & Platform Cache

### Custom Labels
- Store translatable text that can be referenced in Apex, LWC, Aura, and Visualforce.
- In LWC: `import myLabel from '@salesforce/label/c.MyLabel';`
- In VF: `{!$Label.MyLabel}`
- In Apex: `System.Label.MyLabel`
- **Max 5,000 custom labels** per org.

### Static Resources
- Store files (JS libraries, CSS, images, ZIP archives) up to **5 MB each**, **250 MB total**.
- In LWC: `import myResource from '@salesforce/resourceUrl/MyResource';`
- In VF: `{!$Resource.MyResource}` or `{!URLFOR($Resource.MyZip, 'path/to/file.js')}`

### Platform Cache
- **Org Cache**: Shared across all users in the org.
- **Session Cache**: Per-user, per-session.
- Reduces SOQL queries and callouts by caching frequently accessed data.
- Accessed via `Cache.Org.get()`, `Cache.Org.put()`, `Cache.Session.get()`, etc.

---

## 6. Content Security

### Lightning Locker Service (Legacy) → Lightning Web Security (LWS)
- Enforces **component isolation** — components from different namespaces cannot access each other's DOM or global objects.
- LWS is the modern replacement for Locker Service (better performance, more compatible with third-party libraries).

### Cross-Domain Security
- By default, VF pages in Lightning run in an **iframe** with a different domain.
- Use `$A.get("e.force:navigateToSObject")` or `sforce.one` for cross-domain navigation.
