# Testing, Debugging, and Deployment (Obj 2-3) — PD1

> A targeted review based on your 52% mock exam. This section is heavy on memorization of Developer Console tabs, debug log levels, and exact tool capabilities.

---

## 1. Debug Logs & Trace Flags

### Rule: Trace Flag Entities
Trace flags can only be set on **Users, Apex Classes, and Apex Triggers** (also Automated Process / Platform Integration). 
- ❌ JavaScript-based or Query-based trace flags DO NOT EXIST.
- **Where to configure UI:** Setup → "Debug Logs" page (Create a trace flag).

### Rule: Debug Log Levels (Lowest to Highest)
Memorize the exact order.
`NONE` → `ERROR` → `WARN` → `INFO` → `DEBUG` → `FINE` → `FINER` → `FINEST`
- **Mnemonic:** "NEW Info DF3"
- **System.debug():** Requires a minimum level of **DEBUG**. The output is found in the **Log Lines** section of the log.

### Rule: Debug Log Limits and Anatomy
If you need to know how many SOQL queries were initiated and the limit usage:
- **Category:** Apex Profiling
- **Level required:** **FINEST** (to see `LIMIT_USAGE_FOR_NS` event).

**Anatomy of a Limit Log Line:**
`20:43:52.588 (7632137015) | LIMIT_USAGE | [137] | SOQL | 38 | 100`
- `[137]` = The line number in the code that triggered this.
- `38` = The number of queries executed so far.
- `100` = The maximum limit.

### Trap: What is NOT in a debug log?
- **Scheduled Flows:** They run asynchronously. You monitor them in Flow Interviews or Scheduled Jobs page, NOT in synchronous debug logs.
- **Lightning Components / Reports:** Debug logs do not capture UI events for these.

---

## 2. Developer Console & Inspector Tools

### Rule: Perspectives
You manage panel layouts via **Debug > Perspective Manager**.
- Built-in perspectives: **All, Debug, Log Only, Analysis**.
- You CAN clone and create custom perspectives.

### Rule: Log Inspector vs Checkpoint Inspector
**Log Inspector Panels:** Execution Overview, Source, Stack Tree, Variables, Execution Stack, Execution Log.
- *Need execution time (total, average, max, min)?* → Look in the **Executed Units** tab (under Execution Overview).

**Checkpoint Inspector:**
- *Checkpoints Tab (Main UI):* Shows Namespace, **Class**, **Line**, Time.
- *Inspector Heap Tab - Types:* Shows objects that were instantiated.
- *Inspector Heap Tab - State:* Shows field values of an object's instance at that exact moment.

---

## 3. Anonymous Apex (Execute Anonymous)

### Rule: User Context & Execution
Anonymous blocks ALWAYS run in **USER MODE** (they respect sharing settings, field permissions, and OWD).
- **Trap:** "It runs in system context." ❌ WRONG. (Standard Apex classes run in system context. Anonymous Apex is the exception).
- **Author Apex Permission:** Just allows you to run anonymous code. It does NOT grant god-mode data access. If you try to update someone else's private record via anonymous code, it will fail.
- **Commits:** Changes made in anonymous apex ARE committed to the database (unlike test classes).

### Best Use Cases:
- **Search and Replace:** Need to fix strange characters on thousands of records quickly? Write anonymous code.
- **API Callout Testing:** Quickly evaluate a 3rd party API by writing a test callout and dumping the response to `System.debug`.

---

## 4. Jobs, Monitoring, & Automation Failures

### Rule: Pausing a Scheduled Job via Apex
You use the `System` class to pause jobs, NOT `AsyncApexJob`.
- ✅ `System.pauseJobById(job.CronTriggerId);`
- ✅ `System.pauseJobByName('My Job Name');`
- ❌ `AsyncApexJob.pauseJobById(...)` (Method doesn't exist).

### Rule: Querying Job Status
There are two main objects you query for scheduled job info:
1. **`AsyncApexJob`**: Filter by `JobType = 'ScheduledApex'`. Access `Status` and `NumberOfErrors`.
2. **`CronTrigger`**: Access `State` and `TimesTriggered`.

### Rule: Flow Failures
When an autolaunched or record-triggered flow fails halfway:
1. **Admin Email:** Check the detailed error email sent to the last modifier.
2. **Trace Flag:** Set up a user trace flag, reproduce the error, and check the debug log. (Flow limits/resources can be seen by setting Workflow to FINER).

---

## 5. DX, CLI, & Environments

### Rule: Scratch Orgs
- Configurable, short-term environments created via Developer Hub Org & Salesforce CLI.
- **Used for:** A single feature/update OR automated testing (CI/CD).
- **NOT used for:** Sharing between multiple developers simultaneously.

### Rule: VS Code Capabilities
- Each developer defines their own `package.xml` (metadata).
- You can execute SOQL, deploy metadata, run unit tests, and edit code.
- ❌ You CANNOT create Change Sets in VS Code (must use web UI).

### Rule: Code Builder
- Web-based IDE that runs in the browser.
- **Requirement:** You MUST install the Code Builder managed package first to use it.
- **Storage:** Consumes no local hard drive space.

---

## Quick-Fire Cards

**Q: Which trace flags exist: User, Trigger, Class, Query, JavaScript?**
> A: Only User, Trigger, and Class.

**Q: You want to know the max/min execution time of a method. Where do you look?**
> A: The `Executed Units` tab in the Developer Console Log Inspector.

**Q: What is the lowest debug level that captures `System.debug()` output?**
> A: `DEBUG`.

**Q: Does Anonymous Apex commit changes to the database?**
> A: YES. And it runs in USER mode (respects sharing/FLS).

**Q: Can you pause a scheduled job by its name in Apex?**
> A: Yes, using `System.pauseJobByName('Job Name')`.

**Q: Which Setup page shows completed asynchronous Apex jobs (batch, future)?**
> A: "Apex Jobs". ("Scheduled Jobs" is only for managing the schedule).
