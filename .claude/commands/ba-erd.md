# Work on ERD Diagrams

Guide the user through creating or editing ERD diagrams for a module.

## Instructions

Walk the user through each step. Ask questions before proceeding.

### Step 1: Identify the Task

Ask: "What do you want to do?"
1. Create a new ERD for a database
2. Add a table to an existing ERD
3. Add a relationship between tables
4. Review/fix an existing ERD

### Step 2: Identify Database and Module

Ask: "Which database and module?"

| Database | Modules | ERD File |
|----------|---------|----------|
| auth_db | AUTH | `templates/erd-auth.puml` |
| sms_db | SMS | `templates/erd-sms.puml` |
| opensearch | LOG | `templates/erd-log.puml` |
| ecom_db | PROD, ECOM, SHIP | `templates/erd-ecom.puml` |
| pay_db | PAY | `templates/erd-pay.puml` |
| wallet_db | WAL | `templates/erd-wallet.puml` |
| noti_db | NOTI | `templates/erd-noti.puml` |

### Step 3: Read Existing ERD

Read the current ERD file to understand existing tables and relationships.

### Step 4: Create or Edit

#### Creating New ERD

Create `templates/erd-<database>.puml`:

```plantuml
@startuml
!define TABLE(name,desc) name as desc << (table, #E8F5E9) >>
!define PK(name) name << PK >>
!define FK(name) name << FK >>

title <Database> ERD

package "<Module Name> (<database>)" #E8F5E9 {
  TABLE(<project>_<table1>, "<table1>") {
    PK(id : uuid)
    field1 : type
    field2 : type
    created_at : timestamp
    updated_at : timestamp
  }

  TABLE(<project>_<table2>, "<table2>") {
    PK(id : uuid)
    FK(<project>_<table1>_id : uuid)
    field1 : type
    created_at : timestamp
  }

  <project>_<table1> ||--o{ <project>_<table2> : "has"
}

@enduml
```

#### Adding Table

1. Ask for table details:
   - Table name (will be prefixed with project short name)
   - Columns with types
   - Primary key
   - Foreign keys

2. Add to the appropriate module package in the ERD

3. Add relationships

### Step 5: Table Naming Rules

ALL tables MUST use: `<project_short_name>_<table_name>`

Current project: `auth` (from modules.yaml)

| Wrong | Correct |
|-------|---------|
| users | auth_users |
| sessions | auth_sessions |
| roles | auth_roles |

### Step 6: Column Types Reference

| PlantUML | SQL Type | Notes |
|----------|----------|-------|
| uuid | UUID | Primary keys, foreign keys |
| varchar(255) | VARCHAR(255) | Names, emails, codes |
| text | TEXT | Long text, descriptions |
| integer | INTEGER | Counts, small numbers |
| bigint | BIGINT | Large numbers |
| decimal(10,2) | DECIMAL(10,2) | Money, precise values |
| boolean | BOOLEAN | Flags |
| timestamp | TIMESTAMP | created_at, updated_at |
| jsonb | JSONB | Flexible structured data |
| enum('a','b') | ENUM | Fixed set of values |

### Step 7: Relationship Notation

| Symbol | Meaning |
|--------|---------|
| `\|\|--o{` | One to many (optional) |
| `\|\|--\|\|` | One to one (required) |
| `o{--o{` | Many to many |
| `\|\|..o{` | One to many (mandatory) |

### Step 8: Generate and Verify

```bash
make generate-erd-<database>
make build-docs
make open
```

Verify:
- Tables render correctly
- Relationships show correctly
- All table names follow convention
- Module packages are visible

### Step 9: Update Module ERD

If the ERD is module-specific, also update the module's ERD in `modules/<code>/diagrams/erd/`.

## ERD Checklist

Before finalizing:

- [ ] All table names use `<project>_<table>` convention
- [ ] Primary keys are defined (id : uuid)
- [ ] Foreign keys reference full table names
- [ ] Timestamps (created_at, updated_at) exist
- [ ] No cross-database foreign keys
- [ ] Entities grouped by module
- [ ] Each module shows which FR/NFR it resolves
- [ ] Relationships are labeled
