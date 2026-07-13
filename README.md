# ☁️ Salesforce Platform Developer I (PD1) Prep Suite

Welcome to your ultimate all-in-one preparation suite for the **Salesforce Platform Developer I (PD1)** certification exam! This folder has been structured with real-world code patterns, comprehensive domain cheat sheets, and an interactive offline-ready web application simulator to get you 100% exam-ready.

---

## 📁 Repository Structure

```text
PD1/
├── app/                              # 🚀 Interactive Web Application (Exam Hub & Mock Simulator)
│   ├── index.html                    # Open directly in browser to start practicing!
│   ├── style.css                     # Premium dark-mode Salesforce design system
│   ├── app.js                        # State management, timer engine, governor limit gauge
│   └── questions.js                  # 100+ high-yield question bank with explanations
├── study-guides/                     # 📚 Domain Study Guides (Markdown)
│   ├── 01-Salesforce-Fundamentals.md         # Domain 1 (~7% Weighting)
│   ├── 02-Data-Modeling-and-Management.md    # Domain 2 (~13% Weighting)
│   ├── 03-Process-Automation-and-Apex-Logic.md # Domain 3 (~38% Weighting - Largest section!)
│   ├── 04-User-Interface-LWC-and-Aura.md     # Domain 4 (~25% Weighting)
│   ├── 05-Testing-Debugging-and-Deployment.md # Domain 5 (~17% Weighting)
│   └── 06-Quick-Reference-Cheat-Sheet.md     # Master Cheat Sheet & Exam Hacks
└── sfdx-project/                     # 💻 Salesforce DX Sample Codebase
    ├── sfdx-project.json
    └── force-app/main/default/
        ├── triggers/                 # Trigger Handler Pattern (AccountTrigger.trigger)
        └── classes/                  # Best-practice Apex classes and @isTest suites
            ├── AccountTriggerHandler.cls
            ├── AsyncProcessingService.cls (@future, Queueable, Batchable, Schedulable)
            ├── SoqlAndDmlBestPractices.cls (Dynamic SOQL, Safe DML, Savepoints)
            ├── AccountControllerLwc.cls (@AuraEnabled cacheable & imperative DML)
            └── ComprehensiveTests.cls (@isTest, @TestSetup, HttpCalloutMock, Assert.areEqual)
```

---

## 🚀 How to Use Your Prep Suite

### 1. Launch the Interactive Mock Exam Simulator (`/app/`)
Double-click `app/index.html` (or open it in any modern web browser such as Chrome, Edge, or Firefox). No installation or build steps required!
- **Timed Mock Exam (60 Questions / 105 Minutes):** Simulates the exact official PD1 exam timing and domain weighting distribution. Passing score is **68%** (41 out of 60 correct).
- **Domain Quizzes:** Target specific weak spots by launching practice quizzes for individual domains (`Process Automation & Apex Logic`, `User Interface - LWC`, etc.).
- **Governor Limit Sandbox:** Drag the sliders in the sandbox tab to simulate SOQL queries inside vs. outside loops and see when synchronous limits trigger (`100 SOQL`, `150 DML`).

### 2. Read the High-Yield Study Guides (`/study-guides/`)
Each Markdown document under `study-guides/` is tailored to exact exam objectives, highlighting common traps, gotchas, governor limits, and order of execution steps (`V-T-V-A-W-P-E`).

### 3. Explore & Test the Salesforce DX Codebase (`/sfdx-project/`)
If you have **VS Code** with the **Salesforce Extension Pack** installed:
1. Open `sfdx-project/` inside VS Code.
2. Authorize a Scratch Org or Developer Edition (`sf org login web`).
3. Deploy the source code (`sf project deploy start`) and run the comprehensive unit test suite (`sf apex run test --class-names ComprehensiveTests --result-format human`).
