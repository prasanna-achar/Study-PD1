# 09 — Deployment Tools & Procedures

---

## Deployment Tools Comparison

| Tool | Related Orgs Only? | Can Delete Metadata? | Scriptable? | UI? |
|---|---|---|---|---|
| **Change Sets** | ✅ Yes (related only) | ❌ No | ❌ No | ✅ Web UI |
| **Salesforce CLI** | ❌ No (any org) | ✅ Yes | ✅ Yes | ❌ Command line |
| **VS Code + SF Extensions** | ❌ No (any org) | ✅ Yes | ✅ Yes | ✅ IDE |
| **Code Builder** | ❌ No (any org) | ✅ Yes | ✅ Yes | ✅ Web IDE |
| **DevOps Center** | ❌ No (pipeline orgs) | ✅ Yes | ✅ (GitHub) | ✅ Web UI |

---

## Change Sets (Detailed)

### What They Are
- A **native UI tool** in Salesforce Setup for migrating metadata between **related** orgs.
- Available in Enterprise, Unlimited, Performance, and Developer editions of Production orgs.

### Key Rules
| Rule | Detail |
|---|---|
| Orgs must be **related** | Sandbox ↔ Production, or Sandbox ↔ Sandbox (from same Prod) |
| ❌ NOT available in Developer Edition standalone orgs | DE orgs cannot send or receive change sets |
| ❌ Cannot **delete** metadata | Only adds or updates components |
| ❌ Cannot be **scripted** or **scheduled** | Manual process every time |
| Cannot deploy **data** | Only metadata (no records) |
| **Inbound changes must be authorized** | The RECEIVING org must allow inbound from the sender |

### Deployment Connection Setup
1. Go to the **receiving org** (e.g., Production)
2. Navigate to **Setup > Deployment Settings**
3. Click **Edit** next to the sending org (e.g., DevSandbox)
4. Check **"Allow Inbound Changes"**

### Trap
> **Q:** "I uploaded a change set from Sandbox but Production isn't showing as a target."
> **A:** Go to **Production's** Deployment Settings and allow inbound changes from that sandbox.

---

## Salesforce CLI

### What It Is
A command-line tool for interacting with Salesforce orgs. Commands start with `sf` (or legacy `sfdx`).

### Key Capabilities
- ✅ Deploy metadata between **any** orgs (related or unrelated)
- ✅ Retrieve metadata from any org
- ✅ **Delete** metadata: `sf project delete source --metadata ApexClass:MyClass`
- ✅ Create and manage scratch orgs
- ✅ Create and clone sandboxes
- ✅ Run Apex tests
- ✅ Execute anonymous Apex
- ✅ Can be **scripted** and **scheduled** (ideal for CI/CD)
- ❌ No graphical UI (command line only)
- ❌ Does NOT track/audit previously deployed changes

### Common Commands
```bash
# Deploy metadata to an org
sf project deploy start --target-org myOrg

# Retrieve metadata from an org
sf project retrieve start --target-org myOrg

# Delete a specific Apex class
sf project delete source --metadata ApexClass:MyClass --target-org myOrg

# Run all tests
sf apex run test --target-org myOrg --code-coverage

# Execute anonymous Apex
sf apex run --target-org myOrg --file script.apex

# Create a scratch org
sf org create scratch --definition-file config/project-scratch-def.json
```

---

## VS Code with Salesforce Extensions

### Key Facts
| Fact | Detail |
|---|---|
| Uses the CLI behind the scenes | Same capabilities as the CLI |
| Can deploy to **any** org | Including production (if tests pass) |
| Can deploy specific files | Right-click a file → "Deploy Source to Org" |
| Can run SOQL queries | Via the Command Palette |
| ❌ Cannot create Change Sets | Must use the Salesforce web UI for that |

---

## Code Builder

| Fact | Detail |
|---|---|
| Web-based IDE | Runs entirely in the browser |
| Requires managed package installation | Must install "Code Builder" from Setup first |
| No local storage needed | Everything is cloud-hosted |
| Based on VS Code | Same look and feel |
| Uses Salesforce CLI under the hood | Same command set available |

---

## DevOps Center

| Fact | Detail |
|---|---|
| Installed as a managed package | From Setup |
| Tracks metadata changes visually | Through a release pipeline UI |
| Requires a **GitHub account** | For version control integration |
| Manages test and deployment across multiple orgs | Dev → QA → Staging → Prod |
| Creates a connected app | For GitHub authorization |

---

## Development Models

### Org Development Model (Traditional)
```
Developer Sandbox → Testing Sandbox → Production
       ↕                    ↕               ↕
   (develop)            (test)         (deploy via
                                       Change Set / CLI)
```
- Source of truth: **Production Org**
- Development in: **Sandboxes**
- Deploy via: **Change Sets** or **Salesforce CLI**

### Package Development Model (Modern)
```
Scratch Org → Version Control (GitHub) → Integration Sandbox → Production
     ↕                  ↕                        ↕                  ↕
 (develop)     (source of truth)              (test)          (deploy
                                                              package)
```
- Source of truth: **Version Control System (GitHub)**
- Development in: **Scratch Orgs**
- Deploy via: **Salesforce CLI** (unlocked packages)
- Uses CI/CD for automated testing and promotion

### Change Set Development Model
- A subset of Org Development
- Sandbox orgs for development and testing
- Deploy exclusively via Change Sets
- ❌ No version control
- ❌ No automation

---

## APIs for Deployment

### Metadata API
- Used by Change Sets, CLI, and VS Code under the hood
- Best for **large, complex deployments** (multiple components)
- Deploys/retrieves metadata as XML files (package.xml)

#### Cannot Deploy via Metadata API
- Currency Exchange Rates
- Account Teams / Case Team Roles
- Calendars
- Some fiscal year settings

### Tooling API
- Fine-grained, lightweight access to metadata
- Best for **single component operations** (save one class, read one log)
- Key objects:
  - `ApexLog` — Access debug logs
  - `ApexCodeCoverageAggregate` — Code coverage results
  - `ApexTestResult` — Test execution results
  - `TraceFlag` — Manage trace flags programmatically

### Trap
> **Q:** "Which API is better for accessing a debug log — Metadata or Tooling?"
> **A:** **Tooling API** (use the `ApexLog` object).

> **Q:** "Which API for deploying an XML-based configuration?"
> **A:** **Metadata API**.

---

## Quick-Fire Cards

**Q: Can change sets delete metadata from the target org?**
> A: No. Use Salesforce CLI instead.

**Q: Can Salesforce CLI deploy between unrelated orgs?**
> A: Yes. Unlike change sets, CLI can target any authorized org.

**Q: What tool tracks deployment changes with GitHub integration?**
> A: DevOps Center.

**Q: A developer wants to propagate a custom object deletion to production. Which tool?**
> A: Salesforce CLI (`sf project delete source --metadata CustomObject:MyObj__c`).
