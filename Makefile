.PHONY: help pull generate generate-erd-auth generate-erd-log generate-erd-all generate-module generate-all-modules generate-feature-map build-docs build-all clean open watch

PLANTUML_FORMAT ?= png

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-24s\033[0m %s\n", $$1, $$2}'

pull: ## Pull PlantUML Docker image
	docker pull plantuml/plantuml:latest

# ============================================================
# ERD generation (per database)
# ============================================================

generate-erd-auth: ## Generate auth_db ERD only
	@docker run --rm -v "$(PWD)/templates:/input" -v "$(PWD)/modules/images/erd:/output" plantuml/plantuml:latest -t$(PLANTUML_FORMAT) -o /output /input/erd-auth.puml

generate-erd-log: ## Generate log_db ERD only
	@docker run --rm -v "$(PWD)/templates:/input" -v "$(PWD)/modules/images/erd:/output" plantuml/plantuml:latest -t$(PLANTUML_FORMAT) -o /output /input/erd-log.puml

generate-erd-all: ## Generate all ERD diagrams (all databases)
	@make generate-erd-auth && make generate-erd-log

# ============================================================
# Feature Map generation
# ============================================================

generate-feature-map: ## Generate feature-module relationship diagrams
	@docker run --rm -v "$(PWD)/templates:/input" -v "$(PWD)/modules/images/feature-map:/output" plantuml/plantuml:latest -t$(PLANTUML_FORMAT) -o /output /input/feature-map.puml
	@docker run --rm -v "$(PWD)/templates:/input" -v "$(PWD)/modules/images/feature-map:/output" plantuml/plantuml:latest -t$(PLANTUML_FORMAT) -o /output /input/feature-components.puml

# ============================================================
# Module diagram generation
# ============================================================

generate: ## Generate diagrams for a module (usage: make generate MODULE=auth TYPE=erd)
	@bash scripts/generate.sh -f $(PLANTUML_FORMAT) --module $(MODULE) $(TYPE)

generate-all-modules: ## Generate diagrams for all modules
	@bash scripts/generate.sh -f $(PLANTUML_FORMAT) --all-modules

# ============================================================
# Document building
# ============================================================

build-docs: ## Build all HTML documents (modules + index)
	@bash scripts/build-docs.sh

build-all: generate-erd-all generate-all-modules generate-feature-map build-docs ## Generate all ERDs + module diagrams + feature map + build HTML docs

# ============================================================
# Open in browser
# ============================================================

open: build-docs ## Build docs and open index
	@open modules/dist/index.html

serve: build-docs ## Start local web server (http://localhost:8080)
	@echo "Starting server at http://localhost:8080"
	@echo "Press Ctrl+C to stop"
	@cd modules/dist && python3 -m http.server 8080

# ============================================================
# Utilities
# ============================================================

clean: ## Remove all generated images and docs
	rm -rf modules/images/*/*.png modules/images/*/*.svg
	rm -rf modules/*/images/*/*.png modules/*/images/*/*.svg
	rm -rf modules/dist
	@echo "Cleaned generated files."

watch: ## Auto-generate on file change (requires fswatch)
	@echo "Watching modules/ for changes..."
	@fswatch -o modules/ | while read f; do \
		echo "--- Change detected, regenerating..."; \
		$(MAKE) generate-all-modules build-docs; \
	done
