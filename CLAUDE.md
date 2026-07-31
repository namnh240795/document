# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

BA Documentation Framework — generates technical documentation (SRS, TDS, Database Design, API Spec) with PlantUML diagrams from modular templates. Outputs HTML documents print-optimized for A4 paper.

## Build Commands

```bash
make pull           # Pull PlantUML Docker image (required once)
make build-all      # Generate all diagrams + build HTML docs
make open           # Build and open modules/index.html in browser
make clean          # Remove all generated files
make watch          # Auto-rebuild on file change (requires fswatch)
```

Per-module or per-diagram-type:
```bash
make generate MODULE=auth TYPE=erd          # Single module + type
make generate-erd-auth                      # Single database ERD
make generate-erd-all                       # All database ERDs
make generate-all-modules                   # All modules, all types
```

## Architecture

**Source files** → `templates/` (HTML templates with `{{PLACEHOLDER}}` vars) and `modules/<CODE>/diagrams/` (PlantUML `.puml` files)

**Build pipeline** → `scripts/generate.sh` (PlantUML → PNG via Docker) → `scripts/build-docs.sh` (templates → HTML, placeholders replaced from `modules.yaml`)

**Output** → `modules/` — per-module HTML docs + `modules/index.html` master index

**Module registry** → `modules.yaml` — defines modules, databases, tables, dependencies, webhooks, and features. This is the single source of truth for placeholders.

## Module System

Modules defined in `modules.yaml`. Current modules: AUTH, SMS. Each module gets 4 docs: SRS, TDS, Database Design, API Spec.

Module directory structure:
```
modules/<CODE>/
  diagrams/          # PlantUML source files
    erd/
    sequence/
    usecase/
    activity/
    class/
  images/            # Generated diagrams (auto)
  srs.html           # Module SRS content
```

Template placeholders: `{{PROJECT_NAME}}`, `{{MODULE_NAME}}`, `{{MODULE_CODE}}`, `{{MODULE_DATABASE}}`, `{{MODULE_TABLES}}`, `{{MODULE_DEPENDENCIES}}`, `{{MODULE_COLOR}}`, `{{DATE}}`, `{{AUTHOR}}`

## Key Rules

- **Table naming**: `<project_short_name>_<table_name>` (e.g., `auth_users`, `auth_sessions`)
- **Requirement IDs**: FR-xxx (functional), NFR-xxx (non-functional), DR-xxx (data), IR-xxx (integration)
- **Multi-database**: Cross-database refs use application-level IDs, no foreign keys across databases
- **Traceability**: Every doc must trace requirements → design → implementation
- **Module docs**: Each module has its own doc set, not combined system-level docs
- **ERD split**: One ERD file per database (`erd-auth.puml`, `erd-ecom.puml`, etc.)

## Logger Module Architecture

The LOG module uses OpenSearch as the primary store based on the [nestjs-kafka-opensearch](https://github.com/namnh240795/nestjs-kafka-opensearch) pattern, adapted to use RabbitMQ:

```
Any Service → RabbitMQ (queue: log.events) → Logger Consumer → OpenSearch (index: log-events)
                                                              ↓
                                                    Search / Analytics / Dashboards
```

- **RabbitMQ** buffers log events from all services (queue: `log.events`)
- **OpenSearch** is the primary store — handles storage, full-text search, analytics, and dashboards (index: `log-events`)
- **No PostgreSQL** — OpenSearch is the single data store, simplifying the architecture

**Log Schema:** `eventId` (keyword), `source` (text+keyword), `level` (keyword), `action` (keyword), `message` (text), `input` (text), `output` (text), `error` (text), `exception` (text), `metadata` (object), `traceId` (keyword), `userId` (keyword), `timestamp` (date)

**Reference implementation:** See `nestjs-kafka-opensearch` repo for the Kafka-based version. Our adaptation replaces Kafka with RabbitMQ (`amqplib`).

## ERD Templates

ERD templates use `xxx_` as placeholder for the project short name (e.g., `xxx_users`). Replace `xxx` with your actual project short name from `modules.yaml` (`project.short_name`). The build scripts do NOT auto-replace these — edit templates manually before first build.

## CSS

Shared stylesheet: `templates/style.css` (copied to `modules/style.css` at build time). All HTML is print-optimized for A4 paper. Export PDF via browser Print.

## BA Workflow

Run `/ba-guide` or describe what you want to do. Claude will:
1. Check existing modules (reads `modules.yaml`)
2. Ask what's the business (you answer)
3. Ask what's the new use case (you answer)
4. Analyze impact on other modules

Then Claude handles everything. See `BA-WORKFLOW.md` for details.

## Adding a New Module

1. Add module to `modules.yaml` with code, name, database, tables, depends_on
2. Create `modules/<CODE>/diagrams/` with PlantUML source files
3. Add module-specific ERD in `templates/erd-<database>.puml`
4. Run `make generate MODULE=<code>` then `make build-docs`

## Build Script Notes

- `scripts/build-docs.sh` uses macOS `sed -i ''` — will fail on Linux without modification
- Diagram generation requires Docker: `docker pull plantuml/plantuml:latest`
- Output images go to `modules/<code>/images/<type>/`
