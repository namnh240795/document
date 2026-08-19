#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
DIAGRAMS_DIR="$PROJECT_ROOT/diagrams"
MODULES_DIR="$PROJECT_ROOT/modules"
IMAGES_DIR="$PROJECT_ROOT/modules/images"
FORMAT="${PLANTUML_FORMAT:-png}"

# Diagram types to process
TYPES=("usecase" "erd" "activity" "sequence" "class" "component" "deployment" "architecture")

usage() {
    cat <<EOF
Usage: $(basename "$0") [OPTIONS] [TYPE...]

Generate PlantUML diagrams from .puml files.

Options:
  -f, --format FORMAT     Output format: png (default), svg, pdf
  -o, --output DIR        Output directory (default: docs/images/)
  -m, --module MODULE     Generate diagrams for a specific module
  --all-modules           Generate diagrams for all modules
  -h, --help              Show this help message

Types:
  usecase, erd, activity, sequence, class, component, deployment, architecture
  If no type specified, generates all.

Examples:
  $(basename "$0")                              # Generate all system diagrams
  $(basename "$0") erd                          # Generate ERD only
  $(basename "$0") -m auth erd sequence         # Generate AUTH module ERD + sequence
  $(basename "$0") --all-modules erd            # Generate ERD for all modules
  $(basename "$0") -f svg usecase               # Generate usecase as SVG
EOF
}

# Parse modules.yaml to get module list
parse_modules() {
    if [ ! -f "$PROJECT_ROOT/modules.yaml" ]; then
        echo "  [ERROR] modules.yaml not found" >&2
        exit 1
    fi
    # Simple YAML parser: extract module codes (one per line)
    grep -E '^\s+-\s+code:\s+' "$PROJECT_ROOT/modules.yaml" | sed 's/.*code:\s*//' | tr -d '"' | tr -d "'" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//'
}

# Generate diagrams for system-level
generate_diagram() {
    local type="$1"
    local src_dir="$DIAGRAMS_DIR/$type"
    local out_dir="$IMAGES_DIR/$type"

    if [ ! -d "$src_dir" ]; then
        echo "  [SKIP] No directory: $src_dir"
        return 0
    fi

    local count
    count=$(find "$src_dir" -name "*.puml" 2>/dev/null | wc -l | tr -d ' ')

    if [ "$count" -eq 0 ]; then
        echo "  [SKIP] No .puml files in $src_dir"
        return 0
    fi

    echo "  Generating system $type ($count files)..."

    mkdir -p "$out_dir"

    docker run --rm \
        -v "$src_dir:/input" \
        -v "$out_dir:/output" \
        plantuml/plantuml:latest \
        -t"$FORMAT" \
        -DPLANTUML_DPI=200 \
        -o /output \
        /input/*.puml

    echo "  [OK] $type -> $out_dir"
}

# Generate diagrams for a specific module
generate_module_diagram() {
    local module="$1"
    local type="$2"
    local module_lower=$(echo "$module" | tr '[:upper:]' '[:lower:]')
    local src_dir="$MODULES_DIR/$module/diagrams/$type"
    local out_dir="$PROJECT_ROOT/modules/$module_lower/images/$type"

    if [ ! -d "$src_dir" ]; then
        echo "  [SKIP] No directory: $src_dir"
        return 0
    fi

    local count
    count=$(find "$src_dir" -name "*.puml" 2>/dev/null | wc -l | tr -d ' ')

    if [ "$count" -eq 0 ]; then
        echo "  [SKIP] No .puml files in $src_dir"
        return 0
    fi

    echo "  Generating $module/$type ($count files)..."

    mkdir -p "$out_dir"

    docker run --rm \
        -v "$src_dir:/input" \
        -v "$out_dir:/output" \
        plantuml/plantuml:latest \
        -t"$FORMAT" \
        -DPLANTUML_DPI=200 \
        -o /output \
        /input/*.puml

    echo "  [OK] $module/$type -> $out_dir"
}

# Parse arguments
TYPES_TO_GENERATE=()
MODULE=""
ALL_MODULES=false

while [[ $# -gt 0 ]]; do
    case "$1" in
        -f|--format)
            FORMAT="$2"
            shift 2
            ;;
        -o|--output)
            IMAGES_DIR="$2"
            shift 2
            ;;
        -m|--module)
            MODULE="$2"
            shift 2
            ;;
        --all-modules)
            ALL_MODULES=true
            shift
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        -*)
            echo "Error: Unknown option $1" >&2
            usage >&2
            exit 1
            ;;
        *)
            TYPES_TO_GENERATE+=("$1")
            shift
            ;;
    esac
done

# Default to all types
if [ ${#TYPES_TO_GENERATE[@]} -eq 0 ]; then
    TYPES_TO_GENERATE=("${TYPES[@]}")
fi

# Pull plantuml image if not available
echo "Checking PlantUML Docker image..."
docker pull plantuml/plantuml:latest 2>/dev/null || true

echo ""

# Generate module-specific diagrams
if [ -n "$MODULE" ]; then
    echo "Generating diagrams for module: $MODULE"
    echo ""
    for type in "${TYPES_TO_GENERATE[@]}"; do
        if [[ ! " ${TYPES[*]} " =~ " ${type} " ]]; then
            echo "  [ERROR] Unknown type: $type"
            echo "  Valid types: ${TYPES[*]}"
            exit 1
        fi
        generate_module_diagram "$MODULE" "$type"
    done
    echo ""
    echo "Done! Check docs/$MODULE/images/ for generated diagrams."
    exit 0
fi

if [ "$ALL_MODULES" = true ]; then
    echo "Generating diagrams for all modules..."
    echo ""
    MODULES=$(parse_modules)
    for module in $MODULES; do
        echo "  Module: $module"
        for type in "${TYPES_TO_GENERATE[@]}"; do
            generate_module_diagram "$module" "$type" 2>/dev/null || true
        done
        echo ""
    done
    echo "Done! Check docs/<module>/images/ for generated diagrams."
    exit 0
fi

# Generate system-level diagrams (default behavior)
echo "Generating system diagrams..."
echo ""

for type in "${TYPES_TO_GENERATE[@]}"; do
    if [[ ! " ${TYPES[*]} " =~ " ${type} " ]]; then
        echo "  [ERROR] Unknown type: $type"
        echo "  Valid types: ${TYPES[*]}"
        exit 1
    fi
    generate_diagram "$type"
done

echo ""
echo "Done! Check docs/images/ for generated diagrams."

# --- Build HTML documents if requested ---
if [[ "${BUILD_DOCS:-}" == "1" ]]; then
    bash "$SCRIPT_DIR/build-docs.sh"
fi
