# Add New Module

Guide the user through adding a new module to the BA Documentation Framework.

## Instructions

Walk the user through each step. Ask questions at each step before proceeding.

### Step 1: Gather Module Information

Ask the user:

1. "What is the module code? (3-5 chars, e.g., AUTH, PROD, PAY, WAL)"
2. "What is the module name? (e.g., Authentication, Product Catalog)"
3. "What does this module do? (1-2 sentences)"
4. "Which database does it use? (auth_db, ecom_db, pay_db, wallet_db, noti_db, or new)"
5. "What tables does it own? (list table names, will be prefixed with project short name)"
6. "Does it depend on other modules? (e.g., AUTH, SMS)"
7. "What tech stack does it use? (e.g., NestJS, PostgreSQL, RabbitMQ)"

### Step 2: Update modules.yaml

Read `modules.yaml` and add the new module:

```yaml
modules:
  - code: <CODE>
    name: "<Name>"
    description: "<Description>"
    database: <database>
    tables:
      - <project_short_name>_<table1>
      - <project_short_name>_<table2>
    depends_on:
      - <dependency1>
    tech_stack:
      - <tech1>
      - <tech2>
```

Also add webhook events if the module communicates with others:

```yaml
webhooks:
  - from: <FROM_MODULE>
    to: <CODE>
    event: <event.name>
    description: "<what happens>"
    protocol: RabbitMQ
    queue: <queue-name>
    payload:
      field1: type
```

### Step 3: Create Module Directory Structure

```bash
mkdir -p modules/<code>/diagrams/erd
mkdir -p modules/<code>/diagrams/sequence
mkdir -p modules/<code>/diagrams/usecase
mkdir -p modules/<code>/diagrams/activity
mkdir -p modules/<code>/diagrams/class
mkdir -p modules/<code>/images/erd
mkdir -p modules/<code>/images/sequence
mkdir -p modules/<code>/images/usecase
mkdir -p modules/<code>/images/activity
mkdir -p modules/<code>/images/class
```

### Step 4: Create Module Documents

Copy the module templates and customize placeholders:

1. **SRS** - Copy `templates/module-srs.html` to `modules/<code>/srs.html`
   - Replace: `{{MODULE_NAME}}`, `{{MODULE_CODE}}`, `{{MODULE_DATABASE}}`, `{{MODULE_DESCRIPTION}}`, `{{MODULE_TABLES}}`, `{{MODULE_DEPENDENCIES}}`, `{{MODULE_TECH_STACK}}`

2. **TDS** - Copy `templates/module-tds.html` to `modules/<code>/tds.html`
   - Replace same placeholders

3. **Database Design** - Copy `templates/module-database-design.html` to `modules/<code>/database-design.html`
   - Replace same placeholders

4. **API Spec** - Copy `templates/module-api-spec.html` to `modules/<code>/api-technical-spec.html`
   - Replace same placeholders

### Step 5: Create ERD File

Create `templates/erd-<database>.puml` if it doesn't exist for this database:

```plantuml
@startuml
!define TABLE(name,desc) name as desc << (table, #E8F5E9) >>
!define PK(name) name << PK >>
!define FK(name) name << FK >>

title <Database> ERD - <Module Name>

package "<Module Name> (<database>)" #E8F5E9 {
  TABLE(<project>_<table1>, "<table1>") {
    PK(id : uuid)
    field1 : type
    field2 : type
    created_at : timestamp
    updated_at : timestamp
  }
}

@enduml
```

### Step 6: Build and Verify

```bash
make build-all
make open
```

Verify:
- Module appears in master index
- All 4 documents are generated
- ERD renders correctly
- No broken links

### Step 7: Summary

Show the user what was created:
- modules.yaml entry
- Module directory structure
- 4 HTML documents
- ERD file
- Build results

## Reference: Module Directory Structure

```
modules/<code>/
  diagrams/
    erd/
    sequence/
    usecase/
    activity/
    class/
  images/
    erd/
    sequence/
    usecase/
    activity/
    class/
  srs.html
  tds.html
  database-design.html
  api-technical-spec.html
```
