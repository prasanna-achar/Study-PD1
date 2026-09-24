# 📈 PD1 Exam Progress Tracker

## All Exam Results

| Paper | Exam Name | Attempt | Date | Score | % | Time | vs Pass (68%) |
| :--- | :--- | :---: | :--- | :---: | :---: | :---: | :--- |
| Paper 1 | Developer Fundamentals | Attempt 1 | 2026-09-22 | 22/58 | 37.93% | 1h 29m | -30.07% ❌ |
| Paper 1 | Developer Fundamentals | Attempt 2 | 2026-09-23 | 37/58 | 63.79% | 1h 07m | -4.21% ❌ |
| Paper 2 | Process Automation & Logic | Attempt 1 | 2026-09-23 | 34/51 | 66.67% | 38m | -1.33% ❌ |
| Paper 1 | Developer Fundamentals | Attempt 3 | 2026-09-24 | 49/58 | 84.48% | 40m | +16.48% ✅ |
| Paper 2 | Process Automation & Logic | Attempt 2 | 2026-09-24 | 48/51 | 94.12% | 28m | +26.12% ✅ |
| **Paper 3** | **Process Automation Pt 2** | **Attempt 1** | **2026-09-24** | **40/49** | **81.63%** | **43m** | **+13.63% ✅** |

---

## 🔥 Paper 1 Progression: 37% → 63% → 84%

```
Attempt 1: ██████████░░░░░░░░░░░░░░░░░░░░ 37.93%  (22/58)
Attempt 2: ████████████████████░░░░░░░░░░ 63.79%  (37/58)
Attempt 3: █████████████████████████░░░░░ 84.48%  (49/58)  ✅ PASS
Pass Mark: ████████████████████░░░░░░░░░░ 68.00%
```

**+27 questions fixed in 2 days. Time cut from 1h 29m → 40m.**

---

## Stubborn Mistakes FINALLY Fixed ✅

| Mistake | Attempts Wrong | Now |
| :--- | :---: | :--- |
| `getRecordTypeInfosById()` | 1, 2 | ✅ Fixed in Attempt 3 |
| Indirect Lookup (not External) | 1, 2 | ✅ Fixed in Attempt 3 |
| `__Latitude__s` (not `__c`) | 1, 2 | ✅ Fixed in Attempt 3 |
| Stateful client / Stateless server | 1, 2 | ✅ Fixed in Attempt 3 |
| Application event (not Component) | 1, 2 | ✅ Fixed in Attempt 3 |

---

## Remaining Gaps — 9 Wrong in Attempt 3

### Pattern 1: Multi-tenant Facts (Still Shaky)

| Fact | Your Mistake | Correct |
| :--- | :--- | :--- |
| Shared database | Chose "own database" | Share BOTH code AND database |
| Indexing | Chose "can't index" | Custom indexes DO exist, queries must be selective |

### Pattern 2: Roll-up Summary Limitations (Wrong 3 Times)

```
Roll-up Summary:  COUNT, SUM, MIN, MAX  ✅
Roll-up Summary:  AVERAGE              ❌ (not supported — use SUM/COUNT formula)
Roll-up Summary:  Cross-object formula  ❌ (not supported — can't reference formulas)
```

### Pattern 3: Platform Event Architecture

```
Publish from external: REST API (POST to /sobjects/MyEvent__e/)
Subscribe from external: CometD / EMP Connector
Subscribe in Salesforce: Apex Trigger / Flow
NO custom object needed for platform events
```

### Pattern 4: Agentforce Feature Boundaries

| Feature | What It Does | NOT What It Does |
| :--- | :--- | :--- |
| Rules & Workflows | Naming conventions + security compliance | NOT test creation |
| Test Case Generation | Automates test creation | Separate feature |
| MCP | Open standard for live org data access | NOT proprietary |
| Extension Pack | FREE in VSCode + Code Builder | NOT paid |
| Pro model fallback | Auto-redirects to SFR model | NOT rejected |

### Pattern 5: Running Flows on Schedule

```
✅ Schedule-triggered flow (declarative)
✅ Apex Schedulable class → Flow.Interview (programmatic)
❌ "Scheduled Jobs" page in Setup (that's for VIEWING jobs, not configuring flows)
```

---

## Cross-Exam Weakness Map

