# BA Documentation Framework Rules

## Rule: Requirements Traceability

All technical documents MUST trace back to SRS requirements. This is mandatory.

### Requirement ID Convention

| Prefix | Type | Example |
|--------|------|---------|
| FR- | Functional Requirement | FR-001, FR-002 |
| NFR- | Non-Functional Requirement | NFR-001, NFR-002 |
| UC- | Use Case | UC-01, UC-02 |
| DR- | Data Requirement | DR-001, DR-002 |
| IR- | Integration Requirement | IR-001, IR-002 |

### Module ID Convention

| Module Code | Name | Description |
|-------------|------|-------------|
| AUTH | Authentication | User accounts, login, roles, sessions |
| SMS | SMS Service | SMS delivery, logging, audit trail |
| LOG | Logger | Application logging, audit trail, error tracking |

---

## Rule: Document Structure

Each module has 4 documents with full traceability:

```
modules/<code>/
  src/                    # Custom HTML source files (source of truth)
    srs.html
    tds.html
    database-design.html
    api-technical-spec.html
  diagrams/               # PlantUML source files
    usecase/
    erd/
    activity/
    sequence/
  images/                 # Generated diagrams
```

Build output goes to `modules/dist/<code>/` (gitignored).

---

## Rule: Document Header & Navigation

Every HTML document MUST include a logo header and table of contents.

### Logo Header

Every page MUST have a logo header at the top:

```html
<div class="logo-header">
  <div class="logo-left">
    <img src="../../assets/agiletech-logo.avif" alt="AgileTech" class="logo">
  </div>
  <div class="logo-right">
    <img src="../../assets/pvi-logo.png" alt="PVI" class="logo">
  </div>
</div>
```

### Table of Contents

Every page MUST have a TOC after the cover page with links to all sections.

### Section ID Convention

```
<h1 id="section-1">1. Section</h1>
<h2 id="section-1-1">1.1 Sub-section</h2>
```

### FR Requirement ID Convention

In the SRS requirements table:

```html
<tr id="fr-001">
  <td><span class="req-id">FR-001</span></td>
  <td>AUTH</td>
  <td>User Registration</td>
  ...
</tr>
```

---

## Rule: Diagram Order

In documents, diagrams appear in this order:
1. **Activity Diagram** (process flow) - first
2. **Sequence Diagram** (integration flow) - second

### Diagram Types

| Type | Use For |
|------|---------|
| Activity | Process flow (simplified, NO swimlanes) |
| Sequence | Integration between services |
| Use Case | Actor-system interactions |
| ERD | Data model (entities, relationships) |
| Class | Domain model |
| Component | System components |
| Deployment | Infrastructure |
| Architecture | C4 Level 1 |

### Activity Diagram Rules

- **NO swimlanes** - they create duplicate columns
- Use simple sequential flow with diamonds for decisions
- Keep diagrams clean and readable

---

## Rule: Image Paths

All image paths in custom module HTML MUST use relative paths from the module directory:

```html
<!-- CORRECT (relative to modules/auth/) -->
<img src="./images/sequence/login-sequence.png" alt="Login">

<!-- WRONG (goes up to root) -->
<img src="../images/sequence/login-sequence.png" alt="Login">
```

---

## Rule: Template Customization

To customize a module's HTML, place files in `modules/<code>/src/`:

```
modules/auth/src/
  srs.html
  tds.html
  database-design.html
  api-technical-spec.html
```

The build script will use your custom file instead of the template.

---

## Rule: Table Naming Convention

ALL tables MUST use the format: `<project_short_name>_<table_name>`

**Examples (project short name = `auth`):**

| Wrong | Correct |
|-------|---------|
| users | auth_users |
| sessions | auth_sessions |
| roles | auth_roles |

---

## Rule: Multi-Database Architecture

| Database | Modules | Purpose |
|----------|---------|---------|
| auth_db | AUTH | User accounts, authentication |
| sms_db | SMS | SMS delivery logs |
| opensearch | LOG | Application logs |

---

## Rules for Each Document

**SRS:**
- Every requirement MUST have a unique ID (FR-xxx, NFR-xxx)
- Every requirement MUST have a Module column
- Include System Flows section with Activity + Sequence diagrams
- Include Traceability Matrix

**TDS:**
- Every design decision MUST show which SRS requirement it resolves
- Include Integration Flows section with Activity + Sequence diagrams
- Include Traceability Summary

**Database Design:**
- Tables organized by module
- SQL CREATE TABLE statements
- Indexes grouped by module
- Migration scripts documented

**API Spec:**
- Every endpoint MUST show its requirement ID
- Include Request/Response examples
- Error codes documented

---

## Build Commands

```bash
make pull           # Download PlantUML Docker image
make build-all      # Generate diagrams + build HTML docs (output: modules/dist/)
make serve          # Start local web server (http://localhost:8080)
make clean          # Remove generated files
make watch          # Auto-rebuild on file change
```

## Claude Commands

| Command | Purpose |
|---------|---------|
| `/ba-structure` | Show folder structure and workflow |
| `/ba-setup` | Step-by-step setup guide |
| `/ba-guide` | Interactive walkthrough |
| `/ba-trace` | Verify traceability and module mapping |
