# BA Documentation Framework

Framework for creating technical documentation with PlantUML diagrams and HTML output. Supports modular architecture, multi-database design, and requirements traceability.

## Quick Start

```bash
make pull           # Download PlantUML Docker image
make build-all      # Generate diagrams + build HTML docs
open docs/documents/srs.html  # Open in browser
```

## Features

- PlantUML diagrams (Use Case, ERD, Activity, Sequence, Component, Deployment, Architecture)
- HTML documents with print-optimized CSS (A4 paper)
- Requirements traceability (SRS -> TDS -> DB Design -> API Spec)
- Modular architecture (AUTH, PROD, ECOM, PAY, WAL, SHIP, NOTI)
- Multi-database support (auth_db, ecom_db, pay_db, wallet_db, noti_db)
- Table naming convention: `<project_short_name>_<table_name>`
- Export to PDF via browser Print

## Project Structure

```
ba/
├── .claude/
│   ├── CLAUDE.md                  # Framework rules
│   └── commands/                  # Claude commands
│       ├── ba-structure.md        # Show folder structure
│       ├── ba-setup.md            # Step-by-step setup
│       ├── ba-guide.md            # Interactive walkthrough
│       └── ba-trace.md            # Verify traceability
│
├── Makefile                       # Build commands
├── scripts/
│   ├── generate.sh                # PlantUML -> images
│   └── build-docs.sh              # Templates -> HTML docs
│
├── templates/                     # EDIT THESE (source files)
│   ├── style.css                  # Print CSS
│   ├── usecase.puml               # Use Case diagram
│   ├── erd.puml                   # ERD (modular, with xxx_ prefix)
│   ├── activity.puml              # Activity diagram
│   ├── sequence.puml              # Sequence diagram
│   ├── class-diagram.puml         # Class diagram
│   ├── component.puml             # Component diagram
│   ├── deployment.puml            # Deployment diagram
│   ├── architecture.puml          # Architecture C4
│   ├── openapi.yaml               # OpenAPI 3.0 spec
│   ├── srs.html                   # SRS document
│   ├── tds.html                   # TDS document
│   ├── database-design.html       # Database design
│   └── api-technical-spec.html    # API specification
│
├── diagrams/                      # YOUR PlantUML files
│   ├── usecase/
│   ├── erd/
│   ├── activity/
│   ├── sequence/
│   ├── class/
│   ├── component/
│   ├── deployment/
│   └── architecture/
│
├── docs/
│   ├── images/                    # GENERATED images (auto)
│   └── documents/                 # GENERATED HTML docs (auto)
│
├── examples/                      # Sample files
└── CLAUDE.md                      # Rules (copy to project root)
```

## Build Commands

| Command | Description |
|---------|-------------|
| `make help` | Show all commands |
| `make pull` | Pull PlantUML Docker image |
| `make generate` | Generate all diagrams |
| `make generate-erd` | Generate ERD only |
| `make generate-usecase` | Generate usecase only |
| `make generate-activity` | Generate activity only |
| `make generate-sequence` | Generate sequence only |
| `make generate-class` | Generate class diagram only |
| `make generate-component` | Generate component diagram only |
| `make generate-deployment` | Generate deployment only |
| `make generate-architecture` | Generate architecture only |
| `make build-docs` | Build HTML documents |
| `make build-all` | Generate diagrams + build docs |
| `make open` | Build docs and open in browser |
| `make clean` | Remove generated files |
| `make watch` | Auto-rebuild on file change |

## Claude Commands

| Command | Purpose |
|---------|---------|
| `/ba-structure` | Show folder structure and workflow |
| `/ba-setup` | Step-by-step setup guide |
| `/ba-guide` | Interactive walkthrough |
| `/ba-trace` | Verify traceability and module mapping |

## Workflow

```
1. Define modules (AUTH, PROD, ECOM, PAY, WAL, SHIP, NOTI)
2. Create Use Case Diagram -> define actors and functions
3. Create ERD (modular) -> define entities per module
4. Create Sequence Diagram -> map integration flows
5. Fill SRS -> add requirements with IDs and module mapping
6. Fill TDS -> add design decisions with traceability
7. Fill Database Design -> add schema per database
8. Fill API Spec -> add endpoints with requirement IDs
9. Build and view -> make build-all
10. Export PDF -> Browser > Print > Save as PDF
```

## Rules

### Table Naming Convention

All tables MUST use: `<project_short_name>_<table_name>`

```
Wrong:  users, orders, payments
Correct: ecom_users, ecom_orders, ecom_payments
```

### Requirements Traceability

Every technical document MUST trace back to SRS requirements:

| Prefix | Type | Example |
|--------|------|---------|
| FR- | Functional Requirement | FR-001, FR-002 |
| NFR- | Non-Functional Requirement | NFR-001, NFR-002 |
| DR- | Data Requirement | DR-001, DR-002 |
| IR- | Integration Requirement | IR-001, IR-002 |

### Module ID Convention

| Module | Code | Purpose |
|--------|------|---------|
| Authentication | AUTH | User accounts, login, roles |
| Product Catalog | PROD | Products, categories |
| E-Commerce | ECOM | Orders, cart, checkout |
| Payment | PAY | Payments, refunds |
| Wallet | WAL | Wallets, top-up, transfers |
| Shipping | SHIP | Addresses, delivery |
| Notification | NOTI | Email, SMS, push |

### Multi-Database Architecture

| Database | Modules | Purpose |
|----------|---------|---------|
| auth_db | AUTH | User accounts, authentication |
| ecom_db | PROD, ECOM, SHIP | Product catalog, orders, shipping |
| pay_db | PAY | Payment processing, refunds |
| wallet_db | WAL | User wallets, top-up, transfers |
| noti_db | NOTI | Notification templates, logs |

Cross-database references use application-level IDs (no foreign keys across databases).

### Migration Rules

- Every schema change MUST have a migration script
- File naming: `{timestamp}_{database}_{module}_{description}.sql`
- Every migration MUST have a rollback script
- Migrations organized per database

## Document Templates

| Template | Purpose |
|----------|---------|
| `srs.html` | Software Requirements Specification |
| `tds.html` | Technical Design Specification |
| `database-design.html` | Database schema, indexes, migrations |
| `api-technical-spec.html` | API endpoints, request/response |

## Diagram Types

| Type | Template | Use Case |
|------|----------|----------|
| Use Case | `usecase.puml` | Actor & system interactions |
| ERD | `erd.puml` | Entity relationships (modular) |
| Activity | `activity.puml` | Function/process flow |
| Sequence | `sequence.puml` | Integration flow |
| Class | `class-diagram.puml` | Domain model |
| Component | `component.puml` | System components |
| Deployment | `deployment.puml` | Infrastructure topology |
| Architecture | `architecture.puml` | C4 Level 1 context |

## Examples

See `examples/` for sample PlantUML files:
- `erd-sample.puml` - ERD for e-commerce system
- `usecase-sample.puml` - UseCase for e-commerce system
- `sequence-sample.puml` - Sequence diagram for checkout flow

## Tips

- Edit `.puml` files in `diagrams/` for diagrams
- Edit `.html` files in `templates/` for documents
- Run `make build-all` after any changes
- All HTML is print-optimized for A4 paper
- Use `make clean` to remove generated files
- Replace `xxx` in templates with your project short name
- See `CLAUDE.md` for full rules
# document
