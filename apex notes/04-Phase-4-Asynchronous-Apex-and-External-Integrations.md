# 🔴 Phase 4: Asynchronous Apex & External Integrations

*Handling massive data volumes and external APIs without blocking UI or hitting synchronous governor limits.*

## 1. Introduction to Asynchronous Apex
Asynchronous Apex executes logic in the background when resources become available. This provides several benefits:
*   **Higher Governor Limits:** You get double the heap size and more SOQL queries (200 vs 100 in synchronous).
*   **Non-Blocking:** The user interface isn't locked while long-running processes complete.
*   **Mixed DML Operations:** Allows you to perform DML on setup objects (like User) and non-setup objects (like Account) in the same transaction, which is normally prohibited synchronously.

## 2. `@future` Methods
The simplest way to run code asynchronously.

### Syntax & Constraints
*   Must be declared with the `@future` annotation.
*   The method must be `static void`.
*   **Crucial Limitation:** Parameters can ONLY be primitive data types, arrays of primitives, or collections of primitives (e.g., `List<Id>`). You **cannot** pass sObjects as parameters (because the record might change in the database before the future method executes).

```apex
public class FutureExample {
    @future
    public static void processRecords(List<Id> recordIds) {
        List<Account> accounts = [SELECT Id, Name FROM Account WHERE Id IN :recordIds];
        // Process accounts...
    }
}
```

### Callouts from `@future`
If you need to make an HTTP callout from a trigger, you must use an asynchronous method.
```apex
@future(callout=true)
public static void makeApiCallout(Id accountId) {
    // Make external HTTP request
}
```

## 3. Queueable Apex (`Queueable` Interface)
The modern, more powerful alternative to `@future`. 

### Benefits over `@future`:
*   **Non-primitive Types:** You CAN pass complex types like sObjects or custom classes into the constructor.
*   **Monitoring:** Returns an `AsyncApexJob` ID, allowing you to monitor its progress in Setup -> Apex Jobs.
*   **Chaining:** You can start a new Queueable job from within an executing Queueable job, effectively chaining processes indefinitely and resetting governor limits.

### Execution
```apex
public class MyQueueableClass implements Queueable {
    private List<Account> accountsToProcess;
    
    // Constructor accepts sObjects!
    public MyQueueableClass(List<Account> accs) {
        this.accountsToProcess = accs;
    }
    
    public void execute(QueueableContext context) {
        for (Account acc : accountsToProcess) {
            acc.Description = 'Updated via Queueable';
        }
        update accountsToProcess;
        
        // Chaining another job
        // System.enqueueJob(new AnotherQueueableClass()); 
    }
}

// How to invoke it:
// ID jobID = System.enqueueJob(new MyQueueableClass(recordList));
```

## 4. Batch Apex (`Database.Batchable<sObject>`)
Designed to process massive amounts of data (up to **50 million records**) by breaking them into manageable chunks (batches).

### The Three Methods
A Batch class must implement three specific methods:
1.  **`start`**: Collects the records or objects to be passed to the interface. Usually returns a `Database.QueryLocator` (which bypasses the 50k SOQL limit).
2.  **`execute`**: Performs the actual processing for each chunk. The default chunk size is 200, up to a maximum of 2,000. Governor limits are reset for every `execute` batch.
3.  **`finish`**: Executes after all batches are processed. Useful for sending summary emails or chaining another batch job.

### Syntax
```apex
public class AccountBatchUpdate implements Database.Batchable<sObject>, Database.Stateful {
    
    // Database.Stateful allows this variable to retain its value across all batches
    public Integer recordsProcessed = 0; 

    public Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator('SELECT Id, Name FROM Account');
    }
    
    public void execute(Database.BatchableContext bc, List<Account> scope) {
        for (Account acc : scope) {
            acc.Name = acc.Name + ' - Processed';
            recordsProcessed++;
        }
        update scope;
    }
    
    public void finish(Database.BatchableContext bc) {
        System.debug(recordsProcessed + ' records processed.');
        // Send email notification...
    }
}

// How to invoke: (The second parameter is the batch size, max 2000)
// ID batchId = Database.executeBatch(new AccountBatchUpdate(), 200);
```

## 5. Scheduled Apex (`Schedulable` Interface)
Used to run Apex classes at specific times on a daily or weekly basis.

### Syntax
```apex
public class DailyAccountProcessor implements Schedulable {
    public void execute(SchedulableContext sc) {
        // You can run logic directly here, or execute a Batch class
        Database.executeBatch(new AccountBatchUpdate());
    }
}
```

### Scheduling
You can schedule it via the UI, or programmatically using a CRON expression.
```apex
String cronExp = '0 0 0 * * ?'; // Runs every day at midnight
System.schedule('Daily Account Job', cronExp, new DailyAccountProcessor());
```

## 6. HTTP Callouts & REST APIs

### Outbound REST (Calling an External System)
Use `Http`, `HttpRequest`, and `HttpResponse` classes.
```apex
Http http = new Http();
HttpRequest request = new HttpRequest();
request.setEndpoint('https://api.example.com/data');
request.setMethod('GET');
request.setHeader('Content-Type', 'application/json');

HttpResponse response = http.send(request);

if (response.getStatusCode() == 200) {
    System.debug('Response body: ' + response.getBody());
    // Use JSON.deserialize() to parse the response
}
```
*Note: The endpoint must be whitelisted in Salesforce under **Remote Site Settings** or **Named Credentials**.*

### Inbound REST (Exposing Apex as an API)
You can create custom API endpoints for external systems to call.
```apex
@RestResource(urlMapping='/AccountManager/*')
global with sharing class AccountManagerAPI {
    
    @HttpGet
    global static Account getAccountById() {
        RestRequest request = RestContext.request;
        // Grab the ID from the end of the URL
        String accountId = request.requestURI.substring(request.requestURI.lastIndexOf('/')+1);
        
        Account result = [SELECT Id, Name, Phone FROM Account WHERE Id = :accountId];
        return result;
    }
    
    @HttpPost
    global static Id createAccount(String name, String phone) {
        Account acc = new Account(Name = name, Phone = phone);
        insert acc;
        return acc.Id;
    }
}
```
