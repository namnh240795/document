# BA Documentation Framework

Framework for creating technical documentation (SRS, TDS, Database Design, API Spec) with PlantUML diagrams. Outputs HTML documents print-optimized for A4 paper.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (for PlantUML diagram generation)
- [GNU Make](https://www.gnu.org/software/make/) (macOS: `xcode-select --install`)

## Quick Start

```bash
# 1. Pull PlantUML Docker image (one-time setup)
make pull

# 2. Generate all diagrams + build HTML docs
make build-all

# 3. Open in browser
make open
```

This builds everything and opens `modules/index.html` in your browser — the master index linking to all module documents.

## Viewing Documents

### Option 1: Use the Makefile (recommended)

```bash
make serve    # Starts http://localhost:8080
```

Then open [http://localhost:8080](http://localhost:8080) in your browser. Browse modules and click any document to view it.

### Option 2: Open directly in browser

After running `make build-all`, open any HTML file directly:

```bash
# Open the master index
open modules/index.html

# Open a specific module's SRS
open modules/auth/srs.html
```

### Option 3: Export to PDF

1. Open any HTML document in your browser
2. Press `Cmd+P` (macOS) or `Ctrl+P` (Windows/Linux)
3. Select "Save as PDF" as the destination
4. The CSS is optimized for A4 paper — margins and page breaks are handled automatically

## What You Get

Each module produces 4 documents:

| Document | Content |
|----------|---------|
| `srs.html` | Functional requirements, use cases with activity/sequence diagrams, NFRs, traceability |
| `tds.html` | Technical design, architecture, API endpoints, integration flows |
| `database-design.html` | ERD, table schemas, indexes, migration scripts |
| `api-technical-spec.html` | API endpoints with request/response examples, error codes |

### Modules

| Module | Description | Database |
|--------|-------------|----------|
| AUTH | User accounts, login, roles, sessions, verification | auth_db |
| SMS | SMS delivery, logging, audit trail | sms_db |
| LOG | Application logging, audit trail, error tracking | OpenSearch |

## Build Commands

| Command | Description |
|---------|-------------|
| `make help` | Show all available commands |
| `make pull` | Pull PlantUML Docker image (required once) |
| `make build-all` | Generate all diagrams + build HTML docs |
| `make build-docs` | Build HTML documents only (skip diagram generation) |
| `make open` | Build and open `modules/index.html` in browser |
| `make serve` | Start local web server at http://localhost:8080 |
| `make clean` | Remove all generated files |
| `make watch` | Auto-rebuild on file change (requires `fswatch`) |

### Per-module

```bash
make generate MODULE=auth TYPE=erd       # Single module + diagram type
make generate-erd-auth                    # Auth ERD only
make generate-erd-all                     # All ERDs
make generate-all-modules                 # All modules, all types
```

## Project Structure

```
ba/
├── Makefile                       # Build commands
├── scripts/
│   ├── generate.sh                # PlantUML -> PNG images
│   └── build-docs.sh              # Templates -> HTML docs
│
├── templates/                     # Source templates
│   ├── style.css                  # Print-optimized CSS
│   ├── srs.html                   # SRS template
│   ├── tds.html                   # TDS template
│   ├── database-design.html       # DB design template
│   ├── api-technical-spec.html    # API spec template
│   └── erd-*.puml                 # ERD PlantUML templates
│
├── modules/                       # Module output
│   ├── index.html                 # Master index (start here)
│   ├── auth/                      # AUTH module docs + diagrams
│   ├── sms/                       # SMS module docs + diagrams
│   ├── log/                       # LOG module docs + diagrams
│   └── style.css                  # Shared stylesheet
│
└── CLAUDE.md                      # Framework rules
```

## Customizing Documents

To override a module's template HTML, create a file in `modules/<code>/src/`:

```
modules/auth/src/srs.html          # Overrides templates/srs.html for AUTH
modules/auth/src/tds.html          # Overrides templates/tds.html for AUTH
```

The build script uses your custom file when it exists, otherwise falls back to the template.

## Diagram Types

| Type | Use For | File Location |
|------|---------|---------------|
| Use Case | Actor-system interactions | `diagrams/usecase/` |
| Activity | Process flow (no swimlanes) | `diagrams/activity/` |
| Sequence | Integration between services | `diagrams/sequence/` |
| ERD | Data model (entities, relationships) | `diagrams/erd/` or `templates/erd-*.puml` |
| Component | System components | `diagrams/component/` |
| Architecture | C4 Level 1 context | `templates/architecture-system.puml` |

## Claude Code Commands

These slash commands are available when using Claude Code in this repo:

| Command | Purpose |
|---------|---------|
| `/ba-structure` | Show folder structure and workflow |
| `/ba-setup` | Step-by-step setup guide |
| `/ba-guide` | Interactive walkthrough |
| `/ba-trace` | Verify traceability and module mapping |
| `/ba-new-module` | Add a new module step by step |
| `/ba-new-requirement` | Add requirements to SRS |
| `/ba-erd` | Create or edit ERD diagrams |
| `/ba-srs` | Work on SRS document |
| `/ba-review` | Review all documents for compliance |

## Troubleshooting

**"docker: command not found"** — Install [Docker](https://docs.docker.com/get-docker/) and ensure it's running.

**"make: command not found"** — Install Make: `xcode-select --install` (macOS) or `sudo apt install make` (Linux).

**Diagrams not updating** — Run `make clean` then `make build-all` to regenerate from scratch.

**Linux build failure** — The build script uses macOS `sed -i ''`. On Linux, edit `scripts/build-docs.sh` to use `sed -i` (without the empty string argument).
