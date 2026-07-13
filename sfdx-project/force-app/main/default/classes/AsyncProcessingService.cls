/**
 * @description Demonstrates the four core Asynchronous Apex processing frameworks tested on the PD1 Exam:
 *              1. Future Methods (@future)
 *              2. Queueable Apex (implements Queueable)
 *              3. Batch Apex (implements Database.Batchable<sObject>, Database.Stateful)
 *              4. Scheduled Apex (implements Schedulable)
 */
public with sharing class AsyncProcessingService {

    // =========================================================================================
    // 1. FUTURE METHOD (@future)
    // Exam Rules: Must be static void, parameters must be primitives (no sObjects!), cannot call another future.
    // =========================================================================================
    @future(callout=true)
    public static void enrichAccountDataAsync(List<Id> accountIds) {
        List<Account> accountsToUpdate = [SELECT Id, Name, Description FROM Account WHERE Id IN :accountIds];
        
        for (Account acc : accountsToUpdate) {
            // Simulated HTTP Callout or heavy computation
            acc.Description = acc.Description + ' [Async Enriched on ' + DateTime.now() + ']';
        }
        
        if (!accountsToUpdate.isEmpty()) {
            update accountsToUpdate;
        }
    }

    // =========================================================================================
    // 2. QUEUEABLE APEX (implements Queueable)
    // Exam Rules: Can accept non-primitive parameters (sObjects), supports job chaining (enqueueJob).
    // =========================================================================================
    public class AccountQueueableJob implements Queueable {
        private List<Account> accountsToProcess;
        private Boolean chainNextJob;

        public AccountQueueableJob(List<Account> accounts, Boolean shouldChain) {
            this.accountsToProcess = accounts;
            this.chainNextJob = shouldChain;
        }

        public void execute(QueueableContext context) {
            for (Account acc : accountsToProcess) {
                acc.Rating = 'Warm';
            }
            update accountsToProcess;

            // Demonstrating Queueable Job Chaining (Max 1 child job enqueued from executing job)
            if (chainNextJob && !Test.isRunningTest()) {
                System.enqueueJob(new AccountQueueableJob(new List<Account>(), false));
            }
        }
    }

    // =========================================================================================
    // 3. BATCH APEX (implements Database.Batchable<sObject>, Database.Stateful)
    // Exam Rules: Up to 50 million records, Database.Stateful preserves instance variables across execute chunks.
    // =========================================================================================
    public class AccountCleanupBatch implements Database.Batchable<sObject>, Database.Stateful {
        public Integer totalRecordsUpdated = 0; // State preserved across batches due to Database.Stateful

        public Database.QueryLocator start(Database.BatchableContext bc) {
            return Database.getQueryLocator([
                SELECT Id, Active__c, Description FROM Account WHERE Active__c = 'No'
            ]);
        }

        public void execute(Database.BatchableContext bc, List<Account> scope) {
            for (Account acc : scope) {
                acc.Description = 'Archived via Nightly Batch Job.';
                totalRecordsUpdated++;
            }
            update scope;
        }

        public void finish(Database.BatchableContext bc) {
            System.debug(LoggingLevel.INFO, 'Batch Cleanup Complete! Total records updated: ' + totalRecordsUpdated);
        }
    }

    // =========================================================================================
    // 4. SCHEDULED APEX (implements Schedulable)
    // Exam Rules: Executes on a CRON schedule. Often used to launch Batch Apex or Queueable jobs.
    // =========================================================================================
    public class NightlyAccountCleanupScheduler implements Schedulable {
        public void execute(SchedulableContext sc) {
            AccountCleanupBatch batchJob = new AccountCleanupBatch();
            // Launch batch with a chunk size of 200 (default)
            Database.executeBatch(batchJob, 200);
        }
    }
}
