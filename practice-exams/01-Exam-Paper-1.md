# Exam Paper 1: Developer Fundamentals Part 1 – PD1
**Source:** K2 University (Focus on Force)
**Score:** 22/58 (37.93%)

---

A construction company in the housing development business uses the Contact object to track different types of contacts they deal with on a daily basis. The company's Salesforce developer is building a feature for its partner contacts and has written the code below to determine information about a specific record type. Which line of code should be added to line 5?Choose 1 answer.
RecordType recType = [SELECT Id,Name FROM RecordType WHERE SobjectType='Contact' AND DeveloperName='PartnerContact' LIMIT 1]; Schema.DescribeSObjectResult result = Schema.SObjectType.Contact; 5. Schema.RecordTypeInfo recordTypeInfo = mapRecTypes.get(recType.id);
Map<Id,Schema.RecordTypeInfo> mapRecTypes = result.getRecordTypeInfos();
Map<Id,Schema.RecordTypeInfo> mapRecTypes = result.getRecordTypeInfosById(); (Correct)
Map<Id,Schema.RecordTypeInfo> mapRecTypes = result.getRecordTypes();
Map<Id,Schema.RecordTypeInfo> mapRecTypes = result.getRecordTypeIds();

A developer would like to return the developer name of a particular record type using a method of the 'RecordTypeInfo' class. Which method is available for this use case?Choose 1 answer.
getName()
getRecordTypeInfosByDeveloperName()
getRecordTypeInfosByName()
getDeveloperName() (Correct)

A developer has declared and initialized a variable named 's' of type String[] to store multiple sObject types. He uses the code below to get describe metadata information for the sObject types.
Schema.DescribeSobjectResult[] r = Schema.describeSObjects(s);
Which method of the DescribeSObjectResult class can be used to determine whether an sObject appears as 'Account' in the user interface?Choose 1 answer.
isName()
getName()
getLabel() (Correct)
isLabel()

A developer would like to create a new sObject with default values using the describe information of a similar sObject. Which of the following can be used to obtain information about the type of sObject from an sObject describe result?Choose 1 answer.
getSObjectName()
getSObject()
getSObjectType() (Correct)
getType()

How can a dynamic SOQL query be created at runtime using input from an end user?Choose 1 answer.
Use the Database.execute(string) with a query specified in the string
Use the Database.search(string) with a query specified in the string
Use the SOQL.execute(string) with a query specified in the string
Use the Database.query(string) with a query specified in the string (Correct)

What is true regarding accessing sharing programmatically?Choose 3 answers.
Objects on the detail side of a master-detail relationship do not have a sharing object (Correct)
CustomObject__Share is the sharing object for a custom object (Correct)
AccountShare is the sharing object for the Account object (Correct)
Account__Share is the sharing object for the Account object
Programmatic sharing can only give record access to one individual user at a time

How can a developer check if the current user is able to delete the current object?Choose 1 answer.
Use the canDelete() method of the SObjectResult Class
Use the canDelete() method of the DescribeSObjectResult Class
Use the isDeletable() method of the DescribeSObjectResult Class (Correct)
Use the Deletable() method of the SObjectResult Class

How can a developer check the maximum number of digits for an integer field?Choose 1 answer.
Use the getDigits() method of the DescribeFieldResult Class (Correct)
Use the getScale() method of the DescribeFieldResult Class
Use the getLength() method of the DescribeFieldResult Class
Use the getSize() method of the DescribeFieldResult Class

How can a developer check if the current user is able to view a particular field?Choose 1 answer.
Use the isViewable() method of the DescribeFieldResult Class
Use the isAccessible() method of the DescribeFieldResult Class (Correct)
Use the isViewable() method of the DescribeField Class
Use the isAccessible() method of the DescribeField Class

How can a developer get all picklist values of a specific field via Apex?Choose 1 answer.
Use the getPicklistValues method (Correct)
Use the fieldPicklist method
Use the globalPicklist method
Use the describePicklist method

