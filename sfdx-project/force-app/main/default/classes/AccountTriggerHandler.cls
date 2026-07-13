/**
 * @description Best-practice Trigger Handler for Account sObject.
 *              Demonstrates recursion protection, bulkified processing, and clear event dispatching.
 */
public with sharing class AccountTriggerHandler {
    
    // Static boolean flag to prevent infinite recursion during cross-object updates
    public static Boolean isExecuting = false;

    /**
     * @description Main entry point invoked from AccountTrigger.trigger
     */
    public static void run() {
        if (Trigger.isBefore) {
            if (Trigger.isInsert) {
                onBeforeInsert((List<Account>)Trigger.new);
            } else if (Trigger.isUpdate) {
                onBeforeUpdate((List<Account>)Trigger.new, (Map<Id, Account>)Trigger.oldMap);
            }
        } else if (Trigger.isAfter) {
            if (Trigger.isInsert) {
                onAfterInsert((List<Account>)Trigger.new, (Map<Id, Account>)Trigger.newMap);
            } else if (Trigger.isUpdate) {
                onAfterUpdate((List<Account>)Trigger.new, (Map<Id, Account>)Trigger.oldMap);
            }
        }
    }

    /**
     * @description Handles before insert validation and default field population.
     */
    private static void onBeforeInsert(List<Account> newAccounts) {
        for (Account acc : newAccounts) {
            // Default active status if blank
            if (String.isBlank(acc.Active__c)) {
                acc.Active__c = 'Yes';
            }
            // Enforce custom rule: High revenue requires an Industry
            if (acc.AnnualRevenue != null && acc.AnnualRevenue >= 1000000 && String.isBlank(acc.Industry)) {
                acc.addError('Industry is strictly required for Accounts with Annual Revenue of $1M or more.');
            }
        }
    }

    /**
     * @description Handles before update logic. Uses oldMap to process ONLY when specific fields change!
     */
    private static void onBeforeUpdate(List<Account> newAccounts, Map<Id, Account> oldMap) {
        for (Account acc : newAccounts) {
            Account oldAcc = oldMap.get(acc.Id);
            
            // Check if Rating changed to Hot
            if (acc.Rating == 'Hot' && oldAcc.Rating != 'Hot') {
                acc.Description = 'Hot Account priority upgraded on ' + String.valueOf(Date.today());
            }
        }
    }

    /**
     * @description Handles after insert logic (e.g., creating default child related records).
     */
    private static void onAfterInsert(List<Account> newAccounts, Map<Id, Account> newMap) {
        List<Contact> defaultContacts = new List<Contact>();

        for (Account acc : newAccounts) {
            if (acc.Active__c == 'Yes') {
                defaultContacts.add(new Contact(
                    FirstName = 'Primary',
                    LastName = acc.Name + ' Representative',
                    AccountId = acc.Id,
                    Email = 'contact@' + acc.Name.replaceAll('\\s+', '').toLowerCase() + '.com'
                ));
            }
        }

        // Bulkified DML operation outside of loop!
        if (!defaultContacts.isEmpty()) {
            insert defaultContacts;
        }
    }

    /**
     * @description Handles after update logic with recursion protection.
     */
    private static void onAfterUpdate(List<Account> newAccounts, Map<Id, Account> oldMap) {
        if (isExecuting) {
            return; // Prevent recursion if an after-update flow/trigger triggers another update
        }
        isExecuting = true;

        try {
            Set<Id> deactivatedAccountIds = new Set<Id>();
            for (Account acc : newAccounts) {
                Account oldAcc = oldMap.get(acc.Id);
                if (acc.Active__c == 'No' && oldAcc.Active__c != 'No') {
                    deactivatedAccountIds.add(acc.Id);
                }
            }

            if (!deactivatedAccountIds.isEmpty()) {
                // Update related child contacts to DoNotCall = true
                List<Contact> contactsToDeactivate = [
                    SELECT Id, DoNotCall FROM Contact WHERE AccountId IN :deactivatedAccountIds
                ];
                for (Contact c : contactsToDeactivate) {
                    c.DoNotCall = true;
                }
                if (!contactsToDeactivate.isEmpty()) {
                    update contactsToDeactivate;
                }
            }
        } finally {
            isExecuting = false;
        }
    }
}
