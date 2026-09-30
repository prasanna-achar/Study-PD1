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

---

## 6. Environments & Sandboxes (Objective 4)

### Rule: Sandbox Types & Limits
Memorize the 4 sandbox types and what they are for:
1. **Developer Sandbox:** 200MB. Refreshed daily. For single developers.
2. **Developer Pro Sandbox:** 1GB. Refreshed daily. For larger dev/integration.
3. **Partial Copy Sandbox:** 5GB (max 10k records/object). Refreshed every 5 days. For UAT, training, testing with a *sample* of live data.
4. **Full Copy Sandbox:** Exact replica. Refreshed every 29 days. **ONLY FOR:** Staging, Performance Testing, and Load Testing.

### Trap: Sharing sandboxes and environments
- "Share a scratch org between developers" ❌ WRONG. Scratch orgs are single-use per developer.
- "You can build managed packages in a sandbox" ❌ WRONG. Only Developer Edition or Partner Developer Edition orgs can create managed packages.
- Need all developers to have the same metadata? → **Clone an existing sandbox.**

### Rule: AppExchange Package Creation
To distribute a commercially available app on the AppExchange:
1. Manage source code in a **Partner Developer Edition**.
2. Create the package in a **Developer Edition**.
- You CANNOT publish apps from Developer Pro or Partial Copy sandboxes.

---

## 7. Deployment Tools (Change Sets, CLI, VS Code)

### Rule: Change Sets
- **Requirement:** Orgs MUST be related (e.g., Sandbox to Production, or Sandbox to Sandbox).
- ❌ NOT available in Developer Edition orgs.
- **Trap: Change Set from Sandbox to Prod is missing target!** → Go to *Production* Deployment Settings and **allow inbound changes** from the sandbox.
- **Test Coverage Trap:** If overall org coverage is < 75%, but your specific class is 97%: Use **'Run specified tests'** during deployment (the specific class must pass 75%).

### Rule: Salesforce CLI (sf)
- It CAN deploy metadata between *unrelated* orgs.
- It CAN be used to automate/schedule scripted deployments.
- **Deleting Metadata:** You CAN delete metadata using the CLI (Metadata API under the hood). Change Sets *cannot* delete components.
- Syntax to delete a class: `sf project delete source --metadata ApexClass:MyClass`

### Rule: Metadata API Limitations
You CANNOT deploy these via Metadata API (or change sets):
- Currency Exchange Rates
- Account Teams / Case Team Roles
- Calendars / Fiscal Years

### Rule: Package vs Org Development Models
- **Package Development:** Everything managed as a single unit in version control (source of truth). Uses scratch orgs for dev/test.
- **Org Development (Change Set Model):** Uses sandbox orgs for dev/test. Deploys via change sets.

### Rule: DevOps Center
- Centralized deployment tool (managed package).
- Requires integration with a **Github Account** for tracking metadata changes.

---

## 8. Deployment Gotchas

**Why didn't my sandbox flow send an email?**
1. Check email addresses (sandbox appends `.invalid` to all emails).
2. Check email deliverability settings (often defaults to System Email Only).
3. Check the Email Logs.

**Why did my metadata deployment not generate a debug log?**
- By default, debug logs are disabled for metadata deployments.
- You must enable **"Metadata Deployments can generate Debug Logs"** in Apex Settings via Setup.

**Tooling API vs Metadata API**
- **Metadata API:** Large XML deployments, object definitions.
- **Tooling API:** Fine-grained access. Used for accessing a debug log (ApexLog), code coverage results, committing single class changes.
