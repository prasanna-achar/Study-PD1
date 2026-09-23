# 📈 PD1 Exam Progress Tracker

## Exam Paper 1: Developer Fundamentals Part 1 (K2 University)

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
