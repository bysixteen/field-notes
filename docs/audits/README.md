# Audits

Quarterly forensic audits of the codebase. Each dated file is a snapshot of
what was found, what was fixed, and what was deferred at that point in time.

## Cadence
Run quarterly, or before any significant external release.

## What gets compared
- `knip` — unused files / exports / deps
- `lychee --offline` — internal link integrity
- `osv-scanner -r .` — dependency CVEs
- `gitleaks detect` — secrets in history
- `git log` churn analysis — hotspots

## How to read a recurring finding
If an item flagged in audit N reappears in audit N+1, that's a signal the
underlying fix didn't take. Treat it as a higher-priority finding the second
time around — don't silently re-defer it.

## Index
- [2026-04-29](./2026-04-29.md) — initial forensic audit. Headline: drift
  duplication in `fn-design-md/scripts/`, 30 broken internal links, 8 CVE
  advisories.