How can a developer check if a user has read access to a field and if the field can be displayed on a Visualforce page?Choose 1 answer.
Call the IsAccessible() method of Schema.DescribeSObjectResult to verify field level read permission
Call the isReadable() method of Schema.SObjectResult to verify field level read permission
Call the isAccessible() method of Schema.DescribeFieldResult to verify field level read permission (Correct)
Call the isViewable() method of Schema.DescribeFieldResult to verify field level read permission

What method can be used to obtain metadata information about all the sObjects in an organization?Choose 1 answer.
describeObjects()
getGlobalSObjects()
getGlobalDescribe() (Correct)
describeSObjects()

Cosmic Lux is a company that uses Salesforce as the primary system to manage accounts. An ERP system is currently used to manage contact records of customers in Europe. The sales director of the company would like to store only the accounts associated with these contacts in Salesforce. To make the related contacts visible in Salesforce, Salesforce Connect should be used. The contacts in the ERP system have not been configured to store the Salesforce ID of the parent account record. A developer has been asked to show all the related contacts from the external system on the account detail page in Salesforce. Once Salesforce Connect has been configured, which relationship field should the developer define on the external object for this requirement?Choose 1 answer.
Lookup
Internal Lookup
Indirect Lookup (Correct)
External Lookup

Phone Factory uses a custom object named Phone Inventory which has a Geolocation field named Storage Location. A developer is writing a trigger that needs to update Storage Location when certain conditions are met. What is the proper syntax for accessing and modifying this field in Apex?Choose 1 answer.
Phone_Inventory__c.Storage_Location__latitude__s AND/OR Phone_Inventory__c.Storage_Location__longitude__s (Correct)
Phone_Inventory__c.Storage_Location__c.latitude_s AND/OR Phone_Inventory__c.Storage_Location__c.longitude_s
Phone_Inventory__c.Storage_Location__c
Phone_Inventory__c.Storage_Location__c.latitude AND/OR Phone_Inventory__c.Storage_Location__c.longitude

Cosmic Luxio is a company that manufactures and sells luxury watches. Customers can purchase products from the company's website or by visiting an authorized retail store. Each retail store uses a custom web application for managing sales orders. The application supports making custom HTTP POST requests to external endpoints. Salesforce is used by the employees who work at the company's headquarters. When a new sales order is created by a retail store, certain users in Salesforce should be notified and a record of a custom object should be created automatically. A platform event with several custom fields has been defined by a developer for this use case. Which approach should be utilized to publish a platform event message using the custom web application for this requirement?Choose 1 answer.
Use EMP Connector to create a custom client that can publish platform event messages to the event bus.
Use a flow to publish a platform event message to the event bus.
Use REST API to send a POST request with a platform event message to a Salesforce endpoint. (Correct)
Use SOAP API to send a POST request with a platform event message to a Salesforce endpoint.

Cosmic Electronics uses Salesforce to manage opportunities. The company also uses an external order management application to manage orders. Sales users use the application to create orders manually after winning sales deals. However, the sales director would like to automate this process. When an opportunity is won, the external application should receive a notification and create the associated Order record automatically based on the details in the notification. A developer of the company has decided to use a platform event for this use case. Which of the following should be utilized when using a platform event to meet this requirement?Choose 3 answers.
Platform event definition with custom fields (Correct)
Custom object definition with custom fields
CometD client that subscribes to the platform event channel (Correct)
Apex trigger or flow that publishes an event message (Correct)
Apex class that subscribes to the platform event channel

What is a valid consideration regarding development in a multi-tenant environment?Choose 1 answer.
Although Salesforce runs in the cloud, client software is still required
Salesforce organizations can choose to accept upgrades, so different organizations may be on different releases
Salesforce upgrades are automatic and cannot be scheduled on a particular date (Correct)
Salesforce upgrades sandbox environments at the same time as production environments

