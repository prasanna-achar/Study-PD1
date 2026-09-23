# Priority 2: Multi-Tenant Architecture & Governor Limits

*You scored 0/5 on this topic. Every question here is an easy point once memorized.*

---

## Multi-Tenant Architecture — The 5 Facts

### 1. Shared Infrastructure
All customers share the **same code base AND the same database**.
- ❌ WRONG: "Customers share code base but have their own database"
- ✅ RIGHT: "All customers share both code AND database"
- Each row has an **OrgID** column — the platform handles this automatically
- ❌ WRONG: "Developers need to reference OrgID in queries"
- ✅ RIGHT: The platform automatically filters by OrgID — devs never see it

### 2. Automatic Upgrades
- Salesforce releases upgrades **3 times per year** (Spring, Summer, Winter)
- Upgrades are **automatic** — orgs CANNOT opt out or choose when to accept
- ❌ WRONG: "Organizations can choose to accept upgrades"
- ✅ RIGHT: "Upgrades are automatic and cannot be scheduled on a particular date"
- **Sandboxes are upgraded BEFORE production** (so you can preview/test changes)

### 3. Metadata-Driven Architecture
- **ALL** customizations are metadata — this includes:
  - Configuration (objects, fields, page layouts, workflows)
  - **AND code** (Apex classes, triggers, Visualforce pages, LWC)
- ❌ WRONG: "Metadata includes configuration but not code"
- ✅ RIGHT: "All standard and custom configurations, functionality, AND code are metadata"
- Metadata is stored in a separate layer, enabling easy upgrades

### 4. Polyglot Persistence
- Salesforce uses **multiple data storage technologies** behind the scenes
- Developers code to a **single API** regardless of which storage is optimal
- ❌ WRONG: "Custom domain prevents cross-customer data access"
- ✅ RIGHT: "Salesforce optimizes several different data persistence technologies (polyglot persistence)"

### 5. No Client Software
- Only a web browser is needed — no client software required
- ❌ WRONG: "Client software is still required"
- ✅ RIGHT: "No client software is required, apart from a browser"

---

## Governor Limits — What IS and ISN'T a Governor Limit

Governor limits are **per-transaction** limits that prevent one org from monopolizing shared resources.

### ✅ These ARE Governor Limits (per transaction)

| Limit | Synchronous | Asynchronous |
| :--- | :---: | :---: |
| **SOQL queries** | 100 | 200 |
| **DML statements** | 150 | 150 |
| **Records retrieved by SOQL** | 50,000 | 50,000 |
| **Records processed by DML** | 10,000 | 10,000 |
| **CPU time** | 10,000 ms | 60,000 ms |
| **Heap size** | 6 MB | 12 MB |
| **Callouts** | 100 | 100 |
| **Future calls** | 50 | 0 (can't call future from future) |

### ❌ These are NOT Governor Limits

| NOT a Governor Limit | What It Actually Is |
| :--- | :--- |
| **Storage capacity** (data + file storage) | Per-org capacity, based on edition + licenses |
| **API call limit** (per 24 hours) | Per-org rate limit, NOT per-transaction |
| **Number of custom objects** | Per-org metadata limit |
| **Time limit for individual DML operations** | Doesn't exist — there's CPU time for the whole transaction |

### Exam Trap from Q21:
- You chose "Total amount of storage" as a governor limit → ❌ WRONG
- Correct missing answer was "CPU time per transaction" → ✅

---

## Quick-Fire Memorization

```
MULTI-TENANT FACTS:
  ✅ Share code AND database
  ✅ Automatic upgrades 3x/year (Spring, Summer, Winter)
  ✅ Sandbox upgrades BEFORE production
  ✅ ALL customizations = metadata (including code!)
  ✅ Polyglot persistence (multiple storage technologies, one API)
  ✅ OrgID filtering is automatic (devs don't reference it)
  ✅ No client software needed (just a browser)

GOVERNOR LIMITS (per transaction):
  ✅ SOQL queries: 100 sync / 200 async
  ✅ DML statements: 150
  ✅ CPU time: 10s sync / 60s async
  ✅ Heap: 6MB sync / 12MB async
  ✅ Records retrieved: 50,000
  ❌ Storage is NOT a governor limit
  ❌ No time limit on individual DML operations
```
