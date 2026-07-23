# BA Framework - Project Structure Guide

Explain the BA Documentation Framework project structure and guide the user on what to build first.

## Instructions

1. Show the folder structure with descriptions
2. Explain the workflow
3. Ask what system they are documenting
4. Guide them to start with the first diagram

## Step 1: Show Structure

Display this structure to the user:

```
ba/
├── Makefile                    # Build commands (run these)
├── scripts/
│   ├── generate.sh             # PlantUML -> images
│   └── build-docs.sh           # templates -> HTML docs
│
├── templates/                  # EDIT THESE (source files)
│   ├── style.css               # Print CSS (don't touch)
│   ├── usecase.puml            # Use Case diagram template
│   ├── erd.puml                # ERD template
│   ├── activity.puml           # Activity/Function template
│   ├── sequence.puml           # Sequence diagram template
│   ├── class-diagram.puml      # Class diagram template
│   ├── component.puml          # Component diagram template
│   ├── deployment.puml         # Deployment diagram template
│   ├── architecture.puml       # Architecture C4 template
│   ├── srs.html                # SRS document template
│   ├── tds.html                # TDS document template
│   ├── database-design.html    # Database design template
│   └── api-technical-spec.html # API spec template
│
├── diagrams/                   # YOUR PlantUML files
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
│   ├── images/                 # GENERATED (auto)
│   └── documents/              # GENERATED HTML docs (auto)
│
└── examples/                   # Reference samples
```

## Step 2: Explain Workflow

Tell the user:

```
Flow: templates/ -> diagrams/ -> docs/images/ -> docs/documents/

1. Copy template:  cp templates/erd.puml diagrams/erd/my-project.puml
2. Edit the .puml: Customize for your system
3. Generate image: make generate-erd
4. Build docs:     make build-docs
5. View:           open docs/documents/srs.html
6. Export PDF:     Browser > Print > Save as PDF
```

## Step 3: Recommend Build Order

Explain the recommended order based on BA workflow:

| Step | What | Why |
|------|------|-----|
| 1 | Use Case Diagram | Define actors and system scope first |
| 2 | ERD | Design data model from use cases |
| 3 | Sequence Diagram | Map integration flows |
| 4 | Activity Diagram | Document function workflows |
| 5 | SRS Document | Combine into requirements spec |
| 6 | TDS | Add technical design details |
| 7 | Database Design | Formalize schema documentation |
| 8 | API Spec | Document endpoints |

## Step 4: Ask and Guide

Ask: "What system are you documenting?"

Then help them start with Step 1 (Use Case Diagram):
- Copy the template
- Ask about actors (who uses the system)
- Ask about main functions (what the system does)
- Edit the .puml file
- Generate and show the result
