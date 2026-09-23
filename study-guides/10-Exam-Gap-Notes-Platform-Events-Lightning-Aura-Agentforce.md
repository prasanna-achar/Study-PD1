# Priority 4-8: Platform Events, External Relationships, Lightning Framework, Aura & Agentforce

---

## 1. Platform Events (0/2 — Need Full Study)

### What Are Platform Events?
Platform Events enable **event-driven architecture** using the **Publish/Subscribe** model. They decouple systems — the publisher doesn't know who subscribes.

### Key Facts

| Fact | Detail |
| :--- | :--- |
| **Object suffix** | `__e` (e.g., `Order_Event__e`) |
| **NOT an sObject** | Cannot use standard DML (`insert`). Must use `EventBus.publish()` |
| **No SOQL** | Cannot query platform events with SOQL |
| **No Workflow/Process Builder** | Only Flows and Apex triggers can subscribe |

### Publishing Methods

| From Where | How |
| :--- | :--- |
| **Apex** | `EventBus.publish(new Order_Event__e(Field__c = 'value'));` |
| **Flow** | Create Records element targeting the Platform Event |
| **External System (REST API)** | `POST /services/data/vXX.0/sobjects/Order_Event__e/` |
| **External System (SOAP API)** | `create()` call (NOT a POST request) |

### Subscribing Methods

| Subscriber | How |
| :--- | :--- |
| **Apex Trigger** | `trigger OrderTrigger on Order_Event__e (after insert) { }` — **after insert ONLY** |
| **Flow** | Platform Event-Triggered Flow |
| **LWC** | `empApi` module (`subscribe`, `unsubscribe`) |
| **External System** | **CometD client** or **EMP Connector** |

### Publish Behavior (Exam Favorite!)

| Setting | When Event Fires |
| :--- | :--- |
| **Publish After Commit** (default) | After the transaction successfully commits |
| **Publish Immediately** | As soon as `EventBus.publish()` executes, even if transaction rolls back |

### Testing Platform Events
```apex
@isTest
static void testPlatformEvent() {
    Test.startTest();
    EventBus.publish(new Order_Event__e(Status__c = 'Completed'));
    Test.stopTest();  // Forces event delivery
    // Assert trigger results...
}
```

### Q15 — Why REST API, not Flow?
The question said an **external web application** needs to publish. Flow is a **Salesforce-internal** tool — external systems use REST API.

### Q16 — Why CometD, not Apex Class?
The **external application** subscribes, not Salesforce. External subscribers use **CometD** or **EMP Connector**. Apex triggers subscribe **within** Salesforce.

---

## 2. External Data Relationships (0/2)

### Complete Relationship Type Reference

| Type | Links | Key Identifier | Use Case |
| :--- | :--- | :--- | :--- |
| **Lookup** | Any → Any | Salesforce 18-char ID | Standard loose relationship |
| **Master-Detail** | Child → Parent | Salesforce 18-char ID | Tight coupling, roll-ups, cascade delete |
| **External Lookup** | Child (standard/custom/external) → Parent **external** object | Standard External ID field | Parent is in external system |
| **Indirect Lookup** | Child **external** object → Parent (standard/custom) | Custom unique External ID field on parent | Parent is in Salesforce, child is external, no SF IDs available |
| **Hierarchical** | User → User | Salesforce ID | Self-relationship, User object only |

### The Exam Trick: External vs Indirect

**Q13 scenario:** External ERP contacts need to link to Salesforce Account records. The external system does NOT have Salesforce IDs.

- ❌ **External Lookup** = parent is external → wrong direction
- ❌ **Lookup** = requires Salesforce 18-char ID → not available
- ✅ **Indirect Lookup** = external child → Salesforce parent, using a custom External ID field

**Memory trick:**
- "**External** Lookup" → the **parent** is external
- "**Indirect** Lookup" → the **child** is external (indirect = going through an External ID, not a direct SF ID)

### Geolocation Compound Field Syntax

Geolocation fields are compound — you can't access them directly with `__c`.

```apex
// ❌ WRONG
record.Storage_Location__c                        // Can't access compound directly
record.Storage_Location__c.latitude               // Not valid syntax

// ✅ CORRECT — Remove __c, add __latitude__s or __longitude__s
record.Storage_Location__latitude__s
record.Storage_Location__longitude__s
```

---

## 3. Lightning Framework & App Builder (0/3)

### Client-Server Model (YOU GOT THIS BACKWARDS)

| Layer | Technology | State |
| :--- | :--- | :--- |
| **Client** | JavaScript | **Stateful** (retains state, manages UI) |
| **Server** | Apex | **Stateless** (processes request, forgets) |

**Memory trick:** The **browser** (client) remembers what you're doing (stateful). The **server** just processes one request at a time and forgets (stateless). This means fewer server calls → faster apps.

