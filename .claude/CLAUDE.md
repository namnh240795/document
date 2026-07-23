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
| PROD | Product Catalog | Products, categories, inventory |
| ECOM | E-Commerce | Orders, cart, checkout |
| PAY | Payment | Payment processing, refunds, transaction logs |
| WAL | Wallet | User wallets, top-up, transfers |
| SHIP | Shipping | Addresses, delivery tracking |
| NOTI | Notification | Email, SMS, push notifications |

---

## Rule: Modular ERD

ERD MUST be organized by modules. Each feature belongs to one or more modules.

### Table Naming Convention

ALL tables MUST use the format: `<project_short_name>_<table_name>`

- Project short name: 3-4 characters, lowercase
- Table name: lowercase, snake_case

**Examples (project short name = `ecom`):**

| Wrong | Correct |
|-------|---------|
| users | ecom_users |
| orders | ecom_orders |
| order_items | ecom_order_items |
| payments | ecom_payments |

**Examples (project short name = `hrm`):**

| Wrong | Correct |
|-------|---------|
| employees | hrm_employees |
| departments | hrm_departments |

### ERD Structure

```
ERD Diagram
  ├── Authentication Module (proj_users, proj_roles, proj_sessions)
  ├── Product Catalog Module (proj_products, proj_categories)
  ├── E-Commerce Module (proj_orders, proj_order_items, proj_cart)
  ├── Payment Module (proj_payments, proj_refunds, proj_tx_logs)
  ├── Wallet Module (proj_wallets, proj_wallet_tx, proj_topup)
  ├── Shipping Module (proj_addresses, proj_shipments)
  └── Notification Module (proj_templates, proj_logs)
```

### Rules for ERD

1. Each module MUST be visually separated (package/box in PlantUML)
2. Each module MUST show which FR/NFR it resolves
3. Cross-module relationships MUST be clearly marked
4. Module boundaries MUST align with service boundaries in TDS
5. ALL table names MUST follow `<project_short_name>_<table_name>` convention
6. Foreign keys MUST reference full table name (e.g., `proj_users.id`)

### Module-to-Table Mapping

| Module | Tables (project = `ecom`) |
|--------|---------------------------|
| AUTH | ecom_users, ecom_user_sessions, ecom_roles |
| PROD | ecom_products, ecom_categories, ecom_product_images |
| ECOM | ecom_orders, ecom_order_items, ecom_cart_items |
| PAY | ecom_payments, ecom_refunds, ecom_transaction_logs |
| WAL | ecom_wallets, ecom_wallet_transactions, ecom_wallet_topup_requests |
| SHIP | ecom_addresses, ecom_shipments |
| NOTI | ecom_notification_templates, ecom_notification_logs |

---

## Rule: Feature-to-Module Mapping

Every feature in SRS MUST be mapped to its module.

### SRS Requirements Table Must Include:

| Req ID | Module | Requirement | Use Case | Priority | Description |
|--------|--------|-------------|----------|----------|-------------|
| FR-001 | AUTH | User Registration | UC-01 | High | ... |
| FR-008 | WAL | Wallet Top-up | UC-06 | High | ... |

### Rules for Feature Mapping

1. Each requirement MUST have a Module column
2. Module code MUST match the Module ID Convention
3. A feature can span multiple modules (list primary module)
4. Cross-module features MUST show all involved modules

---

## Rule: Database Migrations

Database changes MUST be done step by step using migration scripts. Never modify production database directly.

### Migration Rules

1. **Every schema change MUST have a migration script**
   - CREATE TABLE -> migration file
   - ALTER TABLE -> migration file
   - CREATE INDEX -> migration file
   - DROP TABLE -> migration file

2. **Migration file naming convention:**
   ```
   {timestamp}_{database}_{module}_{description}.sql
   ```
   Examples:
   ```
   20240101_001_authdb_auth_create_users.sql
   20240101_002_proddb_prod_create_products.sql
   20240101_003_ecomdb_ecom_create_orders.sql
   20240101_004_paydb_pay_create_payments.sql
   20240101_005_waldb_wal_create_wallets.sql
   ```

3. **Every migration MUST have a rollback script**
   ```
   migrations/
   ├── auth_db/
   │   ├── up/
   │   │   └── 20240101_001_create_users.sql
   │   └── down/
   │       └── 20240101_001_create_users_rollback.sql
   ├── ecom_db/
   │   ├── up/
   │   │   └── 20240101_003_create_orders.sql
   │   └── down/
   │       └── 20240101_003_create_orders_rollback.sql
   └── wallet_db/
       ├── up/
       │   └── 20240101_005_create_wallets.sql
       └── down/
           └── 20240101_005_create_wallets_rollback.sql
   ```

