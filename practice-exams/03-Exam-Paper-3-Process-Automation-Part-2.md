# Exam Paper: Process Automation and Logic Part 2 – PD1 (Attempt 1)

**Date**: 2026-09-24
**Score**: 40/49 (81.63%) ✅ PASS
**Time**: 43m 45s

## Questions and Answers

### 1. SOSL RETURNING List<List<sObject>>
**Status**: Correct
**Key Takeaway**: `FIND 'New York' IN ALL FIELDS RETURNING Account, Contact` evaluates to `List<List<sObject>>`.

### 2. Multi-tenant consideration
**Status**: Correct
**Key Takeaway**: Filter records in SOQL statements to avoid exceeding governor limits.

### 3. SOQL inside for loop
**Status**: Correct
**Key Takeaway**: `Contract con = [SELECT Id FROM Contract WHERE Id = :opp.ContractId];` inside a loop of 2,000 Opportunity records will cause 0 records to be updated because the limit of 100 synchronous SOQL queries is hit on the 101st loop, rolling back the whole transaction.

### 4. Acceptable inside for loop
**Status**: Correct
**Key Takeaway**: `if (accountRecord.NumberOfEmployees > 1000)` is perfectly acceptable inside a for loop. Queries and DML are not.

### 5. Trigger governor limit exceptions
**Status**: Correct
**Key Takeaway**: Use lists to perform DML operations on multiple records.

### 6. Verify 1,000 imported accounts
**Status**: Correct
**Key Takeaway**: Criteria should be added to the SOQL query to filter out unnecessary records (avoid querying the other 50,000 accounts and hitting the 50,000 SOQL row limit).

### 7. Trigger best practices
**Status**: Correct
**Key Takeaway**: An Apex trigger should be logicless and delegate logic to a handler class.

### 8. Valid Apex data types
**Status**: Correct
**Key Takeaway**: Blob, ID, Enum are valid primitive/abstract types. 'Text' and 'Currency' do not exist in Apex variables.

### 9. Bulk data load error cause
**Status**: Correct
**Key Takeaway**: SOQL query is located inside the for loop code.

### 10. Update related account on contact delete
**Status**: Correct
**Key Takeaway**: After Delete trigger event should be used to update a related record when a record is successfully deleted.

### 11. Data type for SOQL queried records
**Status**: Correct
**Key Takeaway**: List should be used to store queried records via SOQL.

### 12. Context variable for old versions
**Status**: Correct
**Key Takeaway**: `Trigger.oldMap` returns a map of IDs to the old versions of the sObject records.

### 13. Set record type prior to insertion
**Status**: Correct
**Key Takeaway**: Before Insert event should be used to set field values before saving.

### 14. Bulk transactions support
**Status**: Incorrect ❌
**User chose**: Handle 'before undelete' operations
**Correct answer**: Perform data import operations
**Key Takeaway**: Triggers support bulk transactions like data imports, Bulk API, and mass actions. 'before undelete' does not exist.

### 15. Collection for unique email matching
**Status**: Correct
**Key Takeaway**: Map is the best collection type to use email as a key and contact name as a value.

### 16. Trigger statements
**Status**: Incorrect ❌
**User chose**: "Apex triggers are always active and cannot be turned off", "Apex triggers can be used to detect a 'before undelete' event"
**Correct answer**: "Attachment, ContentDocument, and Note standard object triggers cannot be created in the Salesforce UI", "A developer can specify the version of Apex and API to be used with the trigger"
**Key Takeaway**: You can deactivate triggers. You can specify API versions. You cannot use UI to make Attachment triggers. 'before undelete' doesn't exist.

### 17. Change Owner based on Type update
**Status**: Incorrect ❌
**User chose**: After Update
**Correct answer**: Before Update
**Key Takeaway**: If you are updating a field (Owner) on the *same record* that triggered the update based on another field (Type), use **Before Update**.

### 18. Trigger syntax
**Status**: Correct
**Key Takeaway**: `trigger TriggerName on ObjectName (trigger_events) { }`

### 19. Prevent duplicate IDs
**Status**: Correct
**Key Takeaway**: Set and Map can prevent duplicates.

### 20. Throw error on contact delete
**Status**: Correct
**Key Takeaway**: Before Delete is best to use `.addError()` to prevent deletion.

### 21. trigger.new context variable
**Status**: Correct
**Key Takeaway**: Contains a list of new versions of records, available in insert, update, and undelete.

### 22. Trigger execution context variable
**Status**: Incorrect ❌
**User chose**: isUpdate
**Correct answer**: isExecuting
**Key Takeaway**: `Trigger.isExecuting` returns true if the current context for the Apex code is a trigger (not VF, web service, or executeAnonymous).

### 23. Valid String assignment
**Status**: Correct
**Key Takeaway**: 'Salesforce' (single quotes).

### 24. Create calling card after contact create
**Status**: Correct
**Key Takeaway**: After Insert should be used because you need the Contact's newly generated ID to assign it to the calling card.

