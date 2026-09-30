# 03 — Governor Limits & Asynchronous Testing

---

## `Test.startTest()` and `Test.stopTest()`

The most important testing construct in Salesforce. It creates a **new execution context** with fresh governor limits.

```apex
@isTest
private class BatchAccountTest {
    @isTest
    static void testBatchJob() {
        // ---- SETUP PHASE (uses the test method's limits) ----
        List<Account> accounts = new List<Account>();
        for (Integer i = 0; i < 200; i++) {
            accounts.add(new Account(Name = 'Test ' + i));
        }
        insert accounts;  // This DML uses the setup's governor limits

        // ---- TESTING PHASE (fresh governor limits) ----
        Test.startTest();
            BatchAccountProcessor batch = new BatchAccountProcessor();
            Database.executeBatch(batch, 200);
        Test.stopTest();
        // At this point, the batch job has COMPLETED synchronously

        // ---- ASSERT PHASE ----
        List<Account> updated = [SELECT Industry FROM Account];
        for (Account a : updated) {
            System.assertEquals('Technology', a.Industry);
        }
    }
}
```

### How It Works
```
┌─────────────────────────────────┐
│  SETUP PHASE                    │
│  (Governor limits: Set 1)       │
│  - Create test data             │
│  - Query records                │
│  - DML operations               │
├─────────────────────────────────┤
│  Test.startTest()               │  ← Resets all governor limits
├─────────────────────────────────┤
│  TESTING PHASE                  │
│  (Governor limits: Set 2)       │  ← Fresh 150 SOQL, 150 DML, etc.
│  - Run the code under test      │
│  - Queue async jobs             │
├─────────────────────────────────┤
│  Test.stopTest()                │  ← Forces all async to complete
├─────────────────────────────────┤
│  ASSERT PHASE                   │
│  - Verify results               │
│  (Governor limits: back to      │
│   Set 1's remaining limits)     │
└─────────────────────────────────┘
```

### Key Rules
| Rule | Detail |
|---|---|
| Can only be called **once** per test method | You cannot nest or repeat them |
| Resets governor limits | SOQL, DML, callouts, CPU time — ALL reset |
| Forces async execution | Future, Batch, Queueable, Schedulable all execute at `stopTest()` |
| Code AFTER `stopTest()` | Can safely query and assert results |

---

## Testing Asynchronous Apex

### Future Methods
```apex
@isTest
private class FutureTest {
    @isTest
    static void testFutureMethod() {
        Test.startTest();
            MyClass.myFutureMethod('param1');  // Queued, not executed yet
        Test.stopTest();
        // Future method has now COMPLETED — assert results here
    }
}
```

### Batch Apex
```apex
@isTest
private class BatchTest {
    @isTest
    static void testBatch() {
        // Create data first
        insert new Account(Name = 'Test');

        Test.startTest();
            Database.executeBatch(new MyBatch(), 200);
        Test.stopTest();
        // Batch has now finished — all execute/finish methods ran
        Account a = [SELECT Status__c FROM Account LIMIT 1];
        System.assertEquals('Processed', a.Status__c);
    }
}
```

### Queueable Apex
```apex
@isTest
private class QueueableTest {
    @isTest
    static void testQueueable() {
        Test.startTest();
            System.enqueueJob(new MyQueueable());
        Test.stopTest();
        // Queueable has completed
    }
}
```

### Scheduled Apex
```apex
@isTest
private class ScheduledTest {
    @isTest
    static void testSchedule() {
        String cronExp = '0 0 12 * * ?';  // Every day at noon
        Test.startTest();
            String jobId = System.schedule('Test Job', cronExp, new MySchedulable());
        Test.stopTest();

        CronTrigger ct = [SELECT Id, State FROM CronTrigger WHERE Id = :jobId];
        System.assertEquals('WAITING', ct.State);
    }
}
```

### Trap
> ❌ "Batch jobs run asynchronously in tests, so you need to wait."
> ✅ `Test.stopTest()` forces ALL queued async code to execute **synchronously** and **immediately**.

---

## Governor Limits You Must Know

| Limit | Per Transaction |
|---|---|
| SOQL queries | 100 (sync) / 200 (async) |
| DML statements | 150 |
| Records retrieved by SOQL | 50,000 |
| Records processed by DML | 10,000 |
| Callouts | 100 |
| Future calls | 50 |
| CPU time | 10,000 ms (sync) / 60,000 ms (async) |
| Heap size | 6 MB (sync) / 12 MB (async) |

### Why This Matters in Tests
- Your **setup phase** uses one set of limits.
- Your **testing phase** (between `startTest`/`stopTest`) gets a completely fresh set.
- If your code under test uses 90 SOQL queries, it won't fail even if your setup already used 80 — because the limits reset.
