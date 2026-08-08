# Architecture Decision Log

## ADR-001

Decision: Frontend is decoupled from the commerce backend via Canonical Commerce Model + repositories/services.

Reason: Existing shop system was unknown at briefing; go-live must not require frontend rewrite.

Status: Accepted

Date: 2026-08-08

## ADR-002

Decision: Document likely OpenCart source in `migration/source-analysis.md`, but do not couple UI to OpenCart.

Reason: Public fingerprints are strong; architecture must still support API/CSV/DB/other targets.

Status: Accepted

Date: 2026-08-08

## ADR-003

Decision: Demo catalog is limited to 20 curated products across categories, each with a full PDP.

Reason: Pre-sales quality over full-catalog completeness; importer architecture remains full-catalog-capable.

Status: Accepted

Date: 2026-08-08

## ADR-004

Decision: Go-live priority is adapter/import/validation/redirects, not feature churn.

Reason: Customer requirement: once backend data exists, avoid weeks of problems.

Status: Accepted

Date: 2026-08-08
