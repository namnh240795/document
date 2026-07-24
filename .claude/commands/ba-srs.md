# Work on SRS Document

Guide the user through creating or editing a module's SRS document.

## Instructions

Walk the user through each step. Ask questions before proceeding.

### Step 1: Identify Module

Ask: "Which module's SRS are you working on?"

Current modules:
- AUTH - `modules/auth/srs.html`
- SMS - `modules/sms/srs.html`
- LOG - `modules/log/srs.html`

### Step 2: Identify Task

Ask: "What do you want to do?"
1. Add new requirements (FR/NFR/DR/IR)
2. Edit existing requirements
3. Add a new use case
4. Update the traceability matrix
5. Review SRS for completeness

### Step 3: Read Current SRS

Read the module's SRS to understand existing content.

### Step 4: SRS Structure

Every SRS MUST have these sections:

1. **Introduction** (1.1 Purpose, 1.2 Scope, 1.3 Dependencies, 1.4 Definitions)
2. **Module Overview** (2.1 Module Description, 2.2 Use Case Diagram)
3. **Functional Requirements** (3.1 Requirements table with IDs)
4. **Use Cases** (detailed use case descriptions)
5. **Data Model** (ERD reference)
6. **API Specification** (endpoint summary)
7. **Integration** (sequence diagrams, webhook events)
8. **Non-Functional Requirements** (NFR list)
9. **Traceability Matrix** (requirements -> modules -> endpoints -> tables)

### Step 5: Adding Requirements

For each requirement, ensure:

1. **Unique ID**: FR-xxx, NFR-xxx, DR-xxx, IR-xxx
2. **Module column**: Module code (AUTH, SMS, LOG, etc.)
3. **Title**: Short, imperative verb phrase
4. **Use Case**: UC-xx reference
5. **Priority**: High, Medium, Low
6. **Description**: Detailed what the system must do

Add to the requirements table:

```html
<tr>
  <td id="fr-xxx"><span class="req-id">FR-xxx</span></td>
  <td><span class="module-badge">MODULE</span></td>
  <td>Requirement Title</td>
  <td>UC-xx</td>
  <td>High</td>
  <td>Detailed description</td>
</tr>
```

### Step 6: Adding Use Cases

For each use case:

```html
<div class="use-case" id="uc-xx">
  <h3>UC-xx: Use Case Title</h3>
  <table>
    <tr><th>Field</th><th>Value</th></tr>
    <tr><td>Actor</td><td>Who performs this</td></tr>
    <tr><td>Precondition</td><td>What must be true before</td></tr>
    <tr><td>Main Flow</td><td>Step-by-step flow</td></tr>
    <tr><td>Alternative Flow</td><td>What else can happen</td></tr>
    <tr><td>Postcondition</td><td>What is true after</td></tr>
    <tr><td>Requirements</td><td>FR-xxx, FR-yyy</td></tr>
  </table>
</div>
```

### Step 7: Update TOC

Add new sections to the Table of Contents:

```html
<li><a href="#fr-xxx">FR-xxx: Requirement Title</a></li>
```

### Step 8: Update Traceability Matrix

Add requirements to the traceability matrix:

```html
<tr>
  <td>FR-xxx</td>
  <td>Requirement Title</td>
  <td>MODULE</td>
  <td>/api/endpoint</td>
  <td>project_table</td>
</tr>
```

### Step 9: Verify

Check:
- [ ] All requirements have unique IDs
- [ ] All requirements have Module column
- [ ] All requirements are in the TOC
- [ ] All requirements are in the traceability matrix
- [ ] Use cases reference requirements
- [ ] Logo header exists
- [ ] TOC links work

### Step 10: Build

```bash
make build-docs
make open
```

## Requirement ID Reference

| Prefix | Type | Example |
|--------|------|---------|
| FR- | Functional Requirement | FR-001 |
| NFR- | Non-Functional Requirement | NFR-001 |
| UC- | Use Case | UC-01 |
| DR- | Data Requirement | DR-001 |
| IR- | Integration Requirement | IR-001 |

## SRS Completeness Checklist

Before finalizing:

- [ ] Purpose section is clear
- [ ] Scope section defines boundaries
- [ ] All modules are listed
- [ ] All requirements have IDs
- [ ] All requirements have Module column
- [ ] All requirements have priority
- [ ] Use cases are documented
- [ ] Traceability matrix is complete
- [ ] TOC links all sections
- [ ] Logo header exists
- [ ] No placeholder text remains
