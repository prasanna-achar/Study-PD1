# 11 — Monitoring Jobs & Flow Debugging

---

## Monitoring Asynchronous Jobs

### Setup Pages for Monitoring

| Page | What It Shows |
|---|---|
| **Apex Jobs** (Setup) | Status of Batch, Future, Queueable, and Scheduled Apex executions |
| **Scheduled Jobs** (Setup) | Managing job schedules (start/stop/delete), NOT execution results |
| **Background Jobs** (Setup) | Bulk sharing recalculation and other platform-level jobs |
| **Flow Interviews** (Setup) | Paused or waiting flow interviews |

### Trap
> **Q:** "Where do I see if a batch job failed?"
> **A:** **Apex Jobs** page — check the `Status` column and `Number of Errors`.

> **Q:** "Where do I manage when a scheduled job runs?"
> **A:** **Scheduled Jobs** page.

---

## Querying Job Status in Apex

### `AsyncApexJob` Object
Tracks the execution status of asynchronous Apex (Batch, Future, Queueable).

```apex
AsyncApexJob job = [
    SELECT Id, Status, NumberOfErrors, JobItemsProcessed, TotalJobItems
    FROM AsyncApexJob
    WHERE Id = :batchJobId
];
System.debug('Status: ' + job.Status);
// Status values: Holding, Queued, Preparing, Processing, Completed, Failed, Aborted
```

### `CronTrigger` Object
Tracks scheduled jobs (the schedule itself, not the execution).

```apex
CronTrigger ct = [
    SELECT Id, State, TimesTriggered, NextFireTime, CronExpression
    FROM CronTrigger
    WHERE Id = :scheduledJobId
];
System.debug('State: ' + ct.State);
// State values: WAITING, ACQUIRED, EXECUTING, COMPLETE, ERROR, DELETED
```

### `CronJobDetail` Object
Provides the name and type of the scheduled job.

```apex
CronJobDetail detail = [
    SELECT Id, Name, JobType
    FROM CronJobDetail
    WHERE Id = :ct.CronJobDetailId
];
```

---

## Pausing and Aborting Scheduled Jobs

### Pausing
```apex
// By Job Id
System.pauseJobById(ct.Id);

// By Job Name
System.pauseJobByName('My Scheduled Job');
```

### Aborting
```apex
System.abortJob(jobId);
```

### Trap
> ❌ `AsyncApexJob.pauseJobById(...)` — This method does NOT exist.
> ✅ Use `System.pauseJobById()` or `System.pauseJobByName()`.

---

## Flow Debugging

### Where to Find Flow Errors
1. **Admin Email:** When a flow fails, the **last modifier** of the flow receives a detailed error email with:
   - The element that failed
   - The error message
   - The record ID involved
   - The flow version

2. **Debug Logs:** Set a trace flag on the running user. Set the **Workflow** category to **FINER** or higher.

3. **Flow Interviews page:** Shows paused/waiting interviews.

4. **Event Monitoring (Shield):** Advanced — tracks flow execution events.

### Flow Debug in Flow Builder
- **Debug** button in Flow Builder lets you test a flow with specific input values
- Shows the path the flow took through each element
- Shows variable values at each step

### Trap
> **Q:** "A record-triggered flow in a sandbox isn't sending emails. What do you check?"
> **A:** Three things:
> 1. **Email addresses** — sandbox appends `.invalid`
> 2. **Email deliverability settings** — may be set to "No Access"
> 3. **Email Logs** — check if emails are being sent at all
> ❌ "System Logs" and "Record Logs" do NOT exist.

---

## Quick-Fire Cards

**Q: Where do you see the status of a completed batch job?**
> A: **Apex Jobs** page in Setup, or query the `AsyncApexJob` object.

**Q: How do you abort a scheduled job in Apex?**
> A: `System.abortJob(jobId)`

**Q: A flow is failing. Who gets the error email?**
> A: The **last modifier** of the flow.

**Q: What Workflow log level captures flow evaluation details?**
> A: **FINER** or higher.