4. **Migration order MUST follow module dependency:**
   ```
   1. AUTH (users, roles) - no dependencies
   2. PROD (categories, products) - depends on AUTH
   3. ECOM (orders, order_items) - depends on AUTH, PROD
   4. PAY (payments, refunds) - depends on ECOM
   5. WAL (wallets, wallet_transactions) - depends on AUTH
   6. SHIP (addresses, shipments) - depends on AUTH, ECOM
   7. NOTI (templates, logs) - depends on AUTH
   ```

5. **Database Design document MUST include:**
   - Migration file structure
   - Migration order (by module)
   - Rollback procedures for each migration

### Database Design Template Structure

```
Section 1: Overview
Section 2: Database Strategy (multi-database or single)
Section 3: Schema Design (organized by database, then by module)
Section 4: Indexes (grouped by database, then by module)
Section 5: Migrations (per database)
  5.1 Migration Strategy
  5.2 Migration File Structure
  5.3 Migration Order (by database, by module)
  5.4 Rollback Procedures
Section 6: Data Dictionary
Section 7: Backup & Recovery (per database)
Section 8: Performance Tuning (per database)
```

---

## Rule: Multi-Database Architecture

System MAY use multiple databases for different modules. Each database serves a specific business domain.

### Database-to-Module Mapping

| Database | Modules | Purpose |
|----------|---------|---------|
| auth_db | AUTH | User accounts, authentication, authorization |
| ecom_db | PROD, ECOM, SHIP | Product catalog, orders, shipping |
| pay_db | PAY | Payment processing, refunds |
| wallet_db | WAL | User wallets, top-up, transfers |
| noti_db | NOTI | Notification templates, logs |

### Multi-Database Rules

1. **Each database MUST be documented separately**
   - Separate schema design section per database
   - Separate migration scripts per database
   - Separate backup strategy per database

2. **Cross-database references use application-level IDs**
   - NO foreign keys across databases
   - Use `user_id` (application-level) not `REFERENCES auth_db.xxx_users(id)`
   - Validate relationships in application code

3. **Each database follows table naming convention:**
   ```
   <project_short_name>_<table_name>
   ```
   All databases share the same project prefix.

4. **Database Design MUST specify:**
   - Which modules belong to which database
   - How modules communicate across databases
   - Data consistency strategy (eventual consistency, saga pattern, etc.)

### Example: E-Commerce System

```
Database: auth_db
  - ecom_users
  - ecom_user_sessions
  - ecom_roles

Database: ecom_db
  - ecom_products
  - ecom_categories
  - ecom_orders
  - ecom_order_items
  - ecom_addresses
  - ecom_shipments

Database: pay_db
  - ecom_payments
  - ecom_refunds
  - ecom_transaction_logs

Database: wallet_db
  - ecom_wallets
  - ecom_wallet_transactions
  - ecom_wallet_topup_requests

Database: noti_db
  - ecom_notification_templates
  - ecom_notification_logs
```

---

## Rules for Each Document

**SRS (srs.html):**
- Every requirement MUST have a unique ID (FR-xxx, NFR-xxx)
- Every requirement MUST have a Module column
- Include System Modules table (section 2.4)
- Include a Traceability Matrix mapping requirements to modules, endpoints, tables

**TDS (tds.html):**
- Every design decision MUST show which SRS requirement it resolves
- Include "Requirements Addressed" section listing all covered requirement IDs
- Component table MUST map to requirement IDs and modules
- Include full Traceability Summary at end

**Database Design (database-design.html):**
- Tables MUST be organized by module (section headers per module)
- Data Dictionary MUST include "Module" column
- Each module section MUST show which requirements it resolves
- Indexes MUST be grouped by module

**API Technical Spec (api-technical-spec.html):**
- Every endpoint MUST show its requirement ID in the header
- Include "Requirements Addressed" table mapping FR-xxx to endpoints
- Endpoints SHOULD be grouped by module

---

## Traceability Flow

```
SRS defines:
  - Requirements (FR-001, NFR-001)
  - Modules (AUTH, ECOM, WAL)
  - Feature-to-Module mapping
    |
TDS shows:
  - requirement -> design decision -> component -> module
    |
API Spec shows:
  - requirement -> endpoint -> module
    |
DB Design shows:
  - requirement -> table -> module
```

---

## When Creating or Editing Documents

1. Always check if requirement IDs are present
2. Always check if module codes are present
3. Always verify traceability links are correct
4. When adding a new requirement to SRS, update all technical docs
5. When adding a new table, assign it to a module
6. When adding a new endpoint, link it to requirement and module
