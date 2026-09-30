# 08 — Org Types & Environments

---

## All Salesforce Org Types

| Org Type | Purpose | Key Facts |
|---|---|---|
| **Production Org** | Live environment | Real users, real data. Cannot edit Apex directly. |
| **Trial Production Org** | Evaluation org | Sample data included. Lets customers try the platform before subscribing. |
| **Sandbox Org** | Dev / Test / Staging | Copy of Production. Always tied to a specific Prod org. |
| **Scratch Org** | Modern dev (DX) | Short-lived, disposable. Created from a Dev Hub. Config-driven via JSON. Single developer/feature. |
| **Developer Edition (DE)** | Free standalone org | For learning, building packages. Limited storage & users. |
| **Partner Developer Edition** | ISV/Partner org | Larger DE org. More storage, more licenses. For managing commercial app source code. |

### Fake Org Types (These DO NOT Exist)
- ❌ Enterprise Developer Edition
- ❌ Scratch Pro Org
- ❌ Standard Sandbox

---

## The 4 Sandbox Types

```
                    ┌──────────────────────────────────────────────────┐
                    │              SANDBOX COMPARISON                  │
                    ├────────────┬──────┬──────────┬──────────┬────────┤
                    │ Type       │ Data │ Refresh  │ Max Size │ Use    │
                    ├────────────┼──────┼──────────┼──────────┼────────┤
                    │ Developer  │ Meta │ 1 day    │ 200 MB   │ Dev    │
                    │ Dev Pro    │ Meta │ 1 day    │ 1 GB     │ Dev+QA │
                    │ Partial    │ Data │ 5 days   │ 5 GB     │ UAT    │
                    │ Full Copy  │ ALL  │ 29 days  │ = Prod   │ Perf   │
                    └────────────┴──────┴──────────┴──────────┴────────┘
```

### Developer Sandbox
- **Data:** Metadata only (no records copied from Production)
- **Storage:** 200 MB
- **Refresh:** Every day
- **Best for:** Individual developer work, coding, unit testing

### Developer Pro Sandbox
- **Data:** Metadata only (no records)
- **Storage:** 1 GB
- **Refresh:** Every day
- **Best for:** Larger dev tasks, integration testing, multiple developers
- **Note:** Requires an additional license depending on org edition

### Partial Copy Sandbox
- **Data:** Metadata + a **sample** of production data
- **Storage:** 5 GB (max 10,000 records per object)
- **Refresh:** Every 5 days
- **Uses a Sandbox Template** to define which objects' data gets copied
- **Best for:** UAT, training, integration testing, testing with realistic data

### Full Copy Sandbox
- **Data:** Complete replica of production (ALL records, attachments, files)
- **Storage:** Same as Production
- **Refresh:** Every 29 days
- **Best for:** Staging, Performance Testing, Load Testing
- **Also supports templates** for filtering data

### Trap
> **Q:** "Which sandbox should you use for performance and load testing?"
> **A:** **Full Copy** — it's the ONLY sandbox with all production data for realistic load tests.

> **Q:** "A developer needs 4GB of test data refreshed weekly."
> **A:** **Partial Copy** — 5GB limit, refreshes every 5 days.

> **Q:** "Which sandbox for light development with < 100 MB and daily refresh?"
> **A:** **Developer Sandbox** — 200 MB, daily refresh.

---

## Sandbox Cloning

To give multiple developers the **same** metadata:
- **Clone** an existing sandbox (click **Clone** next to the sandbox name in Setup)
- **Create From** — When creating a new sandbox, select an existing sandbox to copy

### Trap
> ❌ "Use change sets to copy metadata between sandboxes for each developer."
> ✅ Just **clone** the sandbox — it's faster and less error-prone.

---

## Sandbox Email Behavior

When a sandbox is created or refreshed:
- All email addresses are appended with **`.invalid`** (e.g., `user@test.com` → `user@test.com.invalid`)
- Email deliverability may be set to **"System Email Only"** or **"No Access"**
- You must manually fix email addresses and deliverability settings for testing

---

## Scratch Orgs

| Fact | Detail |
|---|---|
| Created from | A **Dev Hub** org (must be enabled in Production) |
| Configured via | A **scratch org definition file** (JSON) |
| Lifespan | Short — typically 1-30 days (max 30 days) |
| Used for | Single feature development or CI/CD automated testing |
| Data | No production data — starts empty |
| Sharing | NOT shared between developers — each dev gets their own |

### Trap
> ❌ "Scratch orgs can be shared among a team of developers."
> ✅ Each developer gets their **own** scratch org for their feature.

---

## Quick-Fire Cards

**Q: Can you create a managed package in a Sandbox?**
> A: No. Only in **Developer Edition** or **Partner Developer Edition** orgs.

**Q: What org types are valid? (Trial Production, Enterprise Developer Edition, Scratch Org, Partner DE)**
> A: Trial Production ✅, Enterprise DE ❌ (fake), Scratch Org ✅, Partner DE ✅.

**Q: Which sandbox uses a template to select which objects' data to copy?**
> A: **Partial Copy** (and Full Copy can also use templates).

**Q: At minimum, how many environments do you need for Apex development?**
> A: **2** — a Sandbox (for dev) and Production (for deployment). Best practice is 3+ (dev, test, prod).
