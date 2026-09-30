# 06 — Code Coverage Requirements

---

## The Rules

| Rule | Threshold |
|---|---|
| **Overall org coverage to deploy to Production** | **75%** minimum |
| **Individual trigger coverage** | **1%** minimum (must have at least one line covered) |
| **Individual class coverage** | No hard minimum, but contributes to the 75% org total |
| **"Run Specified Tests" deployment option** | Each class in the change set must have **75%** coverage from the specified tests |

---

## What Counts & What Doesn't

### ✅ Counts Toward Code Coverage
- Apex class lines of code (method bodies, conditionals, loops)
- Trigger lines of code
- Property getters and setters

### ❌ Does NOT Count
- **Comments** — Ignored entirely
- **`System.debug()` statements** — Ignored (they don't affect logic)
- **Test classes themselves** — Never counted in the denominator
- **Managed package code** — Excluded from your org's coverage calculation
- **Blank lines** — Ignored

---

## How to Check Code Coverage

### Developer Console
1. **Test > Run All** or **Test > New Run**
2. After tests complete, open a class → colored lines show coverage:
   - 🟦 Blue = Covered
   - 🟥 Red = Not covered
   - No highlight = Not countable (comments, blank lines)

### Setup
1. Go to **Setup > Apex Test Execution**
2. Click **"View Code Coverage"**
3. See the org-wide percentage and per-class breakdown

### Salesforce CLI
```bash
sf apex run test --code-coverage --result-format human
```

### Tooling API
Query `ApexCodeCoverageAggregate` for per-class results:
```
SELECT ApexClassOrTrigger.Name, NumLinesCovered, NumLinesUncovered
FROM ApexCodeCoverageAggregate
```

---

## Deployment Test Run Options

When deploying via Change Set, Metadata API, or CLI, you choose which tests to run:

| Option | What It Does | When to Use |
|---|---|---|
| **Default** | Runs all local tests (non-managed package tests) | Standard deployments |
| **Run All Tests** | Runs ALL tests including managed package tests | Thorough validation |
| **Run Specified Tests** | Runs ONLY the test classes you name | When org coverage < 75% but YOUR class has 75%+ |
| **No Test Run** | Skips tests entirely | Only for non-Apex metadata (e.g., custom fields, layouts) |

### Trap: "Run Specified Tests" Workaround
If the org's overall coverage has dropped below 75% (maybe someone else broke tests), you can still deploy YOUR code by:
1. Selecting **"Run Specified Tests"**
2. Entering the name of YOUR test class
3. Your class must independently achieve **75% coverage**

> ⚠️ This is a workaround, NOT a long-term fix. The org's coverage still needs repair.

---

## Code Coverage Best Practices

1. **Test positive scenarios** — "Does it work when data is correct?"
2. **Test negative scenarios** — "Does it fail gracefully with bad data?"
3. **Test bulk operations** — Insert 200+ records to ensure no governor limit issues.
4. **Test as different users** — Use `System.runAs()` to validate sharing.
5. **Assert results** — `System.assertEquals()`, `System.assertNotEquals()`, `System.assert()`.
6. **Don't just cover lines** — Meaningless coverage without assertions is useless.

---

## Quick-Fire Cards

**Q: What is the minimum org-wide code coverage to deploy Apex to production?**
> A: 75%

**Q: A trigger has 0% coverage. Can it be deployed?**
> A: No. Triggers need at least 1% (one line must be covered).

**Q: Do test classes count toward the org's Apex code size limit?**
> A: No. Test classes are excluded.

**Q: Your org is at 60% coverage. Your new class has 90% coverage. How do you deploy?**
> A: Use "Run Specified Tests" and name your test class. Each class in the change set must individually meet 75%.
