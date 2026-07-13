/**
 * @description Curated, realistic question bank for Salesforce Platform Developer I (PD1) Exam Prep.
 *              Covering all 5 official domains with exact weightings, code examples, and deep explanations.
 */
const QUESTION_BANK = [
    // =========================================================================================
    // DOMAIN 1: SALESFORCE FUNDAMENTALS (~7% Weighting)
    // =========================================================================================
    {
        id: 101,
        domain: 'Salesforce Fundamentals',
        weight: '7%',
        difficulty: 'Medium',
        type: 'single',
        question: 'A developer needs to automatically calculate the total number of open child Opportunities for each parent Account and store this number directly on the Account record so it can be filtered in SOQL. The Account and Opportunity objects currently share a standard Lookup relationship. What is the best practice solution?',
        options: [
            'Create a Rollup Summary field on the Account object directly selecting Opportunity as the summarized object.',
            'Create an After Insert, After Update, After Delete, and After Undelete Apex Trigger on the Opportunity object to calculate and update the open count on the parent Account.',
            'Create a Formula field on the Account object using the COUNT() function referencing child Opportunities.',
            'Convert the Account-to-Opportunity Lookup relationship to a Master-Detail relationship, and then create a standard Rollup Summary field on Account.'
        ],
        correctAnswer: 1, // 0-indexed
        explanation: 'Rollup Summary fields strictly require a Master-Detail relationship. Because standard Account-to-Opportunity is a Lookup relationship (and standard relationships cannot be converted to Master-Detail), you cannot create a declarative Rollup Summary field. Formula fields cannot query child records. Therefore, writing an After DML Apex Trigger (or Record-Triggered Flow) on Opportunity to aggregate and update the parent Account is the required programmatic solution.'
    },
    {
        id: 102,
        domain: 'Salesforce Fundamentals',
        weight: '7%',
        difficulty: 'Easy',
        type: 'single',
        question: 'Which of the following architectural capabilities represents how Salesforce enforces multi-tenant resource protection across all organizations sharing an application instance?',
        options: [
            'Metadata API separation',
            'Governor Limits enforced per transaction',
            'Organization-Wide Defaults (OWD)',
            'Model-View-Controller (MVC) decoupling'
        ],
        correctAnswer: 1,
        explanation: 'Governor limits are execution boundaries (such as 100 SOQL queries, 10,000 ms CPU time, 150 DML statements) checked continuously at runtime by the Salesforce platform during a transaction. They prevent any single tenant from monopolizing shared physical hardware resources (CPU, memory, database IO) on a multi-tenant instance.'
    },
    {
        id: 103,
        domain: 'Salesforce Fundamentals',
        weight: '7%',
        difficulty: 'Medium',
        type: 'multi',
        question: 'Which TWO of the following scenarios should prompt a developer to choose an Apex programmatic solution over declarative tools like Lightning Flows? (Choose 2)',
        options: [
            'Sending an email alert when an Opportunity status changes to Closed Won.',
            'Processing nightly data cleanups of 1,000,000 obsolete log records in batch chunks.',
            'Performing complex HTTP REST API callouts requiring custom authentication signatures and dynamic JSON parsing inside an asynchronous trigger flow.',
            'Validating that an Invoice Date is not in the past before saving a record.'
        ],
        correctAnswers: [1, 2],
        explanation: 'Declarative tools (Flows/Validation rules) easily handle email alerts and field-level date validations. However, processing massive data volumes across millions of records (Batch Apex) and complex REST integrations with custom cryptographic signatures/JSON parsing (Apex HTTP Callouts) exceed declarative limits and require programmatic solutions.'
    },
    {
        id: 104,
        domain: 'Salesforce Fundamentals',
        weight: '7%',
        difficulty: 'Hard',
        type: 'single',
        question: 'A company has three different custom objects: Region__c, Store__c, and Employee__c. Store__c has a Lookup relationship to Region__c. Employee__c has a Master-Detail relationship to Store__c. If a user deletes a specific Region__c record, what happens to the related Store__c and Employee__c records by default?',
        options: [
            'Both Store__c and all related Employee__c records are cascade deleted immediately.',
            'The deletion of Region__c is blocked until all child Store__c records are manually deleted.',
            'The Lookup field on related Store__c records is cleared to null, while Store__c and Employee__c records remain untouched in the database.',
            'Store__c is deleted, causing all related Employee__c records to be cascade deleted.'
        ],
        correctAnswer: 2,
        explanation: 'Because Store__c has a Lookup relationship to Region__c, the default behavior upon deleting the parent Region__c is simply to clear the value of the lookup field on child Store__c records (`Clear the value of this field`). The Store__c and Employee__c records are not deleted unless Cascade Delete is explicitly enabled for custom lookup relationships via Salesforce Customer Support.'
    },

    // =========================================================================================
    // DOMAIN 2: DATA MODELING AND MANAGEMENT (~13% Weighting)
    // =========================================================================================
    {
        id: 201,
        domain: 'Data Modeling & Management',
        weight: '13%',
        difficulty: 'Medium',
        type: 'single',
        question: 'A developer needs to create a Many-to-Many relationship between two custom objects: Project__c and Consultant__c. How must this data model be configured?',
        options: [
            'Create two Lookup fields on Project__c pointing to Consultant__c.',
            'Create a custom junction object Project_Consultant__c containing exactly two Master-Detail relationship fields pointing to Project__c and Consultant__c respectively.',
            'Enable the "Many-to-Many" checkbox on the Schema Builder settings for Project__c.',
            'Create a Master-Detail relationship on Consultant__c pointing to Project__c, and check "Allow Reparenting".'
        ],
        correctAnswer: 1,
        explanation: 'Salesforce does not have a native direct Many-to-Many field type. To establish a Many-to-Many relationship, you must create an intermediate custom object (known as a Junction Object) that contains two separate Master-Detail relationship fields—one for each parent object being linked.'
    },
    {
        id: 202,
        domain: 'Data Modeling & Management',
        weight: '13%',
        difficulty: 'Hard',
        type: 'single',
        question: 'A developer writes the following SOQL query to retrieve Accounts:\n\nList<Account> accs = [SELECT Id, Name, (SELECT LastName FROM Contacts WHERE DoNotCall = true) FROM Account WHERE CreatedDate = TODAY];\n\nWhich statement accurately describes the Schema relationship and return behavior of this query?',
        options: [
            'The query will throw a runtime syntax error because inner subqueries cannot include a WHERE clause.',
            'This is a Child-to-Parent query that returns one Account record per matching Contact.',
            'This is a Parent-to-Child relationship query. If an Account matches the outer WHERE clause but has NO Contacts with DoNotCall = true, the Account is still returned with an empty Contacts list.',
            'If an Account has zero matching Contacts, the entire Account record is excluded from the returned List<Account>.'
        ],
        correctAnswer: 2,
        explanation: 'In a Parent-to-Child SOQL subquery, the outer query evaluates the Account object first (`CreatedDate = TODAY`). If the Account matches the outer criteria, it is returned in the list regardless of whether the inner subquery returns 0, 1, or 100 child contacts. If no child records match the inner WHERE clause, `acc.Contacts` simply returns an empty list (`size() == 0`).'
    },
    {
        id: 203,
        domain: 'Data Modeling & Management',
        weight: '13%',
        difficulty: 'Medium',
        type: 'single',
        question: 'Which data loading tool or technique is strictly required if a developer needs to Hard Delete 150,000 obsolete Account records directly from the command line without sending them to the Salesforce Recycle Bin?',
        options: [
            'Data Import Wizard using the "Delete" option.',
            'Salesforce Data Loader CLI (`process-conf.xml`) configured with the Bulk API and `hardDelete` operation enabled.',
            'Execute Anonymous Apex running `Database.emptyRecycleBin([SELECT Id FROM Account WHERE...])` in a loop.',
            'Schema Builder Bulk Purge tool.'
        ],
        correctAnswer: 1,
        explanation: 'Data Import Wizard does not support Delete operations (and caps at 50,000 records). Hard Deleting records directly from the database without routing to the Recycle Bin requires using the Bulk API via Salesforce Data Loader (or Data Loader CLI) with the "Use Bulk API" and "Enable Hard Delete" settings active and User Profile "Bulk API Hard Delete" permission granted.'
    },
    {
        id: 204,
        domain: 'Data Modeling & Management',
        weight: '13%',
        difficulty: 'Easy',
        type: 'single',
        question: 'In Apex, how can a developer dynamically check if the currently logged-in user has permission to update the custom field Salary__c on the Employee__c object?',
        options: [
            'if (Schema.sObjectType.Employee__c.fields.Salary__c.isUpdateable()) { ... }',
            'if (UserInfo.hasFieldPermission(\'Employee__c.Salary__c\', \'Edit\')) { ... }',
            'if (Employee__c.Salary__c.getDescribe().isEditable()) { ... }',
            'if (Schema.DescribeSObjectResult.Employee__c.Salary__c.canUpdate()) { ... }'
        ],
        correctAnswer: 0,
        explanation: 'The standard Schema reflection method to verify if the current user has Field-Level Security (FLS) update permissions on a specific sObject field is calling `Schema.sObjectType.ObjectName.fields.FieldName.isUpdateable()` (or calling `.getDescribe().isUpdateable()` on the sObjectField token).'
    },

    // =========================================================================================
    // DOMAIN 3: PROCESS AUTOMATION AND APEX LOGIC (~38% Weighting - LARGEST SECTION!)
    // =========================================================================================
    {
        id: 301,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Medium',
        type: 'single',
        question: 'Consider the following Apex trigger on Contact:\n\ntrigger ContactTrigger on Contact (before update) {\n    for (Contact c : Trigger.new) {\n        Account parent = [SELECT Id, Rating FROM Account WHERE Id = :c.AccountId LIMIT 1];\n        if (parent.Rating == \'Hot\') {\n            c.Priority__c = \'High\';\n        }\n    }\n}\n\nWhat governor limit error will this code throw when a user performs a bulk update of 150 Contacts via Data Loader?',
        options: [
            'System.LimitException: Too many DML statements: 151',
            'System.LimitException: Too many SOQL queries: 101',
            'System.LimitException: Apex CPU time limit exceeded',
            'System.NullPointerException: Attempt to de-reference a null object'
        ],
        correctAnswer: 1,
        explanation: 'Placing a SOQL query inside a `for` loop (`Account parent = [SELECT...]`) violates the core bulkification rule of Salesforce. When 150 Contacts enter the trigger in a single chunk, the loop attempts to execute 150 separate SOQL queries. Because the synchronous transaction governor limit is 100 queries, the transaction crashes on the 101st iteration with `Too many SOQL queries: 101`.'
    },
    {
        id: 302,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Hard',
        type: 'single',
        question: 'A developer needs to write a `before update` trigger on Account to compare the new value of the AnnualRevenue field against its previous value before the update occurred. Which trigger context variable must be used to retrieve the previous revenue value?',
        options: [
            'Trigger.newMap.get(acc.Id).AnnualRevenue',
            'Trigger.oldMap.get(acc.Id).AnnualRevenue',
            'Trigger.priorValue(acc.AnnualRevenue)',
            'Trigger.old[0].AnnualRevenue'
        ],
        correctAnswer: 1,
        explanation: 'To retrieve the exact prior state of a specific sObject during a trigger execution (`before update` / `after update`), you use `Trigger.oldMap`, which is a `Map<Id, sObject>` where the key is the record `Id` and the value is the old version of the record (`Trigger.oldMap.get(acc.Id)`). `PRIORVALUE` is a formula/validation rule function, not valid Apex syntax.'
    },
    {
        id: 303,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Hard',
        type: 'single',
        question: 'According to the official Salesforce Order of Execution (V-T-V-A-W-P-E), what happens immediately AFTER all `before` triggers execute for a record update?',
        options: [
            'After Triggers execute (`after update`).',
            'Workflow Rules and immediate field updates are executed.',
            'Custom Validation Rules, Duplicate Rules, and System Validations step 2 execute.',
            'The record is permanently committed to the database with all Savepoints locked.'
        ],
        correctAnswer: 2,
        explanation: 'The sequence after initial System Validations is: `before` Triggers -> System Validations step 2 & Custom Validation Rules -> Duplicate Rules -> Save to Database (without permanent commit yet) -> `after` Triggers -> Assignment Rules -> Auto-Response Rules -> Workflow Rules -> Process/Flows -> DML Commit.'
    },
    {
        id: 304,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Medium',
        type: 'single',
        question: 'Which of the following statements about `@future` methods in Apex is strictly TRUE?',
        options: [
            'Future methods can return either void or a primitive data type such as String or Boolean.',
            'Future methods must be static and can only accept primitive data types, collections of primitive types (`List<Id>`), or arrays of primitive types as arguments.',
            'A future method can directly accept `List<Account>` or `Map<Id, Contact>` as parameters.',
            'If an `@future` method exceeds CPU time limits, it can catch `System.LimitException` and retry automatically.'
        ],
        correctAnswer: 1,
        explanation: 'Future methods (`@future`) MUST return `void` and MUST be `static`. Furthermore, because they are queued asynchronously by the platform, parameters must be primitives (`String`, `Integer`), arrays of primitives, or collections of primitives (`List<Id>`, `Set<String>`). They cannot accept sObjects (`List<Account>`) because sObject record data might change between when the method is called and when it actually executes from the queue.'
    },
    {
        id: 305,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Medium',
        type: 'single',
        question: 'When implementing the `Database.Batchable<sObject>` interface to process 100,000 records, which optional interface must also be implemented if the developer needs to maintain a running integer counter (`recordsProcessed`) across every `execute()` chunk from start to finish?',
        options: [
            'Database.AllowsCallouts',
            'Database.Stateful',
            'Database.Persistable',
            'System.Serializable'
        ],
        correctAnswer: 1,
        explanation: 'By default, every `execute(bc, scope)` chunk in Batch Apex runs in its own isolated transaction with a fresh copy of the class instance variables. To retain the state of instance variables (`Integer recordsProcessed = 0`) across multiple execute batches until the `finish()` method runs, the class must implement `Database.Stateful`.'
    },
    {
        id: 306,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Hard',
        type: 'single',
        question: 'A developer executes the following Apex snippet:\n\nList<Account> accs = new List<Account>{\n    new Account(Name = \'Good Account\', AnnualRevenue = 50000),\n    new Account() // Missing Name field!\n};\nDatabase.SaveResult[] results = Database.insert(accs, false);\n\nWhat is the exact outcome of this code execution?',
        options: [
            'A System.DmlException is thrown immediately on line 5, and neither Account is saved to the database.',
            'The entire transaction rolls back silently because one record has a validation error.',
            'The first Account ("Good Account") is successfully inserted into the database, while the second invalid Account is skipped and returns an error inside the `results` array.',
            'Both Accounts are inserted into the database, but the second Account is given a default auto-generated Name.'
        ],
        correctAnswer: 2,
        explanation: 'When calling `Database.insert(records, allOrNone)`, passing `false` for the second parameter (`allOrNone = false`) enables partial processing. Instead of throwing a fatal `DmlException` and rolling back the entire list when an invalid record is encountered, the platform inserts all valid records ("Good Account") and records the specific field validation errors inside the corresponding `Database.SaveResult` instance.'
    },
    {
        id: 307,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Medium',
        type: 'single',
        question: 'A developer needs to write a dynamic SOQL query where the object name and filtering criteria are passed as string parameters from a user interface. What is the mandatory best practice to prevent SOQL injection vulnerabilities?',
        options: [
            'Use the `String.escapeSingleQuotes(userInput)` method on any dynamic string parameter before concatenating it into the query string.',
            'Wrap the `Database.query()` call inside a `System.runAs()` block.',
            'Encrypt the query parameter using `Crypto.generateAesKey(128)`.',
            'Use `Schema.DescribeSObjectResult` to validate that the string length is under 255 characters.'
        ],
        correctAnswer: 0,
        explanation: 'Whenever constructing dynamic SOQL query strings with user-supplied input (`String query = \'SELECT Id FROM Account WHERE Name = \\\'\' + userInput + \'\\\'\'`), you must ALWAYS pass the input through `String.escapeSingleQuotes(userInput)` to escape any single quotation marks (`\'`) and prevent attackers from breaking out of the literal string to inject malicious SOQL clauses (`\' OR Active__c = \'Yes`).'
    },
    {
        id: 308,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Hard',
        type: 'single',
        question: 'Which of the following collections correctly maps an Account Id directly to its corresponding Account sObject using a single line of Apex without writing an explicit `for` loop?',
        options: [
            'Map<Id, Account> accMap = [SELECT Id, Name FROM Account LIMIT 50];',
            'Map<Id, Account> accMap = new Map<Id, Account>([SELECT Id, Name FROM Account LIMIT 50]);',
            'Map<Id, Account> accMap = (Map<Id, Account>)Database.query(\'SELECT Id, Name FROM Account\');',
            'Map<Id, Account> accMap = new Map<Id, Account>().putAll([SELECT Id, Name FROM Account]);'
        ],
        correctAnswer: 1,
        explanation: 'Apex provides a specialized `Map<Id, sObject>` constructor (`new Map<Id, Account>(listOfAccountsOrSoqlQuery)`). When passed a `List<Account>` or an inline SOQL query, the map automatically populates with each record\'s `Id` as the key and the entire `Account` sObject as the value!'
    },

    // =========================================================================================
    // DOMAIN 4: USER INTERFACE - LWC, AURA, AND VISUALFORCE (~25% Weighting)
    // =========================================================================================
    {
        id: 401,
        domain: 'User Interface (LWC & Aura)',
        weight: '25%',
        difficulty: 'Medium',
        type: 'single',
        question: 'In Lightning Web Components (LWC), which decorator must a developer use on a JavaScript property (`recordId`) so that a parent component or Lightning Record Page builder can dynamically inject a value into it?',
        options: [
            '@track recordId;',
            '@wire recordId;',
            '@api recordId;',
            '@public recordId;'
        ],
        correctAnswer: 2,
        explanation: 'The `@api` decorator in LWC marks a property or method as public. When applied to `recordId` (`@api recordId;`), it exposes the property to parent components (`<c-child record-id="001..."></c-child>`) and allows Lightning Experience App Builder containers (such as Record Pages) to automatically inject the current record ID.'
    },
    {
        id: 402,
        domain: 'User Interface (LWC & Aura)',
        weight: '25%',
        difficulty: 'Hard',
        type: 'single',
        question: 'A developer creates an LWC with a wire adapter (`@wire(getAccounts) accounts;`) where `getAccounts` is an Apex controller method. What mandatory annotation and property MUST be present on the `getAccounts` Apex method definition for the LWC `@wire` adapter to function without errors?',
        options: [
            '@AuraEnabled(wireable=true) public static List<Account> getAccounts()',
            '@AuraEnabled(cacheable=true) public static List<Account> getAccounts()',
            '@RemoteAction(cache=true) global static List<Account> getAccounts()',
            '@InvocableMethod(label=\'Get Accounts\') public static List<Account> getAccounts()'
        ],
        correctAnswer: 1,
        explanation: 'To use an Apex method with the LWC `@wire` adapter (`@wire(myApexMethod)`), the Apex method MUST be `static` and MUST be annotated with `@AuraEnabled(cacheable=true)`. Setting `cacheable=true` enables Lightning Data Service (LDS) client-side caching. Remember: `cacheable=true` methods are strictly read-only and cannot perform DML!'
    },
    {
        id: 403,
        domain: 'User Interface (LWC & Aura)',
        weight: '25%',
        difficulty: 'Medium',
        type: 'single',
        question: 'Which LWC lifecycle hook method is invoked exactly ONCE when the component is inserted into the Document Object Model (DOM), making it the ideal location to initialize variables or subscribe to Lightning Message Service channels?',
        options: [
            'constructor()',
            'renderedCallback()',
            'connectedCallback()',
            'init()'
        ],
        correctAnswer: 2,
        explanation: '`connectedCallback()` fires when the component is inserted into the DOM. `constructor()` fires when the JavaScript class is instantiated (before DOM insertion, so child elements don\'t exist yet). `renderedCallback()` fires after every render or re-render of the component template.'
    },
    {
        id: 404,
        domain: 'User Interface (LWC & Aura)',
        weight: '25%',
        difficulty: 'Hard',
        type: 'single',
        question: 'In LWC, how should a child component send data upwards to communicate an event (such as a button click passing a selected record ID) to its parent component?',
        options: [
            'Directly mutate a property on `this.parent.recordId`.',
            'Dispatch a standard CustomEvent containing the payload in the `detail` property (`this.dispatchEvent(new CustomEvent(\'select\', { detail: this.recordId }))`).',
            'Call `@salesforce/apex/ParentController.sendEvent()`.',
            'Set the parent component\'s `@api` method using `document.getElementById()`. '
        ],
        correctAnswer: 1,
        explanation: 'LWC follows standard DOM event communication patterns: events bubble UP, properties pass DOWN. To send data from a child component up to a parent, the child dispatches a `CustomEvent` (`this.dispatchEvent(new CustomEvent(\'myev\', { detail: data }))`), and the parent listens for it in HTML via `onmyev={handleEv}`.'
    },
    {
        id: 405,
        domain: 'User Interface (LWC & Aura)',
        weight: '25%',
        difficulty: 'Easy',
        type: 'single',
        question: 'Under what specific circumstance should a developer choose to build a legacy Visualforce page (`<apex:page>`) instead of a modern Lightning Web Component (LWC)?',
        options: [
            'When creating a responsive mobile dashboard for the Salesforce Mobile App.',
            'When generating a pixel-perfect, printable PDF document formatted directly from Salesforce record data (`renderAs="pdf"`).',
            'When embedding a real-time reactive chart inside the Lightning Service Console.',
            'When querying more than 10,000 records from the database.'
        ],
        correctAnswer: 1,
        explanation: 'While LWC is the standard for all interactive web UI inside Lightning Experience, Visualforce remains the primary natively supported technology for generating downloadable server-rendered PDF documents by setting the `<apex:page renderAs="pdf">` attribute.'
    },

    // =========================================================================================
    // DOMAIN 5: TESTING, DEBUGGING, AND DEPLOYMENT (~17% Weighting)
    // =========================================================================================
    {
        id: 501,
        domain: 'Testing, Debugging & Deployment',
        weight: '17%',
        difficulty: 'Medium',
        type: 'single',
        question: 'Why is calling `Test.startTest()` and `Test.stopTest()` considered a mandatory best practice inside an `@isTest` unit test method that executes DML operations or asynchronous jobs?',
        options: [
            'It permanently increases the SOQL query limit from 100 to 500 for the entire test method.',
            'It resets governor limits (`startTest()`) specifically for the code being tested, and forces any asynchronous jobs (`@future`, `Queueable`, `Batchable`) to complete synchronously when `stopTest()` is called.',
            'It allows the test method to query live production data by bypassing `SeeAllData=false`.',
            'It prevents custom validation rules and before triggers from executing during test data setup.'
        ],
        correctAnswer: 1,
        explanation: 'When `Test.startTest()` is called, Salesforce creates a fresh set of governor limits so that any limits consumed while building setup data (`insert 200 accounts`) don\'t count against the actual method being tested. Furthermore, when `Test.stopTest()` is called, all asynchronous processes (`@future`, `Queueable`, `Batchable`) triggered inside the block are forced to execute immediately and synchronously so you can assert their outcomes right below `stopTest()`!'
    },
    {
        id: 502,
        domain: 'Testing, Debugging & Deployment',
        weight: '17%',
        difficulty: 'Hard',
        type: 'single',
        question: 'A developer needs to write a unit test for an Apex class that makes an HTTP REST callout (`Http.send()`) to an external payment gateway. What will happen if the developer executes the unit test without implementing `HttpCalloutMock`?',
        options: [
            'The test will successfully call the external live server and assert against the real response.',
            'The test will fail immediately with a `System.CalloutException: Methods defined as TestMethod do not support Web service callouts`.',
            'The test will pass, but the callout response will automatically return `null`.',
            'The test will hang for 120 seconds and then time out.'
        ],
        correctAnswer: 1,
        explanation: 'Salesforce strictly blocks real network callouts (`HTTP` or `WebService`) to external third-party servers during unit tests (`@isTest`) to prevent test execution from depending on external network availability or modifying live third-party databases. If your code makes a callout during a test without setting a mock via `Test.setMock(HttpCalloutMock.class, mockInstance)`, the test throws a fatal `System.CalloutException`.'
    },
    {
        id: 503,
        domain: 'Testing, Debugging & Deployment',
        weight: '17%',
        difficulty: 'Easy',
        type: 'single',
        question: 'What is the minimum overall org-wide Apex code coverage percentage required by Salesforce before custom Apex code (`.cls` and `.trigger`) can be deployed to a Production environment?',
        options: [
            '50% overall code coverage, with no individual class under 10%.',
            '75% overall code coverage, and every unit test method must execute without failures.',
            '85% overall code coverage.',
            '100% code coverage on all triggers, and 75% on classes.'
        ],
        correctAnswer: 1,
        explanation: 'Salesforce requires at least **75% overall code coverage** across all custom Apex code in the org (plus 100% of unit test executions must pass without errors) before any deployment to a Production environment can succeed.'
    },
    {
        id: 504,
        domain: 'Testing, Debugging & Deployment',
        weight: '17%',
        difficulty: 'Medium',
        type: 'single',
        question: 'What is the primary advantage of using the `@TestSetup` method inside an Apex test class (`@isTest`)?',
        options: [
            'It allows unit tests to execute 10 times faster by skipping all system validation rules.',
            'It creates common test records exactly ONCE before any individual test methods run, and automatically rolls back any modifications made by a test method so subsequent tests see clean setup data.',
            'It gives the test class access to real Production records via `SeeAllData=true`.',
            'It allows test methods to execute across multiple separate user sessions simultaneously.'
        ],
        correctAnswer: 1,
        explanation: 'Methods annotated with `@TestSetup` execute once per test class before any test method starts. Records created inside `@TestSetup` are shared by all test methods in the class. If `testMethod1()` deletes or updates a setup Account, Salesforce automatically rolls back those modifications at the end of `testMethod1()` so `testMethod2()` starts with the exact original setup state!'
    },
    {
        id: 505,
        domain: 'Testing, Debugging & Deployment',
        weight: '17%',
        difficulty: 'Hard',
        type: 'single',
        question: 'A developer needs to delete a custom field `Old_Status__c` and an obsolete Apex class `LegacyCalculator.cls` from a Production org using Salesforce CLI (`sf project deploy start`). Which manifest file must be included in the deployment package to remove these metadata components?',
        options: [
            'package.xml with `<delete>true</delete>` specified inside the types tag.',
            'destructiveChanges.xml alongside a standard `package.xml` manifest.',
            'removeManifest.json',
            '.forceignore with the exact file path listed.'
        ],
        correctAnswer: 1,
        explanation: 'Standard `package.xml` manifests can only create or update metadata. To delete components (such as custom fields, Apex classes, or validation rules) from a target org during deployment, you must include a `destructiveChanges.xml` (or `destructiveChangesPre.xml` / `destructiveChangesPost.xml`) manifest listing the components alongside an empty or valid `package.xml`.'
    },

    // =========================================================================================
    // ADDITIONAL EXPANDED QUESTION BANK (ADDITIONS FOR DEEP MASTERY)
    // =========================================================================================
    {
        id: 105,
        domain: 'Salesforce Fundamentals',
        weight: '7%',
        difficulty: 'Medium',
        type: 'single',
        question: 'A company needs to integrate Salesforce with an external ERP system every night at midnight to synchronize 500,000 inventory records using complex custom authentication headers. Why should the developer choose a programmatic Apex solution over declarative Flow automation?',
        options: [
            'Declarative Flows cannot run on a nightly scheduled cron trigger.',
            'Flows are strictly prohibited from performing any DML or record creation operations after midnight.',
            'Processing 500,000 records across network boundaries exceeds declarative governor limits and requires Batch Apex combined with custom HTTP callout handling (`Database.Batchable` and `Database.AllowsCallouts`).',
            'Flows cannot update custom object fields if they are queried from an external database.'
        ],
        correctAnswer: 2,
        explanation: 'While Schedule-Triggered Flows can run on a schedule, processing 500,000 records and making external REST API callouts requiring custom cryptographic authentication headers will rapidly hit Flow governor limits (CPU time, interview limits, and callout restrictions). Programmatic Batch Apex (`Database.Batchable<sObject>`) with `Database.AllowsCallouts` is specifically engineered to handle high-volume data processing and complex HTTP integrations.'
    },
    {
        id: 106,
        domain: 'Salesforce Fundamentals',
        weight: '7%',
        difficulty: 'Easy',
        type: 'single',
        question: 'In the Salesforce Model-View-Controller (MVC) architectural pattern, what does an `sObject` (such as `Account` or `Contact`) directly represent?',
        options: [
            'The View layer rendering HTML components to the browser.',
            'The Controller layer processing user events and routing business logic.',
            'The Model layer representing the underlying database schema and record data structure.',
            'The Network layer managing REST and SOAP API web service endpoints.'
        ],
        correctAnswer: 2,
        explanation: 'In Salesforce MVC architecture, the Model represents the underlying database structure and data stored within objects (`sObjects`). The View represents the visual UI (Lightning Web Components, Aura, Visualforce). The Controller represents the business logic (Apex classes, LWC JavaScript controllers, Flows).'
    },
    {
        id: 107,
        domain: 'Salesforce Fundamentals',
        weight: '7%',
        difficulty: 'Hard',
        type: 'single',
        question: 'A developer declares a static class variable `public static Integer callCount = 0;` inside a utility Apex class. If three different users execute separate synchronous transactions that invoke this class at the same time, what is the behavior of the `callCount` variable?',
        options: [
            'All three users share the exact same `callCount` value across their transactions because static variables persist globally across the multi-tenant server.',
            'Each user runs in their own isolated execution context and receives a fresh `callCount = 0` initialized for their individual transaction.',
            'The variable throws a `System.LimitException` because static variables cannot be modified concurrently.',
            'The static variable is cached in the database until the org goes through a nightly maintenance reset.'
        ],
        correctAnswer: 1,
        explanation: 'In Apex, `static` class variables are strictly scoped to the duration of a SINGLE execution transaction (`Transaction-scoped`). They are not global across multiple concurrent user transactions or server threads. Every individual request starts with a clean, freshly initialized static variable state.'
    },
    {
        id: 108,
        domain: 'Salesforce Fundamentals',
        weight: '7%',
        difficulty: 'Hard',
        type: 'single',
        question: 'Under which of the following conditions is a custom Formula field (`Calculated_Score__c`) PREVENTED from being indexed for efficient filtering in a SOQL `WHERE` clause?',
        options: [
            'When the formula references a standard picklist field on the same object (`TEXT(Status__c)`).',
            'When the formula evaluates a simple mathematical expression (`Quantity__c * Unit_Price__c`).',
            'When the formula references dynamic date functions (`TODAY()` or `NOW()`), encrypted fields, or cross-object fields (`Parent.Status__c`).',
            'When the formula returns a Checkbox (`Boolean`) data type.'
        ],
        correctAnswer: 2,
        explanation: 'Formula fields cannot be indexed if their underlying value changes nondeterministically or across external boundaries without triggering a direct DML update on the row. Specifically, formulas using `TODAY()`, `NOW()`, `Owner.Id`, cross-object relationships (`Parent.Field__c`), or encrypted fields cannot be indexed by the database engine.'
    },
    {
        id: 205,
        domain: 'Data Modeling & Management',
        weight: '13%',
        difficulty: 'Medium',
        type: 'single',
        question: 'A developer needs to create a Master-Detail relationship on `Invoice_Line_Item__c` pointing to `Invoice__c`. If the developer checks the "Allow Reparenting" setting on the relationship definition, what exact capability is granted to users?',
        options: [
            'Users can change the Master `Invoice__c` parent of an existing `Invoice_Line_Item__c` record after it has been created and saved.',
            'Users can convert the Master-Detail relationship into a standard Lookup relationship at any time.',
            'Child records can exist in the database with a `null` Master parent lookup field.',
            'Deleting the child record automatically deletes the parent Master record.'
        ],
        correctAnswer: 0,
        explanation: 'By default, once a Master-Detail record (`Invoice_Line_Item__c`) is created and assigned to a parent (`Invoice__c`), the parent lookup cannot be changed (`locked`). Enabling "Allow Reparenting" permits users with Edit access on the child record to re-assign (`reparent`) the child to a different parent Master record.'
    },
    {
        id: 206,
        domain: 'Data Modeling & Management',
        weight: '13%',
        difficulty: 'Hard',
        type: 'single',
        question: 'Object `Skill__c` and object `Consultant__c` are linked in a Many-to-Many relationship via a custom junction object `Consultant_Skill__c`. If a user deletes a `Skill__c` record from the database, what occurs regarding the junction records and the related `Consultant__c` records?',
        options: [
            'The `Consultant_Skill__c` junction records pointing to that Skill are cascade deleted immediately, while the `Consultant__c` parent records remain completely untouched.',
            'Both the junction records and the related `Consultant__c` parent records are cascade deleted.',
            'The deletion of `Skill__c` is blocked until all child `Consultant_Skill__c` records are manually deleted first.',
            'The lookup field on `Consultant_Skill__c` is set to null, preserving the junction record.'
        ],
        correctAnswer: 0,
        explanation: 'In a junction object (`Consultant_Skill__c`) with two Master-Detail relationships pointing to two separate Master parents (`Skill__c` and `Consultant__c`), deleting either one of the Master records automatically triggers a Cascade Delete on the intermediate junction records (`Consultant_Skill__c`). The other independent Master (`Consultant__c`) remains untouched.'
    },
    {
        id: 207,
        domain: 'Data Modeling & Management',
        weight: '13%',
        difficulty: 'Medium',
        type: 'single',
        question: 'A developer needs to import 25,000 external Account records using an external identifier (`ERP_Account_ID__c`). Which DML statement or Database method should the developer use in Apex or Data Loader to insert new accounts while simultaneously updating existing matching accounts without throwing duplicate errors?',
        options: [
            'Database.insert(accountsList, false);',
            'upsert accountsList ERP_Account_ID__c;',
            'update accountsList ERP_Account_ID__c;',
            'Database.merge(accountsList);'
        ],
        correctAnswer: 1,
        explanation: 'The `upsert` DML statement (`upsert sObjectList ExternalIdField__c;` or `Database.upsert(list, fieldToken, allOrNone)`) compares the values of the specified custom External ID field (or standard `Id` field). If a match is found in the database, the record is updated (`Update`); if no match is found, a new record is created (`Insert`).'
    },
    {
        id: 208,
        domain: 'Data Modeling & Management',
        weight: '13%',
        difficulty: 'Easy',
        type: 'multi',
        question: 'Which TWO of the following Salesforce schema components CANNOT be created directly using the Schema Builder drag-and-drop tool? (Choose 2)',
        options: [
            'Custom Objects (`CustomObject__c`)',
            'Page Layouts and Section allocations',
            'Lookup and Master-Detail Relationships',
            'Validation Rules and Workflow Rules'
        ],
        correctAnswers: [1, 3],
        explanation: 'Schema Builder is an excellent visual data modeling tool for creating Custom Objects, Custom Fields, and Relationships (Lookup/Master-Detail). However, it CANNOT create Page Layouts, Record Types, Validation Rules, Triggers, or Process Automation tools.'
    },
    {
        id: 209,
        domain: 'Data Modeling & Management',
        weight: '13%',
        difficulty: 'Hard',
        type: 'single',
        question: 'What is the precise behavioral difference between declaring an Apex class `public with sharing class AccountService` versus `public inherited sharing class AccountService`?',
        options: [
            '`with sharing` enforces Field-Level Security (FLS) on all queries, whereas `inherited sharing` only enforces record-level Organization-Wide Defaults (OWD).',
            '`inherited sharing` executes with the sharing rules (`with sharing` or `without sharing`) of the calling class that invoked it, whereas `with sharing` strictly forces sharing enforcement regardless of the caller.',
            '`inherited sharing` is mandatory for all Batch Apex classes, while `with sharing` is mandatory for Triggers.',
            '`inherited sharing` allows the class to bypass all governor limits if called by a System Administrator.'
        ],
        correctAnswer: 1,
        explanation: 'If a class is marked `inherited sharing`, it dynamically adopts the sharing mode (`with sharing` or `without sharing`) of the class that called it. If an `inherited sharing` class is the top-level entry point (e.g., invoked via REST, LWC, or Visualforce), it defaults to `with sharing`. This is the recommended security best practice for utility and service classes.'
    },
    {
        id: 309,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Hard',
        type: 'single',
        question: 'Consider the following scenario: An `after update` trigger on `Account` updates a related `Contact` record. The `after update` trigger on `Contact` then updates a field back on the parent `Account` record. What will happen if the developer does not implement recursion protection (`static Boolean isExecuting`)?',
        options: [
            'The updates loop back and forth until the transaction hits `System.LimitException: Maximum trigger depth exceeded` (typically at depth 16) and rolls back completely.',
            'Salesforce automatically detects the cross-object loop after 2 iterations and gracefully commits the changes.',
            'The database throws a `System.QueryException: Lock violation` error.',
            'The `after update` trigger on Account simply skips the second invocation silently.'
        ],
        correctAnswer: 0,
        explanation: 'Salesforce allows triggers to recursively invoke up to a maximum depth of 16 execution cycles. If cross-object DML (`Account -> Contact -> Account -> Contact...`) creates an infinite recursion loop without a static boolean or `Set<Id>` check inside a `TriggerHandler` to halt re-processing, the transaction crashes with `Maximum trigger depth exceeded`.'
    },
    {
        id: 310,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Hard',
        type: 'single',
        question: 'A developer executes the following SOQL query using aggregate functions:\n\nAggregateResult[] results = [SELECT Industry, COUNT(Id) totalAccs FROM Account GROUP BY Industry HAVING COUNT(Id) > 10];\n\nHow must the developer extract the calculated `totalAccs` count inside a `for` loop in Apex?',
        options: [
            'Integer count = results[i].totalAccs;',
            'Integer count = (Integer)ar.get(\'totalAccs\');',
            'Integer count = ar.getCount(\'Id\');',
            'Integer count = (Integer)ar.fields.totalAccs;'
        ],
        correctAnswer: 1,
        explanation: 'Aggregate SOQL queries (`GROUP BY`) return a list of `AggregateResult` objects (`List<AggregateResult>`). Because `AggregateResult` acts as a dynamic key-value map, you extract values using the `.get(\'aliasName\')` method (`(Integer)ar.get(\'totalAccs\')` or `ar.get(\'expr0\')` if no field alias was specified).'
    },
    {
        id: 311,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Medium',
        type: 'single',
        question: 'Which of the following syntax patterns correctly binds an Apex variable (`targetStatus`) directly into an inline SOQL query?',
        options: [
            'List<Account> accs = [SELECT Id FROM Account WHERE Active__c = {targetStatus}];',
            'List<Account> accs = [SELECT Id FROM Account WHERE Active__c = :targetStatus];',
            'List<Account> accs = [SELECT Id FROM Account WHERE Active__c = \' + targetStatus + \'];',
            'List<Account> accs = [SELECT Id FROM Account WHERE Active__c = $targetStatus];'
        ],
        correctAnswer: 1,
        explanation: 'To bind local Apex variables, collections (`Set<Id>`), or method parameters directly into static inline SOQL statements, you must prefix the variable name with a colon (`:`), such as `WHERE Active__c = :targetStatus` or `WHERE Id IN :accountIds`.'
    },
    {
        id: 312,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Hard',
        type: 'single',
        question: 'A developer needs to insert a parent `Account` and 5 child `Opportunity` records across multiple DML statements. If any of the `Opportunity` records fail insertion, the developer wants the parent `Account` insertion to be rolled back as well. How should this be structured in Apex?',
        options: [
            'Use `Database.insert(opportunities, true)` after inserting the Account.',
            'Declare a Savepoint (`Savepoint sp = Database.setSavepoint();`) before inserting Account, wrap the insertions in a `try-catch` block, and call `Database.rollback(sp);` inside the `catch` block if an exception occurs.',
            'Annotate the Apex method with `@Transaction(rollback=true)`.',
            'Call `System.resetDatabaseState()` in the `catch` block.'
        ],
        correctAnswer: 1,
        explanation: 'To maintain transactional consistency across multiple separate DML statements (`insert account; ... insert opps;`), you establish a database checkpoint using `Savepoint sp = Database.setSavepoint();`. If any subsequent DML operation throws an exception, calling `Database.rollback(sp);` inside the `catch` block reverts all database changes back to the exact state at the savepoint.'
    },
    {
        id: 313,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Medium',
        type: 'multi',
        question: 'Which TWO of the following capabilities are supported by **Queueable Apex** (`implements Queueable`) but are NOT supported by simple `@future` methods? (Choose 2)',
        options: [
            'Accepting sObject records (`List<Account>`) and custom class objects as constructor arguments.',
            'Executing web service callouts to external REST APIs.',
            'Chaining jobs by enqueuing a child Queueable job (`System.enqueueJob()`) directly from the `execute()` method.',
            'Running up to 10,000 queries per transaction without governor limits.'
        ],
        correctAnswers: [0, 2],
        explanation: 'Both `@future(callout=true)` and `Queueable` support callouts and share the same async governor limits (`200 SOQL queries`, `60s CPU time`). However, `@future` methods can ONLY accept primitive types (`List<Id>`, `String`) and CANNOT chain (`no async inside future`). Queueable Apex allows passing full `sObject` lists (`List<Account>`) to the constructor and allows enqueuing exactly one child Queueable job from inside `execute()` to build complex job chains!'
    },
    {
        id: 314,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Easy',
        type: 'single',
        question: 'In SOSL (Salesforce Object Search Language), what is the return data type when executing a query such as: `FIND \'Acme*\' IN ALL FIELDS RETURNING Account(Id, Name), Contact(Id, Email)`?',
        options: [
            'List<sObject>',
            'Map<String, List<sObject>>',
            'List<List<sObject>> (A list of lists of sObjects, where each inner list corresponds to an object defined in the RETURNING clause)',
            'Database.SearchResult[]'
        ],
        correctAnswer: 2,
        explanation: 'SOSL queries search across multiple distinct sObjects simultaneously. Therefore, the return type is always `List<List<sObject>>`. In this example, `results[0]` is a `List<Account>` matching the search, and `results[1]` is a `List<Contact>` matching the search.'
    },
    {
        id: 406,
        domain: 'User Interface (LWC & Aura)',
        weight: '25%',
        difficulty: 'Hard',
        type: 'single',
        question: 'A developer creates an LWC with a property `@api recordId;` and connects it to an Apex method (`getAccountDetails`) via `@wire`. Which `@wire` syntax ensures that Lightning Data Service automatically re-invokes the Apex method whenever the `recordId` property changes dynamically on the page?',
        options: [
            '@wire(getAccountDetails, { accountId: this.recordId }) details;',
            '@wire(getAccountDetails, { accountId: \'$recordId\' }) details;',
            '@wire(getAccountDetails, { accountId: \'recordId\' }) details;',
            '@wire(getAccountDetails, { accountId: \'@recordId\' }) details;'
        ],
        correctAnswer: 1,
        explanation: 'In LWC wire adapters, prefixing a parameter value with a dollar sign (`\'$recordId\'`) marks it as **reactive**. If `recordId` changes dynamically (for example, navigating to a new record or receiving data from parent), the wire adapter automatically detects the change and re-fetches data from the `@AuraEnabled(cacheable=true)` Apex controller!'
    },
    {
        id: 407,
        domain: 'User Interface (LWC & Aura)',
        weight: '25%',
        difficulty: 'Medium',
        type: 'single',
        question: 'Two completely unrelated Lightning Web Components (`ComponentA` and `ComponentB`) are placed in separate regions of a Lightning Utility Bar and share no parent-child DOM relationship. What is the standard framework technology to enable bidirectional communication between these two components?',
        options: [
            'Dispatching a bubbling DOM `CustomEvent` (`this.dispatchEvent(...)`).',
            'Lightning Message Service (LMS) using `@salesforce/messageChannel` (`publish` and `subscribe`).',
            'Setting global JavaScript `window.sharedData` variables.',
            'Executing `@AuraEnabled` static variables across the components.'
        ],
        correctAnswer: 1,
        explanation: '`CustomEvent` communication in LWC is strictly scoped to parent-child DOM relationships (events bubble up through the DOM tree). For unrelated components across the page, sibling components, or communication across LWC, Aura, and Visualforce boundaries, Salesforce provides **Lightning Message Service (LMS)** using Message Channels (`@salesforce/messageChannel/ChannelName__c`).'
    },
    {
        id: 408,
        domain: 'User Interface (LWC & Aura)',
        weight: '25%',
        difficulty: 'Medium',
        type: 'single',
        question: 'When writing an imperative `@AuraEnabled` Apex method called from an LWC JavaScript controller (`handleSave`), what must the Apex method throw if validation fails so that the LWC JavaScript `.catch(error)` block receives a clean, user-friendly error message?',
        options: [
            'throw new System.Exception(\'Invalid input\');',
            'throw new AuraHandledException(\'Invalid input\');',
            'throw new LwcHandledException(\'Invalid input\');',
            'ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.ERROR, \'Invalid input\'));'
        ],
        correctAnswer: 1,
        explanation: 'Any standard server-side `Exception` (`DmlException`, `NullPointerException`) is obfuscated by the platform for security reasons and returned to LWC as a generic `An internal server error has occurred` message. To return clear, custom, readable error messages (`error.body.message`) to LWC or Aura clients, the Apex controller must wrap or throw an **`AuraHandledException`**.'
    },
    {
        id: 506,
        domain: 'Testing, Debugging & Deployment',
        weight: '17%',
        difficulty: 'Easy',
        type: 'single',
        question: 'A developer has written a complex utility method inside a production class that is declared `private static Boolean validateCreditScore(Integer score)` to encapsulate logic from external classes. How can an `@isTest` unit test method invoke and verify this `private` method directly without changing its public visibility?',
        options: [
            'Change `private` to `global` during unit test execution.',
            'Annotate the private method definition with `@TestVisible` (`@TestVisible private static Boolean validateCreditScore(Integer score)`).',
            'Use `Test.invokePrivateMethod(\'validateCreditScore\', score);`.',
            'Private methods cannot be tested; only public methods can achieve test coverage.'
        ],
        correctAnswer: 1,
        explanation: 'The `@TestVisible` annotation in Apex allows test methods (`@isTest`) to directly access and execute `private` or `protected` variables, inner classes, and methods of another class. This allows thorough unit testing of internal helper functions while maintaining strict encapsulation from standard production code.'
    },
    {
        id: 507,
        domain: 'Testing, Debugging & Deployment',
        weight: '17%',
        difficulty: 'Hard',
        type: 'single',
        question: 'A developer writes the following unit test snippet using `System.runAs()`:\n\nUser testUser = [SELECT Id FROM User WHERE Profile.Name = \'Standard User\' LIMIT 1];\nSystem.runAs(testUser) {\n    List<Account> accs = [SELECT Id FROM Account];\n}\n\nWhich of the following restrictions is enforced inside the `System.runAs(testUser)` block during test execution?',
        options: [
            'The block strictly enforces the testUser\'s Profile permissions, Role hierarchy access, and `with sharing` record sharing rules.',
            'The block enforces both the user permissions AND limits the number of SOQL queries to 20 if the user has a restricted license.',
            'The block allows testing external callouts without needing `HttpCalloutMock`.',
            'The block prevents any trigger execution on `Account` inside the block.'
        ],
        correctAnswer: 0,
        explanation: '`System.runAs(userRecord)` executes code within the exact user security context of the specified User. It is essential for testing **Record Sharing (`with sharing`)**, **Organization-Wide Defaults (OWD)**, **Role hierarchy visibility**, and **User Profile/Permission Set access**. However, `runAs` does NOT enforce user license limits or alter standard governor limits (`100 SOQL / 150 DML`).'
    },
    {
        id: 508,
        domain: 'Testing, Debugging & Deployment',
        weight: '17%',
        difficulty: 'Medium',
        type: 'single',
        question: 'How do **Checkpoints** set inside the Salesforce Developer Console differ from traditional breakpoints in standard local IDE debugging tools (like Eclipse or Visual Studio for C++/Java)?',
        options: [
            'Salesforce checkpoints pause server execution and freeze the user session until the developer clicks "Continue".',
            'Salesforce checkpoints do NOT pause or freeze live execution; instead, when execution passes the line, the platform captures a comprehensive snapshot of memory, local variables, and sObject states for post-execution inspection.',
            'Checkpoints automatically increase the CPU time limit from 10,000 ms to 60,000 ms.',
            'Checkpoints can only be placed inside triggers, not standard Apex classes.'
        ],
        correctAnswer: 1,
        explanation: 'Because Salesforce operates on multi-tenant cloud servers handling concurrent requests from millions of users globally, you cannot "freeze" server execution with traditional live breakpoints. Checkpoints act as diagnostic probes: when execution crosses a checkpoint line, it records a deep snapshot (`Heap Dump`, local variables, collections) that you inspect in the Checkpoint tab after the transaction completes.'
    },
    {
        id: 109,
        domain: 'Salesforce Fundamentals',
        weight: '7%',
        difficulty: 'Medium',
        type: 'single',
        question: 'Which of the following synchronous vs. asynchronous CPU timeout limits is enforced by Salesforce Governor Limits during a single execution transaction?',
        options: [
            'Synchronous: 5,000 ms (5s) | Asynchronous: 30,000 ms (30s)',
            'Synchronous: 10,000 ms (10s) | Asynchronous: 60,000 ms (60s)',
            'Synchronous: 60,000 ms (60s) | Asynchronous: 120,000 ms (120s)',
            'Synchronous: 1,000 ms (1s) | Asynchronous: 10,000 ms (10s)'
        ],
        correctAnswer: 1,
        explanation: 'The maximum CPU time allowed for synchronous transactions (e.g., standard UI button clicks, immediate trigger execution) is 10,000 milliseconds (10 seconds). For asynchronous executions (`@future`, `Queueable`, `Batchable`), the CPU time limit is expanded to 60,000 milliseconds (60 seconds).'
    },
    {
        id: 211,
        domain: 'Data Modeling & Management',
        weight: '13%',
        difficulty: 'Hard',
        type: 'single',
        question: 'A user is granted Read access to custom object `Project__c`, but has NO Read access to custom object `Consultant__c`. Both objects serve as Master parents to the junction object `Project_Assignment__c`. What access does the user have when querying `Project_Assignment__c` records via SOQL or UI?',
        options: [
            'The user can read all `Project_Assignment__c` records where `Project__c` is populated, but the `Consultant__c` lookup field displays as blank.',
            'The user is strictly blocked from viewing or querying any `Project_Assignment__c` records (`No Access`).',
            'The user can view the junction records because Read access to only one Master parent is sufficient.',
            'The user can view junction records only if they own the record.'
        ],
        correctAnswer: 1,
        explanation: 'In a Master-Detail junction object relationship (`Project_Assignment__c`), security and sharing are inherited from **BOTH** Master parent records. To read or query a junction record, a user must have Read access to BOTH Master records (`Project__c` and `Consultant__c`). Lacking access to either parent results in zero visibility (`No Access`).'
    },
    {
        id: 212,
        domain: 'Data Modeling & Management',
        weight: '13%',
        difficulty: 'Medium',
        type: 'multi',
        question: 'Which TWO custom field data types can be designated as an **External ID** on an sObject to enable `upsert` operations matching external systems? (Choose 2)',
        options: [
            'Text (`Text`) and Number (`Number`)',
            'Email (`Email`) and Auto Number (`Auto Number`)',
            'Master-Detail and Lookup Relationships',
            'Date (`Date`) and Checkbox (`Checkbox`)'
        ],
        correctAnswers: [0, 1],
        explanation: 'An External ID field acts as a unique identifier from an external system (`ERP_ID__c`). Only four specific custom field types can be marked as an External ID: **Text**, **Number**, **Email**, and **Auto Number**. Relationships, Dates, and Checkboxes cannot be External IDs.'
    },
    {
        id: 315,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Hard',
        type: 'single',
        question: 'During a record update, a Workflow Rule (or Process Builder) executes a field update on the record. According to the exact Salesforce Order of Execution (`V-T-V-A-W-P-E`), what happens directly as a result of that field update?',
        options: [
            'The transaction immediately commits to the database without running any more code.',
            '`before update` and `after update` Apex triggers fire exactly ONE more time on the record, but custom validation rules and duplicate rules are NOT run again.',
            'All validation rules, duplicate checks, before triggers, and assignment rules run a second full time.',
            'Only `before update` triggers run a second time (`after update` triggers are skipped).'
        ],
        correctAnswer: 1,
        explanation: 'If a workflow rule or immediate field update modifies a field on the record during step 9 of the Order of Execution, Salesforce fires `before update` and `after update` triggers ONE more time to allow code to react to the workflow change. Crucially, custom validation rules (`Step 3`) and duplicate rules (`Step 4`) are NOT executed during this second re-trigger cycle!'
    },
    {
        id: 316,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Medium',
        type: 'single',
        question: 'Consider the following `try-catch-finally` block in Apex:\n\ntry {\n    Account a = new Account(); // Missing Name\n    insert a;\n    return \'Inserted\';\n} catch (DmlException e) {\n    return \'DML Error\';\n} finally {\n    System.debug(\'Finally Executed\');\n}\n\nWhen this method is called, does the `finally` block execute before the method returns `\'DML Error\'`?',
        options: [
            'No, because the `return` statement inside the `catch` block terminates method execution immediately.',
            'Yes, code inside the `finally` block is guaranteed to execute regardless of whether an exception occurs or a `return` statement is encountered in the `try` or `catch` blocks.',
            'Only if the `catch` block re-throws the exception using `throw e;`.',
            'No, `finally` only executes if no exceptions occur during the `try` block.'
        ],
        correctAnswer: 1,
        explanation: 'In Apex exception handling, the `finally` block is guaranteed to execute before the method exits, regardless of whether the `try` block succeeded, an exception was caught inside `catch`, or an explicit `return` statement was reached. It is the designated location for releasing resources or closing stream connections.'
    },
    {
        id: 317,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Hard',
        type: 'single',
        question: 'Can a developer invoke a Batch Apex job (`Database.executeBatch(myBatch)`) from inside an asynchronous `@future` method or a `Queueable` job execution?',
        options: [
            'No, because Salesforce strictly prohibits any asynchronous job from enqueuing another asynchronous job (`No async in async`).',
            'Yes! You can invoke `Database.executeBatch()` from inside an `@future` method or a `Queueable` job.',
            'Only if the Batch Apex class implements `Database.AllowsCallouts`.',
            'No, Batch Apex can only be launched from synchronous UI clicks or `Schedulable` cron triggers.'
        ],
        correctAnswer: 1,
        explanation: 'While you cannot call an `@future` method from another `@future` or `Batchable` method, you CAN invoke `Database.executeBatch()` from within an `@future` method or a `Queueable` job! This is a standard architectural pattern when an async process needs to trigger a massive data cleanup upon completion.'
    },
    {
        id: 318,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Medium',
        type: 'single',
        question: 'In SOQL relationship queries, what is the maximum number of relationship levels you can traverse UPWARD using dot notation (`Child.Parent.Parent.Name`), and what is the maximum number of relationship levels you can traverse DOWNWARD using subqueries in the `SELECT` clause?',
        options: [
            'Upward: 5 levels | Downward: 1 level (`(SELECT Id FROM Contacts)`)',
            'Upward: 10 levels | Downward: 5 levels',
            'Upward: 3 levels | Downward: 3 levels',
            'Upward: Unlimited | Downward: 2 levels'
        ],
        correctAnswer: 0,
        explanation: 'In a single SOQL query, you can traverse up to **5 levels upward** in a parent relationship using dot notation (`Contact.Account.Parent.Parent.Parent.Name`). For child subqueries (`SELECT Id, (SELECT Id FROM Contacts) FROM Account`), you can traverse exactly **1 level downward** (subqueries cannot contain nested inner subqueries).'
    },
    {
        id: 319,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Easy',
        type: 'single',
        question: 'When creating a custom exception class in Apex (`public class MyBusinessRuleException extends Exception {}`), what strict naming requirement does the Salesforce compiler enforce?',
        options: [
            'The class name must start with `Custom` (`CustomMyBusinessRule`).',
            'The class name must end with the exact word `Exception` (`...Exception`).',
            'The class must implement the `Database.Error` interface.',
            'The class must be annotated with `@CustomException`.'
        ],
        correctAnswer: 1,
        explanation: 'In Apex, whenever you define a custom exception class by extending the built-in `Exception` class, the name of your custom class MUST end with the word `Exception` (`class InvalidInvoiceException extends Exception {}`). If the name does not end with `Exception`, the compiler throws a syntax error.'
    },
    {
        id: 409,
        domain: 'User Interface (LWC & Aura)',
        weight: '25%',
        difficulty: 'Medium',
        type: 'single',
        question: 'In Lightning Web Components (LWC), how can a developer style the outer wrapper element (`<c-my-card>`) directly from within the component\'s own `myCard.css` file?',
        options: [
            'Using the `:host` CSS pseudo-class selector (`:host { display: block; border: 1px solid red; }`).',
            'Using `c-my-card { ... }` inside the stylesheet.',
            'Using `this.template.querySelector(\'root\').style = ...;`.',
            'Outer wrapper elements cannot be styled via CSS due to Shadow DOM encapsulation.'
        ],
        correctAnswer: 0,
        explanation: 'Because LWC enforces Shadow DOM style encapsulation, normal CSS selectors inside `myCard.css` only apply to internal elements inside `<template>`. To style the component\'s own outer host element (`<c-my-card>`), you use the standard **`:host`** or **`:host(.active)`** CSS pseudo-class selector.'
    },
    {
        id: 410,
        domain: 'User Interface (LWC & Aura)',
        weight: '25%',
        difficulty: 'Hard',
        type: 'single',
        question: 'A developer uses `@wire(getAccounts)` in an LWC to display a list of accounts. When the user clicks a button, an imperative Apex method (`updateAccount`) updates the account names in the database. Why does the `@wire` account list NOT update automatically after the imperative update completes, and how must the developer refresh the UI?',
        options: [
            'Wired data is cached client-side by Lightning Data Service (LDS). To update the wired view after an imperative DML operation, the developer must call `refreshApex(this.wiredAccountResult)` imported from `@salesforce/apex`.',
            'The developer must call `location.reload()` to refresh the entire browser window.',
            'The developer must set `@wire(getAccounts, { refresh: true })`.',
            'Imperative DML cannot be used alongside `@wire` in the same LWC component.'
        ],
        correctAnswer: 0,
        explanation: 'Because `@wire` adapters connected to `@AuraEnabled(cacheable=true)` methods store results in the client-side Lightning Data Service (LDS) cache, modifying data via an imperative Apex call does not automatically bust the LDS cache. To refresh the UI without reloading the page, you import `refreshApex` from `@salesforce/apex` and pass the entire wired result object (`refreshApex(this.wiredResult)`).'
    },
    {
        id: 509,
        domain: 'Testing, Debugging & Deployment',
        weight: '17%',
        difficulty: 'Easy',
        type: 'single',
        question: 'Which type of Salesforce distribution package allows the target subscriber org\'s System Administrator or developer to view, edit, and debug the underlying Apex source code directly inside the target org?',
        options: [
            'Managed Package (`Managed - Released`)',
            'Unmanaged Package',
            'Managed Beta Package',
            'AppExchange Protected Package'
        ],
        correctAnswer: 1,
        explanation: '**Unmanaged Packages** distribute open-source customizations where all Apex code, triggers, and page layouts are completely visible and editable inside the subscriber org upon installation. Conversely, **Managed Packages** obfuscate and IP-protect all Apex source code so subscribers cannot view or modify the underlying code.'
    },
    {
        id: 510,
        domain: 'Testing, Debugging & Deployment',
        weight: '17%',
        difficulty: 'Medium',
        type: 'single',
        question: 'A development team needs a sandbox environment to perform formal User Acceptance Testing (UAT) with real-world relationship data. They configure a **Partial Copy Sandbox**. What is the maximum data storage limit and refresh interval for this sandbox type?',
        options: [
            'Storage: 200 MB | Refresh Interval: 1 Day',
            'Storage: 5 GB | Refresh Interval: 5 Days',
            'Storage: 10 GB | Refresh Interval: 15 Days',
            'Storage: Same as Production | Refresh Interval: 29 Days'
        ],
        correctAnswer: 1,
        explanation: 'A **Partial Copy Sandbox** copies 100% of org metadata plus a sample of real data records defined by a Sandbox Template up to **5 GB** of storage. It can be refreshed once every **5 days**. (Developer = 200 MB / 1 day; Developer Pro = 1 GB / 1 day; Full Sandbox = Same as Prod / 29 days).'
    },
    {
        id: 110,
        domain: 'Salesforce Fundamentals',
        weight: '7%',
        difficulty: 'Hard',
        type: 'single',
        question: 'A company receives inbound emails from partners containing complex XML email attachments that need to be parsed to create custom `Inventory_Order__c` and `Line_Item__c` records automatically. Which solution is required?',
        options: [
            'Configure standard declarative Email-to-Case and write a workflow rule to parse the XML.',
            'Create an Apex class implementing `Messaging.InboundEmailHandler` and configure an Inbound Email Service under Setup.',
            'Build a Screen Flow with an Email Input component.',
            'Use standard Data Import Wizard with an email trigger.'
        ],
        correctAnswer: 1,
        explanation: 'Standard Email-to-Case can only create Case records and cannot parse complex XML attachments or create multi-object hierarchies (`Inventory_Order__c` + `Line_Item__c`). To intercept inbound emails programmatically, parse binary/text attachments, and perform custom DML, you must create an Apex class implementing `Messaging.InboundEmailHandler` (`handleInboundEmail(email, envelope)`) bound to an Inbound Email Service.'
    },
    {
        id: 213,
        domain: 'Data Modeling & Management',
        weight: '13%',
        difficulty: 'Medium',
        type: 'single',
        question: 'An `Account` parent record has a Rollup Summary field `Total_Active_Opportunities__c` summarizing child `Opportunity` records in a Master-Detail relationship. If a user deletes one of the child `Opportunity` records (`soft delete` sent to Recycle Bin), what happens to the parent `Account` rollup summary field?',
        options: [
            'The rollup summary field immediately recalculates (`decreases by 1`) and triggers `before update` / `after update` triggers on the parent `Account`.',
            'The rollup summary field retains the old count until the record is permanently hard-deleted from the Recycle Bin.',
            'The parent `Account` throws a validation error locking the deletion.',
            'The rollup summary field only updates during nightly batch processing.'
        ],
        correctAnswer: 0,
        explanation: 'When a child detail record in a Master-Detail relationship is created, updated, soft-deleted (`delete`), or undeleted (`undelete`), the parent Master record\'s Rollup Summary fields immediately recalculate in real time! Furthermore, because the parent record is modified during step 13 of the Order of Execution, the parent object\'s `before update` and `after update` triggers execute automatically.'
    },
    {
        id: 321,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Hard',
        type: 'single',
        question: 'A developer executes `undelete myAccountsList;` on a list of Account records currently stored in the Recycle Bin. Which trigger context variables are available and populated inside the `after undelete` trigger on Account?',
        options: [
            '`Trigger.new` and `Trigger.oldMap`',
            '`Trigger.new` and `Trigger.newMap` (both read-only)',
            '`Trigger.old` and `Trigger.oldMap`',
            '`Trigger.new` (editable) and `Trigger.newMap`'
        ],
        correctAnswer: 1,
        explanation: 'In an `after undelete` trigger, the restored records are already saved back into the active database. Therefore, `Trigger.new` (`List<sObject>`) and `Trigger.newMap` (`Map<Id, sObject>`) are both populated and read-only. `Trigger.old` and `Trigger.oldMap` are null because there is no prior active version of the record immediately preceding the undelete.'
    },
    {
        id: 322,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Medium',
        type: 'single',
        question: 'A developer needs to write a SOQL query to find all Contacts whose `AccountId` is contained within a `Set<Id> accountIds` collection. Which SOQL `WHERE` clause syntax is correct and bulkified?',
        options: [
            'WHERE AccountId = :accountIds',
            'WHERE AccountId IN :accountIds',
            'WHERE AccountId IN {accountIds}',
            'WHERE AccountId LIKE :accountIds'
        ],
        correctAnswer: 1,
        explanation: 'When filtering against a collection of primitive values (`Set<Id>`, `List<String>`) in SOQL, you must use the **`IN`** operator combined with the variable bind syntax (`:`), such as `WHERE AccountId IN :accountIds`. Using `=` against a collection or omitting the colon causes a query compile error.'
    },
    {
        id: 411,
        domain: 'User Interface (LWC & Aura)',
        weight: '25%',
        difficulty: 'Hard',
        type: 'single',
        question: 'A developer declares an object property in LWC JavaScript: `userConfig = { theme: \'dark\', fontSize: 14 };`. Later, an event handler mutates a nested property directly: `this.userConfig.theme = \'light\';`. Why might the LWC template fail to re-render in older framework components or when nested reactivity is required, and what is the best practice fix?',
        options: [
            'Assign a completely new object reference (`this.userConfig = { ...this.userConfig, theme: \'light\' };`) or decorate the original property with `@track userConfig = { ... };`.',
            'Call `this.forceUpdate()` inside the event handler.',
            'Decorate the property with `@wire` instead of `@track`.',
            'Invoke `document.querySelector().innerHTML` manually.'
        ],
        correctAnswer: 0,
        explanation: 'While primitive properties (`String`, `Number`, `Boolean`) assigned directly (`this.title = \'New\'`) trigger automatic re-renders without `@track`, mutating internal properties of a complex Object or Array (`this.obj.prop = \'val\'`) without changing the object\'s memory reference does not trigger reactivity unless the object is decorated with **`@track`** or you assign a new object clone (`this.obj = { ...this.obj, prop: \'val\' };`).'
    },
    {
        id: 511,
        domain: 'Testing, Debugging & Deployment',
        weight: '17%',
        difficulty: 'Easy',
        type: 'single',
        question: 'Why does Salesforce recommend using the modern **`Assert`** class (`Assert.areEqual(expected, actual, \'message\')`) inside new `@isTest` unit tests instead of the legacy **`System.assertEquals(expected, actual)`** methods?',
        options: [
            'The `Assert` class runs 50% faster by skipping stack trace recording.',
            'The `Assert` class provides clearer, more readable method names (`areEqual`, `isTrue`, `isNotNull`, `fail`) and better standardized assertion failure messaging across all Salesforce SDKs.',
            'Legacy `System.assertEquals` throws fatal compile errors in API version 60.0.',
            '`Assert.areEqual()` allows testing private methods without `@TestVisible`.'
        ],
        correctAnswer: 1,
        explanation: 'Introduced in Winter \'23 (API v56+), the dedicated **`Assert` namespace (`Assert.areEqual`, `Assert.isTrue`, `Assert.isNotNull`, `Assert.fail`)** replaces legacy `System.assert` methods to improve test code readability, self-documenting intent, and standardized diagnostic output during test execution failures.'
    }
];
console.log(QUESTION_BANK.length);
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { QUESTION_BANK };
}
