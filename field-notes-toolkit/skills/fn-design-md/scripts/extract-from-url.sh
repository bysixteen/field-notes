#!/usr/bin/env bash
# Extract design tokens and screenshots from a live site URL.
# Wraps `npx designlang` (Playwright-based extractor) and captures screenshots
# at standard viewports for downstream Vision reconciliation.
#
# Usage: extract-from-url.sh <url> [out-dir]
#
# Output:
#   <out-dir>/raw/tokens.json     — DTCG-shaped token export (what designlang produces)
#   <out-dir>/raw/screenshots/    — viewport screenshots for Vision reconciliation
#
# Dependencies: Node 18+, npx. The first run downloads designlang's Chromium
# bundle (~150 MB). If you've not used designlang before, expect a slow start.

set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "usage: extract-from-url.sh <url> [out-dir]" >&2
  exit 64
fi

URL="$1"
OUT_DIR="${2:-./extracted}"
RAW_DIR="$OUT_DIR/raw"
SHOT_DIR="$RAW_DIR/screenshots"

mkdir -p "$RAW_DIR" "$SHOT_DIR"

if ! command -v npx >/dev/null 2>&1; then
  echo "error: npx not found. Install Node 18+ from https://nodejs.org" >&2
  exit 69
fi

echo "→ extracting tokens from $URL"
echo "  (first run downloads ~150 MB Chromium bundle)"
npx --yes designlang@latest "$URL" --out "$RAW_DIR" --json

if [[ ! -f "$RAW_DIR/tokens.json" ]]; then
  echo "error: designlang did not produce $RAW_DIR/tokens.json" >&2
  echo "  (the package may have changed its output path; check $RAW_DIR for what it produced)" >&2
  exit 1
fi

echo "→ capturing screenshots at standard viewports"
node - "$URL" "$SHOT_DIR" <<'NODE'
const url = process.argv[2];
const outDir = process.argv[3];
const viewports = [
  { name: "desktop-1280", width: 1280, height: 800 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "mobile-375", width: 375, height: 812 },
];

const { chromium } = await import("playwright");
const browser = await chromium.launch();
try {
  for (const v of viewports) {
    const ctx = await browser.newContext({ viewport: { width: v.width, height: v.height } });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
    await page.screenshot({ path: `${outDir}/${v.name}.png`, fullPage: true });
    await ctx.close();
    console.log(`  ✓ ${v.name}.png`);
  }
} finally {
  await browser.close();
}
NODE

echo "✓ extraction complete:"
echo "  tokens:      $RAW_DIR/tokens.json"
echo "  screenshots: $SHOT_DIR/"
echo ""
echo "next: read the screenshots + tokens together, dedupe the palette,"
echo "      assign dimensional roles, then run emit-design-md.mjs"
