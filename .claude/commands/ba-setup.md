# BA Documentation Setup

Guide the user through setting up and using the BA Documentation Framework step by step.

## Instructions

Walk the user through this workflow. Ask which step they want to do, then execute it.

### Step 1: Initial Setup
Run these commands in the project directory:
```bash
make pull          # Download PlantUML Docker image
make help          # Show available commands
```

### Step 2: Define System Modules

Before creating diagrams, ask the user to define their system modules:

| Module | Code | Purpose |
|--------|------|---------|
| Authentication | AUTH | User accounts, login, roles |
| Product Catalog | PROD | Products, categories |
| E-Commerce | ECOM | Orders, cart, checkout |
| Payment | PAY | Payments, refunds |
| Wallet | WAL | Wallets, top-up, transfers |
| Shipping | SHIP | Addresses, delivery |
| Notification | NOTI | Email, SMS, push |

Ask: "Which modules does your system have? Customize the list above."

### Step 3: Create Project Diagrams
Ask the user what system they are documenting. Then for each diagram type they need:

1. **Use Case Diagram**
   - Copy template: `cp templates/usecase.puml diagrams/usecase/<project-name>-usecase.puml`
   - Edit the .puml file with actors and use cases for their system
   - Generate: `make generate-usecase`

2. **ERD (Entity Relationship Diagram) - Modular**
   - Copy template: `cp templates/erd.puml diagrams/erd/<project-name>-erd.puml`
   - The template is organized by modules (AUTH, PROD, ECOM, PAY, WAL, SHIP, NOTI)
   - Keep only the modules your system needs
   - Add/remove entities within each module
   - Ensure cross-module relationships are correct
   - Generate: `make generate-erd`

3. **Activity/Function Diagram**
   - Copy template: `cp templates/activity.puml diagrams/activity/<project-name>-activity.puml`
   - Edit the workflow/process flow
   - Generate: `make generate-activity`

4. **Sequence Diagram (Integration)**
   - Copy template: `cp templates/sequence.puml diagrams/sequence/<project-name>-sequence.puml`
   - Edit participants and message flow
   - Generate: `make generate-sequence`

5. **Component Diagram**
   - Copy template: `cp templates/component.puml diagrams/component/<project-name>-component.puml`
   - Edit system components and their interactions
   - Generate: `make generate-component`

6. **Deployment Diagram**
   - Copy template: `cp templates/deployment.puml diagrams/deployment/<project-name>-deployment.puml`
   - Edit infrastructure and deployment topology
   - Generate: `make generate-deployment`

7. **Architecture Overview (C4)**
   - Copy template: `cp templates/architecture.puml diagrams/architecture/<project-name>-architecture.puml`
   - Edit high-level system context
   - Generate: `make generate-architecture`

### Step 4: Create OpenAPI Spec
- Copy template: `cp templates/openapi.yaml <project-name>-openapi.yaml`
- Edit endpoints, schemas, and descriptions
- Group endpoints by module

### Step 5: Fill in Document Templates
Ask which documents they need, then:

1. **SRS (Software Requirements Specification)**
   - Copy: `cp templates/srs.html <project-name>-srs.html`
   - Fill in: purpose, scope, user classes
   - Add requirements with IDs (FR-xxx) and Module column
   - Link each requirement to its module (AUTH, ECOM, WAL, etc.)
   - Add Traceability Matrix mapping requirements to modules, endpoints, tables
   - Link generated diagrams in the img src attributes

2. **TDS (Technical Design Specification)**
   - Copy: `cp templates/tds.html <project-name>-tds.html`
   - Fill in: architecture decisions, component design, deployment, security
   - Every design decision MUST show which SRS requirement it resolves
   - Component table MUST map to requirement IDs and modules

3. **Database Design**
   - Copy: `cp templates/database-design.html <project-name>-database-design.html`
   - Tables are organized by module - keep only modules your system needs
   - Fill in: table definitions, indexes, migrations, backup strategy
   - Data Dictionary MUST include Module column

4. **API Technical Specification**
   - Copy: `cp templates/api-technical-spec.html <project-name>-api-spec.html`
   - Fill in: endpoints, request/response examples, error codes
   - Every endpoint MUST show its requirement ID
   - Group endpoints by module

### Step 6: Verify Traceability
Run `/ba-trace` to verify:
- All requirements have IDs and module codes
- All tables/endpoints are assigned to modules
- All technical docs trace back to SRS requirements

### Step 7: Build and View
```bash
make build-all     # Generate all diagrams + build HTML docs
open docs/documents/srs.html  # Open in browser
```

To export PDF: Open HTML in browser > Print (Cmd+P) > Save as PDF.

### Step 8: Iterate
When user updates diagrams or documents:
```bash
make build-all     # Rebuild everything
```

Or watch for changes:
```bash
make watch         # Auto-rebuild on file changes
```

## Module Reference

| Module | Code | ERD Tables | Resolves |
|--------|------|------------|----------|
| Authentication | AUTH | users, user_sessions, roles | FR-001, FR-002, FR-006, NFR-003, NFR-004 |
| Product Catalog | PROD | products, categories, product_images | FR-003 |
| E-Commerce | ECOM | orders, order_items, cart_items | FR-004, FR-012 |
| Payment | PAY | payments, refunds, transaction_logs | FR-005, FR-011, IR-001 |
| Wallet | WAL | wallets, wallet_transactions, wallet_topup_requests | FR-008, FR-009, FR-010 |
| Shipping | SHIP | addresses, shipments | FR-012 |
| Notification | NOTI | notification_templates, notification_logs | IR-002, IR-003 |

## Tips for the User

- Edit `.puml` files in `diagrams/` for diagrams
- Edit `.html` files in `templates/` for documents
- Run `make build-all` after any changes
- All HTML is print-optimized for A4 paper
- Use `make clean` to remove generated files
- See `CLAUDE.md` for full rules on traceability and modules
