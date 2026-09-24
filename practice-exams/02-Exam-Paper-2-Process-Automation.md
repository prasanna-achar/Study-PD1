# Exam Paper 2: Process Automation and Logic Part 1 – PD1
**Source:** K2 University (Focus on Force)
**Date:** 2026-09-23
**Score:** 34/51 (66.67%)
**Time:** 38m 26s

---

## Results Summary

### Correct (34 questions)
Q3, Q4, Q7, Q8, Q9, Q10, Q11, Q12, Q13, Q14, Q15, Q16, Q17, Q18, Q20, Q21, Q22, Q23, Q24, Q26, Q27, Q28, Q30, Q33, Q34, Q38, Q39, Q40, Q41, Q44, Q45, Q48, Q49, Q51

### Incorrect (17 questions)
Q1, Q2, Q5, Q6, Q19, Q25, Q29, Q31, Q32, Q35, Q36, Q37, Q42, Q43, Q46, Q47, Q50

---

## Wrong Answers — Full Detail

### Category 1: Declarative Automation Features (3 wrong)

**Q1 — Outbound Message (not "Outbound notification rule")**
Scenario: Send record info to external system when opportunity updated.
Your answer: Outbound notification rule | Correct: **Outbound Message**
Key fact: Outbound messaging sends SOAP messages over HTTP(S). Triggered via flows. "Outbound notification rule" doesn't exist.

**Q5 — Custom Email Handler (not Escalation Rule)**
Scenario: Inbound email with reference number should match to custom object Claim__c.
Your answer: Escalation Rule | Correct: **Custom Email Handler**
Key fact: Email-to-Case = Cases only. Custom object email processing = **InboundEmailHandler** (Apex implements `Messaging.InboundEmailHandler`).

**Q6 — Data quality tools (choose 3)**
Missed: Required fields | Wrong pick: Assignment rules
Correct 3: **Validation rules, Required fields, Restricted Picklists**
Key fact: Assignment rules route leads/cases to owners — NOT data quality.

### Category 2: Control Flow Trap (1 wrong)

**Q19 — Multiple IF (no else) with value 75 → result is "D" not "C"**
Your answer: C | Correct: **D**
Key fact: Without `else`, ALL if statements execute. 75 >= 70 sets "C", then 75 >= 60 OVERWRITES to "D". Only `else if` stops at the first match.

### Category 3: Class & Sharing Rules (3 wrong)

**Q25 — Inner class sharing**
Wrong: "sharing keyword only in outer" + "inner inherits sharing"
Correct: **Inner classes do NOT inherit sharing** + default for inner is **without sharing**

**Q29 — Access modifier requirements**
Wrong: "optional for top-level" | Correct: **Required for top-level, optional for inner classes**

**Q32 — Anonymous blocks execute as current user**
Your answer: Apex Classes | Correct: **Anonymous Blocks**
Key fact: Apex classes/triggers/web services run in **system mode** by default. Only **anonymous blocks** always run as current user.

### Category 4: Static Variables (1 wrong)

**Q31 — Reasons for static method/variable (choose 3)**
Missed: "utility method" | Wrong pick: "persist beyond transaction"
Correct: Use without instantiating, utility method, share across instances
Key fact: Static variables persist only **within a single transaction**, NOT beyond it.

### Category 5: SOQL/SOSL/DML Specifics (5 wrong)

**Q35 — Geolocation SOQL suffix**
Your answer: `__Latitude__c` | Correct: **`__Latitude__s`** (lowercase 's' for system suffix, not 'c')
Still getting this wrong — same mistake from Exam Paper 1!

**Q36 — SOQL escape sequences (choose 3)**
Missed: `\"` | Wrong pick: `\c`
Valid escapes: `\n`, `\'`, `\"`, `\t`, `\r`, `\\`, `\b`, `\f`
Not valid: `\a`, `\c`

**Q37 — Upsert behavior (choose 3)**
Missed: "record ID as key" | Wrong pick: "multiple matches → most recent updated"
Key fact: If key matched **multiple times → ERROR** (not most recent). Upsert can use record ID, external ID, or idLookup fields.

**Q42 — Objects that don't support DML (choose 2)**
Wrong: User | Correct: **Profile** and **Record Type**
Key fact: User object DOES support DML (you can insert/update User records). Profile and RecordType are read-only.

**Q43 — Delete/undelete behavior (choose 3)**
Missed: "parent/child accounts supported by undelete" | Wrong pick: "undelete doesn't restore parent cases"
Key fact: Undelete DOES restore parent case associations. It also restores opportunity-quote associations.

### Category 6: Async Apex — New Topics (2 wrong)

**Q46 — AsyncOptions.MaximumQueueableStackDepth**
Your answer: `QueueableRecursionLimit` | Correct: **`MaximumQueueableStackDepth`**
Key fact: The property name is `MaximumQueueableStackDepth`, not `QueueableRecursionLimit`.

**Q47 — QueueableDuplicateSignature (choose 2)**
Missed: `.addString(myRecord.Id)` variant | Wrong pick: `UniqueSignature.Builder()`
Key fact: Class is **`QueueableDuplicateSignature`**, not `UniqueSignature`. Methods: `addId()`, `addString()`, `addInteger()`.

### Category 7: Error Tracking (1 wrong)

**Q50 — Event Log File Browser for unhandled exceptions**
Your answer: Platform event-triggered flow | Correct: **Event Log File (ELF) Browser**
Key fact: Unhandled Apex exceptions are tracked via Event Monitoring (free tier). View in Setup → ELF Browser. Platform event flows can't subscribe to Apex exceptions.
