# Priority 1: Declarative vs. Programmatic Decision Framework

*This was your #1 scoring issue — 8 questions lost by choosing code when declarative was correct.*

---

## The Golden Rule

> **If the requirement CAN be met declaratively, the declarative answer is ALWAYS correct on PD1.**
> Apex/Triggers are only correct when the question says "complex logic," "cannot be met declaratively," or the scenario genuinely requires code.

---

## Decision Tree: Which Tool to Use?

```
Is the requirement about DATA VALIDATION?
├── Yes → Validation Rule (always)
└── No ↓

Is the requirement about DISPLAYING calculated values?
├── Yes → Formula Field or Roll-up Summary
│   ├── Need parent field values? → Cross-Object Formula
│   ├── Need child aggregate (COUNT/SUM/MIN/MAX)? → Roll-up Summary (Master-Detail only)
│   ├── Need AVG of child records? → Roll-up SUM + Roll-up COUNT + Formula (AVG = SUM/COUNT)
│   └── Need to show parent fields on child record page? → Dynamic Forms (NOT formula fields)
└── No ↓

Is the requirement about AUTOMATING record changes?
├── Yes ↓
│   ├── Simple field update when record saved? → Record-Triggered Flow (Before Save)
│   ├── Create/update related records? → Record-Triggered Flow (After Save)
│   ├── Send email when record changes? → Record-Triggered Flow + Email Action
│   ├── Run weekly/daily/scheduled? → Schedule-Triggered Flow
│   ├── User-facing wizard with screens? → Screen Flow
│   └── Too complex for Flow? (50M records, ranking, cross-object aggregation) → Batch Apex
└── No ↓

Is the requirement about USER INTERACTION?
├── Yes ↓
│   ├── Wizard with input screens? → Screen Flow
│   ├── Custom UI component? → LWC
│   └── PDF generation? → Visualforce (renderAs="pdf")
└── No ↓

Does it require EXTERNAL SYSTEM integration?
├── Yes → Apex (HTTP Callouts, @future, Platform Events)
└── No → Re-evaluate — it's probably declarative
```

---

## The Exam Traps You Fell Into

### Trap 1: "Send email + update records" → You chose Apex, correct was Flow

**Q38:** "Send weekly email reminders to customers with failed audit status"
- You chose: Batch Apex job
- Correct: **Scheduled Flow** (runs weekly, filters records, sends email — all declarative)
- **Rule:** If the operation is "filter records + send email + run on schedule" → Scheduled Flow

**Q41:** "Check if opportunity has highest amount + mark checkbox + send email"
- You chose: Approval Process
- Correct: **Flow Builder** (Record-Triggered Flow with Get Records + Decision + Update + Email Action)
- **Rule:** "Compare records + update + email" is within Flow's capability

### Trap 2: "Create related records automatically" → You chose Trigger, correct was Flow

**Q39:** "When opportunity closes, create commission records for team members"
- You chose: Apex Trigger
- Correct: **Flow Builder** (Record-Triggered Flow → Get team members → Loop → Create Records)
- **Rule:** "When X happens, create Y records" → Flow Builder, unless there's extreme complexity

### Trap 3: "Display data from parent" → You chose Formula, correct was Dynamic Forms

**Q43:** "Display fields from parent record on a record page"
- You chose: Cross-Object Formula Fields
- Correct: **Dynamic Forms** (drag and drop parent fields directly onto the page)
- **Rule:** "Display parent fields on page" ≠ "Calculate values" → Dynamic Forms, not formula fields

### Trap 4: "Validate input" → You chose wrong tool

**Q44:** "Validate Country Code against 200 ISO codes"
- You chose: Geolocation field (?!)
- Correct: **Validation Rule** (formula can contain the list of valid codes using CASE or OR)
- **Rule:** "Validate data on save" → ALWAYS Validation Rule

---

## When IS Apex/Code the Correct Answer?

Apex is correct when the question mentions ANY of these:

| Keyword in Question | Why Apex is Needed |
| :--- | :--- |
| "Complex calculations across **all** records" | Flow can't efficiently process millions of records |
| "**Rank** or **rate** all records relative to each other" | Requires sorting/comparing across entire dataset |
| "External HTTP callout" | Flow can't make arbitrary HTTP requests |
| "**Real-time** integration with external system" | Apex REST/SOAP services needed |
| "Cannot be met using declarative tools" | Explicit instruction to use code |
| "High-volume batch processing" | Batch Apex (50M records) |
| "Complex sharing logic" | Apex Managed Sharing |
| "Dynamically build SOQL at runtime" | `Database.query(string)` |

**Q40 was correctly Apex:** "Rate ALL accounts daily based on aggregated opportunity values, ranked #1 to last"
→ This requires cross-record comparison and ranking = Batch Apex + Scheduled Apex ✅

---

## Roll-up Summary Quick Reference

| Supported | NOT Supported |
| :--- | :--- |
| COUNT | ❌ **AVG** (Average) |
| SUM | ❌ Cross-object formula fields in roll-up |
| MIN | ❌ Roll-ups on Lookup relationships (Master-Detail only) |
| MAX | ❌ Formula fields as the summarized field |

**How to get AVG:** Create 2 roll-up summaries (SUM + COUNT) and 1 formula field (SUM / COUNT).

---

## Dynamic Forms — Key Facts

- Available on **Lightning Record Pages** only
- Can display fields from the **current record AND parent records** (spanning fields)
- Replaces the need to create cross-object formula fields just for display purposes
- Fields can have **visibility rules** (show/hide based on conditions)
- Does NOT replace formula fields for *calculations* — only for *display*
