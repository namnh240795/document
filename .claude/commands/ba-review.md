# Review BA Documents

Review all documents for compliance with BA Documentation Framework rules.

## Instructions

Read all module documents and check for compliance issues.

### Step 1: Read modules.yaml

Read `modules.yaml` to understand:
- Project short name
- All modules and their codes
- Database assignments
- Table lists
- Dependencies
- Webhook events

### Step 2: Check Each Module

For each module (AUTH, SMS, LOG, etc.):

#### SRS Check (`modules/<code>/srs.html`)

- [ ] Logo header exists
- [ ] Table of contents exists
- [ ] All requirements have unique IDs (FR-xxx, NFR-xxx)
- [ ] All requirements have Module column
- [ ] All requirements have priority
- [ ] Use cases are documented
- [ ] Traceability matrix exists
- [ ] No placeholder text ({{...}}) remains

#### TDS Check (`modules/<code>/tds.html`)

- [ ] Logo header exists
- [ ] Table of contents exists
- [ ] "Requirements Addressed" section exists
- [ ] Design decisions show which requirement they resolve
- [ ] Component table maps to requirement IDs
- [ ] Traceability summary exists

#### Database Design Check (`modules/<code>/database-design.html`)

- [ ] Logo header exists
- [ ] Table of contents exists
- [ ] Tables organized by module
- [ ] Data dictionary has Module column
- [ ] Indexes grouped by module
- [ ] Migration scripts documented
- [ ] Rollback procedures documented

#### API Spec Check (`modules/<code>/api-technical-spec.html`)

- [ ] Logo header exists
- [ ] Table of contents exists
- [ ] "Requirements Addressed" table exists
- [ ] Each endpoint has requirement ID
- [ ] Endpoints grouped by module

### Step 3: Check ERD Files

For each ERD file in `templates/erd-*.puml`:

- [ ] Table names use `<project>_<table>` convention
- [ ] Primary keys defined
- [ ] Foreign keys reference full table names
- [ ] No cross-database foreign keys
- [ ] Entities grouped by module
- [ ] Module shows which FR/NFR it resolves

### Step 4: Check Traceability

Verify the traceability chain:

```
SRS (FR-xxx) -> TDS (design resolves FR-xxx) -> DB Design (table for FR-xxx) -> API Spec (endpoint for FR-xxx)
```

Check:
- [ ] Every FR in SRS has a design decision in TDS
- [ ] Every FR in SRS has a table in DB Design
- [ ] Every FR in SRS has an endpoint in API Spec
- [ ] Every table in DB Design has a corresponding FR
- [ ] Every endpoint in API Spec has a corresponding FR

### Step 5: Check Naming Conventions

- [ ] All tables use `<project>_<table>` format
- [ ] All requirement IDs follow convention (FR-xxx, NFR-xxx)
- [ ] All module codes match modules.yaml
- [ ] All database names match modules.yaml

### Step 6: Generate Report

Create a summary report:

```
=== BA Document Review Report ===

Project: <project_name>
Short Name: <short_name>
Modules: <list>

--- AUTH Module ---
SRS:     [PASS/FAIL] - <issues>
TDS:     [PASS/FAIL] - <issues>
DB:      [PASS/FAIL] - <issues>
API:     [PASS/FAIL] - <issues>
ERD:     [PASS/FAIL] - <issues>

--- SMS Module ---
...

--- Traceability ---
FR-001: [COVERED/MISSING] in TDS, DB, API
FR-002: [COVERED/MISSING] in TDS, DB, API
...

--- Issues Found ---
1. [CRITICAL/WARNING] <description>
2. [CRITICAL/WARNING] <description>
...

--- Summary ---
Total checks: XX
Passed: XX
Failed: XX
Warnings: XX
```

### Step 7: Recommendations

Based on findings, suggest:
1. Missing requirement IDs to add
2. Missing module columns to add
3. Missing traceability links to add
4. Naming convention fixes needed
5. Missing documents to create

## Issue Severity

| Severity | Description | Action |
|----------|-------------|--------|
| CRITICAL | Missing requirement ID, missing module, wrong table name | Must fix before review |
| WARNING | Missing traceability, incomplete TOC | Should fix |
| INFO | Missing optional section, style issue | Nice to have |

## Common Issues

1. **Missing requirement IDs** - Every requirement MUST have FR-xxx or NFR-xxx
2. **Missing module column** - Every requirement MUST map to a module
3. **Wrong table names** - Always use `<project>_<table>` format
4. **Cross-database foreign keys** - Never reference tables in another database
5. **Missing traceability** - Every technical doc must trace back to SRS
6. **No TOC** - Every HTML page needs a table of contents
7. **No logo header** - Every HTML page needs the logo header
8. **Placeholder text** - No `{{...}}` should remain in final docs
