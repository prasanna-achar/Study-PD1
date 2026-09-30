# 10 — AppExchange Packages

---

## Managed vs Unmanaged Packages

| Feature | Unmanaged Package | Managed Package |
|---|---|---|
| **IP Protection** | ❌ None — code is fully visible & editable | ✅ Code is hidden (obfuscated) |
| **Upgradeable** | ❌ No — each install is a one-time snapshot | ✅ Publisher can push version upgrades |
| **Editable by installer** | ✅ Yes — customer can modify everything | ❌ No — customer cannot see or edit Apex |
| **Namespace prefix** | ❌ Not required | ✅ Required (e.g., `myapp__CustomField__c`) |
| **Created in** | Developer Edition or Sandbox | Developer Edition or Partner DE **only** |
| **Use case** | Open-source templates, starter kits | Commercial apps on AppExchange |
| **Dependency tracking** | ❌ No | ✅ Yes — tracks component dependencies |

---

## Where Can You Create Packages?

| Org Type | Unmanaged? | Managed? |
|---|---|---|
| Developer Edition | ✅ | ✅ |
| Partner Developer Edition | ✅ | ✅ |
| Developer Sandbox | ✅ | ❌ |
| Developer Pro Sandbox | ✅ | ❌ |
| Partial Copy Sandbox | ❌ | ❌ |
| Full Copy Sandbox | ❌ | ❌ |
| Production | ❌ | ❌ |

### Trap
> ❌ "Managed packages can be created in any sandbox."
> ✅ Managed packages can ONLY be created in **Developer Edition** or **Partner Developer Edition** orgs.

---

## Unlocked Packages (2GP — Second-Generation Packaging)

A newer packaging model used with the **Package Development Model** and Salesforce CLI.

| Feature | Detail |
|---|---|
| **Source-driven** | Built from source in version control (GitHub) |
| **Versioned** | Each build creates a new version |
| **Editable by customer** | ✅ Unlike managed packages, customers CAN modify components |
| **Namespace** | Optional |
| **Created via** | Salesforce CLI (`sf package create`) |
| **Use case** | Internal enterprise deployments, modular architecture |

---

## AppExchange Distribution Workflow

```
Partner Developer Edition        Developer Edition
  (manage source code)    →     (create & upload package)
                                        ↓
                                  AppExchange
                                        ↓
                              Customer Org (install)
```

1. **Develop** the app in a **Partner Developer Edition** org
2. **Create** the managed package in a **Developer Edition** org
3. **Upload** the package version to AppExchange
4. **Customers** install the package into their own orgs
5. **Push upgrades** to all installed customers when needed

---

## Quick-Fire Cards

**Q: A company wants to distribute a free app but retain IP protection and push upgrades. Which package type?**
> A: **Managed Package**

**Q: Can managed packages be created in a Developer Pro Sandbox?**
> A: No. Only Developer Edition or Partner Developer Edition.

**Q: What is the key difference between managed and unmanaged packages?**
> A: Managed packages protect source code (IP) and support versioned upgrades. Unmanaged packages are fully editable one-time snapshots.

**Q: What are unlocked packages?**
> A: Source-driven, versioned packages created via CLI for internal enterprise deployments. Customers CAN edit them.
