# Migration

## Source Data

Supported adapter slots:

- Public crawler (demo)
- Legacy DB / OpenCart
- Custom API
- CSV / XML / JSON
- Shopify / Shopware / WooCommerce stubs

## Canonical Model

All sources normalize into `src/domain/*`.

## Import Sequence

Categories → Products → Variants → Media → Content → Reviews → Customers → Addresses → Orders → Discounts/Vouchers

## Validation

Use `buildMigrationReport` and `validateMigrationCounts`.

Go-live quality bar:

- entity counts match source
- zero critical mapping errors
- random sample PDPs visually/data-correct
- URL map covers indexed URLs

## Duplicate Handling

- Prefer upsert by `source.externalId` then slug
- Re-run must be idempotent

## IDs

- Internal canonical `id`
- Preserve `source.externalId` forever for re-sync

## Logging

Each import run should write machine-readable logs (to be stored under `migration/logs/` when production importer lands).

## Rollback

Keep previous `/data` snapshot or DB backup before productive import. Document restore path in go-live checklist.

## Re-run

Imports must upsert, not blind-insert.
