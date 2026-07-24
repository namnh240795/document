# BA Workflow Guide

Step-by-step guide for Business Analysts working with the BA Documentation Framework.

---

## Prerequisites

- Docker installed (for PlantUML diagram generation)
- Git installed
- Text editor (VS Code recommended)
- Browser (for viewing HTML docs, export PDF)

## First-Time Setup

```bash
make pull          # Download PlantUML Docker image (one-time)
make help          # Verify all commands are available
```

---

## BA Daily Workflow

### 1. Pull Latest Changes

```bash
git pull
```

### 2. Pick Your Task

| Task | Command | What You Do |
|------|---------|-------------|
| Add a new module | `/ba-new-module` | Define module in modules.yaml, create directories, generate templates |
| Write SRS requirements | `/ba-srs` | Add FR/NFR requirements with IDs and module mapping |
| Design ERD | `/ba-erd` | Create/edit PlantUML ERD files per database |
| Write TDS | Edit `modules/<code>/tds.html` | Technical design with traceability to SRS |
| Write DB Design | Edit `modules/<code>/database-design.html` | Schema, indexes, migrations |
| Write API Spec | Edit `modules/<code>/api-technical-spec.html` | Endpoints with requirement IDs |
| Review all docs | `/ba-review` | Check traceability, naming conventions, completeness |

### 3. Build and Verify

```bash
make build-all     # Generate all diagrams + build HTML docs
make open          # Open master index in browser
```

### 4. Export PDF

Open any HTML doc in browser > Cmd+P > Save as PDF

### 5. Commit Changes

```bash
git add modules/<code>/
git commit -m "docs(<code>): update <what changed>"
```

---

## Document Creation Order

Follow this order when documenting a new system or module:

```
Step 1: Define Modules (modules.yaml)
   |
Step 2: Use Case Diagram (who uses the system, what they do)
   |
Step 3: ERD (what data the system stores)
   |
Step 4: SRS (formal requirements with IDs)
   |
Step 5: Sequence Diagrams (how modules talk to each other)
   |
Step 6: TDS (how we build it technically)
   |
Step 7: Database Design (schema details, indexes, migrations)
   |
Step 8: API Spec (endpoints, request/response)
```

---

## Module Definition Checklist

When adding a new module, answer these questions:

- [ ] Module code (3-5 chars, e.g., AUTH, PROD, PAY)
- [ ] Module name (human-readable, e.g., "Authentication")
- [ ] Module description (1-2 sentences)
- [ ] Which database does it use? (auth_db, ecom_db, pay_db, etc.)
- [ ] What tables does it own? (prefix with project short name)
- [ ] What are its dependencies on other modules?
- [ ] What tech stack does it use?
- [ ] What webhook events does it send/receive?

---

## SRS Requirement Checklist

For every requirement you add:

- [ ] Has a unique ID (FR-xxx, NFR-xxx, DR-xxx, IR-xxx)
- [ ] Has a Module column (AUTH, PROD, ECOM, PAY, WAL, SHIP, NOTI, LOG)
- [ ] Has a clear title
- [ ] Has a use case reference (UC-xx)
- [ ] Has a priority (High, Medium, Low)
- [ ] Has a detailed description
- [ ] Is linked in the TOC

---

## ERD Checklist

For every ERD you create:

- [ ] File is named `erd-<database>.puml` (e.g., `erd-auth.puml`)
- [ ] Tables use `<project_short_name>_<table_name>` convention
- [ ] Entities are grouped by module (package/box)
- [ ] Each module shows which FR/NFR it resolves
- [ ] Foreign keys reference full table names (e.g., `auth_users.id`)
- [ ] No cross-database foreign keys (use application-level IDs)

---

## Table Naming Convention

ALL tables MUST use: `<project_short_name>_<table_name>`

| Wrong | Correct (project = auth) |
|-------|--------------------------|
| users | auth_users |
| sessions | auth_sessions |
| roles | auth_roles |

Current project short name: `auth` (defined in `modules.yaml`)

---

## Requirement ID Convention

| Prefix | Type | Example | When to Use |
|--------|------|---------|-------------|
| FR- | Functional Requirement | FR-001 | What the system must do |
| NFR- | Non-Functional Requirement | NFR-001 | Performance, security, availability |
| UC- | Use Case | UC-01 | Actor + system interaction |
| DR- | Data Requirement | DR-001 | Data storage, retention, format |
| IR- | Integration Requirement | IR-001 | External system connections |

---

## Module ID Convention

| Code | Name | Database |
|------|------|----------|
| AUTH | Authentication | auth_db |
| SMS | SMS Service | sms_db |
| LOG | Logger | opensearch |
| PROD | Product Catalog | ecom_db |
| ECOM | E-Commerce | ecom_db |
| PAY | Payment | pay_db |
| WAL | Wallet | wallet_db |
| SHIP | Shipping | ecom_db |
| NOTI | Notification | noti_db |

---

## Inter-Module Communication

Modules communicate via webhook events defined in `modules.yaml`:

```yaml
webhooks:
  - from: AUTH
    to: SMS
    event: verification.requested
    protocol: RabbitMQ
    queue: verification.sms
    payload:
      user_id: uuid
      phone: string
      otp: string
```

When documenting a module:
1. Check `modules.yaml` for events this module sends
2. Check `modules.yaml` for events this module receives
3. Document events in the module's TDS under "Integration" section
4. Include events in the SRS traceability matrix

---

## Common Mistakes to Avoid

1. **Missing requirement IDs** - Every requirement MUST have FR-xxx or NFR-xxx
2. **Missing module column** - Every requirement MUST map to a module
3. **Wrong table names** - Always use `<project>_<table>` format
4. **Cross-database foreign keys** - Never reference tables in another database
5. **Missing traceability** - Every technical doc must trace back to SRS
6. **No TOC** - Every HTML page needs a table of contents
7. **No logo header** - Every HTML page needs the logo header

---

## Quick Reference Commands

```bash
# Show all commands
make help

# Generate diagrams for a module
make generate MODULE=auth TYPE=erd

# Generate all ERDs
make generate-erd-all

# Generate all module diagrams
make generate-all-modules

# Build all HTML docs
make build-docs

# Build everything (diagrams + docs)
make build-all

# Build and open in browser
make open

# Clean generated files
make clean

# Watch for changes
make watch
```

---

## Claude Commands for BAs

| Command | Purpose |
|---------|---------|
| `/ba-structure` | Show folder structure and workflow |
| `/ba-setup` | Step-by-step setup guide |
| `/ba-guide` | Interactive walkthrough |
| `/ba-trace` | Verify traceability and module mapping |
| `/ba-new-module` | Add a new module step by step |
| `/ba-new-requirement` | Add requirements to SRS |
| `/ba-erd` | Create or edit ERD diagrams |
| `/ba-srs` | Work on SRS document |
| `/ba-review` | Review all documents for compliance |

---

## File Locations Quick Reference

```
modules.yaml                              # Module definitions (edit this first)
templates/                                # Source templates (do not edit directly)
modules/<code>/srs.html                   # Module SRS content
modules/<code>/tds.html                   # Module TDS content
modules/<code>/database-design.html       # Module DB design
modules/<code>/api-technical-spec.html    # Module API spec
modules/<code>/diagrams/                  # Module PlantUML source files
modules/index.html                        # Master index (generated)
```
