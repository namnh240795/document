# BA Guide - Interactive Setup

Walk the user through the BA documentation framework step by step. Ask questions at each step.

## Flow

1. First, run `make help` to show available commands
2. Ask: "What system are you documenting?" (e.g., e-commerce, HR system, etc.)
3. Ask: "Which modules does your system have?" (AUTH, PROD, ECOM, PAY, WAL, SHIP, NOTI - or custom)
4. For each module, ask:
   - Module code and name
   - Which database does it use?
   - Which tables does it have?
   - What are its dependencies on other modules?
5. Ask: "How do modules communicate?" (webhook events via RabbitMQ, HTTP, etc.)
6. Create `modules.yaml` with all module definitions and webhook events
7. For each module:
   - Create `modules/<code>/diagrams/` directory
   - Copy module templates and customize
   - Generate module diagrams with `make generate-module MODULE=<code>`
8. Ask: "Which system-level diagrams do you need?" (architecture, deployment, component)
9. Run `make build-all` and open `docs/index.html` in browser
10. Explain per-module navigation and webhook event documentation

## Module Reference

| Module | Code | Tables |
|--------|------|--------|
| Authentication | AUTH | users, user_sessions, roles, accounts, verification |
| SMS Service | SMS | sms_logs |
| Product Catalog | PROD | products, categories, product_images |
| E-Commerce | ECOM | orders, order_items, cart_items |
| Payment | PAY | payments, refunds, transaction_logs |
| Wallet | WAL | wallets, wallet_transactions, wallet_topup_requests |
| Shipping | SHIP | addresses, shipments |
| Notification | NOTI | notification_templates, notification_logs |

## Key Commands

### System-Level
- `make pull` - First time setup
- `make generate` - Generate all system diagrams
- `make generate-<type>` - Generate specific diagram type
- `make build-docs` - Build all HTML documents (system + modules + index)
- `make build-all` - Generate everything
- `make open` - Build and open master index in browser
- `make clean` - Clean generated files

### Module-Level
- `make generate-module MODULE=<code>` - Generate diagrams for a module
- `make generate-all-modules` - Generate diagrams for all modules
- `make open-module MODULE=<code>` - Build and open a module's docs
- `/ba-trace` - Verify traceability and module mapping

## Per-Module Document Structure

Each module gets its own document set:
```
docs/
  <module>/
    images/           # Module-specific diagram images
      erd/
      sequence/
    srs.html          # Module SRS
    tds.html          # Module TDS
    database-design.html
    api-technical-spec.html
  index.html          # Master index linking to all modules
```

## Webhook Event Documentation

When modules communicate via events, document them in `modules.yaml`:

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

These events are automatically shown in the master index and can be referenced in module TDS documents.
