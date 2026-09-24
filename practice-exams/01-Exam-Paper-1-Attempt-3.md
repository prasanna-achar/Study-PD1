# Exam Paper 1: Developer Fundamentals Part 1 – PD1 (Attempt 3)
**Source:** K2 University (Focus on Force)
**Date:** 2026-09-24
**Score:** 49/58 (84.48%)
**Time:** 40m 01s
**Pass Mark:** 68% — **PASSED ✅**

---

## Progress on This Paper

| Attempt | Score | % | Time | Status |
| :---: | :---: | :---: | :---: | :--- |
| 1 | 22/58 | 37.93% | 1h 29m | ❌ |
| 2 | 37/58 | 63.79% | 1h 07m | ❌ |
| **3** | **49/58** | **84.48%** | **40m** | **✅ PASS** |

**+12 questions fixed since Attempt 2. +27 questions fixed since Attempt 1.**

---

## Stubborn Mistakes FIXED ✅

These were wrong on Attempt 1 & 2 but now CORRECT:
- ✅ `getRecordTypeInfosById()` — finally nailed it
- ✅ Indirect Lookup (not External Lookup)
- ✅ Geolocation `__Latitude__s` (not `__c`)
- ✅ Stateful client / Stateless server
- ✅ Application event (not Component event)

---

## Still Wrong (9 questions)

### Category 1: Multi-tenant Architecture (2 wrong)

**Q18 — Multi-tenant facts (choose 2)**
Correct: **Automatic upgrades for all customers** + **All customizations are metadata (including code)**
Traps: "own database" is WRONG (shared database), "metadata doesn't include code" is WRONG (code IS metadata)

**Q20 — Multi-tenant development (choose 2)**
Missed: "Queries should be selective" | Wrong pick: "not possible to index"
Key fact: Indexing IS possible in multi-tenant (custom indexes exist). Queries MUST be selective.

### Category 2: Platform Events (1 wrong)

**Q16 — Platform event integration (choose 3)**
Missed: CometD client that subscribes | Wrong pick: Custom object definition
Correct 3: **Platform event definition** + **Apex trigger/flow to publish** + **CometD client to subscribe**
Key fact: CometD/EMP Connector subscribes from external systems. No custom object needed.

### Category 3: Declarative vs Programmatic (3 wrong)

**Q37 — Run flow weekly (choose 2)**
Missed: Apex Schedulable job | Wrong pick: Scheduled Jobs page in Setup
Correct: **Schedule-triggered flow** + **Apex Schedulable class invoking flow**
Key fact: "Scheduled Jobs" page is for viewing/managing existing jobs, not configuring flows.

**Q46 — Valid declarative use cases (choose 3)**
Missed: Lead rating based on 3 fields (formula) | Wrong pick: Roll-up summary with cross-object formula
Key fact: **Cross-object formula fields CANNOT be used in roll-up summaries** — this was wrong in Attempt 1 too!

**Q47 — Average of won opportunities**
Your answer: Roll-up summary with average function | Correct: **Roll-up summary + formula field**
Key fact: Roll-up summary supports COUNT, SUM, MIN, MAX — but NOT AVERAGE. Calculate average manually: SUM / COUNT.

### Category 4: Agentforce (3 wrong)

**Q49 — MCP integration**
Your answer: Proprietary protocol | Correct: **Open standard giving access to live org data**
Key fact: MCP is an OPEN standard (not proprietary). It gives Agentforce access to live org data, config, and third-party services.

**Q50 — Agentforce rules & workflows (choose 2)**
Missed: Ensuring compliance with security guidelines | Wrong pick: Automating test creation
Correct: **Maintaining naming conventions** + **Ensuring compliance with security guidelines**
Key fact: Test creation is a separate feature (Test Case Generation), NOT part of rules/workflows.

**Q54 — Agentforce Vibes availability (choose 2)**
Missed: Pre-installed in Code Builder (free) | Wrong pick: Paid VSCode extension
Correct: **Pre-installed in Code Builder** + **Automates test creation + inline completions**
Key fact: Salesforce Extension Pack is FREE, not paid. Code Builder = Agentforce Vibes IDE.
