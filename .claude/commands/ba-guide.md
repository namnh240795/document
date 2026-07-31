# BA Guide — Interactive Setup

Guide the user through BA documentation. Claude answers Q1 and Q4 automatically; only ask user Q2 and Q3.

## Flow

### Step 1: Claude Answers — New Module or Existing?

Read `modules.yaml` to determine:
- Is the module the user wants to work on already defined?
- What tables, databases, and dependencies does it have?

Tell the user: "I see we have modules: AUTH, SMS, EMAIL, LOG. Which one are you working on, or is this a new module?"

### Step 2: Ask User — What's the Business?

> What does this module do, or what's changing?

If **new module**, ask:
- What is the module code? (3-5 chars, e.g., PROD, PAY)
- What is the module name? (e.g., Product Catalog)
- What does this module do? (1-2 sentences)
- Which database? (existing like auth_db, or new)
- What tables does it own? (will be prefixed with project short name)
- Does it depend on other modules?
- What tech stack? (e.g., NestJS, PostgreSQL, RabbitMQ)

If **existing module**, ask:
- What's changing? (new requirement, ERD update, new use case, etc.)

### Step 3: Ask User — What's the New Use Case?

> What are the new use cases or requirements?

Ask for:
- Use case name and description
- Which actors are involved
- What the system should do (functional requirements)
- Any performance/security needs (non-functional requirements)

### Step 4: Claude Answers — Impact on Current Workflow

Based on `modules.yaml` webhook definitions and dependencies, analyze:
- Does this module send/receive events from other modules?
- Do existing modules need updates (new webhooks, new dependencies)?
- Are there any breaking changes?

Tell the user: "This change will affect modules X and Y because [reason]. I'll update their docs too."

---

## Execute

Based on the answers:

### If New Module:
1. Update `modules.yaml` with the new module definition
2. Create module directory structure (`modules/<code>/diagrams/`, `modules/<code>/images/`)
3. Create 4 HTML documents from templates (SRS, TDS, Database Design, API Spec)
4. Create ERD file in `templates/erd-<database>.puml`
5. Run `make build-all`
6. Verify module appears in master index

### If Existing Module:
1. Update module's SRS (`modules/<code>/srs.html`) with new requirements/use cases
2. Update ERD if tables changed (`templates/erd-<database>.puml`)
3. Update TDS if technical design changed (`modules/<code>/tds.html`)
4. Run `make build-all`
5. Verify changes in browser

## Important Rules

- All tables: `<project_short_name>_<table_name>` (from modules.yaml)
- Requirement IDs: FR-xxx, NFR-xxx, DR-xxx, IR-xxx
- Every requirement must have: ID, Module, Title, Use Case ref, Priority, Description
- Every HTML page needs logo header + table of contents
- No cross-database foreign keys — use application-level IDs
- Every technical doc must trace back to SRS requirements

## Build Commands

```bash
make build-all     # Generate diagrams + build HTML docs
make open          # Build and open master index in browser
make clean         # Remove generated files
```