### 25. Before update trigger actions
**Status**: Correct
**Key Takeaway**: Perform validation before accepting field changes, and change field values of a record using `trigger.new`.

### 26. SOQL best practice
**Status**: Correct
**Key Takeaway**: Moving queries outside for-loops makes the code run faster and less likely to exceed governor limits.

### 27. Invoice trigger code
**Status**: Incorrect ❌
**User chose**: The trigger demonstrates an example solution that bypasses the governor limit on SOQL queries.
**Correct answer**: The SOQL statement retrieves all the related line items of a single Invoice record during each loop.
**Key Takeaway**: You can't bypass governor limits. The code is poorly written and will hit the SOQL 100 limit because it queries *inside* the loop.

### 28. DML 150 limit
**Status**: Correct
**Key Takeaway**: A loop trying to insert 200 records one by one will fail on the 151st DML. No records will be inserted because it throws a `LimitException` which cannot be caught, rolling back the transaction.

### 29. Governor limit hit in Visualforce transaction
**Status**: Correct
**Key Takeaway**: Any database changes made up to the error will be rolled back. LimitExceptions cannot be caught.

### 30. future methods
**Status**: Correct
**Key Takeaway**: Methods annotated with @future are executed asynchronously.

### 31. Record-triggered flow email sending
**Status**: Correct
**Key Takeaway**: Execution of post-commit logic, such as sending emails, happens after all DML operations are committed to the database.

### 32. Order of execution
**Status**: Correct
**Key Takeaway**: System Validation Rules, Before Triggers, All Validation Rules, Duplicate Rules, After Triggers, Assignment Rules, Workflow Rules, Commit.

### 33. Record-triggered flow + before update trigger
**Status**: Incorrect ❌
**User chose**: The Apex trigger will be fired first, voiding the flow due to the order of execution
**Correct answer**: Both will be fired only once
**Key Takeaway**: Before triggers fire first, then the record-triggered flow fires. Record-triggered flows have built-in recursion control.

### 34. Recursive trigger
**Status**: Correct
**Key Takeaway**: Inserting child cases inside an `after insert` trigger on Case without a recursion check will result in an infinite loop.

### 35. Built-in exceptions
**Status**: Correct
**Key Takeaway**: The generic `Exception` can be used to handle almost all types of exceptions.

### 36. Throw custom exception
**Status**: Correct
**Key Takeaway**: `throw new MyException('error message');`

### 37. Display custom error message in trigger
**Status**: Correct
**Key Takeaway**: Calling the `addError()` method displays the error message of an exception thrown from an Apex trigger.

### 38. Exception method for user message
**Status**: Correct
**Key Takeaway**: `getMessage()`

### 39. Partial processing
**Status**: Correct
**Key Takeaway**: Use `Database.SaveResult` class.

### 40. Display custom error on record
**Status**: Correct
**Key Takeaway**: `addError(errMsg)`

### 41. Syntax for try-catch-finally
**Status**: Correct
**Key Takeaway**: `try { } catch (Exception e) { } finally { }`

### 42. Custom exceptions
**Status**: Correct
**Key Takeaway**: Custom exceptions can be top-level classes and support variables and methods.

### 43. Visualforce error message not displaying
**Status**: Incorrect ❌
**User chose**: The Visualforce page refreshes and is unable to receive and display the error message
**Correct answer**: The `<apex:pageMessages>` message component has not been added to the Visualforce page.
**Key Takeaway**: To display `ApexPages.addMessage()` errors on a VF page, you need `<apex:pageMessages>` on the page.

### 44. Try-catch with uninitialized String
**Status**: Correct
**Key Takeaway**: `String hello; hello.contains('world')` causes a `NullPointerException`. The last generic `catch(Exception e)` block handles it.

### 45. SOQL relationship query
**Status**: Correct
**Key Takeaway**: A relationship between the objects is required in order to create a join in SOQL.

### 46. Custom iterator
**Status**: Correct
**Key Takeaway**: Implement `Iterator<Contact>` which requires `hasNext()` and `next()` methods.

### 47. Callout after DML exception
**Status**: Incorrect ❌
**User chose**: `Database.releaseSavepoint(sp); Database.rollback(sp);`
**Correct answer**: `Database.rollback(sp); Database.releaseSavepoint(sp);`
**Key Takeaway**: To clear uncommitted work pending, you must rollback first, then release the savepoint. (Though usually you just move the callout to an async method).

### 48. Flow troubleshooting
**Status**: Correct
**Key Takeaway**: Errors and Warnings Pane

### 49. ApexDoc
**Status**: Incorrect ❌
**User chose**: @param tags not correct order + closing delimiters not valid
**Correct answer**: @param tags not correct order + opening delimiters not valid
**Key Takeaway**: Opening delimiter for ApexDoc is `/**`. Closing is `*/`. `@param` tags should be in order of parameters in the method signature.