| Topic | Paper 1 (Att 3) | Paper 2 (Att 1) | Priority |
| :--- | :---: | :---: | :--- |
| Multi-tenant facts | ❌ (2 wrong) | — | 🔴 HIGH |
| Roll-up limitations | ❌ (2 wrong) | — | 🔴 HIGH |
| Agentforce features | ❌ (3 wrong) | — | 🟡 MEDIUM |
| Platform events | ❌ (1 wrong) | — | 🟡 MEDIUM |
| Inner class sharing | — | ❌ | 🟡 MEDIUM |
| Anonymous blocks = user mode | — | ❌ | 🟡 MEDIUM |
| Geolocation suffix | ✅ FIXED | ❌ | ✅ Fixed on Paper 1 |
| DML-restricted objects | — | ❌ | 🟡 MEDIUM |
| AsyncOptions API | — | ❌ | 🟡 MEDIUM |


## All Exam Results

| Paper | Exam Name | Attempt | Date | Score | % | Time | vs Pass (68%) |
| :--- | :--- | :---: | :--- | :---: | :---: | :---: | :--- |
| Paper 1 | Developer Fundamentals | Attempt 1 | 2026-09-22 | 22/58 | 37.93% | 1h 29m | -30.07% ❌ |
| Paper 1 | Developer Fundamentals | Attempt 2 | 2026-09-23 | 37/58 | **63.79%** | 1h 07m | -4.21% ⚠️ |
| Paper 2 | Process Automation & Logic | Attempt 1 | 2026-09-23 | 34/51 | 66.67% | 38m | -1.33% ⚠️ |
| **Paper 3** | **Process Automation Pt 2** | **Attempt 1** | **2026-09-24** | **40/49** | **81.63%** | **43m** | **+13.63% ✅** |

| Attempt | Date | Score | Percentage | Time | vs Pass (68%) |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Attempt 1** | 2026-09-22 | 22/58 | 37.93% | 1h 29m | -30.07% ❌ |
| **Attempt 2** | 2026-09-23 | 37/58 | **63.79%** | 1h 07m | **-4.21%** ⚠️ |

> **+15 questions corrected, +25.86% improvement, 22 minutes faster!**

---

## Attempt 2 — Detailed Breakdown

### Questions Fixed (Were Wrong → Now Correct) ✅ +19

| Q# | Topic | What You Learned |
| :--- | :--- | :--- |
| Q5 | `Database.query()` | Now know dynamic SOQL uses `Database.query(string)` |
| Q7 | `isDeletable()` | Now know it's `isDeletable()` on `DescribeSObjectResult` |
| Q8 | `getDigits()` | Now know `getDigits()` ≠ `getLength()` |
| Q15 | Platform Events — REST API | External apps publish via **REST API**, not Flow |
| Q16 | Platform Events — CometD | External apps subscribe via **CometD**, not Apex class |
| Q17 | Multi-tenant upgrades | Upgrades are automatic, cannot be scheduled |
| Q19 | Multi-tenant dev considerations | Deployment restrictions + CPU governor limits |
| Q21 | Governor limits | CPU time IS a limit, storage is NOT |
| Q24 | Lightning App Builder | Creates Record/Home/App pages, NOT page layouts |
| Q25 | App page components | Global actions on App pages, object-specific on Record pages |
| Q33 | Aura lifecycle | init → render → afterRender (not "start") |
| Q38 | Scheduled flow for email | Declarative > Batch Apex when possible |
| Q39 | Commission → Flow Builder | Flow can create records, don't default to Apex Trigger |
| Q41 | Flow Builder for opp check | Flow can compare records + send emails |
| Q43 | Dynamic Forms | Display parent fields = Dynamic Forms, not formula fields |
| Q47 | Roll-up + Formula for AVG | SUM roll-up + COUNT roll-up + Formula = AVG |
| Q49 | MCP = open standard | Not proprietary, gives access to live org data |
| Q52 | Pro model auto-fallback | Auto-redirects to SFR, no manual switch needed |
| Q56 | Agentforce definition | Suite of AI agents ≠ the VSCode extension |

### Questions That Regressed (Were Correct → Now Wrong) ❌ -4

| Q# | Topic | What Happened |
| :--- | :--- | :--- |
| Q4 | `getSObjectType()` | Was correct, now chose `getSObjectName()` — overthinking? |
| Q37 | Scheduled flow + Apex job | Got schedule-triggered flow ✅ but chose "Scheduled Jobs page" instead of "Apex job" |
| Q54 | Agentforce Vibes availability | Was correct, now chose "paid version" — it's FREE |
| Q58 | LLM definition | Was correct, now chose "natural language simplifies" — it CHALLENGES, not simplifies |

### Still Wrong (Wrong Both Times) ❌ 17 remaining

