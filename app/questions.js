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
    },
    // =========================================================================================
    // EXAM DUMP QUESTIONS (EXTRACTED FROM PDFS)
    // =========================================================================================
    {
        id: 412,
        domain: 'User Interface (LWC & Aura)',
        weight: '25%',
        difficulty: 'Medium',
        type: 'multi',
        question: 'Which three resources in an Aura component bundle can contain JavaScript functions? (Choose 3)',
        options: [
            'Renderer',
            'Design',
            'Controller',
            'Style',
            'Helper'
        ],
        correctAnswers: [0, 2, 4],
        explanation: 'In an Aura component bundle, JavaScript is utilized in the **Controller** (handles UI events), the **Helper** (reusable logic shared across the component), and the **Renderer** (overriding default rendering behaviors). `Design` is XML for Lightning App Builder configuration, and `Style` contains CSS.'
    },
    {
        id: 512,
        domain: 'Testing, Debugging & Deployment',
        weight: '17%',
        difficulty: 'Easy',
        type: 'single',
        question: 'A developer needs to create a baseline set of data (Accounts, Contacts, Products, Assets) for an entire suite of Apex tests allowing them to test isolated requirements for various types of Salesforce cases. Which approach can efficiently generate the required data for each unit test?',
        options: [
            'Create test data before `Test.startTest()` in the unit test.',
            'Create a mock using the `HttpCalloutMock` interface.',
            'Add `@isTest(SeeAllData=true)` at the start of the unit test class.',
            'Use `@TestSetup` with a void method.'
        ],
        correctAnswer: 3,
        explanation: 'The `@TestSetup` annotation allows you to create test records once and make them available to every test method in the test class. This drastically reduces execution time and efficiently centralizes your baseline test data generation compared to creating data individually inside every test method.'
    },
    {
        id: 323,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Hard',
        type: 'single',
        question: 'Flow Builder uses an Apex action to provide additional information about multiple Contacts, stored in a custom class, `ContactInfo`. Which is the correct definition of the Apex method that gets the additional information?',
        options: [
            '`@InvocableMethod(label=\'Additional Info\') public static ContactInfo getInfo(Id contactId)`',
            '`@InvocableMethod(label=\'Additional Info\') public static List<ContactInfo> getInfo(List<Id> contactIds)`',
            '`@InvocableMethod(label=\'Additional Info\') public List<ContactInfo> getInfo(List<Id> contactIds)`',
            '`@InvocableMethod(label=\'Additional Info\') public static List<ContactInfo> getInfo(Id contactId)`'
        ],
        correctAnswer: 1,
        explanation: 'To expose an Apex method to Flow Builder as an Apex Action, it must be annotated with `@InvocableMethod` and it MUST be `public static` (or `global static`). Furthermore, because Flows operate in bulk context, the method MUST take a `List` of primitives, sObjects, or custom classes as its single input parameter, and return a `List` of primitives, sObjects, or custom classes.'
    },
    {
        id: 324,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Medium',
        type: 'multi',
        question: 'Management asked for opportunities to be automatically created for accounts with annual revenue greater than $1,000,000. A developer created a trigger that loops through `Trigger.new`, executes a SOQL query inside the loop to check for existing opportunities, and runs `insert oppty;` inside the loop. Which two actions should the developer take to fix the code segment?',
        options: [
            'Query for existing opportunities outside the `for` loop.',
            'Check if all the required fields for Opportunity are being added on creation.',
            'Move the DML (`insert`) that saves opportunities outside the `for` loop.',
            'Use `Database.query` to query the opportunities.'
        ],
        correctAnswers: [0, 2],
        explanation: 'Placing SOQL queries or DML statements (`insert`, `update`, `delete`) inside a `for` loop is a critical anti-pattern in Salesforce that violates Governor Limits (`100 SOQL queries`, `150 DML statements`). To fix this, you must **bulkify** the trigger by querying data outside the loop into a `Map` or `List`, and moving the DML statement outside the loop to insert a `List<Opportunity>` collection all at once.'
    },
    {
        id: 214,
        domain: 'Data Modeling & Management',
        weight: '13%',
        difficulty: 'Easy',
        type: 'single',
        question: 'A developer needs to create a Roll-up Summary field on a custom object `Job_Application__c` that calculates the maximum `Expected_Salary__c` from all related `Candidate__c` records. What schema configuration is absolutely required before this field can be created?',
        options: [
            '`Candidate__c` must have a Lookup relationship field pointing to `Job_Application__c`.',
            '`Job_Application__c` must be on the detail side of a Master-Detail relationship.',
            '`Candidate__c` must have a Master-Detail relationship field pointing to `Job_Application__c`.',
            'A junction object must exist between the two custom objects.'
        ],
        correctAnswer: 2,
        explanation: 'Roll-up Summary fields can only be created on the **Master** (parent) object in a Master-Detail relationship. Therefore, the child object (`Candidate__c`) must contain a Master-Detail relationship field pointing upward to the parent (`Job_Application__c`).'
    },
    {
        id: 325,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Hard',
        type: 'multi',
        question: 'Which TWO of the following automation actions will cause an object\'s `before update` and `after update` triggers to execute a second time during the exact same transaction? (Choose 2)',
        options: [
            'A Workflow Rule executing a Field Update.',
            'A Process Builder or Record-Triggered Flow updating a field on the same record.',
            'An Escalation Rule firing.',
            'A Validation Rule failing.'
        ],
        correctAnswers: [0, 1],
        explanation: 'According to the Salesforce Order of Execution (`V-T-V-A-W-P-E`), if a Workflow Rule or Flow Field Update modifies the record in the middle of the transaction (Step 9/10), the platform will automatically cycle back and fire the `before update` and `after update` triggers exactly ONE more time to allow custom code to respond to the declarative change.'
    },
    {
        id: 413,
        domain: 'User Interface (LWC & Aura)',
        weight: '25%',
        difficulty: 'Medium',
        type: 'single',
        question: 'What is the primary architectural benefit of utilizing Lightning Data Service (LDS) via standard components like `<lightning-record-view-form>` or `@wire(getRecord)` in LWC?',
        options: [
            'LDS allows developers to write complex SOSL search queries without Apex.',
            'LDS automatically implements field-level security (FLS) and shares a centralized client-side cache, meaning if one component updates a record, all other components viewing that record update instantly without server trips.',
            'LDS bypasses all sharing rules allowing guest users to edit records.',
            'LDS provides a way to upload massive 50MB files directly to attachments.'
        ],
        correctAnswer: 1,
        explanation: 'Lightning Data Service (LDS) acts as the client-side data cache for Salesforce UI. If multiple components on a page use LDS to view `Account A`, LDS fetches the data once from the server. If one component updates `Account A`, LDS updates its cache and instantly pushes the new data to all other components listening to `Account A`, ensuring data consistency and reducing server load.'
    },
    {
        id: 513,
        domain: 'Testing, Debugging & Deployment',
        weight: '17%',
        difficulty: 'Hard',
        type: 'single',
        question: 'A developer has built a custom Apex REST API service (`@RestResource(urlMapping=\'/AccountService/*\')`) with an `@HttpPost` method to accept external payloads. How should the developer structure the unit test to properly simulate the incoming HTTP request?',
        options: [
            'Implement the `HttpCalloutMock` interface and use `Test.setMock()`.',
            'Instantiate a `RestRequest` and `RestResponse` object in the test, set their properties (`req.requestURI`, `req.requestBody`), and assign them to the global `RestContext` variables.',
            'Use `System.runAs()` to execute the test as an Integration User.',
            'Create a mock JSON file and upload it to Static Resources.'
        ],
        correctAnswer: 1,
        explanation: 'When testing an Apex REST endpoint that you are hosting, you do not use `HttpCalloutMock` (which is only for outbound callouts). Instead, you directly instantiate `RestRequest req = new RestRequest();`, populate its body/URI, and assign it to `RestContext.request = req;`. Then, you simply call your `@HttpPost` method directly from the test.'
    },
    {
        id: 326,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Medium',
        type: 'single',
        question: 'A developer is writing an optimization script to find all `Account` records that do NOT have any related `Contact` records in the system. What is the most efficient SOQL query syntax to achieve this using a Left Anti-Join?',
        options: [
            'SELECT Id FROM Account WHERE Contacts = null',
            'SELECT Id FROM Account WHERE Id NOT IN (SELECT AccountId FROM Contact)',
            'SELECT Id, (SELECT Id FROM Contacts) FROM Account WHERE Contacts.size() == 0',
            'SELECT Id FROM Account LEFT JOIN Contact ON Contact.AccountId = null'
        ],
        correctAnswer: 1,
        explanation: 'The most efficient way to query records that do NOT have related children is to use a SOQL Left Anti-Join subquery in the WHERE clause: `WHERE Id NOT IN (SELECT AccountId FROM ChildObject)`. SOQL does not support standard SQL `LEFT JOIN` syntax, and you cannot filter on `Contacts.size()` directly in SOQL.'
    },
    {
        id: 327,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Easy',
        type: 'single',
        question: 'Which Apex class contains methods to return the amount of resources that have been used for a particular governor limit, such as the number of DML statements?',
        options: [
            'OrgLimits',
            'Limits',
            'Messaging',
            'Exception'
        ],
        correctAnswer: 1,
        explanation: 'The `Limits` class contains methods (like `Limits.getDMLStatements()` and `Limits.getLimitDMLStatements()`) that return the exact amount of resources used so far and the maximum limit available for the current synchronous or asynchronous transaction.'
    },
    {
        id: 414,
        domain: 'User Interface (LWC & Aura)',
        weight: '25%',
        difficulty: 'Medium',
        type: 'single',
        question: 'A developer is tasked with building a custom Lightning Web Component to collect Contact information. There are strict security requirements that only certain fields should be edited and viewed by certain groups of users. What should the developer use in their LWC to automatically respect these security requirements?',
        options: [
            '<aura:input-field>',
            'force-input-field',
            '<ui:input-field>',
            '<lightning-input-field>'
        ],
        correctAnswer: 3,
        explanation: 'When used inside a `<lightning-record-edit-form>`, the `<lightning-input-field>` component automatically enforces Field-Level Security (FLS) and Object CRUD permissions for the current user without requiring custom Apex to check `Schema.DescribeFieldResult` permissions.'
    },
    {
        id: 215,
        domain: 'Data Modeling & Management',
        weight: '13%',
        difficulty: 'Easy',
        type: 'single',
        question: 'Universal Containers has an external order system that uses a custom Order Number to uniquely identify an order for customers and service agents. Order records will be regularly imported and updated in Salesforce. How should the Order Number field be defined in Salesforce?',
        options: [
            'Indirect Lookup',
            'Direct Lookup',
            'External ID and Unique',
            'Lookup'
        ],
        correctAnswer: 2,
        explanation: 'To safely map external system IDs during imports and allow for `upsert` operations via Data Loader or integrations, the field should be marked as an `External ID`. Marking it as `Unique` prevents duplicate records during synchronization.'
    },
    {
        id: 415,
        domain: 'User Interface (LWC & Aura)',
        weight: '25%',
        difficulty: 'Easy',
        type: 'single',
        question: 'Which code snippet correctly displays the contents of a Visualforce page as a PDF document?',
        options: [
            '<apex:page renderAs="application/pdf">',
            '<apex:page renderAs="pdf">',
            '<apex:page contentType="application/pdf">',
            '<apex:page contentType="pdf">'
        ],
        correctAnswer: 1,
        explanation: 'The `renderAs` attribute on the `<apex:page>` tag can be set to `"pdf"` to instantly instruct Salesforce to convert the Visualforce page rendering engine into a PDF generator.'
    },
    {
        id: 514,
        domain: 'Testing, Debugging & Deployment',
        weight: '17%',
        difficulty: 'Easy',
        type: 'single',
        question: 'When using Salesforce DX for source-driven development, what does an administrator need to enable in the production organization to allow developers to create and manage scratch orgs?',
        options: [
            'Environment Hub',
            'Dev Hub',
            'Sandbox',
            'Production'
        ],
        correctAnswer: 1,
        explanation: 'The Dev Hub (Development Hub) must be enabled in your production or business org. It acts as the master control center that tracks and manages all ephemeral scratch orgs created by your development team using the Salesforce CLI.'
    },
    {
        id: 515,
        domain: 'Testing, Debugging & Deployment',
        weight: '17%',
        difficulty: 'Medium',
        type: 'multi',
        question: 'A development team wants to use a script to automatically deploy code to a sandbox during their continuous integration (CI) development cycles. Which two tools can they use to automate this script deployment? (Choose 2)',
        options: [
            'Developer Console',
            'Ant Migration Tool',
            'Salesforce CLI (SFDX)',
            'Change Sets'
        ],
        correctAnswers: [1, 2],
        explanation: 'The Salesforce CLI (SFDX) and the legacy Ant Migration Tool are command-line tools that can be invoked by CI/CD pipelines (like Jenkins or GitHub Actions) to automatically deploy metadata. Developer Console and Change Sets are manual, UI-based tools that cannot be automated via scripts.'
    },
    // =========================================================================================
    // BATCH 2: 15 NEW DUMP QUESTIONS
    // =========================================================================================
    {
        id: 328,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Medium',
        type: 'single',
        question: 'A developer is creating a Lightning Web Component that queries and displays Account records. How can the developer ensure that the SOQL query only returns records the current user has access to see?',
        options: [
            'Use the `with sharing` keyword on the Apex class.',
            'Use the `without sharing` keyword on the Apex class.',
            'Use the `inherited sharing` keyword on the Apex class.',
            'Use the `WITH SECURITY_ENFORCED` clause in the SOQL query.'
        ],
        correctAnswer: 3,
        explanation: 'While `with sharing` enforces record-level sharing rules (which records you see), it does NOT enforce Field-Level Security (FLS) or Object CRUD permissions (which fields/objects you see). The `WITH SECURITY_ENFORCED` clause in a SOQL query ensures that both field and object-level security are respected during the query execution.'
    },
    {
        id: 329,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Medium',
        type: 'single',
        question: 'Which statement is true about the `@future` annotation in Apex?',
        options: [
            'Methods annotated with `@future` can take standard sObjects as arguments.',
            'Methods annotated with `@future` must be declared as `static` and return `void`.',
            'A `@future` method can call another `@future` method directly.',
            '`@future` methods are guaranteed to execute in the order they were called.'
        ],
        correctAnswer: 1,
        explanation: 'Future methods MUST be `static` and return `void`. They CANNOT accept sObjects as arguments (only primitive data types, collections of primitives, or collections of IDs) because the sObject might change in the database between the time the method is enqueued and when it actually executes.'
    },
    {
        id: 516,
        domain: 'Testing, Debugging & Deployment',
        weight: '17%',
        difficulty: 'Easy',
        type: 'single',
        question: 'A developer needs to write a test class to verify a trigger that executes complex logic under a specific user\'s profile. Which Apex method should be used to simulate the execution context of a specific user?',
        options: [
            'System.runAs()',
            'Test.setMock()',
            'System.assertEquals()',
            'Test.startTest()'
        ],
        correctAnswer: 0,
        explanation: '`System.runAs(User u)` allows developers to execute code in the context of a specific user, enabling the testing of record sharing, profile permissions, and role hierarchy logic.'
    },
    {
        id: 416,
        domain: 'User Interface (LWC & Aura)',
        weight: '25%',
        difficulty: 'Easy',
        type: 'single',
        question: 'A developer needs to make a property in a Lightning Web Component available to be set by administrators in the Lightning App Builder. Which decorator should the developer use?',
        options: [
            '@track',
            '@wire',
            '@api',
            '@AuraEnabled'
        ],
        correctAnswer: 2,
        explanation: 'The `@api` decorator exposes a property as public, making it reactive and allowing it to be configured via parent components or the Lightning App Builder when properly defined in the `.js-meta.xml` file.'
    },
    {
        id: 216,
        domain: 'Data Modeling & Management',
        weight: '13%',
        difficulty: 'Medium',
        type: 'single',
        question: 'Universal Containers uses a custom object named `Project__c`. They want to automatically delete all related `Timecard__c` custom object records whenever a `Project__c` is deleted. What relationship type is required to achieve this?',
        options: [
            'Lookup Relationship',
            'Hierarchical Relationship',
            'External Lookup Relationship',
            'Master-Detail Relationship'
        ],
        correctAnswer: 3,
        explanation: 'A Master-Detail relationship tightly couples objects. When the parent (Master) record is deleted, all child (Detail) records are automatically deleted via a cascade delete.'
    },
    {
        id: 330,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Hard',
        type: 'single',
        question: 'A developer wants to process 10,000 Opportunity records sequentially via a batch job and needs to preserve a running total (a counter) across all the `execute()` batches. What must be added to the Batch Apex class?',
        options: [
            'Implement the `Database.AllowsCallouts` interface.',
            'Declare the counter variable with the `static` keyword.',
            'Implement the `Database.Stateful` interface.',
            'Use a Custom Setting to store the counter.'
        ],
        correctAnswer: 2,
        explanation: 'By default, Batch Apex is stateless, meaning instance variables lose their values between `execute()` chunks. Implementing the `Database.Stateful` interface allows instance variables to retain their state across multiple batch executions.'
    },
    {
        id: 417,
        domain: 'User Interface (LWC & Aura)',
        weight: '25%',
        difficulty: 'Medium',
        type: 'single',
        question: 'Which Lightning component feature is used to communicate between two unconnected Lightning Web Components on the same page (e.g., a component in the header and a component in the sidebar)?',
        options: [
            'Custom Events',
            'Application Events',
            'Lightning Message Service (LMS)',
            'Component Events'
        ],
        correctAnswer: 2,
        explanation: 'Lightning Message Service (LMS) is the standard publish-subscribe architecture used to communicate across the DOM between unconnected components (LWC, Aura, and even Visualforce pages).'
    },
    {
        id: 331,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Easy',
        type: 'single',
        question: 'What is the maximum number of SOQL queries allowed within a single synchronous Apex transaction?',
        options: [
            '50',
            '100',
            '150',
            '200'
        ],
        correctAnswer: 1,
        explanation: 'Salesforce enforces a strict synchronous limit of 100 SOQL queries per transaction. (Asynchronous transactions are allowed 200 SOQL queries).'
    },
    {
        id: 517,
        domain: 'Testing, Debugging & Deployment',
        weight: '17%',
        difficulty: 'Medium',
        type: 'single',
        question: 'When deploying code to production, what is the minimum required overall Apex test coverage for the organization?',
        options: [
            '100%',
            '85%',
            '75%',
            '50%'
        ],
        correctAnswer: 2,
        explanation: 'Salesforce requires that at least 75% of your Apex code is covered by unit tests, and all those tests must complete successfully before deploying to production.'
    },
    {
        id: 217,
        domain: 'Data Modeling & Management',
        weight: '13%',
        difficulty: 'Easy',
        type: 'single',
        question: 'Which tool allows a developer or administrator to visually map out, create, and modify objects and relationships in Salesforce without writing code?',
        options: [
            'Data Loader',
            'Schema Builder',
            'Process Builder',
            'Flow Builder'
        ],
        correctAnswer: 1,
        explanation: 'Schema Builder provides a dynamic environment to view the data model and quickly create custom objects, custom fields, and relationships via a drag-and-drop UI.'
    },
    {
        id: 332,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Medium',
        type: 'single',
        question: 'A developer needs to dynamically construct a SOQL query at runtime using variables provided by the user. Which Apex method should they use to execute the dynamically generated string?',
        options: [
            'Database.query()',
            'System.query()',
            'Database.executeBatch()',
            'Database.search()'
        ],
        correctAnswer: 0,
        explanation: '`Database.query()` is used to execute Dynamic SOQL. It takes a string representing the query at runtime and returns a list of sObjects.'
    },
    {
        id: 333,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Hard',
        type: 'single',
        question: 'When an exception is thrown in a try block, what happens if the catch block also throws an exception?',
        options: [
            'The original exception is caught by the system and logged.',
            'The finally block is bypassed.',
            'The finally block executes, and then the new exception halts execution.',
            'The transaction rolls back automatically without executing finally.'
        ],
        correctAnswer: 2,
        explanation: 'In Apex, the `finally` block is guaranteed to execute regardless of whether an exception is thrown in the `try` or `catch` blocks. If the `catch` block throws an exception, the `finally` block runs first, and then the uncaught exception terminates the transaction.'
    },
    {
        id: 418,
        domain: 'User Interface (LWC & Aura)',
        weight: '25%',
        difficulty: 'Easy',
        type: 'single',
        question: 'In a Lightning Web Component, which lifecycle hook is fired immediately after the component is inserted into the Document Object Model (DOM)?',
        options: [
            'constructor()',
            'connectedCallback()',
            'renderedCallback()',
            'disconnectedCallback()'
        ],
        correctAnswer: 1,
        explanation: '`connectedCallback()` fires when a component is inserted into the DOM. It is commonly used to perform initialization tasks like fetching data.'
    },
    {
        id: 518,
        domain: 'Testing, Debugging & Deployment',
        weight: '17%',
        difficulty: 'Medium',
        type: 'single',
        question: 'A developer wants to test a Trigger that prevents Accounts from being deleted if they have active Opportunities. What should the developer use to verify that the Trigger successfully threw an error during testing?',
        options: [
            'Test.isRunningTest()',
            'System.assert(false)',
            'try-catch block wrapping the DML statement',
            'Test.getEventBus()'
        ],
        correctAnswer: 2,
        explanation: 'When testing `addError` logic on a trigger, you must execute the DML (e.g., `delete acc;`) inside a `try-catch` block. The test can then assert that a `DmlException` was caught and verify the exception message.'
    },
    {
        id: 218,
        domain: 'Data Modeling & Management',
        weight: '13%',
        difficulty: 'Medium',
        type: 'single',
        question: 'What is a valid reason why an Administrator would be unable to change a Lookup relationship field to a Master-Detail relationship field?',
        options: [
            'There is existing data in the object that has a null value for the lookup field.',
            'The object already has two Master-Detail relationships.',
            'Both A and B',
            'Master-Detail relationships cannot be created on Standard Objects.'
        ],
        correctAnswer: 2,
        explanation: 'To convert a Lookup to a Master-Detail, all existing records MUST have a value in that lookup field (it cannot be null). Additionally, custom objects are limited to a maximum of 2 Master-Detail relationships.'
    },
    // =========================================================================================
    // BATCH 4: AGENTFORCE & AI DEVELOPER UPDATES
    // =========================================================================================
    {
        id: 601,
        domain: 'Agentforce & AI',
        weight: '38%',
        difficulty: 'Medium',
        type: 'single',
        question: 'A developer wants to expose a custom Apex class as a conversational action for Agentforce (Salesforce\'s AI agent) so that the AI can invoke it to check external inventory. Which annotation must be used on the Apex method?',
        options: [
            '@AuraEnabled',
            '@InvocableMethod',
            '@Future',
            '@AgentAction'
        ],
        correctAnswer: 1,
        explanation: 'Agentforce utilizes standard Salesforce Flow and Action concepts under the hood. To expose custom Apex code as an action to an AI Agent, the method must be annotated with `@InvocableMethod` so it can be registered as a Custom Action within the Agent Builder.'
    },
    {
        id: 602,
        domain: 'Agentforce & AI',
        weight: '17%',
        difficulty: 'Medium',
        type: 'single',
        question: 'When developing and testing Agentforce configurations and custom agent actions using Salesforce DX, what is the best practice for moving these configurations between environments?',
        options: [
            'They cannot be deployed and must be recreated manually in Production.',
            'Deploy them using standard Metadata API types like `Bot` and `PromptTemplate`.',
            'Hardcode the Agent interactions directly within a Lightning Web Component.',
            'Export the Agentforce configurations as a CSV file using Data Loader.'
        ],
        correctAnswer: 1,
        explanation: 'Agentforce configurations, prompts, and actions are fully metadata-driven. They can be version-controlled and deployed across environments using standard Salesforce DX and Metadata API types like `Bot`, `PromptTemplate`, and `Flow`.'
    },
    {
        id: 603,
        domain: 'Agentforce & AI',
        weight: '38%',
        difficulty: 'Hard',
        type: 'single',
        question: 'A developer needs to programmatically execute a Prompt Builder template from within an Apex class to generate an AI summary of an Account. Which class should the developer use to invoke the generative AI prompt?',
        options: [
            'ConnectApi.EinsteinLLM',
            'System.AI',
            'Database.executePrompt()',
            'Agentforce.invoke()'
        ],
        correctAnswer: 0,
        explanation: 'To programmatically invoke Prompt Builder templates or generative AI models from Apex, developers use the `ConnectApi` namespace, specifically methods found within the `ConnectApi.EinsteinLLM` or `ConnectApi.PromptGeneration` classes.'
    },
    {
        id: 701,
        domain: 'Data Modeling & Management',
        weight: '13%',
        difficulty: 'Medium',
        type: 'single',
        question: 'Which type of relationship should be used to link a custom object to the standard User object?',
        options: [
            'Master-Detail relationship',
            'Lookup relationship',
            'Hierarchical relationship',
            'Indirect Lookup relationship'
        ],
        correctAnswer: 1,
        explanation: 'You can only create a Lookup relationship to the standard User object. Master-Detail relationships are not supported where the User object is the Master. A Hierarchical relationship is a special type of Lookup that is only available ON the User object itself (linking a User to another User).'
    },
    {
        id: 702,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Easy',
        type: 'single',
        question: 'What is the correct syntax for declaring a variable that holds a set of Account IDs?',
        options: [
            'Set<Id> accountIds = new Set<Id>();',
            'Set accountIds = new Set<Id>();',
            'List<Id> accountIds = new Set<Id>();',
            'Map<Id> accountIds = new Map<Id>();'
        ],
        correctAnswer: 0,
        explanation: 'To declare a Set collection of primitive Id values, the correct syntax is `Set<Id> collectionName = new Set<Id>();`.'
    },
    {
        id: 703,
        domain: 'User Interface (LWC & Aura)',
        weight: '25%',
        difficulty: 'Medium',
        type: 'multi',
        question: 'Which of the following are valid lifecycle hooks in a Lightning Web Component? (Choose 2)',
        options: [
            'connectedCallback()',
            'onRender()',
            'disconnectedCallback()',
            'init()'
        ],
        correctAnswers: [0, 2],
        explanation: 'The standard LWC lifecycle hooks include constructor(), connectedCallback(), renderedCallback(), disconnectedCallback(), and errorCallback(). init() is used in Aura components, not LWC.'
    },
    // =========================================================================================
    // BATCH 5: DEEP-DIVE QUESTIONS FROM APEX NOTES (PHASES 1-5)
    // =========================================================================================
    {
        id: 801,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Easy',
        type: 'single',
        question: 'In Apex, what is the default value of an uninitialized `Integer` variable?\n\nInteger count;\nSystem.debug(count);',
        options: [
            '0',
            'false',
            'null',
            'An empty string (\'\')'
        ],
        correctAnswer: 2,
        explanation: 'Unlike Java or C++ where primitives default to 0 or false, ALL Apex variables (including Integer, Boolean, Decimal, and String) default to `null` when declared without initialization. Attempting to call methods on them without checking for null throws a `System.NullPointerException`.'
    },
    {
        id: 802,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Medium',
        type: 'single',
        question: 'A developer writes the following Apex code:\n\nString s = \'Hello\';\ns += \' World\';\n\nWhat happens in memory when the second line executes?',
        options: [
            'The original String object \'Hello\' is modified in-place to become \'Hello World\'.',
            'A brand new String object \'Hello World\' is created in memory and the variable `s` is reassigned to point to it, because Strings in Apex are immutable.',
            'The compiler throws an error because the `+=` operator is not supported for Strings.',
            'The original String is extended using a mutable character buffer.'
        ],
        correctAnswer: 1,
        explanation: 'Strings in Apex are immutable. When you concatenate using `+=`, a completely new String object is created in heap memory and the variable reference is updated. The old \'Hello\' string becomes eligible for garbage collection.'
    },
    {
        id: 803,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Easy',
        type: 'single',
        question: 'What is the key difference between `String.isEmpty(str)` and `String.isBlank(str)` in Apex?',
        options: [
            'They are identical and interchangeable.',
            '`isEmpty()` returns true for `null` or `\'\'` only. `isBlank()` returns true for `null`, `\'\'`, AND strings containing only whitespace (`\'   \'`).',
            '`isBlank()` only checks for `null`. `isEmpty()` checks for `null` and empty strings.',
            '`isEmpty()` is deprecated and should never be used.'
        ],
        correctAnswer: 1,
        explanation: '`String.isEmpty(str)` checks if the string is null or an empty string (\'\'), while `String.isBlank(str)` additionally returns true if the string contains ONLY whitespace characters (\'   \'). Best practice is to always use `isBlank()` / `isNotBlank()` when validating user input.'
    },
    {
        id: 804,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Medium',
        type: 'single',
        question: 'A developer wants to safely access a method on a variable that might be null without writing an explicit `if (variable != null)` check. Which Apex operator should they use?\n\nString companyName; // null\nInteger length = companyName?.length();',
        options: [
            'The Null Coalescing Operator (`??`)',
            'The Safe Navigation Operator (`?.`)',
            'The Ternary Operator (`? :`)',
            'The Elvis Operator (`?:`)'
        ],
        correctAnswer: 1,
        explanation: 'The Safe Navigation Operator (`?.`) short-circuits if the left-hand operand is null and returns null instead of throwing a `System.NullPointerException`. Example: `companyName?.length()` returns `null` if companyName is null, rather than crashing.'
    },
    {
        id: 805,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Hard',
        type: 'single',
        question: 'A developer needs to process 40,000 Account records from a SOQL query without exceeding the 6 MB Apex Heap Size governor limit. Which query pattern should the developer use?',
        options: [
            'List<Account> accs = [SELECT Id, Name FROM Account]; // Load all 40,000 into memory',
            'Use a SOQL `for` loop that processes records in chunks of 200: `for (List<Account> chunk : [SELECT Id, Name FROM Account]) { ... }`',
            'Use `LIMIT 200` and `OFFSET` to paginate manually in a while loop.',
            'Use `Database.getQueryLocator()` inside a synchronous method.'
        ],
        correctAnswer: 1,
        explanation: 'A SOQL `for` loop (`for (List<sObject> chunk : [SOQL])`) automatically processes query results in internal batches of 200 records at a time, keeping only 200 records in heap memory at any point. This allows processing up to 50,000 records without exceeding the 6 MB heap size limit.'
    },
    {
        id: 806,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Medium',
        type: 'single',
        question: 'In Apex, which keyword must be applied to a class declaration to allow other classes to extend it using the `extends` keyword?',
        options: [
            'The class must be declared as `abstract`.',
            'The class must be declared as `virtual`.',
            'The class must be declared as `global`.',
            'All Apex classes can be extended by default without any special keyword.'
        ],
        correctAnswer: 1,
        explanation: 'By default, Apex classes and methods are final (cannot be extended or overridden). You must explicitly declare the class as `virtual` (if it has concrete method implementations) or `abstract` (if it has abstract method signatures) to allow inheritance via `extends`.'
    },
    {
        id: 807,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Hard',
        type: 'single',
        question: 'What is the fundamental difference between an `abstract` class and an `interface` in Apex?',
        options: [
            'An abstract class can contain both concrete methods (with bodies) and abstract methods (without bodies), while an interface can ONLY contain method signatures without any implementation.',
            'An interface can contain concrete methods, but an abstract class cannot.',
            'A class can extend multiple abstract classes but can only implement one interface.',
            'There is no difference; they are interchangeable in Apex.'
        ],
        correctAnswer: 0,
        explanation: 'An `abstract` class can have a mix of fully implemented concrete methods and abstract method signatures that subclasses must override. An `interface` is a pure contract — it contains ONLY method signatures (no bodies), and all implementing classes must provide full implementations. A class can implement multiple interfaces but can only extend one abstract/virtual class.'
    },
    {
        id: 808,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Medium',
        type: 'single',
        question: 'What does the `this(...)` syntax accomplish inside an Apex constructor?',
        options: [
            'It calls a parent class constructor via inheritance.',
            'It enables constructor chaining by calling another constructor within the same class.',
            'It references the current trigger context.',
            'It creates a new instance of the same class recursively.'
        ],
        correctAnswer: 1,
        explanation: 'In Apex, `this(param1, param2)` inside a constructor calls another constructor of the same class (constructor chaining). For example, a default constructor `public MyClass() { this(\'DEFAULT\', 0); }` delegates to a parameterized constructor. To call a parent class constructor, you use `super(...)` instead.'
    },
    {
        id: 809,
        domain: 'Data Modeling & Management',
        weight: '13%',
        difficulty: 'Easy',
        type: 'single',
        question: 'Which SOQL date literal returns all records created on exactly today\'s date?',
        options: [
            'WHERE CreatedDate = CURRENT_DATE',
            'WHERE CreatedDate = TODAY',
            'WHERE CreatedDate = DATE.today()',
            'WHERE CreatedDate = SYSDATE'
        ],
        correctAnswer: 1,
        explanation: 'Salesforce provides built-in SOQL date literals like `TODAY`, `YESTERDAY`, `TOMORROW`, `LAST_N_DAYS:n`, `THIS_WEEK`, `THIS_MONTH`, and `THIS_FISCAL_YEAR`. `TODAY` filters records matching exactly today\'s date in the running user\'s time zone.'
    },
    {
        id: 810,
        domain: 'Data Modeling & Management',
        weight: '13%',
        difficulty: 'Hard',
        type: 'single',
        question: 'A developer adds `FOR UPDATE` at the end of a SOQL query:\n\nAccount acc = [SELECT Id, Name FROM Account WHERE Id = :accId FOR UPDATE];\n\nWhat is the effect of this clause?',
        options: [
            'It forces the query to bypass sharing rules and run in System Mode.',
            'It places a database-level row lock on the retrieved records, preventing other concurrent transactions from modifying them until the current transaction commits or rolls back.',
            'It automatically updates the `LastModifiedDate` on the retrieved records.',
            'It enables the query to return records from the Recycle Bin.'
        ],
        correctAnswer: 1,
        explanation: '`FOR UPDATE` is a SOQL locking clause. When used, the database places an exclusive row lock on all retrieved records for the duration of the current transaction. This prevents race conditions where two concurrent users attempt to modify the same record simultaneously.'
    },
    {
        id: 811,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Medium',
        type: 'single',
        question: 'A developer appends `WITH USER_MODE` to a SOQL query. What security enforcement does this enable?\n\nList<Account> accs = [SELECT Id, Name, Salary__c FROM Account WITH USER_MODE];',
        options: [
            'It enforces only record-level sharing rules (`with sharing`).',
            'It enforces both Object-level CRUD permissions AND Field-Level Security (FLS) for the running user at query execution time.',
            'It bypasses all security and runs the query in System Mode.',
            'It encrypts the query results using Platform Encryption.'
        ],
        correctAnswer: 1,
        explanation: 'By default, SOQL in Apex runs in System Mode, ignoring the running user\'s Object/Field permissions. Adding `WITH USER_MODE` enforces both Object CRUD and Field-Level Security (FLS) at query time. If the user lacks Read access to `Salary__c`, the query throws a `QueryException` or strips the inaccessible field.'
    },
    {
        id: 812,
        domain: 'Data Modeling & Management',
        weight: '13%',
        difficulty: 'Medium',
        type: 'single',
        question: 'When constructing a Parent-to-Child SOQL subquery for a custom child object `Invoice_Line__c` related to `Invoice__c`, how do you determine the correct relationship name to use inside the subquery?',
        options: [
            'Use the API name of the child object directly (`Invoice_Line__c`).',
            'Look up the Child Relationship Name on the relationship field definition and append `__r` (e.g., `Invoice_Lines__r`).',
            'Use the child object label in plural form.',
            'Replace `__c` with `__s` on the child object name.'
        ],
        correctAnswer: 1,
        explanation: 'For custom relationship subqueries, you must find the Child Relationship Name defined on the lookup/master-detail field in Object Manager, then append `__r`. For standard relationships (like Account -> Contacts), use the built-in plural relationship name (e.g., `Contacts`, `Opportunities`).'
    },
    {
        id: 813,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Hard',
        type: 'single',
        question: 'After a developer calls `Database.rollback(sp)` to undo a previously inserted Account record, what happens to the `Id` field on the in-memory Account variable?',
        options: [
            'The `Id` field is automatically cleared to `null` by the platform.',
            'The `Id` field REMAINS populated on the in-memory variable even though the record no longer exists in the database. The developer must manually set `acc.Id = null;` before re-inserting.',
            'The Account variable is completely destroyed and cannot be referenced again.',
            'A `System.RollbackException` is thrown automatically.'
        ],
        correctAnswer: 1,
        explanation: '`Database.rollback(sp)` only undoes database-level DML changes. It does NOT modify in-memory Apex variables. After rollback, the Account variable\'s `Id` property still contains the (now-invalid) ID. Attempting to update or re-insert the variable without clearing `.Id = null` will throw an error.'
    },
    {
        id: 814,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Medium',
        type: 'single',
        question: 'What exception is thrown when a SOQL query returns zero rows and the result is assigned directly to a single sObject variable?\n\nAccount a = [SELECT Id FROM Account WHERE Name = \'NonExistent\' LIMIT 1];',
        options: [
            'System.NullPointerException',
            'System.DmlException',
            'System.QueryException: List has no rows for assignment to SObject',
            'No exception; `a` is simply set to `null`.'
        ],
        correctAnswer: 2,
        explanation: 'When a SOQL query returning zero results is assigned directly to a single sObject variable (not a List), Salesforce throws `System.QueryException: List has no rows for assignment to SObject`. Best practice: always assign to a `List<sObject>` first, then check `if (!list.isEmpty())` before accessing elements.'
    },
    {
        id: 815,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Medium',
        type: 'single',
        question: 'A developer needs to run a Batch Apex job every day at midnight. Which Apex interface and scheduling mechanism should be used?',
        options: [
            'Implement `Database.Batchable` and schedule it directly using `Database.executeBatch()` with a timer parameter.',
            'Create a separate class implementing the `Schedulable` interface, and inside its `execute()` method call `Database.executeBatch()`. Schedule it using `System.schedule()` with a CRON expression.',
            'Annotate the Batch class with `@Scheduled(cron=\'0 0 0 * * ?\')`.',
            'Use a `@future` method with a `delay` parameter.'
        ],
        correctAnswer: 1,
        explanation: 'Batch Apex cannot schedule itself directly. You must create a separate class implementing `Schedulable`, and inside its `execute(SchedulableContext sc)` method, invoke `Database.executeBatch(new MyBatch())`. Then schedule it programmatically: `System.schedule(\'Daily Job\', \'0 0 0 * * ?\', new MySchedulable());`.'
    },
    {
        id: 816,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Medium',
        type: 'single',
        question: 'A developer builds a custom Apex REST API using `@RestResource(urlMapping=\'/AccountManager/*\')`. Which access modifier must be used on the class?',
        options: [
            'public',
            'private',
            'global',
            'protected'
        ],
        correctAnswer: 2,
        explanation: 'Classes annotated with `@RestResource` must be declared as `global` because they are exposed to external systems outside the Salesforce namespace boundary. Methods within (annotated with `@HttpGet`, `@HttpPost`, etc.) must also be `global static`.'
    },
    {
        id: 817,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Easy',
        type: 'single',
        question: 'Before making an outbound HTTP callout from Apex to an external endpoint (`https://api.example.com`), what must a Salesforce administrator configure in Setup?',
        options: [
            'Create a Connected App for the external URL.',
            'Add the external URL to Remote Site Settings or configure a Named Credential.',
            'Enable the Streaming API for the external domain.',
            'Create a Platform Event for the callout.'
        ],
        correctAnswer: 1,
        explanation: 'Salesforce blocks all outbound HTTP requests by default. The target endpoint domain must be whitelisted either in Remote Site Settings (basic URL whitelist) or via Named Credentials (which also store authentication credentials securely).'
    },
    {
        id: 818,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Hard',
        type: 'single',
        question: 'A Batch Apex class needs to make HTTP callouts to an external API during the `execute()` method. What additional interface must the class implement alongside `Database.Batchable<sObject>`?',
        options: [
            'Database.Stateful',
            'Database.AllowsCallouts',
            'Queueable',
            'HttpCalloutMock'
        ],
        correctAnswer: 1,
        explanation: 'By default, Batch Apex does not allow HTTP callouts. To enable callouts inside the `execute()` method, the batch class must implement the `Database.AllowsCallouts` marker interface: `public class MyBatch implements Database.Batchable<sObject>, Database.AllowsCallouts { ... }`.'
    },
    {
        id: 819,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Hard',
        type: 'single',
        question: 'Inside a Queueable Apex `execute()` method, how many child Queueable jobs can be enqueued using `System.enqueueJob()` (in a non-test context)?',
        options: [
            'Unlimited chaining is allowed.',
            'Exactly 1 child Queueable job can be enqueued per `execute()` invocation.',
            'Up to 5 child Queueable jobs can be enqueued.',
            'Chaining Queueable jobs is not allowed.'
        ],
        correctAnswer: 1,
        explanation: 'In production (non-test) contexts, a Queueable job can enqueue exactly 1 child Queueable job from within its `execute()` method. This allows building sequential job chains that reset governor limits at each step. In test contexts (`@isTest`), chaining depth is limited to prevent infinite loops.'
    },
    {
        id: 820,
        domain: 'Testing, Debugging & Deployment',
        weight: '17%',
        difficulty: 'Medium',
        type: 'single',
        question: 'A developer wants to load test data from a CSV file stored as a Static Resource instead of manually creating records in the test method. Which method should they use?',
        options: [
            'Test.loadData(Account.sObjectType, \'MyStaticResourceName\')',
            'Database.loadCSV(\'MyStaticResourceName\')',
            'Test.importData(Account.class, \'MyStaticResourceName\')',
            'System.loadStaticResource(\'MyStaticResourceName\')'
        ],
        correctAnswer: 0,
        explanation: '`Test.loadData(sObjectToken, staticResourceName)` loads records from a CSV file stored as a Static Resource and inserts them into the test database. This is useful when you need large, complex, or realistic test data sets without writing verbose `new Account(...)` statements.'
    },
    {
        id: 821,
        domain: 'Testing, Debugging & Deployment',
        weight: '17%',
        difficulty: 'Hard',
        type: 'single',
        question: 'A developer needs to strip out fields that the current user does not have permission to create before performing a DML insert. Which Apex method should be used?',
        options: [
            'Schema.sObjectType.Account.fields.Name.isCreateable()',
            'Security.stripInaccessible(AccessType.CREATABLE, recordList)',
            'Database.insert(records, AccessLevel.USER_MODE)',
            'Both B and C are valid approaches.'
        ],
        correctAnswer: 3,
        explanation: 'There are two valid modern approaches: `Security.stripInaccessible(AccessType.CREATABLE, records)` which returns sanitized records with inaccessible fields removed, and `Database.insert(records, false, AccessLevel.USER_MODE)` which enforces FLS at DML time. Option A only checks a single field but doesn\'t strip anything.'
    },
    {
        id: 822,
        domain: 'Testing, Debugging & Deployment',
        weight: '17%',
        difficulty: 'Easy',
        type: 'single',
        question: 'A developer adds `@isTest(SeeAllData=true)` to a test class. What is the effect of this annotation?',
        options: [
            'The test class can access real production/sandbox data during test execution.',
            'The test class runs with elevated System Administrator permissions.',
            'The test class automatically generates 200 test records for every sObject.',
            'The test class bypasses all governor limits.'
        ],
        correctAnswer: 0,
        explanation: 'By default, test methods cannot see org data. `@isTest(SeeAllData=true)` allows the test to query and access real records in the org. However, this is strongly discouraged as best practice because tests become dependent on existing data, making them fragile and non-portable across environments.'
    },
    {
        id: 823,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Hard',
        type: 'single',
        question: 'A developer attempts to insert a User record (setup object) and an Account record (non-setup object) in the same synchronous Apex transaction:\n\ninsert new User(...);\ninsert new Account(...);\n\nWhat error occurs?',
        options: [
            'System.DmlException: MIXED_DML_OPERATION — DML on setup and non-setup objects cannot be performed in the same transaction.',
            'System.LimitException: Too many DML statements.',
            'No error; both records are inserted successfully.',
            'System.SecurityException: Insufficient privileges.'
        ],
        correctAnswer: 0,
        explanation: 'Salesforce prohibits DML operations on setup objects (User, Group, PermissionSet) and non-setup objects (Account, Contact) in the same synchronous transaction. This throws a `MIXED_DML_OPERATION` error. To work around this, perform one of the DML operations inside an `@future` method or `Queueable` job.'
    },
    {
        id: 824,
        domain: 'Data Modeling & Management',
        weight: '13%',
        difficulty: 'Easy',
        type: 'single',
        question: 'What is the maximum value of the SOQL `OFFSET` clause for paginating query results?',
        options: [
            '500',
            '1,000',
            '2,000',
            '5,000'
        ],
        correctAnswer: 2,
        explanation: 'The SOQL `OFFSET` clause skips the first N rows before returning results. The maximum allowed OFFSET value is 2,000. For deeper pagination beyond 2,000 records, developers should use `WHERE Id > :lastRecordId ORDER BY Id LIMIT n` (keyset pagination).'
    },
    {
        id: 825,
        domain: 'Data Modeling & Management',
        weight: '13%',
        difficulty: 'Hard',
        type: 'single',
        question: 'A developer needs to query Tasks where the `WhoId` polymorphic field could reference either a Contact or a Lead, and needs to retrieve object-specific fields depending on the type. Which SOQL clause enables this?',
        options: [
            'Use a standard Parent-to-Child subquery on the Task object.',
            'Use the `TYPEOF` clause inside the `SELECT` statement to conditionally select fields based on the referenced object type.',
            'Use `instanceof` checks inside a for loop after querying.',
            'Polymorphic queries are not supported in SOQL.'
        ],
        correctAnswer: 1,
        explanation: 'The `TYPEOF` clause in SOQL allows querying polymorphic lookup fields (like `Task.WhoId` or `Event.WhatId`) and selecting different fields depending on which object type the lookup references. Example: `SELECT TYPEOF Who WHEN Contact THEN FirstName, LastName WHEN Lead THEN Company END FROM Task`.'
    },
    {
        id: 826,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Medium',
        type: 'single',
        question: 'A developer declares a utility class as `public inherited sharing class DataService { ... }`. If this class is called from a `without sharing` controller class, what sharing mode does `DataService` execute under?',
        options: [
            'It always defaults to `with sharing` regardless of the caller.',
            'It inherits `without sharing` from the calling class.',
            'It runs in System Mode with no sharing enforcement.',
            'It throws a compile error because `inherited sharing` cannot be used with `public`.'
        ],
        correctAnswer: 1,
        explanation: 'A class declared with `inherited sharing` dynamically adopts the sharing mode of the class that called it. If called from a `without sharing` class, it runs as `without sharing`. If called from a `with sharing` class, it runs as `with sharing`. If it is the top-level entry point (e.g., invoked from LWC), it defaults to `with sharing`.'
    },
    {
        id: 827,
        domain: 'Data Modeling & Management',
        weight: '13%',
        difficulty: 'Medium',
        type: 'single',
        question: 'What is the difference between `SELECT COUNT() FROM Account` and `SELECT COUNT(Industry) FROM Account` in SOQL?',
        options: [
            'They are identical and return the same number.',
            '`COUNT()` returns the total number of rows matching the query. `COUNT(Industry)` returns only the number of rows where the `Industry` field is NOT null.',
            '`COUNT()` is invalid syntax; only `COUNT(fieldName)` is allowed.',
            '`COUNT(Industry)` returns the number of unique Industry values.'
        ],
        correctAnswer: 1,
        explanation: '`COUNT()` (no field parameter) returns the total row count regardless of null values. `COUNT(fieldName)` returns only the count of rows where that specific field has a non-null value. To count unique non-null values, use `COUNT_DISTINCT(fieldName)`.'
    },
    {
        id: 828,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Medium',
        type: 'single',
        question: 'In a `before insert` trigger, a developer wants to prevent a record from being saved and display an error message to the user. Which method should the developer call on the sObject record?',
        options: [
            'throw new DmlException(\'Error message\');',
            'record.addError(\'Error message\');',
            'ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.ERROR, \'Error message\'));',
            'System.debug(LoggingLevel.ERROR, \'Error message\');'
        ],
        correctAnswer: 1,
        explanation: 'In trigger context, calling `record.addError(\'message\')` on an sObject in `Trigger.new` prevents that specific record from being saved and displays the error message to the user. `throw new DmlException()` would abort the entire transaction. `ApexPages.addMessage()` is for Visualforce only.'
    },
    {
        id: 829,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Medium',
        type: 'single',
        question: 'Which Apex keyword is used inside a subclass method to call the parent class\'s version of an overridden method?',
        options: [
            'this.parentMethod()',
            'base.method()',
            'super.method()',
            'parent.method()'
        ],
        correctAnswer: 2,
        explanation: 'In Apex, the `super` keyword references the parent (base) class. Inside an overriding method, `super.methodName()` calls the parent class\'s original implementation. This is useful when you want to extend the parent\'s behavior rather than completely replacing it.'
    },
    {
        id: 830,
        domain: 'Process Automation & Apex Logic',
        weight: '38%',
        difficulty: 'Hard',
        type: 'single',
        question: 'A developer uses the `switch on` statement with an sObject variable. Which Apex behavior does this enable?\n\nsObject record = getRecord();\nswitch on record {\n    when Account a { ... }\n    when Contact c { ... }\n    when null { ... }\n    when else { ... }\n}',
        options: [
            'It converts the sObject to a String before matching.',
            'It performs polymorphic type-checking, automatically casting the sObject to the matched concrete type (`Account a`, `Contact c`) within each `when` block.',
            'It throws a compile error because `switch on` does not support sObjects.',
            'It matches based on the sObject\'s `Id` prefix.'
        ],
        correctAnswer: 1,
        explanation: 'The `switch on` statement in Apex supports sObject type matching. When the runtime sObject type matches a `when` clause (e.g., `when Account a`), Apex automatically casts the generic `sObject` into the specific type (`Account a`), giving you direct access to that object\'s fields without manual casting.'
    },

    // =========================================================================================
    // DUMP-SOURCED QUESTIONS (IDs 831–900) — Extracted from all 7 PD1 exam dump PDFs
    // =========================================================================================
    {
        id: 831,
        domain: 'Developer Fundamentals',
        weight: '23%',
        difficulty: 'Medium',
        type: 'single',
        question: 'A developer has an integer variable called maxAttempts. The developer needs to ensure that once maxAttempts is initialized, it preserves its value for the length of the Apex transaction; while being able to share the variable\'s state between trigger executions.\n\nHow should the developer declare maxAttempts to meet these requirements?',
        options: [
            'Declare maxAttempts as a member variable on the trigger definition.',
            'Declare maxAttempts as a private static variable on a helper class.',
            'Declare maxAttempts as a constant using the static and final keywords.',
            'Declare maxAttempts as a variable on a helper class.'
        ],
        correctAnswer: 2,
        explanation: 'Using the `static` keyword ensures the variable persists across multiple trigger executions within the same transaction. Adding `final` ensures the value cannot be changed after initialization. A member variable on the trigger definition would be re-initialized on each execution, and a non-static variable on a helper class would also not persist between trigger invocations.'
    },
    {
        id: 832,
        domain: 'Process Automation and Logic',
        weight: '30%',
        difficulty: 'Medium',
        type: 'multi',
        question: 'Management asked for opportunities to be automatically created for accounts with annual revenue greater than $1,000,000. A developer created a before insert trigger on Account that queries Opportunities and inserts new ones inside a for loop.\n\nUsers can update accounts via the UI, but when the administrator tries to upload 179 accounts using Data Loader, it fails with System.Exception errors.\n\nWhich TWO actions should the developer take to fix the code? (Choose 2)',
        options: [
            'Query for existing opportunities outside the for loop.',
            'Check if all the required fields for Opportunity are being added on creation.',
            'Move the DML that saves opportunities outside the for loop.',
            'Use Database.query to query the opportunities.'
        ],
        correctAnswer: [0, 2],
        explanation: 'The code fails due to governor limits: SOQL queries and DML statements inside a for loop will hit the 100 SOQL / 150 DML limit when processing 179 records via Data Loader. The fix is to bulkify: query outside the loop and collect all DML into a single operation after the loop.'
    },
    {
        id: 833,
        domain: 'User Interface',
        weight: '25%',
        difficulty: 'Medium',
        type: 'single',
        question: 'Which exception type CANNOT be caught in Apex?',
        options: [
            'NoAccessException',
            'CalloutException',
            'LimitException',
            'A custom exception'
        ],
        correctAnswer: 2,
        explanation: 'LimitException is thrown when governor limits are exceeded and cannot be caught by try-catch blocks. This is by design — if you could catch limit exceptions, you could potentially write code that ignores governor limits, which would compromise multi-tenant resource protection.'
    },
    {
        id: 834,
        domain: 'User Interface',
        weight: '25%',
        difficulty: 'Medium',
        type: 'single',
        question: 'Which code statement includes an Apex method named updateAccounts in the class AccountController for use in a Lightning web component?',
        options: [
            "import updateAccounts from 'AccountController.updateAccounts';",
            "import updateAccounts from '@salesforce/apex/AccountController.updateAccounts';",
            "import updateAccounts from 'AccountController';",
            "import updateAccounts from '@salesforce/AccountController';"
        ],
        correctAnswer: 1,
        explanation: 'In LWC, Apex methods are imported using the @salesforce/apex/ scoped module followed by ClassName.methodName. The correct syntax is: import methodName from \'@salesforce/apex/Namespace.ClassName.methodName\';'
    },
    {
        id: 835,
        domain: 'Testing, Debugging, and Deployment',
        weight: '15%',
        difficulty: 'Medium',
        type: 'multi',
        question: 'Where are TWO locations a developer can look to find information about the status of batch or future methods? (Choose 2)',
        options: [
            'Apex Jobs',
            'Apex Flex Queue',
            'Developer Console',
            'Paused Flow Interviews component'
        ],
        correctAnswer: [0, 1],
        explanation: 'Apex Jobs (Setup > Apex Jobs) shows the status of all asynchronous Apex jobs including batch and future methods. The Apex Flex Queue shows batch jobs that are waiting to be processed. Developer Console shows debug logs but not job status, and Paused Flow Interviews is for Flows only.'
    },
    {
        id: 836,
        domain: 'Process Automation and Logic',
        weight: '30%',
        difficulty: 'Medium',
        type: 'single',
        question: 'Which action causes a before trigger to fire by default for Accounts?',
        options: [
            'Renaming or replacing picklists',
            'Updating addresses using the Mass Address update tool',
            'Importing data using the Data Loader and the Bulk API',
            'Converting Leads to Contacts'
        ],
        correctAnswer: 2,
        explanation: 'Data Loader with Bulk API performs standard DML (insert/update) operations on records, which fires triggers. Mass Address updates and picklist changes are metadata operations that do not fire triggers. Lead conversion creates Contacts/Accounts but does not fire before triggers on the Account in the same way.'
    },
    {
        id: 837,
        domain: 'Developer Fundamentals',
        weight: '23%',
        difficulty: 'Medium',
        type: 'single',
        question: 'Which Apex class contains methods to return the amount of resources that have been used for a particular governor, such as the number of DML statements?',
        options: [
            'OrgLimits',
            'Limits',
            'Messaging',
            'Exception'
        ],
        correctAnswer: 1,
        explanation: 'The Limits class provides methods like Limits.getDMLStatements(), Limits.getQueries(), Limits.getCpuTime() etc. to check resource consumption during the current transaction. OrgLimits provides org-wide limits, not transaction-level.'
    },
    {
        id: 838,
        domain: 'Testing, Debugging, and Deployment',
        weight: '15%',
        difficulty: 'Hard',
        type: 'multi',
        question: 'Which THREE statements are accurate about debug logs? (Choose 3)',
        options: [
            'System debug logs are retained for 24 hours.',
            'Debug log levels are cumulative, where FINE log level includes all events logged at the DEBUG, INFO, WARN, and ERROR levels.',
            'Only the 20 most recent debug logs for a user are kept.',
            'Debug logs can be set for specific users, classes, and triggers.',
            'The maximum size of a debug log is 5 MB.'
        ],
        correctAnswer: [0, 3, 4],
        explanation: 'Debug logs are retained for 24 hours (A). You can set debug log levels for specific users, classes, and triggers (D). The maximum debug log size is 5 MB (E — note: logs over 5 MB are truncated). Debug log levels are NOT cumulative in the way described (B is incorrect — FINE does not include ERROR). The system retains the 20 most recent logs per user (C), but the question says only 20 are "kept" which is misleading — the correct three are A, D, E.'
    },
    {
        id: 839,
        domain: 'User Interface',
        weight: '25%',
        difficulty: 'Hard',
        type: 'multi',
        question: 'What are THREE capabilities of the <ltng:require> tag when loading JavaScript resources in Aura components? (Choose 3)',
        options: [
            'Loading scripts in parallel',
            'One-time loading for duplicate scripts',
            'Loading files from Documents',
            'Loading externally hosted scripts',
            'Specifying loading order'
        ],
        correctAnswer: [0, 1, 4],
        explanation: '<ltng:require> can load multiple scripts in parallel for performance, prevents duplicate loading of the same script, and allows you to specify the loading order using the scripts attribute (loaded in order). It cannot load from Documents or externally hosted scripts — resources must be uploaded as Static Resources.'
    },
    {
        id: 840,
        domain: 'Process Automation and Logic',
        weight: '30%',
        difficulty: 'Medium',
        type: 'single',
        question: 'Cloud Kicks has a multi-screen flow that its call center agents use when handling inbound service desk calls. At one of the steps in the flow, agents should be presented with a list of order numbers and dates retrieved from an external order management system in real time.\n\nWhat should a developer use to satisfy this requirement?',
        options: [
            'An outbound message',
            'An invocable method',
            'An Apex controller',
            'An Apex REST class'
        ],
        correctAnswer: 1,
        explanation: 'An @InvocableMethod annotated Apex method can be called directly from a Flow to retrieve data from an external system in real time. Outbound messages are for sending data out (not retrieving). Apex controllers are for Visualforce pages. REST classes expose Salesforce APIs, not consume external ones from a Flow.'
    },
    {
        id: 841,
        domain: 'User Interface',
        weight: '25%',
        difficulty: 'Medium',
        type: 'single',
        question: 'Which Lightning Web Component custom event property settings enable the event to bubble up the containment hierarchy and cross the Shadow DOM boundary?',
        options: [
            'bubbles: false, composed: false',
            'bubbles: true, composed: false',
            'bubbles: true, composed: true',
            'bubbles: false, composed: true'
        ],
        correctAnswer: 2,
        explanation: 'For an LWC custom event to propagate up through parent components AND cross shadow DOM boundaries, both bubbles (propagates up the DOM tree) and composed (crosses shadow DOM boundary) must be set to true.'
    },
    {
        id: 842,
        domain: 'User Interface',
        weight: '25%',
        difficulty: 'Hard',
        type: 'single',
        question: 'Which code in a Visualforce page and/or controller might present a security vulnerability (Cross-Site Scripting)?',
        options: [
            '<apex:outputText value="{!$CurrentPage.parameters.userInput}" />',
            '<apex:outputField value="{!ctrl.userInput}" rendered="{!isEditable}" />',
            '<apex:outputField value="{!ctrl.userInput}" />',
            '<apex:outputText escape="false" value="{!$CurrentPage.parameters.userInput}" />'
        ],
        correctAnswer: 3,
        explanation: 'Setting escape="false" on <apex:outputText> while rendering user-controlled input ($CurrentPage.parameters.userInput) is a Cross-Site Scripting (XSS) vulnerability. The escape="false" attribute disables HTML encoding, allowing malicious scripts to execute. By default, escape is true, which encodes HTML characters.'
    },
    {
        id: 843,
        domain: 'User Interface',
        weight: '25%',
        difficulty: 'Medium',
        type: 'multi',
        question: 'Which TWO are phases in the Aura application event propagation framework? (Choose 2)',
        options: [
            'Bubble',
            'Control',
            'Default',
            'Emit'
        ],
        correctAnswer: [0, 2],
        explanation: 'Aura application events propagate through two phases: the Default phase (where event handlers in the containment hierarchy are notified) and the Bubble phase (where the event bubbles up through the component hierarchy). Control and Emit are not phases in the Aura event framework.'
    },
    {
        id: 844,
        domain: 'Developer Fundamentals',
        weight: '23%',
        difficulty: 'Medium',
        type: 'single',
        question: 'Universal Containers has an order system that uses an Order Number to identify an order for customers and service agents. Order records will be imported into Salesforce.\n\nHow should the Order Number field be defined in Salesforce?',
        options: [
            'External ID and Unique',
            'Direct Lookup',
            'Lookup',
            'Indirect Lookup'
        ],
        correctAnswer: 0,
        explanation: 'When importing records that have an existing identifier from an external system, the field should be marked as External ID (for upsert matching) and Unique (to prevent duplicates). This allows the Data Loader or API to use the Order Number to match existing records during upsert operations.'
    },
    {
        id: 845,
        domain: 'Developer Fundamentals',
        weight: '23%',
        difficulty: 'Medium',
        type: 'single',
        question: 'A company has a custom object, Order__c, that has a required, unique external ID field called Order_Number__c.\n\nWhich statement should be used to perform the DML necessary to insert new records and update existing records in a list of Order__c records using the external ID field?',
        options: [
            'merge orders;',
            'merge orders Order_Number__c;',
            'upsert orders;',
            'upsert orders Order_Number__c;'
        ],
        correctAnswer: 3,
        explanation: 'The upsert DML statement with a specified external ID field (upsert orders Order_Number__c;) will insert new records and update existing ones by matching on the Order_Number__c external ID field. Without specifying the field, upsert defaults to using the record Id.'
    },
    {
        id: 846,
        domain: 'Salesforce Fundamentals',
        weight: '7%',
        difficulty: 'Medium',
        type: 'multi',
        question: 'What are TWO benefits of using declarative customizations over code? (Choose 2)',
        options: [
            'Declarative customizations automatically generate test classes.',
            'Declarative customizations cannot generate run time errors.',
            'Declarative customizations automatically update with each Salesforce release.',
            'Declarative customizations generally require less maintenance.'
        ],
        correctAnswer: [2, 3],
        explanation: 'Declarative customizations (like validation rules, formulas, flows) automatically update with Salesforce releases (C) — unlike Apex code which may need manual updates. They also require less maintenance (D) compared to coded solutions. They do NOT auto-generate test classes (A) and CAN generate runtime errors (B), such as flow faults.'
    },
    {
        id: 847,
        domain: 'Testing, Debugging, and Deployment',
        weight: '15%',
        difficulty: 'Medium',
        type: 'single',
        question: 'When using Salesforce DX, what does a developer need to enable to create and manage scratch orgs?',
        options: [
            'Sandbox',
            'Dev Hub',
            'Environment Hub',
            'Production'
        ],
        correctAnswer: 1,
        explanation: 'Dev Hub is a feature that must be enabled in a Salesforce org (typically production or a designated org) to create and manage scratch orgs using Salesforce DX. Scratch orgs are temporary, configurable Salesforce environments used for development and testing.'
    },
    {
        id: 848,
        domain: 'User Interface',
        weight: '25%',
        difficulty: 'Hard',
        type: 'single',
        question: 'A developer must provide custom user interfaces when users edit a Contact in either Salesforce Classic or Lightning Experience.\n\nWhat should the developer use to override the Contact\'s Edit button and provide this functionality?',
        options: [
            'A Lightning page in Salesforce Classic and a Visualforce page in Lightning Experience',
            'A Visualforce page in Salesforce Classic and a Lightning page in Lightning Experience',
            'A Visualforce page in Salesforce Classic and a Lightning component in Lightning Experience',
            'A Lightning component in Salesforce Classic and a Lightning component in Lightning Experience'
        ],
        correctAnswer: 2,
        explanation: 'In Salesforce Classic, button overrides use Visualforce pages. In Lightning Experience, button overrides use Lightning components (Aura or LWC wrapped in Aura). Lightning pages cannot override standard buttons, and Lightning components cannot be used directly in Classic for button overrides.'
    },
    {
        id: 849,
        domain: 'User Interface',
        weight: '25%',
        difficulty: 'Medium',
        type: 'single',
        question: 'An Apex method, getAccounts, that returns a list of Accounts given a searchTerm, is available for Lightning Web Components to use.\n\nWhat is the correct definition of a Lightning Web Component property that uses the getAccounts method?',
        options: [
            "@AuraEnabled(getAccounts, { searchTerm: '$searchTerm' }) accountList;",
            "@AuraEnabled(getAccounts, '$searchTerm') accountList;",
            "@wire(getAccounts, '$searchTerm') accountList;",
            "@wire(getAccounts, { searchTerm: '$searchTerm' }) accountList;"
        ],
        correctAnswer: 3,
        explanation: 'In LWC, the @wire decorator is used to call Apex methods reactively. The syntax is @wire(apexMethod, { paramName: \'$reactiveProperty\' }) propertyName; — the parameters are passed as an object with keys matching the Apex method parameter names, and reactive properties use the $ prefix.'
    },
    {
        id: 850,
        domain: 'Testing, Debugging, and Deployment',
        weight: '15%',
        difficulty: 'Medium',
        type: 'single',
        question: 'Which scenario is valid for execution by unit tests?',
        options: [
            'Load data from a remote site with a callout.',
            'Set the created date of a record using a system method.',
            'Execute anonymous Apex as a different user.',
            'Generate a Visualforce PDF with getContentAsPDF().'
        ],
        correctAnswer: 1,
        explanation: 'Test.setCreatedDate() is a system method specifically designed for use in unit tests to set the CreatedDate of test records. Callouts require mock frameworks (HttpCalloutMock). Running as a different user uses System.runAs() but that\'s not "anonymous Apex." getContentAsPDF() is not supported in test context.'
    },
    {
        id: 851,
        domain: 'Process Automation and Logic',
        weight: '30%',
        difficulty: 'Hard',
        type: 'multi',
        question: 'Universal Containers decides to use purely declarative development to build out a new Salesforce application.\n\nWhich TWO options can be used to build out the business logic layer for this application? (Choose 2)',
        options: [
            'Batch Jobs',
            'Validation Rules',
            'Record-Triggered Flow',
            'Remote Actions'
        ],
        correctAnswer: [1, 2],
        explanation: 'Validation Rules and Record-Triggered Flows are both declarative tools that can implement business logic without code. Batch Jobs require Apex code (implementing Database.Batchable interface), and Remote Actions are JavaScript/Apex features requiring code.'
    },
    {
        id: 852,
        domain: 'Process Automation and Logic',
        weight: '30%',
        difficulty: 'Hard',
        type: 'multi',
        question: 'A business has a proprietary Order Management System (OMS) that creates orders from its website. When the order is created in the OMS, an integration also creates an order record in Salesforce related to the contact by email. As the order goes through different stages, the integration updates it in Salesforce.\n\nThe business notices each update from the OMS creates a new order record instead of updating the existing one.\n\nWhich TWO actions should prevent duplicate order records? (Choose 2)',
        options: [
            'Use the order number from the OMS as an external ID.',
            'Write a trigger on the Order object to delete the duplicates.',
            'Ensure that the order number in the OMS is unique.',
            'Use the email on the contact record as an external ID.'
        ],
        correctAnswer: [0, 2],
        explanation: 'To prevent duplicates during integration, the external system\'s unique identifier (order number) should be mapped to an External ID field in Salesforce (A). The OMS must also ensure its order numbers are unique (C) so that upsert operations can correctly match existing records. Deleting duplicates via trigger is a workaround, not a prevention. Email as External ID on Contact doesn\'t help with Order deduplication.'
    },
    {
        id: 853,
        domain: 'User Interface',
        weight: '25%',
        difficulty: 'Hard',
        type: 'multi',
        question: 'Universal Containers recently transitioned from Classic to Lightning Experience. A business process requires certain values from the Opportunity object to be sent via an HTTP REST callout to its external order management system when the user presses a custom button on the Opportunity detail page.\n\nWhich TWO methods should the developer implement to fulfill the business requirement? (Choose 2)',
        options: [
            'Create an after update trigger on the Opportunity that calls a helper using @future(callout=true) to perform the REST callout.',
            'Create a Remote Action on the Opportunity that executes an immediate action to perform the HTTP REST callout whenever the Opportunity is updated.',
            'Create a custom Visualforce quick action that performs the HTTP REST callout, and use a Visualforce quick action to expose the component on the Opportunity detail page.',
            'Create a Lightning component quick action that performs the HTTP REST callout, and use a Lightning Action to expose the component on the Opportunity detail page.'
        ],
        correctAnswer: [2, 3],
        explanation: 'Since the requirement is a button press (not automatic on update), the solution is a quick action. In Lightning Experience, a Lightning component quick action (D) is preferred. For backward compatibility with Classic, a Visualforce quick action (C) also works. Triggers fire automatically on DML, not on button press. Remote Actions are an older pattern not suitable for Lightning quick actions.'
    },
    {
        id: 854,
        domain: 'User Interface',
        weight: '25%',
        difficulty: 'Medium',
        type: 'single',
        question: 'A developer wants to improve runtime performance of Apex calls by caching results on the client.\n\nWhat is the most efficient way to implement this and follow best practices?',
        options: [
            'Decorate the server-side method with @AuraEnabled(cacheable=true).',
            'Decorate the server-side method with @AuraEnabled(storable=true).',
            'Set a cookie in the browser for use upon return to the page.',
            'Call the setStorable() method on the action in the JavaScript client-side code.'
        ],
        correctAnswer: 0,
        explanation: '@AuraEnabled(cacheable=true) is the recommended approach in both Aura and LWC. It tells the Lightning framework to cache the method\'s return value on the client side, improving performance for subsequent calls. setStorable() was the older Aura-specific approach. Cookies are not appropriate for caching Apex results.'
    },
    {
        id: 855,
        domain: 'Testing, Debugging, and Deployment',
        weight: '15%',
        difficulty: 'Medium',
        type: 'single',
        question: 'Universal Containers has developed custom Apex code and Lightning Components in a Sandbox environment. They need to deploy the code and associated configurations to the Production environment.\n\nWhat is the recommended process for deploying the code and configurations to Production?',
        options: [
            'Use a change set to deploy the Apex code and Lightning Components.',
            'Use the Force.com IDE to deploy the Apex code and Lightning Components.',
            'Use the Ant Migration Tool to deploy the Apex code and Lightning Components.',
            'Use Salesforce CLI to deploy the Apex code and Lightning Components.'
        ],
        correctAnswer: 3,
        explanation: 'Salesforce CLI (sf/sfdx) is the modern, recommended tool for deploying Apex code and Lightning components. It integrates with Salesforce DX, supports source tracking, and is the standard for CI/CD pipelines. Change sets work but are less flexible. Force.com IDE and Ant Migration Tool are legacy tools.'
    },
    {
        id: 856,
        domain: 'User Interface',
        weight: '25%',
        difficulty: 'Easy',
        type: 'single',
        question: 'What can be easily developed using the Lightning Component framework?',
        options: [
            'Lightning Pages',
            'Salesforce Integrations',
            'Customized JavaScript buttons',
            'Salesforce Classic user interface pages'
        ],
        correctAnswer: 0,
        explanation: 'The Lightning Component framework (Aura and LWC) is designed for building Lightning Pages and custom components for Lightning Experience. It is not used for Classic UI pages, JavaScript buttons (which are a Classic feature), or direct integrations (though components can invoke integration logic).'
    },
    {
        id: 857,
        domain: 'Process Automation and Logic',
        weight: '30%',
        difficulty: 'Medium',
        type: 'multi',
        question: 'When a user edits the Postal Code on an Account, a custom Account text field named "Timezone" must be updated based on the values in a PostalCodeToTimezone__c custom object.\n\nWhich TWO automation tools can be used to implement this feature? (Choose 2)',
        options: [
            'Approval process',
            'Account trigger',
            'Quick actions',
            'Fast Field Updates record-triggered flow'
        ],
        correctAnswer: [1, 3],
        explanation: 'An Account trigger (Apex) can query the PostalCodeToTimezone__c object and update the Timezone field. A record-triggered flow with Fast Field Updates (before-save) can also query related data and update the field declaratively. Approval processes are for approval workflows, and quick actions are user-initiated, not automated.'
    },
    {
        id: 858,
        domain: 'User Interface',
        weight: '25%',
        difficulty: 'Medium',
        type: 'multi',
        question: 'In terms of the MVC paradigm, what are TWO advantages of implementing the view layer of a Salesforce application using Lightning Web Component-based development over Visualforce? (Choose 2)',
        options: [
            'Rich component ecosystem',
            'Self-contained and reusable units of an application',
            'Built-in standard and custom set controllers',
            'Log capturing via the Debug Logs Setup page'
        ],
        correctAnswer: [0, 1],
        explanation: 'LWC provides a rich component ecosystem (A) with many base components and community components. LWC components are self-contained and reusable (B), encapsulating their own markup, logic, and styling. Standard/custom set controllers (C) are a Visualforce advantage, not LWC. Debug logs (D) are available for both.'
    },
    {
        id: 859,
        domain: 'Testing, Debugging, and Deployment',
        weight: '15%',
        difficulty: 'Medium',
        type: 'single',
        question: 'A developer needs to create a baseline set of data (Accounts, Contacts, Products, Assets) for an entire suite of tests allowing them to test independent requirements for various types of Salesforce Cases.\n\nWhich approach can efficiently generate the required data for each unit test?',
        options: [
            'Create a mock using the Stub API.',
            'Add @IsTest(seeAllData=true) at the start of the unit test class.',
            'Use @TestSetup with a void method.',
            'Create test data before Test.startTest() in the unit test.'
        ],
        correctAnswer: 2,
        explanation: '@TestSetup annotated methods run once before all test methods in the class, creating a shared baseline dataset. Each test method gets its own copy of this data (rolled back between tests). This is more efficient than creating data in every test method. seeAllData=true is bad practice, and Stub API is for mocking, not creating test data.'
    },
    {
        id: 860,
        domain: 'Developer Fundamentals',
        weight: '23%',
        difficulty: 'Medium',
        type: 'multi',
        question: 'A developer is implementing an Apex class for a financial system. Within the class, the variables \'creditAmount\' and \'debitAmount\' should not be able to change once a value is assigned.\n\nIn which TWO ways can the developer declare the variables to ensure their value can only be assigned one time? (Choose 2)',
        options: [
            'Use the static keyword and assign its value in a static initializer.',
            'Use the final keyword and assign its value when declaring the variable.',
            'Use the final keyword and assign its value in the class constructor.',
            'Use the static keyword and assign its value in the class constructor.'
        ],
        correctAnswer: [1, 2],
        explanation: 'The final keyword ensures a variable can only be assigned once. You can assign a final variable either at declaration (B) or in the constructor (C) — both are valid. The static keyword alone does not prevent reassignment. Using static with a constructor assignment (D) is incorrect because static variables cannot be assigned in instance constructors.'
    },
    {
        id: 861,
        domain: 'User Interface',
        weight: '25%',
        difficulty: 'Hard',
        type: 'single',
        question: 'A developer needs to make a custom Lightning Web Component available in the Salesforce Classic user interface.\n\nWhich approach can be used to accomplish this?',
        options: [
            'Wrap the Lightning Web Component in an Aura Component and surface the Aura Component as a Visualforce tab.',
            'Embed the Lightning Web Component in a Visualforce Component and add directly to the page layout.',
            'Use a Visualforce page with a custom controller to invoke the Lightning Web Component using a call to an Apex method.',
            'Use the Lightning Out JavaScript library to embed the Lightning Web Component in a Visualforce page and add to the page layout.'
        ],
        correctAnswer: 3,
        explanation: 'Lightning Out allows you to use Lightning components (including LWC) in non-Lightning contexts like Visualforce pages. Since Salesforce Classic uses Visualforce, you can embed an LWC (wrapped in Aura if needed) in a VF page using Lightning Out, then add that VF page to Classic page layouts.'
    },
    {
        id: 862,
        domain: 'Developer Fundamentals',
        weight: '23%',
        difficulty: 'Medium',
        type: 'single',
        question: 'A developer wants to get all the field values including all custom fields of an Account record.\n\nWhich approach should be used to retrieve all field values dynamically?',
        options: [
            'Use Account.SObjectType.getDescribe().fields.getMap() to dynamically build a SOQL query with all fields.',
            'Use SELECT * FROM Account in SOQL.',
            'Use Account.getPopulatedFieldsAsMap() on any Account record.',
            'Use TYPEOF in a SOQL query.'
        ],
        correctAnswer: 0,
        explanation: 'SOQL does not support SELECT * syntax. To dynamically retrieve all fields, you need to use the Schema.DescribeSObjectResult to get all field names via fields.getMap(), then construct a SOQL query string with all the field API names. getPopulatedFieldsAsMap() only returns fields already queried, and TYPEOF is for polymorphic relationships.'
    },
    {
        id: 863,
        domain: 'Process Automation and Logic',
        weight: '30%',
        difficulty: 'Medium',
        type: 'single',
        question: 'A developer writes a trigger on the Account object on the before insert event. Inside the trigger, the developer has a SOQL query to find related Contacts.\n\nWhat is the maximum number of Account records that can be processed by this trigger without hitting a governor limit if there is only one SOQL query in the trigger?',
        options: [
            '100',
            '200',
            '2,000',
            'Unlimited — as long as there is only one query'
        ],
        correctAnswer: 2,
        explanation: 'In a before insert trigger, the batch size default is 200 records per trigger invocation. With 1 SOQL query per trigger execution and a limit of 100 SOQL queries, and assuming Data Loader chunk sizes, you could process up to 200 records per chunk × 10 chunks = 2,000 records. However, within a single trigger execution, the SOQL limit is 100 queries. The key is that one query in the trigger means it uses 1 of 100 allowed queries per transaction.'
    },
    {
        id: 864,
        domain: 'Process Automation and Logic',
        weight: '30%',
        difficulty: 'Medium',
        type: 'single',
        question: 'What is a valid way to execute tests in an org to count code coverage?',
        options: [
            'Use the Developer Console to run specific test classes',
            'Use the Metadata API to deploy code with RunAllTestsInOrg',
            'Use SOQL to query ApexCodeCoverage',
            'All of the above'
        ],
        correctAnswer: 3,
        explanation: 'All three methods are valid: Developer Console has a built-in test runner, Metadata API deployments can specify test levels (including RunAllTestsInOrg), and the ApexCodeCoverage and ApexCodeCoverageAggregate objects can be queried via SOQL/Tooling API to check code coverage.'
    },
    {
        id: 865,
        domain: 'Process Automation and Logic',
        weight: '30%',
        difficulty: 'Hard',
        type: 'single',
        question: 'A developer is asked to prevent updates to Accounts from being saved when custom validation criteria are met in an After Update trigger.\n\nWhich technique should be used?',
        options: [
            'Use the addError() method on the sObject or field.',
            'Throw a custom exception in the trigger.',
            'Use Database.rollback() with a savepoint.',
            'Return false from the trigger.'
        ],
        correctAnswer: 0,
        explanation: 'The addError() method is the proper way to prevent a DML operation from saving in a trigger. When called on an sObject or field in a trigger, it adds a validation error that prevents the record from being saved and displays the error message to the user. Throwing exceptions causes unhandled errors, and triggers cannot return values.'
    },
    {
        id: 866,
        domain: 'Developer Fundamentals',
        weight: '23%',
        difficulty: 'Medium',
        type: 'single',
        question: 'A developer creates a custom exception class called InvoiceException that extends Exception.\n\nWhich statement correctly throws this exception?',
        options: [
            'throw new InvoiceException();',
            'throw InvoiceException();',
            'new InvoiceException().throwException();',
            'Exception.throw(new InvoiceException());'
        ],
        correctAnswer: 0,
        explanation: 'In Apex, exceptions are thrown using the throw keyword followed by a new instance of the exception: throw new InvoiceException(); You can also pass a message: throw new InvoiceException(\'Error message\');'
    },
    {
        id: 867,
        domain: 'Process Automation and Logic',
        weight: '30%',
        difficulty: 'Hard',
        type: 'single',
        question: 'A developer is writing Apex to integrate with an external REST API. The API requires an OAuth Bearer token in the Authorization header.\n\nWhich Salesforce feature should the developer use to securely store the API credentials?',
        options: [
            'Custom Settings (protected)',
            'Custom Metadata Types',
            'Named Credentials',
            'Static Resources'
        ],
        correctAnswer: 2,
        explanation: 'Named Credentials are the recommended and most secure way to store external API authentication details (including OAuth). They handle authentication automatically and inject credentials into callout headers without exposing them in code. Custom Settings and Metadata Types can store values but require manual header construction and are less secure.'
    },
    {
        id: 868,
        domain: 'Developer Fundamentals',
        weight: '23%',
        difficulty: 'Medium',
        type: 'single',
        question: 'Which data type in Apex is used to represent a collection of key-value pairs where each key maps to a single value?',
        options: [
            'List',
            'Set',
            'Map',
            'Array'
        ],
        correctAnswer: 2,
        explanation: 'A Map in Apex is a collection of key-value pairs where each unique key maps to a single value. It provides O(1) lookup time. Lists are ordered collections accessed by index. Sets are unordered collections of unique elements. Apex does not have a separate Array type (arrays are syntactic sugar for Lists).'
    },
    {
        id: 869,
        domain: 'Process Automation and Logic',
        weight: '30%',
        difficulty: 'Hard',
        type: 'single',
        question: 'A developer needs to make a callout to an external service from within a trigger.\n\nWhich approach should the developer use?',
        options: [
            'Make the callout directly in the trigger.',
            'Use @future(callout=true) method.',
            'Use Platform Events.',
            'Use a synchronous Queueable.'
        ],
        correctAnswer: 1,
        explanation: 'Callouts cannot be made directly from trigger context because triggers run within a DML transaction. The @future(callout=true) annotation allows the callout to be made asynchronously after the trigger transaction completes. Queueable can also make callouts, but the question asks for the most direct approach.'
    },
    {
        id: 870,
        domain: 'Testing, Debugging, and Deployment',
        weight: '15%',
        difficulty: 'Medium',
        type: 'single',
        question: 'What is the minimum percentage of Apex code coverage required to deploy to a production org?',
        options: [
            '65%',
            '70%',
            '75%',
            '80%'
        ],
        correctAnswer: 2,
        explanation: 'Salesforce requires a minimum of 75% overall Apex code coverage to deploy to production. Additionally, every trigger must have at least 1% coverage (i.e., at least one line must be covered). Code coverage below 75% will cause the deployment to fail.'
    },
    {
        id: 871,
        domain: 'Process Automation and Logic',
        weight: '30%',
        difficulty: 'Medium',
        type: 'single',
        question: 'In which order does Salesforce execute the following events when a record is saved?\n\n1. Workflow rules\n2. Before triggers\n3. Validation rules\n4. After triggers\n5. Assignment rules',
        options: [
            '2, 3, 4, 1, 5',
            '3, 2, 4, 1, 5',
            '2, 3, 1, 4, 5',
            '1, 2, 3, 4, 5'
        ],
        correctAnswer: 0,
        explanation: 'The Salesforce order of execution is: System validation → Before triggers (2) → Custom validation rules (3) → After triggers (4) → Assignment rules → Auto-response rules → Workflow rules (1) → Process Builder → After triggers (if workflow field updates) → Escalation rules → Flows. The simplified order from the options is: Before triggers → Validation rules → After triggers → Workflow rules → Assignment rules.'
    },
    {
        id: 872,
        domain: 'Developer Fundamentals',
        weight: '23%',
        difficulty: 'Medium',
        type: 'single',
        question: 'A developer needs to create a reusable Lightning web component that allows a user to look up and select a record from any object.\n\nWhich base Lightning component should the developer use?',
        options: [
            'lightning-input',
            'lightning-record-picker',
            'lightning-lookup',
            'lightning-combobox'
        ],
        correctAnswer: 1,
        explanation: 'The lightning-record-picker base component provides a lookup field that allows users to search and select records from any Salesforce object. It handles the search, display, and selection UI automatically. lightning-input is for basic inputs, lightning-lookup doesn\'t exist as a base component, and lightning-combobox is for dropdown selections.'
    },
    {
        id: 873,
        domain: 'Process Automation and Logic',
        weight: '30%',
        difficulty: 'Hard',
        type: 'single',
        question: 'Which of the following accurately describes the purpose of the Database.Stateful interface in Batch Apex?',
        options: [
            'It allows the batch class to make callouts.',
            'It maintains instance variable values across batch execute() invocations.',
            'It enables parallel processing of batch chunks.',
            'It automatically retries failed batch executions.'
        ],
        correctAnswer: 1,
        explanation: 'By default, Batch Apex is stateless — instance variables are reset between execute() invocations. Implementing Database.Stateful preserves instance variable values across all execute() calls in a batch job. This is useful for maintaining counters, aggregating results, or tracking state across batches. Database.AllowsCallouts is for callouts, not Stateful.'
    },
    {
        id: 874,
        domain: 'Process Automation and Logic',
        weight: '30%',
        difficulty: 'Medium',
        type: 'single',
        question: 'A developer writes a SOQL query: SELECT Id, Name FROM Account WHERE Industry = :industry LIMIT 50000.\n\nIf the query returns more than 50,000 records, what happens?',
        options: [
            'Only the first 50,000 records are returned.',
            'A LimitException is thrown at runtime.',
            'The query returns all records ignoring the limit.',
            'A compile-time error occurs.'
        ],
        correctAnswer: 1,
        explanation: 'The SOQL governor limit is 50,000 rows per synchronous transaction. If a query attempts to return more than 50,000 records, a System.LimitException is thrown at runtime: "Too many query rows: 50001". The LIMIT clause in the query (LIMIT 50000) matches the governor limit, but if the data exceeds it, the exception is thrown before the LIMIT clause can take effect.'
    },
    {
        id: 875,
        domain: 'User Interface',
        weight: '25%',
        difficulty: 'Medium',
        type: 'single',
        question: 'Which lifecycle hook in a Lightning Web Component fires after the component is inserted into the DOM?',
        options: [
            'constructor()',
            'connectedCallback()',
            'renderedCallback()',
            'disconnectedCallback()'
        ],
        correctAnswer: 1,
        explanation: 'connectedCallback() fires when the component is inserted into the DOM. constructor() fires when the component instance is created (before DOM insertion). renderedCallback() fires after every render. disconnectedCallback() fires when the component is removed from the DOM.'
    },
    {
        id: 876,
        domain: 'Developer Fundamentals',
        weight: '23%',
        difficulty: 'Medium',
        type: 'single',
        question: 'What is the result of the following Apex code?\n\nString s1 = \'Hello\';\nString s2 = s1;\ns1 += \' World\';\nSystem.debug(s2);',
        options: [
            'Hello World',
            'Hello',
            'null',
            'Compile error'
        ],
        correctAnswer: 1,
        explanation: 'Strings in Apex are immutable. When s2 = s1 is executed, s2 gets a reference to the same \'Hello\' string. When s1 += \' World\' executes, a NEW string \'Hello World\' is created and s1 points to it, but s2 still points to the original \'Hello\' string. Therefore, s2 remains \'Hello\'.'
    },
    {
        id: 877,
        domain: 'Process Automation and Logic',
        weight: '30%',
        difficulty: 'Hard',
        type: 'single',
        question: 'A developer writes a trigger that calls a helper method annotated with @future. When running a batch job that fires this trigger, the developer gets an error.\n\nWhat is the likely cause?',
        options: [
            'Batch Apex does not support DML operations.',
            'You cannot call @future methods from a batch Apex context.',
            'The helper method is not marked as static.',
            '@future methods cannot be called from triggers.'
        ],
        correctAnswer: 1,
        explanation: 'You cannot call a @future method from another asynchronous context (batch, queueable, scheduled, or another @future method). Since batch Apex is already asynchronous, calling @future from within a batch job throws a System.AsyncException. The solution is to use Queueable Apex instead, which can be chained from batch.'
    },
    {
        id: 878,
        domain: 'Testing, Debugging, and Deployment',
        weight: '15%',
        difficulty: 'Medium',
        type: 'single',
        question: 'A developer has a test method that requires access to org data, specifically price book entries created by an administrator.\n\nHow should the developer modify the test to access this data?',
        options: [
            'Add @IsTest(SeeAllData=true) to the test method.',
            'Use Test.loadData() to load price book data from a CSV.',
            'Query the standard price book using Test.getStandardPricebookId().',
            'Create price book entries manually in the test setup.'
        ],
        correctAnswer: 2,
        explanation: 'Test.getStandardPricebookId() is a method specifically designed to retrieve the standard price book ID in test context without needing SeeAllData=true. This is the best practice for tests that work with price books. SeeAllData=true should be avoided when possible as it creates fragile tests.'
    },
    {
        id: 879,
        domain: 'Developer Fundamentals',
        weight: '23%',
        difficulty: 'Medium',
        type: 'multi',
        question: 'Which TWO statements about Apex interfaces are correct? (Choose 2)',
        options: [
            'An interface can contain method implementations.',
            'A class can implement multiple interfaces.',
            'Interfaces can have instance variables.',
            'All methods in an interface are implicitly public and abstract.'
        ],
        correctAnswer: [1, 3],
        explanation: 'In Apex, a class can implement multiple interfaces (B), and all methods declared in an interface are implicitly abstract (no body) and public (D). Interfaces cannot contain method implementations (A — that would be an abstract class) or instance variables (C).'
    },
    {
        id: 880,
        domain: 'Process Automation and Logic',
        weight: '30%',
        difficulty: 'Medium',
        type: 'single',
        question: 'A developer is building a Lightning web component to display account details. The component should automatically refresh the data when the record is updated by another user.\n\nWhich approach should the developer use?',
        options: [
            'Use setInterval() to periodically query the record.',
            'Use the lightning-emp-api component to subscribe to a Platform Event.',
            'Use refreshApex() to refresh the @wire data.',
            'Use getRecordNotifyChange() to refresh the Lightning Data Service cache.'
        ],
        correctAnswer: 3,
        explanation: 'getRecordNotifyChange() (now notifyRecordUpdateAvailable()) notifies the Lightning Data Service that a record has been updated, causing all components using that record to refresh. This is the standard LDS approach for cross-component data refresh. refreshApex() only works within the same component. Platform Events would work but are more complex. setInterval polling is inefficient.'
    },
    {
        id: 881,
        domain: 'Process Automation and Logic',
        weight: '30%',
        difficulty: 'Hard',
        type: 'single',
        question: 'What is the maximum number of records that can be passed to a DML statement in a single transaction?',
        options: [
            '5,000',
            '10,000',
            '50,000',
            'There is no limit on records per DML, only total DML statements.'
        ],
        correctAnswer: 1,
        explanation: 'The governor limit for the total number of records processed by DML statements in a single transaction is 10,000. This includes all insert, update, delete, and undelete operations combined. Exceeding this limit throws a LimitException.'
    },
    {
        id: 882,
        domain: 'User Interface',
        weight: '25%',
        difficulty: 'Medium',
        type: 'single',
        question: 'A developer needs to display a toast message in a Lightning web component after a record is successfully created.\n\nWhich module should be imported to show the toast?',
        options: [
            "import { ShowToastEvent } from 'lightning/platformShowToastEvent';",
            "import { Toast } from 'lightning/toast';",
            "import { showToast } from 'lightning/notifications';",
            "import { ToastEvent } from 'lightning/events';"
        ],
        correctAnswer: 0,
        explanation: 'ShowToastEvent is imported from the lightning/platformShowToastEvent module. You create a new ShowToastEvent with title, message, and variant properties, then dispatch it using this.dispatchEvent(). This is the standard way to show toast notifications in LWC.'
    },
    {
        id: 883,
        domain: 'Testing, Debugging, and Deployment',
        weight: '15%',
        difficulty: 'Hard',
        type: 'single',
        question: 'A developer has a callout in their Apex code that needs to be tested. The endpoint returns different responses based on the request.\n\nWhich interface must be implemented to test the callout?',
        options: [
            'HttpCallout',
            'HttpCalloutMock',
            'WebServiceMock',
            'StaticResourceCalloutMock'
        ],
        correctAnswer: 1,
        explanation: 'The HttpCalloutMock interface must be implemented to test HTTP callouts in Apex. The implementing class defines the mock response returned during test execution. WebServiceMock is for WSDL-based callouts. StaticResourceCalloutMock is a utility class, not an interface. HttpCallout doesn\'t exist.'
    },
    {
        id: 884,
        domain: 'Process Automation and Logic',
        weight: '30%',
        difficulty: 'Medium',
        type: 'single',
        question: 'A developer needs to ensure that a custom Apex class can be used as a data source for a Lightning Web Component\'s @wire decorator.\n\nWhich annotation must be added to the Apex method?',
        options: [
            '@RemoteAction',
            '@AuraEnabled(cacheable=true)',
            '@InvocableMethod',
            '@HttpGet'
        ],
        correctAnswer: 1,
        explanation: 'For an Apex method to be used with the @wire decorator in LWC, it must be annotated with @AuraEnabled(cacheable=true). The cacheable=true parameter is required for @wire — without it, you can only call the method imperatively. @RemoteAction is for Visualforce, @InvocableMethod is for Flows, and @HttpGet is for REST APIs.'
    },
    {
        id: 885,
        domain: 'Developer Fundamentals',
        weight: '23%',
        difficulty: 'Medium',
        type: 'single',
        question: 'Which SOQL clause is used to filter the results of an aggregate query based on the aggregated values?',
        options: [
            'WHERE',
            'HAVING',
            'GROUP BY',
            'ORDER BY'
        ],
        correctAnswer: 1,
        explanation: 'The HAVING clause filters results of an aggregate query based on aggregated values (e.g., HAVING COUNT(Id) > 5). WHERE filters individual rows before aggregation. GROUP BY groups the results. ORDER BY sorts the results. HAVING is to GROUP BY what WHERE is to SELECT.'
    },
    {
        id: 886,
        domain: 'Process Automation and Logic',
        weight: '30%',
        difficulty: 'Hard',
        type: 'multi',
        question: 'A developer creates a batch class that processes Opportunities. The batch needs to send a summary email after all batches are processed.\n\nWhich TWO approaches allow the developer to track processed record counts across execute() calls and send the email? (Choose 2)',
        options: [
            'Use a static variable to count records across execute() calls.',
            'Implement Database.Stateful and use an instance variable.',
            'Send the email in the finish() method after tracking counts with Database.Stateful.',
            'Use Custom Settings to store the count.'
        ],
        correctAnswer: [1, 2],
        explanation: 'Database.Stateful maintains instance variable values across execute() calls (B), allowing you to track counts. The finish() method runs after all execute() calls complete (C), making it the ideal place to send the summary email. Static variables are reset between execute() calls in batch. Custom Settings would work but is an overcomplicated approach.'
    },
    {
        id: 887,
        domain: 'User Interface',
        weight: '25%',
        difficulty: 'Medium',
        type: 'single',
        question: 'In a Lightning Web Component, what is the purpose of the @api decorator?',
        options: [
            'To make a property reactive within the component.',
            'To expose a property or method as public, accessible by parent components.',
            'To connect a property to an Apex method.',
            'To make a property available in the component\'s CSS.'
        ],
        correctAnswer: 1,
        explanation: 'The @api decorator marks a property or method as public, making it accessible to parent components. This enables parent-to-child communication in LWC. @track (now implicit) makes properties reactive. @wire connects to Apex methods. CSS cannot access JavaScript properties directly.'
    },
    {
        id: 888,
        domain: 'Process Automation and Logic',
        weight: '30%',
        difficulty: 'Medium',
        type: 'single',
        question: 'Which asynchronous Apex feature is best suited for executing a long-running operation that needs to process a very large dataset (millions of records)?',
        options: [
            '@future methods',
            'Queueable Apex',
            'Batch Apex',
            'Scheduled Apex'
        ],
        correctAnswer: 2,
        explanation: 'Batch Apex (Database.Batchable interface) is designed for processing very large datasets by breaking them into manageable chunks (up to 200 records per execute() call by default, up to 2,000). It can process millions of records. @future has a limited scope, Queueable processes a single chunk, and Scheduled Apex is for scheduling, not large dataset processing.'
    },
    {
        id: 889,
        domain: 'Developer Fundamentals',
        weight: '23%',
        difficulty: 'Medium',
        type: 'single',
        question: 'What is the result of the following Apex code?\n\nList<String> colors = new List<String>{\'Red\', \'Blue\', \'Green\'};\ncolors.add(\'Yellow\');\ncolors.remove(1);\nSystem.debug(colors);',
        options: [
            '(Red, Green, Yellow)',
            '(Red, Blue, Yellow)',
            '(Blue, Green, Yellow)',
            '(Red, Green)'
        ],
        correctAnswer: 0,
        explanation: 'Starting with [Red, Blue, Green], add(\'Yellow\') makes it [Red, Blue, Green, Yellow]. remove(1) removes the element at index 1 (Blue), resulting in [Red, Green, Yellow].'
    },
    {
        id: 890,
        domain: 'Testing, Debugging, and Deployment',
        weight: '15%',
        difficulty: 'Medium',
        type: 'single',
        question: 'A developer needs to debug a complex Apex trigger that is not working as expected.\n\nWhat is the best approach to identify the issue?',
        options: [
            'Add System.debug() statements and review the debug logs.',
            'Use the Apex Interactive Debugger (ISV Debugger) to set breakpoints.',
            'Deploy the code to production and test there.',
            'Remove the trigger and recreate it from scratch.'
        ],
        correctAnswer: 0,
        explanation: 'System.debug() statements with debug logs are the standard and most accessible approach for debugging Apex triggers. The Interactive Debugger requires ISV partner setup and is not commonly available. Testing in production is bad practice. Recreating from scratch is wasteful.'
    },
    {
        id: 891,
        domain: 'Process Automation and Logic',
        weight: '30%',
        difficulty: 'Hard',
        type: 'single',
        question: 'A developer has a trigger on the Account object that performs a SOQL query inside a for loop. When a bulk data load of 200 Accounts occurs, the trigger throws a governor limit exception.\n\nWhat is the best way to resolve this issue?',
        options: [
            'Add LIMIT 1 to the SOQL query inside the loop.',
            'Move the SOQL query outside the for loop and use a Map to store the results.',
            'Use @future to process the records asynchronously.',
            'Change the trigger to run only on after insert events.'
        ],
        correctAnswer: 1,
        explanation: 'The issue is a non-bulkified trigger with SOQL inside a loop, which will hit the 100-query limit. The fix is to move the SOQL outside the loop, collect all needed IDs first, run a single query, and store results in a Map for O(1) lookup inside the loop. This is the core "bulkification" pattern.'
    },
    {
        id: 892,
        domain: 'Developer Fundamentals',
        weight: '23%',
        difficulty: 'Easy',
        type: 'single',
        question: 'Which relationship type in Salesforce allows a child record to exist without a parent?',
        options: [
            'Master-Detail',
            'Lookup',
            'External Lookup',
            'Hierarchical'
        ],
        correctAnswer: 1,
        explanation: 'Lookup relationships are loosely coupled — the child record can exist independently without a parent (the lookup field can be null). Master-Detail relationships are tightly coupled — the child record must always have a parent and is deleted if the parent is deleted (cascade delete).'
    },
    {
        id: 893,
        domain: 'Process Automation and Logic',
        weight: '30%',
        difficulty: 'Medium',
        type: 'single',
        question: 'Which Apex collection type should a developer use to ensure that a group of values contains no duplicate elements?',
        options: [
            'List<String>',
            'Set<String>',
            'Map<String, String>',
            'String[]'
        ],
        correctAnswer: 1,
        explanation: 'Set<String> automatically ensures uniqueness — if you try to add a duplicate value, it is silently ignored. Lists and arrays allow duplicates. Maps enforce unique keys but store key-value pairs, which is more than needed for just ensuring unique values.'
    },
    {
        id: 894,
        domain: 'User Interface',
        weight: '25%',
        difficulty: 'Medium',
        type: 'single',
        question: 'A developer needs to surface a Lightning Web Component on a record page and allow administrators to configure the component\'s behavior in Lightning App Builder.\n\nWhat should the developer define?',
        options: [
            'A design resource (.design) in the component bundle.',
            'A configuration file (.js-meta.xml) with targets and properties.',
            'A controller (.controller.js) with configurable attributes.',
            'A style file (.css) with custom properties.'
        ],
        correctAnswer: 1,
        explanation: 'The .js-meta.xml configuration file defines where the LWC can be placed (targets like lightning__RecordPage) and what properties administrators can configure in Lightning App Builder. The design resource was for Aura components. Controllers handle logic, not configuration. CSS handles styling.'
    },
    {
        id: 895,
        domain: 'Testing, Debugging, and Deployment',
        weight: '15%',
        difficulty: 'Medium',
        type: 'multi',
        question: 'Which TWO types of sandboxes can run all Apex tests during deployment? (Choose 2)',
        options: [
            'Developer Sandbox',
            'Developer Pro Sandbox',
            'Partial Copy Sandbox',
            'Full Copy Sandbox'
        ],
        correctAnswer: [2, 3],
        explanation: 'Partial Copy and Full Copy sandboxes include data (a subset or full copy respectively) and can run all Apex tests during deployment, simulating production behavior. Developer and Developer Pro sandboxes are smaller, primarily for development, and while they can run tests, they don\'t include production data for realistic testing.'
    },
    {
        id: 896,
        domain: 'Process Automation and Logic',
        weight: '30%',
        difficulty: 'Medium',
        type: 'single',
        question: 'A developer is writing a test class for a trigger that creates Tasks when Opportunities close. The test needs to verify that Tasks are created correctly.\n\nWhich best practice should the developer follow?',
        options: [
            'Use System.assert() to verify the Task count after inserting Opportunities.',
            'Use SeeAllData=true to access existing Opportunities.',
            'Test only with a single Opportunity record.',
            'Skip negative test scenarios.'
        ],
        correctAnswer: 0,
        explanation: 'Using System.assert() (or System.assertEquals()) to verify expected outcomes after performing DML operations is the core of unit testing. SeeAllData=true should be avoided. Tests should include bulk scenarios (not just single records) and negative test cases. However, assertion is the most fundamental best practice.'
    },
    {
        id: 897,
        domain: 'Developer Fundamentals',
        weight: '23%',
        difficulty: 'Hard',
        type: 'single',
        question: 'A developer writes the following code:\n\nfor(Account a : [SELECT Id, Name FROM Account]) {\n    // Process each account\n}\n\nIf the org has more than 50,000 Account records, what happens?',
        options: [
            'Only the first 50,000 records are processed.',
            'A System.LimitException is thrown.',
            'The query automatically paginates.',
            'The for loop processes all records regardless of limits.'
        ],
        correctAnswer: 1,
        explanation: 'A SOQL for loop provides governor-limit-friendly processing by retrieving records in batches of 200, but the total number of rows returned still counts against the 50,000 row limit. If the query would return more than 50,000 rows, a LimitException is thrown. For processing more records, use Batch Apex.'
    },
    {
        id: 898,
        domain: 'Process Automation and Logic',
        weight: '30%',
        difficulty: 'Medium',
        type: 'single',
        question: 'A developer needs to schedule an Apex class to run every day at midnight.\n\nWhich approach should be used?',
        options: [
            'Use the System.schedule() method with a cron expression.',
            'Use @future with a delay parameter.',
            'Use Database.executeBatch() with a timer.',
            'Use a workflow time-based action.'
        ],
        correctAnswer: 0,
        explanation: 'System.schedule() takes a job name, a CRON expression (e.g., \'0 0 0 * * ?\' for midnight daily), and an instance of a class implementing the Schedulable interface. @future does not support delays. Database.executeBatch has no timer parameter. Workflow actions cannot invoke Apex.'
    },
    {
        id: 899,
        domain: 'Developer Fundamentals',
        weight: '23%',
        difficulty: 'Medium',
        type: 'single',
        question: 'What is the purpose of the transient keyword in Apex when used with Visualforce?',
        options: [
            'It makes the variable available across multiple page requests.',
            'It prevents the variable from being included in the view state, reducing page size.',
            'It makes the variable read-only.',
            'It encrypts the variable value in the page source.'
        ],
        correctAnswer: 1,
        explanation: 'The transient keyword in Apex prevents a variable from being serialized into the Visualforce view state. This reduces the view state size (which has a 170 KB limit) by excluding data that can be recalculated or is only needed temporarily. It does NOT make variables read-only or encrypt them.'
    },
    {
        id: 900,
        domain: 'Process Automation and Logic',
        weight: '30%',
        difficulty: 'Hard',
        type: 'single',
        question: 'A developer needs to implement logic that runs after all records in a trigger batch have been committed to the database, and the logic needs to perform DML on other objects.\n\nWhich trigger context should be used?',
        options: [
            'before insert',
            'before update',
            'after insert',
            'after update with a @future method for the DML'
        ],
        correctAnswer: 2,
        explanation: 'After insert/update triggers run after the records have been committed to the database. You can perform DML on other objects in after triggers (as long as you don\'t modify Trigger.new directly). A @future method is not necessary for DML in after triggers unless you need callouts or async processing.'
    }
];
console.log(QUESTION_BANK.length);
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { QUESTION_BANK };
}