What is true regarding the Salesforce multitenant environment?Choose 2 answers.
All customers share the same code base, but have their own database
Automatic upgrades are applied during the year according to the Salesforce release schedule to all customers (Correct)
All customizations are specified as metadata, allowing for easy upgrades (Correct)
Metadata includes configuration but not code

Which of the following are valid considerations that a new developer should be aware of when developing in a multi-tenant environment?Choose 2 answers.
Restrictions are enforced on code that can be deployed into a production environment (Correct)
The number of API calls allowed is unlimited
Governor limits ensure that the amount of CPU time is monitored and limited per customer over a defined time period to ensure that performance in one org is not impacted by another (Correct)
Many customers share the same instance, so queries need to ensure the correct organization id is referenced to return the correct organizational data

Which of the following are true regarding developing in the Salesforce multi-tenant environment?Choose 2 answers.
It is not possible to index application data as each tenant stores different types of data in the same application table
Queries should be selective in terms of the number of records returned (Correct)
Salesforce optimizes several different data persistence technologies to implement polyglot persistence. (Correct)
The custom domain feature ensures that different customers do not access each other's data

Because Apex runs in a multitenant environment, the Apex runtime engine enforces governor limits to ensure that Apex code or processes don't monopolize shared resources. What are valid examples of these limits?Choose 3 answers.
Total number of records retrieved by SOQL queries (Correct)
Total amount of storage that can be consumed
Total number of DML statements to execute (Correct)
Maximum execution time for a DML operation
CPU time per transaction (Correct)

Cosmic Solutions uses a third-party platform for managing their employees' compensation plans. It needs to be integrated with its Salesforce org. For example, when the third-party platform sends a request for a particular resource to the org, the org should respond to the request by sending data in JSON format. In addition, when certain records are changed in the org, the third-party platform should be automatically notified of the change. Which of the following should be used to meet the requirement?Choose 2 answers.
REST API (Correct)
Streaming API (Correct)
Bulk API
SOAP API

Cosmic Innovation is considering the use of the Lightning Component Framework to build a custom application for managing the company's products. Which of the following are valid capabilities of the framework that would be useful for understanding how to develop and provide access to the custom application?Choose 3 answers.
The components built using the framework offer cross-browser compatibility but not device-awareness.
The framework utilizes stateless client and stateful server, which improves efficiency and responsiveness.
The framework uses JavaScript on the client-side and Apex on the server-side. (Correct)
The framework provides two programming models for development, namely, Aura Components and Lightning Web Components. (Correct)
The components built using the framework can be added as custom tabs on the navigation bar. (Correct)

Cosmic Finance Solutions has recently switched to Lightning Experience. The Salesforce Administrator of the company would like to make use of Lightning components to enhance the user experience. Which of the following can be created using the Lightning App Builder?Choose 3 answers.
Custom page layouts
Custom record pages (Correct)
Single-page apps (Correct)
Custom Lightning components
Custom home pages (Correct)

A Salesforce Developer working for Cosmic Traders would like to create a custom Lightning App page in Lightning App Builder to meet a particular business requirement that contains reports, dashboards and some components from installed packages. Which of the following can be added to the Lightning App page?Choose 2 answers.
Primary components
Standard components (Correct)
Global actions (Correct)
Object-specific actions

What constitutes the Model layer in the Model-View-Controller architecture?Choose 2 answers.
Standard Pages
Visualforce Pages
Standard Objects (Correct)
Custom Objects (Correct)

What is correct in respect to the Salesforce MVC paradigm?Choose 1 answer.
All Statements are true (Correct)
Visualforce pages are part of MVC
Standard pages are part of MVC
Custom Objects are part of MVC

A sales user needs to track customer preferences and product interests. Which of the following options falls under the Model layer of Salesforce's MVC architecture?Choose 1 answer.
Creating a Visualforce page
Defining an Apex controller
Defining a page layout
Creating a custom field (Correct)

