# Exam Paper 1 — Attempt 2: Developer Fundamentals Part 1 – PD1
**Source:** K2 University (Focus on Force)
**Date:** 2026-09-23
**Score:** 37/58 (63.79%)
**Time:** 1h 07m
**Previous Score:** 22/58 (37.93%) — Attempt 1 on 2026-09-22

---

## Results Summary

### Correct (37 questions)
Q2, Q3, Q5, Q7, Q8, Q9, Q10, Q15, Q16, Q17, Q19, Q21, Q22, Q24, Q25, Q26, Q27, Q28, Q29, Q30, Q31, Q32, Q33, Q34, Q38, Q39, Q40, Q41, Q42, Q43, Q45, Q47, Q49, Q52, Q55, Q56, Q57

### Incorrect (21 questions)
Q1, Q4, Q6, Q11, Q12, Q13, Q14, Q18, Q20, Q23, Q35, Q36, Q37, Q44, Q46, Q48, Q50, Q51, Q53, Q54, Q58

---

## Still-Wrong Questions — Full Detail

**Q1 — getRecordTypeInfosById()**
Your answer: getRecordTypes() | Correct: getRecordTypeInfosById()

**Q4 — getSObjectType()**
Your answer: getSObjectName() | Correct: getSObjectType()

**Q6 — Programmatic Sharing (choose 3)**
Missed: "Objects on detail side of MD don't have sharing object" + "AccountShare"
Wrong: chose Account__Share and/or "one user at a time"
Correct: AccountShare (no underscore), CustomObject__Share, detail-side has no sharing object

**Q11 — isAccessible() on DescribeFieldResult**
Your answer: isViewable() | Correct: isAccessible() of Schema.DescribeFieldResult

**Q12 — getGlobalDescribe()**
Your answer: getGlobalSObjects() | Correct: getGlobalDescribe()

**Q13 — Indirect Lookup**
Your answer: External Lookup | Correct: Indirect Lookup (external child → SF parent)

**Q14 — Geolocation syntax**
Your answer: __c.latitude_s | Correct: __latitude__s (remove __c, add __latitude__s)

**Q18 — Multi-tenant shared database**
Your answer: "share code, own database" | Correct: share BOTH code AND database

**Q20 — Polyglot persistence + selective queries**
Missed: "Queries should be selective" | Wrong: chose "custom domain"

**Q23 — Stateful client, stateless server**
Your answer: "stateless client, stateful server" | Correct: REVERSED — stateful client, stateless server

**Q35 — Application event**
Your answer: component event | Correct: Application event (components may/may not share parent)

**Q36 — AppExchange benefits**
Your answer: "installs additional development tools" | Correct: reviewed solutions + support/maintenance

**Q37 — Schedule-triggered flow + Apex job**
Got: schedule-triggered flow ✅ | Missed: Apex job | Wrong: chose "Scheduled Jobs page"

**Q44 — Validation rule for country codes**
Your answer: Formula field | Correct: Validation rule

**Q46 — Declarative customization (choose 3)**
Wrong: chose "roll-up summary using cross-object formula fields" — cross-obj formulas CANNOT be used in roll-ups

**Q48 — Agentforce Vibes chat capabilities**
Wrong: chose "real-time code suggestions" (that's Inline Auto Completion, not agentic chat)

**Q50 — Agentforce rules/workflows benefits**
Wrong: chose "automating test creation" (that's Test Case Generation feature, not rules/workflows)

**Q51 — Act mode actions**
Wrong: chose "designing implementation strategies" (that's Plan mode, not Act mode)

**Q53 — Pro model reset timing**
Wrong: chose "resets after last request" | Correct: resets 24h after FIRST request

**Q54 — Agentforce Vibes availability**
Wrong: chose "paid version of Extension Pack" | Correct: it's FREE, pre-installed in Code Builder

**Q58 — LLM definition**
Wrong: chose "natural language simplifies interpretation" | Correct: "predicts one token at a time"
