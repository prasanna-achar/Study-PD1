# Exam Paper 2: Process Automation and Logic Part 1 – PD1 (Attempt 2)
**Source:** K2 University (Focus on Force)
**Date:** 2026-09-24
**Score:** 48/51 (94.12%)
**Time:** 28m 45s
**Pass Mark:** 68% — **PASSED ✅**

---

## Progress on This Paper

| Attempt | Score | % | Time | Status |
| :---: | :---: | :---: | :---: | :--- |
| 1 | 34/51 | 66.67% | 38m | ❌ |
| **2** | **48/51** | **94.12%** | **28m** | **✅ PASS** |

**+14 questions fixed. Time cut by 10 minutes.**

---

## Fixed from Attempt 1 ✅ (14 questions)

- ✅ Outbound Message (not "Outbound notification rule")
- ✅ Invocable Apex + Flow + Trigger for child updates
- ✅ Custom Email Handler (not Escalation Rule)
- ✅ if vs else-if (multiple if = all execute, last wins)
- ✅ Inner class does NOT inherit sharing, default = without sharing
- ✅ Static vars persist within ONE transaction only
- ✅ Anonymous blocks = current user
- ✅ Geolocation `__Latitude__s`
- ✅ SOQL escape sequences (`\"`, `\'`, `\n`)
- ✅ Upsert duplicate key = ERROR (not most recent)
- ✅ Profile & RecordType can't DML, User CAN
- ✅ Undelete DOES restore parent case associations
- ✅ QueueableDuplicateSignature (not UniqueSignature)
- ✅ ELF Browser for unhandled exceptions

---

## Still Wrong — 3 Stubborn Mistakes

### Q6 — Data quality tools (wrong BOTH attempts)
**Chose:** Assignment rules | **Correct:** Restricted Picklists
```
Data quality tools: Validation rules, Required fields, Restricted Picklists
NOT data quality: Assignment rules (route leads/cases), Escalation rules (case timers)
```

### Q29 — Top-level class access modifier (wrong BOTH attempts)
**Chose:** Optional for top-level | **Correct:** Required for top-level
```
Top-level class:  Access modifier REQUIRED (public, global, etc.)
Inner class:      Access modifier OPTIONAL (defaults to private)
```

### Q46 — AsyncOptions property name (wrong BOTH attempts)
**Chose:** QueueableRecursionLimit | **Correct:** MaximumQueueableStackDepth
```
✅ AsyncOptions.MaximumQueueableStackDepth = 3;
❌ AsyncOptions.QueueableRecursionLimit (doesn't exist)
```