Which of the following are part of the model layer in the MVC model?Choose 3 answers.
Fields (Correct)
Relationships (Correct)
Page Layouts
Tabs
Objects (Correct)

Which of the following correctly describes how the Salesforce platform features map to the MVC software design pattern?Choose 1 answer.
Model: Standard and Custom Objects; View: JavaScript; Controller: Standard and Custom Controllers
Model: Standard and Custom Objects; View: Pages and Components; Controller: Standard and Custom Controllers (Correct)
Model: JavaScript; View: Visualforce Pages; Controller: Custom Apex Class
Model: Apex Classes; View: Pages and Components; Controller: Standard and Custom Objects

Eric was told that Visualforce is part of the MVC paradigm. In this context, what does MVC stand for?Choose 1 answer.
Master Class Variable
Master Control Variable
Model Variable Controller
Model View Controller (Correct)

Which of the following options represent the controller layer in the MVC architecture of a Salesforce application?Choose 2 answers.
Visualforce Controller (Correct)
Apex Controller (Correct)
List View
Lightning App page

Which of the following events are fired when an Aura component loads on a page?Choose 3 answers.
afterRender (Correct)
start
load
init (Correct)
render (Correct)

A Salesforce developer is building a Lightning Aura component and is refactoring code to create a common function that will be reused by several other JavaScript functions in the component. Which file in the component bundle should contain the common function?Choose 1 answer.
The component file
The design file
The controller file
The helper file (Correct)

A developer is creating a custom Lightning page with multiple Aura components and wants certain components to refresh when the information in other components changes. The components causing the change and the components that need to be refreshed may or may not be in the same parent component. How can this be accomplished?Choose 1 answer.
Use an application event to notify other components of the change and give them a chance to handle it (Correct)
Use viewstate to detect changes in components and update other components accordingly
Use the reRender attribute and an onchange event handler
Use a component event to notify other components of the change and give them a chance to handle it

A company has a business requirement that cannot be met using the declarative tools available in its Salesforce org. As a result, the Salesforce Administrator of the company has resorted to installing a suitable package available in the AppExchange marketplace. What are the benefits of using AppExchange?Choose 2 answers.
AppExchange can scan an org for any security vulnerabilities.
AppExchange apps may include support and maintenance. (Correct)
AppExchange offers reviewed and proven solutions for customers. (Correct)
AppExchange installs additional development tools in the org.

Cosmic Solutions has a custom object called Weekly Employee Summary, which stores a summary of employee data that is tracked in Salesforce, such as hours worked and wage totals. An autolaunched flow has been built to calculate this information and create a new Weekly Employee Summary record for each employee every time it is run. Currently, a Salesforce Administrator needs to run this flow manually once a week. They would like this type of operation to be run automatically in the future. Which solutions would meet this requirement?Choose 2 answers.
Use a TimeSync Automation Rule to run the flow weekly.
Invoke the flow from a schedule-triggered flow. (Correct)
Invoke the flow from an Apex job that runs weekly. (Correct)
Configure the flow on the 'Scheduled Jobs' page in Setup.

A service manager wants to send an email reminder to customers who have failed their energy audit to schedule another audit after they have completed the required modifications. The service manager wants the reminders to be sent weekly for all the records that still have a failed audit status. How should this requirement be met?Choose 1 answer.
Create an auto-response rule to send an email reminder for the set of records with a failed audit status.
Create a validation rule to verify failed audit status of records and use an email action to send the email reminders.
Create a scheduled flow for the set of records with a failed audit status to send an email. (Correct)
Create a batch Apex job for the records that failed the energy audit and use scheduled Apex to schedule the emails.

There is a requirement that when an opportunity is closed, commission records should be created automatically for each member of the related opportunity team. The 'Commission' custom object has a currency field whose value is calculated based on the role of the opportunity team member and the Type and Amount of the related opportunity. Which automation tool should be used to meet this requirement?Choose 1 answer.
Approval Process
Apex Trigger
Validation Rule
Flow Builder (Correct)

