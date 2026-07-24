# BA Documentation Framework

Framework for creating technical documentation with PlantUML diagrams and HTML output.

## Quick Start

```bash
make pull           # Download PlantUML Docker image
make build-all      # Generate diagrams + build HTML docs
make serve          # Start local web server (http://localhost:8080)
```

## Features

- PlantUML diagrams (Use Case, ERD, Activity, Sequence, Component, Deployment, Architecture)
- HTML documents with print-optimized CSS (A4 paper)
- Requirements traceability (SRS -> TDS -> DB Design -> API Spec)
- Modular architecture (AUTH, SMS, LOG)
- Multi-database support (auth_db, sms_db, OpenSearch)
- Table naming convention: `<project_short_name>_<table_name>`
- Logo header (company + partner)
- Table of contents with FR links
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
├── templates/                     # Source templates
│   ├── style.css                  # Print CSS
│   ├── srs.html                   # SRS template
│   ├── tds.html                   # TDS template
│   ├── database-design.html       # Database design template
│   ├── api-technical-spec.html    # API spec template
│   ├── erd-auth.puml              # Auth ERD template
│   ├── erd-log.puml              # Log ERD template
│   └── ...
│
├── modules/                       # Module docs + images
│   ├── auth/                      # AUTH module
│   │   ├── src/                   # Custom HTML (overrides templates)
│   │   ├── diagrams/              # PlantUML source files
│   │   │   ├── usecase/
│   │   │   ├── erd/
│   │   │   ├── activity/
│   │   │   └── sequence/
│   │   ├── images/                # Generated diagrams
│   │   ├── srs.html               # Generated SRS
│   │   ├── tds.html               # Generated TDS
│   │   ├── database-design.html   # Generated DB design
│   │   └── api-technical-spec.html # Generated API spec
│   ├── sms/                       # SMS module
│   ├── log/                       # Logger module
│   ├── index.html                 # Master index
│   └── style.css                  # Generated stylesheet
│
├── examples/                      # Sample files
└── CLAUDE.md                      # Rules
```

## Build Commands

| Command | Description |
|---------|-------------|
| `make help` | Show all commands |
| `make pull` | Pull PlantUML Docker image |
| `make build-all` | Generate all diagrams + build HTML docs |
| `make build-docs` | Build HTML documents only |
| `make serve` | Start local web server (http://localhost:8080) |
| `make clean` | Remove generated files |
| `make watch` | Auto-rebuild on file change |

### Generate Specific Diagrams

| Command | Description |
|---------|-------------|
| `make generate MODULE=auth TYPE=sequence` | Generate sequence diagrams for AUTH |
| `make generate MODULE=auth TYPE=activity` | Generate activity diagrams for AUTH |
| `make generate-erd-all` | Generate all ERD diagrams |

## Claude Commands

| Command | Purpose |
|---------|---------|
| `/ba-structure` | Show folder structure and workflow |
| `/ba-setup` | Step-by-step setup guide |
| `/ba-guide` | Interactive walkthrough |
| `/ba-trace` | Verify traceability and module mapping |

## Document Structure

Each module has 4 documents with full traceability:

| Document | Purpose |
|----------|---------|
| `srs.html` | Software Requirements Specification |
| `tds.html` | Technical Design Specification |
| `database-design.html` | Database schema, indexes, migrations |
| `api-technical-spec.html` | API endpoints, request/response |

## Diagram Types

| Type | Use For | Example |
|------|---------|---------|
| Use Case | Actor-system interactions | What users can do |
| Activity | Process flow (simplified, no swimlanes) | Login, Registration, Password Reset |
| Sequence | Integration between services | AUTH -> RabbitMQ -> SMS -> Twilio |
| ERD | Data model (entities, relationships) | Database schema |
| Class | Domain model | Class relationships |
| Component | System components | Service architecture |
| Deployment | Infrastructure | Server topology |
| Architecture | C4 Level 1 | System context |

## Diagram Order

In documents, diagrams appear in this order:
1. **Activity Diagram** (process flow) - first
2. **Sequence Diagram** (integration flow) - second

## Template Customization

To customize a module's HTML, create files in `modules/<code>/src/`:

```bash
# Example: Custom AUTH SRS
cp modules/auth/srs.html modules/auth/src/srs.html
# Edit modules/auth/src/srs.html
# The build script will use your custom file instead of the template
```

## Examples

See `examples/` for sample PlantUML files.

## Rules

See `CLAUDE.md` for framework rules including:
- Requirements traceability (FR-xxx, NFR-xxx)
- Table naming convention (`<project>_<table>`)
- Logo header (company + partner)
- Table of contents with FR links
- Document structure per module
