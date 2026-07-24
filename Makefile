.PHONY: help pull generate generate-usecase generate-erd generate-erd-auth generate-erd-ecom generate-erd-pay generate-erd-wallet generate-erd-noti generate-activity generate-sequence generate-class generate-component generate-deployment generate-architecture generate-module generate-all-modules build-docs build-docs-module build-all clean open open-module watch

PLANTUML_FORMAT ?= png

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-24s\033[0m %s\n", $$1, $$2}'

pull: ## Pull PlantUML Docker image
	docker pull plantuml/plantuml:latest

# ============================================================
# System-level diagram generation
# ============================================================

generate: ## Generate all system diagrams
	@bash scripts/generate.sh -f $(PLANTUML_FORMAT)

generate-usecase: ## Generate usecase diagrams only
	@bash scripts/generate.sh -f $(PLANTUML_FORMAT) usecase

generate-erd: ## Generate ERD diagrams only
	@bash scripts/generate.sh -f $(PLANTUML_FORMAT) erd

generate-erd-auth: ## Generate auth_db ERD only
	@docker run --rm -v "$(PWD)/templates:/input" -v "$(PWD)/docs/images/erd:/output" plantuml/plantuml:latest -t$(PLANTUML_FORMAT) -o /output /input/erd-auth.puml

generate-erd-ecom: ## Generate ecom_db ERD only
	@docker run --rm -v "$(PWD)/templates:/input" -v "$(PWD)/docs/images/erd:/output" plantuml/plantuml:latest -t$(PLANTUML_FORMAT) -o /output /input/erd-ecom.puml

generate-erd-pay: ## Generate pay_db ERD only
	@docker run --rm -v "$(PWD)/templates:/input" -v "$(PWD)/docs/images/erd:/output" plantuml/plantuml:latest -t$(PLANTUML_FORMAT) -o /output /input/erd-pay.puml

generate-erd-wallet: ## Generate wallet_db ERD only
	@docker run --rm -v "$(PWD)/templates:/input" -v "$(PWD)/docs/images/erd:/output" plantuml/plantuml:latest -t$(PLANTUML_FORMAT) -o /output /input/erd-wallet.puml

generate-erd-noti: ## Generate noti_db ERD only
	@docker run --rm -v "$(PWD)/templates:/input" -v "$(PWD)/docs/images/erd:/output" plantuml/plantuml:latest -t$(PLANTUML_FORMAT) -o /output /input/erd-noti.puml

generate-erd-all: ## Generate all ERD diagrams (all databases)
	@make generate-erd-auth && make generate-erd-ecom && make generate-erd-pay && make generate-erd-wallet && make generate-erd-noti

generate-activity: ## Generate activity diagrams only
	@bash scripts/generate.sh -f $(PLANTUML_FORMAT) activity

generate-sequence: ## Generate sequence diagrams only
	@bash scripts/generate.sh -f $(PLANTUML_FORMAT) sequence

generate-class: ## Generate class diagrams only
	@bash scripts/generate.sh -f $(PLANTUML_FORMAT) class

generate-component: ## Generate component diagrams only
	@bash scripts/generate.sh -f $(PLANTUML_FORMAT) component

generate-deployment: ## Generate deployment diagrams only
	@bash scripts/generate.sh -f $(PLANTUML_FORMAT) deployment

generate-architecture: ## Generate architecture diagrams only
	@bash scripts/generate.sh -f $(PLANTUML_FORMAT) architecture

# ============================================================
# Module-level diagram generation
# ============================================================

generate-module: ## Generate diagrams for a module (usage: make generate-module MODULE=auth TYPE=erd)
	@bash scripts/generate.sh -f $(PLANTUML_FORMAT) --module $(MODULE) $(TYPE)

generate-all-modules: ## Generate diagrams for all modules
	@bash scripts/generate.sh -f $(PLANTUML_FORMAT) --all-modules

# ============================================================
# Document building
# ============================================================

build-docs: ## Build all HTML documents (system + modules + index)
	@bash scripts/build-docs.sh

build-docs-module: ## Build docs for a specific module (usage: make build-docs-module MODULE=auth)
	@bash scripts/build-docs.sh --module $(MODULE)

build-all: generate generate-all-modules build-docs ## Generate all diagrams + build all HTML docs

# ============================================================
# Open in browser
# ============================================================

open: build-docs ## Build docs and open system index
	@open docs/index.html

open-module: build-docs ## Build and open a module's docs (usage: make open-module MODULE=auth)
	@open docs/$(MODULE)/srs.html

# ============================================================
# Utilities
# ============================================================

clean: ## Remove all generated images and docs
	rm -rf docs/images/*/*.png docs/images/*/*.svg
	rm -rf docs/documents/*.html docs/documents/*.css
	rm -rf docs/*/images/*/*.png docs/*/images/*/*.svg
	rm -rf docs/*/srs.html docs/*/tds.html docs/*/database-design.html docs/*/api-technical-spec.html
	rm -f docs/index.html
	@echo "Cleaned generated files."

watch: ## Auto-generate on file change (requires fswatch)
	@echo "Watching diagrams/ and modules/ for changes..."
	@fswatch -o diagrams/ modules/ | while read f; do \
		echo "--- Change detected, regenerating..."; \
		$(MAKE) generate generate-all-modules; \
	done
