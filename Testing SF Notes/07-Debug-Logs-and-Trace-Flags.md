# 07 — Debug Logs, Trace Flags & Developer Console

---

## Debug Log Levels (Lowest → Highest)

```
NONE → ERROR → WARN → INFO → DEBUG → FINE → FINER → FINEST
```

**Mnemonic: "NEW Info DF3"** (None, Error, Warn, Info, Debug, Fine, Finer, Finest)

| Level | What It Captures |
|---|---|
| `NONE` | Nothing logged for this category |
| `ERROR` | Only errors and exceptions |
| `WARN` | Errors + warnings |
| `INFO` | Errors + warnings + high-level info |
| `DEBUG` | **Minimum level to see `System.debug()` output** |
| `FINE` | Detailed trace — variable values |
| `FINER` | More detail — method entry/exit |
| `FINEST` | Everything — including `LIMIT_USAGE` events |

---

## Log Categories

| Category | What It Tracks |
|---|---|
| **Database** | DML operations, SOQL queries, query results |
| **Workflow** | Workflow rules, approval processes, escalation rules, flow interviews |
| **Validation** | Validation rules |
| **Callout** | HTTP and SOAP callout details |
| **Apex Code** | Apex execution, `System.debug()` output, exceptions |
| **Apex Profiling** | Governor limits, cumulative resource usage (`LIMIT_USAGE`) |
| **Visualforce** | VF page rendering, view state |
| **System** | System methods, `Type` operations |

### Trap
> **Q:** "Where do I find how many SOQL queries were used?"
> **A:** Set **Apex Profiling** to **FINEST** → Look for `LIMIT_USAGE_FOR_NS` in the log.

> **Q:** "Where do I see approval process evaluation?"
> **A:** Set **Workflow** to **FINER** or higher.

---

## Trace Flags

Trace flags control **who or what** generates debug logs and **how detailed** they are.

### Trace Flag Entities (What You Can Trace)
| Entity Type | Example |
|---|---|
| **User** | Specific user's transactions |
| **Apex Class** | A specific class execution |
| **Apex Trigger** | A specific trigger execution |
| **Automated Process** | System/automated user transactions |
| **Platform Integration** | Integration user transactions |

### ❌ What You CANNOT Trace
- JavaScript (client-side) — No trace flags for LWC/Aura JS
- Queries — No standalone "query" trace flag
- Flows — No direct trace flag (use Workflow log category)

### Trace Flag Expiration
- Trace flags have a **start time** and **expiration time**
- Maximum duration: **24 hours**
- They must be **active** to generate logs

---

## Developer Console

### Key Panels & Tabs

| Panel | What It Shows |
|---|---|
| **Execution Overview** | Summary of the log — DML, SOQL, method calls |
| **Executed Units** | Execution time per method (total, avg, max, min) |
| **Execution Log** | The raw log lines — timestamps, events, debug output |
| **Source** | The Apex source code with highlighted coverage |
| **Stack Tree** | Call stack — which method called which |
| **Variables** | Variable values at checkpoints |

### Trap
> **Q:** "I need to see the max/min execution time of a method."
> **A:** Look in the **Executed Units** tab.

### Perspectives
- Access via **Debug > Perspective Manager**
- Built-in: All, Debug, Log Only, Analysis
- You CAN create custom perspectives

### Checkpoints
- Set checkpoints in the source code (up to 5 per class)
- **Checkpoint Inspector** has two tabs:
  - **Types** — Shows object types instantiated at that line
  - **State** — Shows field values of variables at that exact moment

---

## Execute Anonymous

### Key Facts
| Fact | Detail |
|---|---|
| Runs in **User Mode** | Respects sharing rules, FLS, and OWD |
| **Commits to the database** | Changes are permanent (unlike test classes) |
| Requires **"Author Apex" permission** | But this does NOT bypass data access rules |
| Does NOT appear in deployment history | It is a one-time execution |
| Has its own governor limits | Fresh transaction limits per execution |

### Trap
> ❌ "Execute Anonymous runs in system context like regular Apex."
> ✅ It runs in **User Mode**. If you try to update a record you don't have access to, it will fail.

---

## Enabling Debug Logs for Metadata Deployments

By default, metadata deployments do NOT generate debug logs.

To enable:
1. Go to **Setup > Apex Settings**
2. Enable **"Metadata Deployments can generate Debug Logs"**
3. The running user must also have an **active trace flag**

---

## Quick-Fire Cards

**Q: What is the minimum log level to see `System.debug()` output?**
> A: `DEBUG`

**Q: What log category shows governor limit usage?**
> A: **Apex Profiling** (set to `FINEST`)

**Q: Can you set a trace flag on a JavaScript file?**
> A: No. Trace flags only work on Users, Apex Classes, and Apex Triggers.

**Q: Does Execute Anonymous code get committed to the database?**
> A: Yes. And it runs in User Mode.

**Q: Maximum number of checkpoints per class?**
> A: 5