### Lightning App Builder — What Can It Create?

| ✅ Can Create | ❌ Cannot Create |
| :--- | :--- |
| Custom **Record Pages** | Page Layouts (use Page Layout Editor) |
| Custom **Home Pages** | Custom Lightning Components (use VS Code) |
| Lightning **App Pages** (single-page apps) | Validation Rules |
| Email Application Panes | Apex Triggers |

### Lightning App Page — Available Components

| Component Type | Where Available |
| :--- | :--- |
| **Standard components** | All Lightning page types |
| **Custom components** (LWC/Aura) | All Lightning page types (if configured in .js-meta.xml) |
| **Third-party components** | All Lightning page types |
| **Global Actions** | **App Pages ONLY** (via Actions property) |
| **Object-specific Actions** | **Record Pages ONLY** |

---

## 4. Aura Component Specifics (1/3)

### Rendering Lifecycle Events

```
init → render → afterRender
```

| Event | When | Use For |
| :--- | :--- | :--- |
| `init` | Component initialization complete | Fetching initial data, setting defaults |
| `render` | Component rendering starts | Rarely used directly |
| `afterRender` | Rendering complete, DOM is ready | DOM manipulation, 3rd party library init |

❌ "start" and "load" are **NOT** valid Aura lifecycle events.

### Event Types

| Event Type | Scope | Use Case |
| :--- | :--- | :--- |
| **Component Event** | Parent-child hierarchy only | Communication between directly related components |
| **Application Event** | **ALL components on the page** | Broadcasting to unrelated components anywhere |

**Q35:** Components "may or may not be in the same parent" → **Application Event** (not Component Event).

### Aura Bundle Files

| File | Purpose |
| :--- | :--- |
| `.cmp` | Component markup (HTML-like) |
| `Controller.js` | Event handler functions (called from markup) |
| `Helper.js` | **Reusable shared functions** (called from Controller or other JS) |
| `Style.css` | Component styling |
| `Design` | Exposes attributes for Lightning App Builder |
| `Renderer` | Custom rendering behavior |

---

## 5. Agentforce Cheat Sheet (5/11)

### The Key Distinction

| | **Agentforce** | **Agentforce Vibes** |
| :--- | :--- | :--- |
| **What** | Autonomous AI agent **suite** for business tasks | AI coding **extension** for developers |
| **Where** | Salesforce org, Slack, email, SMS | VS Code + Code Builder (Agentforce Vibes IDE) |
| **Who uses** | Admins, business users | Developers |
| **Config** | No-code (uses Flows, Prompts, Actions) | Pre-installed in Code Builder |
| **Cost** | Varies | Free (part of SF Extension Pack) |

### Agentforce 5 Core Components

| Component | Role |
| :--- | :--- |
| **Data** | Secure information foundation (structured + unstructured) |
| **Reasoning** | Brain — Atlas Reasoning Engine interprets intent |
| **Actions** | Individual tasks (flows, prompts, business logic) |
| **Topics** | Categories defining guardrails and action triggers |
| **Channels** | Where agents operate (Salesforce, Slack, email, SMS) |

### Agentforce Vibes Modes

| Mode | Purpose | Actions |
| :--- | :--- | :--- |
| **Plan** | Strategy & assessment | Assess org architecture, design implementation strategies |
| **Act** | Execution | **Deploy metadata**, **run tests** directly in org |

### Agentforce Vibes Features

| Feature | What It Does |
| :--- | :--- |
| **Inline Auto Completion** | Real-time code suggestions (uses SFR model) |
| **Agentic Chat** | Conversational code analysis + multi-step workflows |
| **Test Case Generation** | Automated test creation for edge cases |
| **Rules & Workflows** | Enforces naming conventions + security guidelines |

### Pro Model Limits

| Limit | Value |
| :--- | :--- |
| Daily requests | **50 per org per day** |
| Daily tokens | **1 million per org per day** |
| When limit hit | **Auto-fallback to SFR model** (NOT rejected, NOT manual switch) |
| Reset timing | **24 hours after first request** (not after last) |

### MCP (Model Context Protocol)

- **Open standard** (NOT proprietary) for AI-to-external-system communication
- Gives Agentforce access to **live org data, config, and third-party services**
- Maintains **strict privacy controls**
- Part of Einstein Trust Layer security

### Einstein Trust Layer

| Component | Function |
| :--- | :--- |
| **Data Masking** | Identifies and masks sensitive data with placeholders |
| **Prompt Defense** | System policies against jailbreaking and prompt injection |
| **Toxicity Detection** | Scans generative outputs for harmful content |
| **Zero Data Retention** | Data sent to external LLM providers is NOT retained |
| **Audit Trail** | Logs all AI interactions for compliance |
