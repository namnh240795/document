# BA Guide - Interactive Setup

Walk the user through the BA documentation framework step by step. Ask questions at each step.

## Flow

1. First, run `make help` to show available commands
2. Ask: "What system are you documenting?" (e.g., e-commerce, HR system, etc.)
3. Ask: "Which modules does your system have?" (AUTH, PROD, ECOM, PAY, WAL, SHIP, NOTI - or custom)
4. Ask: "Which diagrams do you need?" (usecase, erd, activity, sequence, component, deployment, architecture)
5. For each selected diagram:
   - Copy the template to `diagrams/<type>/`
   - Help the user customize it for their system
   - For ERD: organize entities by module, remove unused modules
   - Generate with `make generate-<type>`
6. Ask: "Which documents do you need?" (srs, tds, database-design, api-technical-spec)
7. For each selected document:
   - Copy the HTML template
   - Help fill in the content
   - Ensure requirements have IDs (FR-xxx) and Module column
   - Ensure tables/endpoints are assigned to modules
8. Run `make build-all` and open in browser
9. Explain how to export to PDF

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

## Key Commands
- `make pull` - First time setup
- `make generate-<type>` - Generate specific diagram
- `make build-docs` - Build HTML documents
- `make build-all` - Generate everything
- `make open` - Build and open in browser
- `make clean` - Clean generated files
- `/ba-trace` - Verify traceability and module mapping
