# BA Guide - Requirements Traceability & Module Mapping

Guide the user to add or verify requirements traceability and module mapping between SRS and technical documents.

## Instructions

1. Check if SRS has requirement IDs AND module codes defined
2. Verify all technical docs trace back to SRS requirements
3. Verify all tables/endpoints are assigned to modules
4. Help user add missing traceability

## Step 1: Check SRS Requirements & Modules

Read `templates/srs.html` and verify:
- All requirements have IDs (FR-xxx, NFR-xxx, DR-xxx, IR-xxx)
- All requirements have Module column (AUTH, PROD, ECOM, PAY, WAL, SHIP, NOTI)
- System Modules table exists (section 2.4)
- Traceability Matrix exists with module mapping

If missing, help user add requirement IDs and module codes to SRS first.

## Step 2: Verify Modular ERD

Read `templates/erd.puml` and verify:
- Entities are grouped by module (package/box per module)
- Each module shows which requirements it resolves
- Cross-module relationships are clearly marked

Ask: "Do you want to update the ERD modules? (yes/no)"

## Step 3: Verify TDS Traceability

Read `templates/tds.html` and verify:
- "Requirements Addressed" section exists (section 1.4)
- Each design decision has "Resolves" column with requirement IDs
- Component table maps to requirement IDs AND modules
- Traceability Summary exists at end (section 11)

Ask: "Do you want to add traceability to TDS? (yes/no)"

## Step 4: Verify Database Design Traceability

Read `templates/database-design.html` and verify:
- Tables are organized by module (section headers per module)
- Data Dictionary has "Module" column
- Each module section shows which requirements it resolves
- Indexes are grouped by module

Ask: "Do you want to add traceability to Database Design? (yes/no)"

## Step 5: Verify API Spec Traceability

Read `templates/api-technical-spec.html` and verify:
- "Requirements Addressed" table exists with module mapping
- Each endpoint header has requirement ID
- Endpoints are grouped by module (optional but recommended)

Ask: "Do you want to add traceability to API Spec? (yes/no)"

## Step 6: Add Missing Traceability

For each document the user wants to update:

1. Identify requirements in SRS that are not traced
2. Identify tables/endpoints without module assignment
3. Add requirement IDs and module codes
4. Update "Resolves" columns
5. Verify all links are correct

## Step 7: Rebuild and Verify

Run `make build-docs` to rebuild HTML documents.

## Module Reference

| Module | Code | Tables |
|--------|------|--------|
| Authentication | AUTH | users, user_sessions, roles |
| Product Catalog | PROD | products, categories, product_images |
| E-Commerce | ECOM | orders, order_items, cart_items |
| Payment | PAY | payments, refunds, transaction_logs |
| Wallet | WAL | wallets, wallet_transactions, wallet_topup_requests |
| Shipping | SHIP | addresses, shipments |
| Notification | NOTI | notification_templates, notification_logs |

## Rule Reference

See `CLAUDE.md` for the full traceability and modular ERD rules.