| Q# | Topic | Attempt 1 Wrong Answer | Attempt 2 Wrong Answer | Correct Answer | Pattern |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Q1 | RecordType map | `getRecordTypeInfos()` | `getRecordTypes()` | **`getRecordTypeInfosById()`** | Still guessing method names |
| Q6 | Programmatic sharing | Missed detail-side rule | Still missed options | All 3 correct ones | Multi-select confusion |
| Q11 | Field isAccessible | `isReadable()` | `isViewable()` | **`isAccessible()` on DescribeFieldResult** | Keeps picking fake methods |
| Q12 | getGlobalDescribe | `describeSObjects()` | `getGlobalSObjects()` | **`getGlobalDescribe()`** | Still guessing method names |
| Q13 | Indirect Lookup | External Lookup | External Lookup | **Indirect Lookup** | Same mistake twice! |
| Q14 | Geolocation syntax | `__c.latitude` | `__c.latitude_s` | **`__latitude__s`** | Close but wrong suffix |
| Q18 | Shared DB | "own database" | "own database" | **Share BOTH code AND database** | Same mistake twice! |
| Q20 | Polyglot + selective | custom domain | custom domain | **Selective queries** | Same mistake twice! |
| Q23 | Stateful/stateless | stateless client | stateless client | **Stateful client, stateless server** | Same mistake twice! |
| Q35 | Application event | component event | component event | **Application event** | Same mistake twice! |
| Q36 | AppExchange benefits | dev tools | dev tools | **Reviewed solutions + support** | Same mistake twice! |
| Q44 | Validation for codes | Geolocation | Formula field | **Validation rule** | Different wrong, same trap |
| Q46 | Declarative use cases | cross-obj in roll-up | cross-obj in roll-up | **Cross-obj formulas can't be in roll-ups** | Same mistake twice! |
| Q48 | Agentforce chat feature | code suggestions | code suggestions | **Multi-step workflows + code analysis** | Same mistake twice! |
| Q50 | Rules/workflows benefit | test creation | test creation | **Naming conventions + security** | Same mistake twice! |
| Q51 | Act mode actions | org architecture | design strategies | **Deploy metadata + run tests** | Different wrong, same category |
| Q53 | Pro model reset | rejected | resets after last | **Resets 24h after FIRST request** | Different wrong |

---

## Stubborn Mistakes — The Final 5 Points You Need

These 6 facts are costing you the most. Memorize them and you pass:

### 1. `getRecordTypeInfosById()` & `getGlobalDescribe()` (Q1, Q12)
```
getRecordTypeInfosById() → Map<Id, RecordTypeInfo>   // "ById" = Map with Id key
getGlobalDescribe()      → Map<String, SObjectType>   // "Global" = ALL objects
```

### 2. Indirect Lookup vs External Lookup (Q13)
```
External Lookup → parent is EXTERNAL (external parent)
Indirect Lookup → child is EXTERNAL  (external child → SF parent via External ID)
```

### 3. Stateful CLIENT, Stateless SERVER (Q23)
```
Browser (JavaScript) = STATEFUL  → remembers UI state
Server  (Apex)       = STATELESS → processes and forgets
```

### 4. Application Event vs Component Event (Q35)
```
"May or may not be in the same parent" → APPLICATION event (broadcasts to ALL)
"Always in the same parent hierarchy"  → Component event
```

### 5. Cross-object formulas CANNOT be used in Roll-up Summaries (Q46)
```
Roll-up Summary field → can summarize: COUNT, SUM, MIN, MAX
                      → CANNOT use: cross-object formula fields, AVG function
```

### 6. Share BOTH code AND database (Q18)
```
❌ "Share code, own database"
✅ "Share BOTH code AND database" → that's why governor limits exist
```

---

## Paper 3 (Process Automation Pt 2) — New Gaps

You crushed this one with 81.63% on a completely fresh paper! 

Here are the 9 mistakes to review:
1. **Bulk Triggers**: Triggers support data import, bulk API, mass actions. ("before undelete" doesn't exist).
2. **Trigger Management**: Triggers can be deactivated. API versions can be set. UI *cannot* create Attachment triggers. 
3. **Same-Record Update**: If a field on a record updates *another* field on the *same record*, use **Before Update**, not After Update.
4. **Trigger.isExecuting**: Checks if context is a trigger. (Not `isUpdate`).
5. **SOQL limit bypass trap**: You CANNOT bypass limits. Putting a SOQL query inside a loop (like `[SELECT Id FROM LineItem__c WHERE Invoice__c = :invoice.Id]`) will hit the 100 query limit.
6. **Trigger + Flow recursion**: Before triggers fire first, then record-triggered flows. Built-in recursion control prevents infinite loops when they both update the same record.
7. **Visualforce errors**: Need `<apex:pageMessages>` component to display `ApexPages.addMessage()` messages on the page.
8. **Callout after DML**: Rollback *first*, then release savepoint: `Database.rollback(sp); Database.releaseSavepoint(sp);`
9. **ApexDoc**: Starts with `/**` and ends with `*/`. The `@param` tags must match parameter order.