There is a requirement to rate all accounts daily based on the values of the opportunities closed in the current year, the number of open opportunities, and the opportunity close rates. The account with the highest aggregated result should be rated number 1, and so on until the account with the lowest rating is updated. How could this requirement be achieved?Choose 1 answer.
Use a report subscription to run nightly and update account ratings.
Use an Apex trigger on the Account object and schedule it to run each night.
Use a platform event-triggered flow to run scheduled nightly updates.
Use a Batch Apex job and schedule it to run each night. (Correct)

Cosmic Containers requires that when saving an opportunity record, a check is performed to determine if the opportunity amount is the highest value amongst all the opportunities created in the current year. If so, a checkbox on the opportunity record should be marked, and an email should be sent to the record owner's manager. Which Salesforce feature should be recommended to handle this requirement?Choose 1 answer.
Flow Builder (Correct)
Approval Process
Formula Field
Apex Trigger

Global Insurance would like users to be able to enter policy and advisor details on a screen. When a user clicks the 'Next' button on the screen, the advisor commission related to the details entered by the user should be displayed on the next screen. What would be the recommended solution for this requirement?Choose 1 answer.
Create a Visualforce wizard
Create a flow with Flow Builder (Correct)
Create an Apex Class
Create an approval process

A Salesforce developer needs to build a record page displaying fields from its parent record. Which is the most efficient solution of the given options?Choose 1 answer.
Add fields directly from the parent object using the page layout editor
Build a custom Lightning component to display any field from the parent
Create cross-object formula fields to display the necessary fields
Enable Dynamic Forms and drag and drop fields on the record page (Correct)

A 'Country Code' custom field on the Account object needs to be validated against 200 ISO country codes. Which of the following should be used to automate the validation when creating or updating accounts?Choose 1 answer.
Validation rule (Correct)
Formula field
Geolocation field
Apex trigger

A developer is required to ensure that a reason is entered if an opportunity stage is updated to 'Closed Lost'. What is the best way to meet this requirement?Choose 1 answer.
Required field
Formula field
Validation rule (Correct)
Apex trigger

Which of the following use cases are valid for using declarative customization?Choose 3 answers.
Displaying the number of employees of the account related to an opportunity on the Opportunity page layout (Correct)
Calculating the number of days until an opportunity closes and displaying the value on a report (Correct)
Displaying the discount amount on an opportunity using a roll-up summary field that uses cross-object formula fields
Meeting high-performance batch processing requirements in an org with a large data volume
Determining a lead rating that is based on the value of three fields on the lead record (Correct)

A requirement has been given to display the average value of won opportunities on the Account page layout. How can this be best achieved?Choose 1 answer.
Use a trigger on the opportunity object
Use a trigger on the account object
Use roll-up summary fields and a formula field (Correct)
Use a roll-up summary field with the average function

Which capabilities are enabled by the agentic chat feature within Agentforce Vibes?Choose 2 answers.
Generating real-time code suggestions for Apex and LWC files.
Enforcing naming conventions and security guidelines through persistent instructions.
Implementing complex, multi-step development workflows automatically. (Correct)
Allowing developers to converse with Agentforce to analyze existing code. (Correct)

What is the significance of the Model Context Protocol (MCP) integration with Agentforce?Choose 1 answer.
MCP is a proprietary protocol that securely restricts Agentforce to only communicate with hosted models within the Salesforce Trust Boundary.
MCP transforms Agentforce into a complete development ecosystem by granting it access to live org data, configuration details, and third-party services. (Correct)
MCP is the conversational mode that developers use to separate strategic planning (Plan Mode) from code execution (Act Mode) within the Agentforce Vibes extension.
MCP guarantees that all generative AI responses are audited for explicit feedback and are scanned for toxicity before the final output is provided to the developer.

Which outcomes are benefits derived from Agentforce rules and workflows?Choose 2 answers.
Automating test creation for edge-case scenarios.
Ensuring compliance with security guidelines. (Correct)
Identify developers who do not follow best practices.
Maintaining naming conventions. (Correct)

