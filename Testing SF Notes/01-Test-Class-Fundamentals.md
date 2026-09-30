# 01 — Test Class Fundamentals

---

## The `@isTest` Annotation

Every test class MUST be annotated with `@isTest`.

```apex
@isTest
private class AccountTriggerTest {
    @isTest
    static void testInsert() {
        Account acc = new Account(Name = 'Test');
        insert acc;
        System.assertNotEquals(null, acc.Id);
    }
}
```

### Key Rules
| Rule | Detail |
|---|---|
| Test classes don't count against org code limits | They are excluded from the Apex code size limit |
| Test methods must be `static void` | They cannot return a value |
| Test classes cannot be interfaces or enums | Only regular classes |
| Default data isolation | Test methods **cannot** see org data (records) unless `SeeAllData=true` |

---

## `@isTest(SeeAllData=true)`

By default, test methods are **isolated** from org data. They start with zero records.

Setting `SeeAllData=true` lets the test method access ALL existing records in the org.

```apex
@isTest(SeeAllData=true)
private class PricebookTest {
    @isTest
    static void testStandardPricebook() {
        // Can access the Standard Pricebook because SeeAllData=true
        Pricebook2 stdPb = [SELECT Id FROM Pricebook2 WHERE IsStandard = true LIMIT 1];
        System.assertNotEquals(null, stdPb);
    }
}
```

### When You MUST Use `SeeAllData=true`
- Accessing the **Standard Pricebook** (it's not creatable in test data)
- Querying existing **User** or **Profile** records (e.g., to use in `System.runAs()`)
- Accessing **Custom Settings** that are already in the org (hierarchy)

### Trap
> ❌ "Always use SeeAllData=true so tests have data."
> ✅ Best practice is to **create your own test data**. SeeAllData makes tests fragile and environment-dependent.

### Scope
- You can set it at the **class level** (applies to all methods) or at the **method level** (applies only to that method).
- If set at the class level, individual methods CANNOT override it to `false`.

---

## Access Modifiers in Test Classes

### `@TestVisible`

Used on the **production class** (not the test class) to expose a `private` member to test methods.

```apex
// ---- Production Class ----
public class OrderProcessor {
    @TestVisible
    private static Integer retryCount = 0;

    @TestVisible
    private void resetCounter() {
        retryCount = 0;
    }
}

// ---- Test Class ----
@isTest
private class OrderProcessorTest {
    @isTest
    static void testRetryCount() {
        OrderProcessor op = new OrderProcessor();
        op.resetCounter();  // Accessible because of @TestVisible
        System.assertEquals(0, OrderProcessor.retryCount);
    }
}
```

### Quick Reference
| Modifier | Visible to Tests? | Notes |
|---|---|---|
| `public` | ✅ Yes | Accessible from anywhere |
| `private` | ❌ No | Hidden. Use `@TestVisible` to expose |
| `global` | ✅ Yes | Accessible across namespaces |
| `@TestVisible private` | ✅ Yes (tests only) | Private at runtime, visible in tests |

---

## Test Method Requirements Checklist

- [x] Annotated with `@isTest` (class and/or method)
- [x] Methods are `static void`
- [x] Contains at least one `System.assert*` statement (best practice)
- [x] Creates its own test data (best practice)
- [x] Does NOT make real HTTP callouts (use mocks)
- [x] Does NOT send real emails
