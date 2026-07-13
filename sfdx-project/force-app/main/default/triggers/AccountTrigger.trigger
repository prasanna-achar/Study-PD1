/**
 * @description Master Trigger for Account sObject demonstrating the Trigger Handler pattern.
 *              Never place business logic directly in this file!
 */
trigger AccountTrigger on Account (
    before insert, before update, before delete,
    after insert, after update, after delete, after undelete
) {
    AccountTriggerHandler.run();
}
