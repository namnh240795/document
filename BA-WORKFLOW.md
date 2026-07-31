# BA Workflow Guide

How to work with the BA Documentation Framework.

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

## How It Works

Describe what you want to do, or run `/ba-guide`. Claude will:

1. **Check existing modules** — reads `modules.yaml` to know what's already there
2. **Ask what's the business** — you describe the module or what's changing
3. **Ask what's the new use case** — you describe requirements and use cases
4. **Analyze impact** — Claude checks dependencies and tells you what else needs updating

Then Claude handles everything — updates modules.yaml, creates/edits docs, generates diagrams, and builds.

---

## Build Commands

```bash
make build-all     # Generate all diagrams + build HTML docs
make open          # Build and open master index in browser
make clean         # Remove generated files
make watch         # Auto-rebuild on file change

# Per module
make generate MODULE=auth TYPE=erd
make generate-erd-all
make generate-all-modules
```

---

## Document Creation Order

```
1. Define Modules (modules.yaml)
   ↓
2. Use Case Diagram (who uses the system, what they do)
   ↓
3. ERD (what data the system stores)
   ↓
4. SRS (formal requirements with IDs)
   ↓
5. Sequence Diagrams (how modules talk to each other)
   ↓
6. TDS (how we build it technically)
   ↓
7. Database Design (schema details, indexes, migrations)
   ↓
8. API Spec (endpoints, request/response)
```

---

## Naming Conventions

### Features

Features map business flows to modules in `modules.yaml`:

```yaml
features:
  - name: "User Registration"
    modules: [AUTH, SMS, EMAIL, LOG]
    description: "User signs up, receives OTP, account created, event logged"
```

### Tables

ALL tables: `<project_short_name>_<table_name>`

| Wrong | Correct (project = auth) |
|-------|--------------------------|
| users | auth_users |
| sessions | auth_sessions |
| roles | auth_roles |

### Requirement IDs

| Prefix | Type | Example |
|--------|------|---------|
| FR- | Functional Requirement | FR-001 |
| NFR- | Non-Functional Requirement | NFR-001 |
| UC- | Use Case | UC-01 |
| DR- | Data Requirement | DR-001 |
| IR- | Integration Requirement | IR-001 |

### Module Codes

| Code | Name | Database |
|------|------|----------|
| AUTH | Authentication | auth_db |
| SMS | SMS Service | sms_db |
| EMAIL | Email Service | email_db |
| LOG | Logger | opensearch |

---

## File Locations

```
modules.yaml                              # Module definitions (edit this first)
templates/                                # Source templates
templates/erd-<database>.puml            # ERD per database
modules/<code>/srs.html                   # Module SRS
modules/<code>/tds.html                   # Module TDS
modules/<code>/database-design.html       # Module DB design
modules/<code>/api-technical-spec.html    # Module API spec
modules/<code>/diagrams/                  # Module PlantUML sources
modules/<code>/images/                    # Generated diagram images
modules/index.html                        # Master index (generated)
```

---

## Common Mistakes

1. **Missing requirement IDs** — Every requirement MUST have FR-xxx or NFR-xxx
2. **Wrong table names** — Always use `<project>_<table>` format
3. **Cross-database foreign keys** — Never reference tables in another database
4. **Missing traceability** — Every technical doc must trace back to SRS
5. **No TOC or logo header** — Every HTML page needs both

---

## Export PDF

Open any HTML doc in browser > Cmd+P > Save as PDF

## Commit Changes

```bash
git add modules/<code>/
git commit -m "docs(<code>): update <what changed>"
```
