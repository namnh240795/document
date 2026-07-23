.PHONY: generate generate-usecase generate-erd generate-activity generate-sequence generate-class generate-component generate-deployment generate-architecture build-docs build-all clean watch pull help

PLANTUML_FORMAT ?= png

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

pull: ## Pull PlantUML Docker image
	docker pull plantuml/plantuml:latest

generate: ## Generate all diagrams
	@bash scripts/generate.sh -f $(PLANTUML_FORMAT)

generate-usecase: ## Generate usecase diagrams only
	@bash scripts/generate.sh -f $(PLANTUML_FORMAT) usecase

generate-erd: ## Generate ERD diagrams only
	@bash scripts/generate.sh -f $(PLANTUML_FORMAT) erd

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

build-docs: ## Build HTML documents from templates
	@bash scripts/build-docs.sh

build-all: generate build-docs ## Generate diagrams + build HTML docs

clean: ## Remove all generated images and docs
	rm -rf docs/images/*/*.png docs/images/*/*.svg
	rm -rf docs/documents/*.html docs/documents/*.css
	@echo "Cleaned generated files."

open: build-docs ## Build docs and open in browser
	@open docs/documents/srs.html

watch: ## Auto-generate on file change (requires fswatch)
	@echo "Watching diagrams/ for changes..."
	@fswatch -o diagrams/ | while read f; do \
		echo "--- Change detected, regenerating..."; \
		$(MAKE) generate; \
	done
