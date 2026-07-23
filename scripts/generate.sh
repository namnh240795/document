#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
DIAGRAMS_DIR="$PROJECT_ROOT/diagrams"
IMAGES_DIR="$PROJECT_ROOT/docs/images"
FORMAT="${PLANTUML_FORMAT:-png}"

# Diagram types to process
TYPES=("usecase" "erd" "activity" "sequence" "class" "component" "deployment" "architecture")

usage() {
    cat <<EOF
Usage: $(basename "$0") [OPTIONS] [TYPE...]

Generate PlantUML diagrams from .puml files.

Options:
  -f, --format FORMAT   Output format: png (default), svg, pdf
  -o, --output DIR      Output directory (default: docs/images/)
  -h, --help            Show this help message

Types:
  usecase, erd, activity, sequence, class
  If no type specified, generates all.

Examples:
  $(basename "$0")                    # Generate all diagrams
  $(basename "$0") erd                # Generate ERD diagrams only
  $(basename "$0") -f svg usecase     # Generate usecase as SVG
EOF
}

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

    echo "  Generating $type ($count files)..."

    mkdir -p "$out_dir"

    docker run --rm \
        -v "$src_dir:/input" \
        -v "$out_dir:/output" \
        plantuml/plantuml:latest \
        -t"$FORMAT" \
        -o /output \
        /input/*.puml

    echo "  [OK] $type -> $out_dir"
}

# Parse arguments
TYPES_TO_GENERATE=()

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
echo "Generating diagrams..."
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
