#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
TEMPLATES_DIR="$PROJECT_ROOT/templates"
IMAGES_DIR="$PROJECT_ROOT/docs/images"
DOCS_DIR="$PROJECT_ROOT/docs/documents"

mkdir -p "$DOCS_DIR"

# --- Copy CSS ---
cp "$TEMPLATES_DIR/style.css" "$DOCS_DIR/"
echo "  [OK] style.css"

# --- Find first image in a diagram type directory ---
find_first_image() {
    local type="$1"
    local dir="$IMAGES_DIR/$type"
    find "$dir" -name "*.png" -o -name "*.svg" 2>/dev/null | head -1
}

# --- Process each HTML template ---
for html_file in "$TEMPLATES_DIR"/*.html; do
    [ -f "$html_file" ] || continue
    filename=$(basename "$html_file")
    output_file="$DOCS_DIR/$filename"

    # Start with a copy
    cp "$html_file" "$output_file"

    # Replace each image placeholder with actual path or placeholder div
    for type in usecase erd activity sequence class component deployment architecture; do
        # Match: <img src="../images/TYPE/PLACEHOLDER.png" alt="...">
        # The placeholder is everything after /TYPE/ and before .png
        while IFS= read -r line; do
            # Extract the full img tag
            img_tag=$(echo "$line" | sed -n 's/.*\(<img src="[^"]*" alt="[^"]*">\).*/\1/p')
            [ -z "$img_tag" ] && continue

            # Extract src path
            src=$(echo "$img_tag" | sed -n 's/.*src="\([^"]*\)".*/\1/p')
            [ -z "$src" ] && continue

            # Check if this is a placeholder path (contains type directory)
            case "$src" in
                ../images/${type}/*)
                    # Find actual image
                    actual=$(find_first_image "$type")
                    if [ -n "$actual" ]; then
                        # Convert to relative path from DOCS_DIR
                        rel_path="../images/$type/$(basename "$actual")"
                        # Replace in file
                        sed -i '' "s|src=\"[^\"]*${type}/[^\"]*\"|src=\"${rel_path}\"|g" "$output_file"
                        echo "  [OK] $filename -> $type image linked"
                    else
                        # No image found - replace img with placeholder
                        escaped_tag=$(echo "$img_tag" | sed 's/[[\.*^$()+?{|]/\\&/g')
                        sed -i '' "/<img src=\"..\/images\/${type}\//{
                            s|.*|<div style=\"border:2px dashed #ccc;padding:40px;text-align:center;color:#999;margin:20px 0;\">Diagram not generated yet. Run <code>make generate-${type}</code> then <code>make build-docs</code>.</div>|
                        }" "$output_file"
                        echo "  [WARN] $filename -> $type placeholder shown"
                    fi
                    ;;
            esac
        done < <(grep -n "img src=\"../images/${type}/" "$output_file" 2>/dev/null || true)
    done

    echo "  [OK] $filename -> $DOCS_DIR/"
done

echo ""
echo "HTML documents ready in $DOCS_DIR/"
echo ""

# Print first available doc
first_doc=$(find "$DOCS_DIR" -name "*.html" -not -name "style.css" | head -1)
if [ -n "$first_doc" ]; then
    echo "Open: file://$(realpath "$first_doc")"
fi
