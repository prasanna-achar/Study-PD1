/**
 * @description Controller specifically built for Lightning Web Components (LWC) and Aura.
 *              Demonstrates @AuraEnabled(cacheable=true), imperative DML methods, and AuraHandledException.
 */
public with sharing class AccountControllerLwc {

    /**
     * @description Read-only method cacheable by Lightning Data Service (LDS) for use with @wire adapter.
     */
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountsByIndustry(String industry) {
        if (String.isBlank(industry)) {
            return [SELECT Id, Name, AnnualRevenue, Rating, Active__c FROM Account WHERE Active__c = 'Yes' LIMIT 50];
        }
        return [
            SELECT Id, Name, AnnualRevenue, Rating, Active__c 
            FROM Account 
            WHERE Industry = :industry AND Active__c = 'Yes' 
            LIMIT 50
        ];
    }

    /**
     * @description Imperative method performing DML update. Notice cacheable is NOT set to true!
     */
    @AuraEnabled
    public static Account updateAccountRevenue(Id accountId, Decimal newRevenue) {
        try {
            if (newRevenue < 0) {
                throw new AuraHandledException('Annual Revenue cannot be negative.');
            }

            Account acc = [SELECT Id, AnnualRevenue, Rating FROM Account WHERE Id = :accountId LIMIT 1];
            acc.AnnualRevenue = newRevenue;
            
            if (newRevenue >= 1000000) {
                acc.Rating = 'Hot';
            }
            
            update acc;
            return acc;
        } catch (Exception e) {
            // Always wrap server exceptions in AuraHandledException so LWC receives clean readable errors!
            throw new AuraHandledException('Failed to update Account: ' + e.getMessage());
        }
    }
}
