#!/usr/bin/env node
// Top-level entry that delegates to the canonical emit-design-md.mjs
// inside the fn-design-md skill. This shim exists so consumers can invoke
// the CLI at a stable, predictable path:
//
//   node node_modules/field-notes-toolkit/scripts/emit-design-md.mjs ...
//
// The canonical implementation lives at:
//   skills/fn-design-md/scripts/emit-design-md.mjs
import "../skills/fn-design-md/scripts/emit-design-md.mjs";
