# Exam Paper: Testing, Debugging, and Deployment (Obj 1) – PD1 (Attempt 1)

**Date**: 2026-09-28
**Score**: 26/38 (68.42%) ✅ PASS (barely!)
**Time**: 48m 26s

---

## Wrong Answers (12 total)

### Q3 — Testing framework capabilities
**Chose**: Audit code for security vulnerabilities
**Correct**: Use integrated tools to run unit tests
**Lesson**: The testing framework runs tests and checks coverage. It does NOT audit for security vulnerabilities.

### Q9 — runAs() method
**Chose**: runAs() can be used in any Apex method
**Correct**: runAs() ignores user license limits
**Lesson**: `runAs()` is **test-only** — cannot be used in production Apex. It ignores license limits so you can create users even with no spare licenses.

### Q12 — Creating unit tests
**Chose**: If code uses conditional logic, one scenario will automatically cover all conditions
**Correct**: Lines of code in Test methods and test classes are NOT counted as part of code coverage
**Lesson**: Conditional logic (if/else, ternary) requires testing **every branch** separately. Test class lines don't count toward coverage.

### Q15 — Test data access without SeeAllData
**Chose**: Custom Objects, Custom Settings (wrong ones)
**Correct**: Users, Profiles, Record Types
**Lesson**: Tests can ALWAYS access **metadata/org-management objects**: User, Profile, RecordType, Organization. Custom Objects and Custom Settings require you to create your own test data or use `SeeAllData=true`.

### Q21 — Developer Console test features
**Chose**: Suite Manager is used to abort tests
**Correct**: "Rerun Failed Tests" reruns only failed tests from the highlighted test run
**Lesson**: Suite Manager = create/manage test suites (grouping classes). It does NOT abort tests.

### Q23 — Execute a new test class
**Chose**: REST API and ApexTestRun method
**Correct**: Application Test Execution in Setup + Developer Console Test menu
**Lesson**: `ApexTestRun` method does NOT exist. Tests run via: Setup (Application Test Execution), Developer Console, VS Code, Code Builder, SOAP API, Tooling REST API.

### Q26 — Running selected tests during deployment
**Chose**: Running selected tests is only available in Metadata API
**Correct**: Code coverage is computed for each class and trigger individually (different from overall %)
**Lesson**: Selected tests work in Metadata API AND tools built on it (Salesforce CLI, VS Code). When running selected tests, each component must individually hit 75%.

### Q28 — Default test for API v33.0 deployment
**Chose**: All local AND managed package tests
**Correct**: All LOCAL tests only (managed package tests excluded)
**Lesson**: API v33.0 and earlier = all local tests run (excludes managed packages). API v34.0+ = no tests run by default if no Apex in package.

### Q30 — Negative test scenario
**Chose**: `System.assertEquals('Hot', acc.Rating)` (positive test!)
**Correct**: `System.assert(acc.Rating != 'Hot')` (negative test)
**Lesson**: **Negative test** = verify what should NOT happen. If Credit_Status is not 'Excellent', Rating should NOT be 'Hot'. `assertEquals('Hot')` is a positive test.

### Q31 — Skip code coverage option location
**Chose**: Test Manager in Developer Console, Apex Classes page in Setup
**Correct**: "New Run" menu in Developer Console, Application Test Execution page in Setup
**Lesson**: Skip code coverage is in the **Settings** when creating a **New Run** (not Test Manager). In Setup it's on the **Application Test Execution** page (not Apex Classes page).

### Q32 — Skipping code coverage statements
**Chose**: Suite Manager can be used to skip code coverage
**Correct**: Code coverage can be skipped during a new test run
**Lesson**: Suite Manager groups test classes. It does NOT have a skip coverage option. The skip option appears when creating a new test run.

### Q36 — sObject error methods
**Chose**: `a.containsErrors()` (doesn't exist)
**Correct**: `a.hasErrors()`
**Lesson**: The three sObject error methods are: `addError()`, `hasErrors()`, `getErrors()`. There is NO `containsErrors()` or `errors()` method.