A Salesforce development team is experimenting with different Agentforce modes to understand how each affects automation and task execution. Which actions are characteristic of Agentforce’s Act mode?Choose 2 answers.
Assessing org architecture
Running tests directly in the org (Correct)
Designing implementation strategies
Deploying metadata to the org (Correct)

What occurs when the Pro model's daily usage limit is reached in Agentforce Vibes?Choose 1 answer.
All subsequent requests are automatically rejected until the 24-hour reset period passes.
The developer is prompted to manually switch to the Salesforce Core (SFR) model tier.
All subsequent requests are still directed to the Pro model tier, but generation latency increases.
All subsequent requests are automatically redirected to the Salesforce Core (SFR) model. (Correct)

A development team has reached its daily limit for using the premium Pro model tier in Agentforce Vibes. What are the key usage considerations associated with the Pro model tier?Choose 2 answers.
There is a daily usage limit of 50 requests per org per day. (Correct)
The limit resets 24 hours after the last request is made to the Pro model.
There is a daily usage limit of 1 million tokens per org per day. (Correct)
Once the limit is reached, requests are rejected until the daily limit resets.

A company is exploring Salesforce’s new AI-powered development tools to help its teams work more efficiently. What is the primary purpose of the Agentforce Vibes extension, and where is it available?Choose 2 answers.
It is a free AI extension that comes pre-installed in Code Builder, which is also known as the Agentforce Vibes IDE. (Correct)
It is primarily used for cross-team project planning, allocating developer resources, and managing sprint backlogs.
It boosts developer productivity by automating test creation and generating inline completions for Apex and LWC. (Correct)
It is available in Visual Studio Code for those who have the paid version of the Salesforce Extension Pack.

Which 2 of the 5 core components represent enabling Agentforce to perform intelligent and context-aware operations?Choose 2 answers.
Actions, which serve as the persistent memory layer that allows the agent to retain conversational context across multiple sessions.
Data, which provides the secure information foundation for agents using structured and unstructured sources. (Correct)
Channels, which function as the real-time AI performance monitor, auditing generative outputs for toxicity before presenting to the user.
Reasoning, which acts as the brain using the Atlas Reasoning Engine to interpret intent and select the optimal actions. (Correct)

An organization is exploring ways to streamline workflows, automate tasks, and enable intelligent assistance for employees using Salesforce's AI capabilities. Which statement correctly defines Agentforce?Choose 1 answer.
Agentforce is a specialized tool that requires advanced custom Apex and flow to configure, limiting its deployment to expert developers.
Agentforce is an AI extension that is available in Visual Studio Code (VSC) and Code Builder as part of the Salesforce Extension Pack.
Agentforce is a reasoning engine used to analyze context and execute multi-step development workflows automatically within Visual Studio Code.
Agentforce is an autonomous and assistive suite of AI agents that perform intelligent, data-driven business tasks across multiple workflows. (Correct)

Which actions are performed within the Einstein Trust Layer to ensure data security and privacy before the response is sent back to the user?Choose 2 answers.
System policies are used to defend against jailbreaking and prompt injection attacks. (Correct)
Generated works are scanned for plagiarism and spoofing.
Data is retained by the LLM Gateway for 24 hours to enable efficient feedback loops.
Sensitive data in the prompt is identified and masked using placeholder text. (Correct)

Which statement accurately describes a Large Language Model (LLM)Choose 1 answer.
An LLM's primary design goal is to retain sensitive proprietary information to ensure data grounding for all model interactions.
An LLM focuses on monitoring and auditing generative AI performance to ensure ethical, social, and environmental compliance.
An LLM primarily relies on natural language, which includes ambiguity, nuance, and variation that simplify computer interpretation.
An LLM generates text by predicting one token at a time, forming coherent and contextually relevant sentences. (Correct)
