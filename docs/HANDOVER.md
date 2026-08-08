# Handover

## Projektziel

Neue Zirbelino Storefront-Demo als Version 0.1 des späteren Shops, migrationsfähig unabhängig vom finalen Backend.

## Aktueller Stand

See `CURRENT_STATE.md`.

## Architektur

UI never talks to source shop systems directly. Canonical model + repositories/services are mandatory.

## Wichtige Dateien

- Domain: `src/domain`
- Repositories: `src/repositories`
- Services: `src/services`
- Demo adapters: `src/adapters/demo`
- Importers: `src/importers`
- Demo data: `data/`
- Migration: `migration/`
- Go-live playbook: `docs/DEMO_TO_PRODUCTION.md`

## Was NICHT ändern

- Canonical model bypass
- UI → external API coupling
- Secrets in git
- Invented product/trust content

## Handover answers

1. Start: `npm install && npm run dev`
2. Product data: `data/products/products.json`
3. Content data: `data/content/*`
4. Demo mode: `NEXT_PUBLIC_DEMO_MODE=true`
5. Simulated: checkout, payment, email, auth
6. Missing externals: commerce API, payment, email, customer DB
7. Real shop connection: implement repository/service adapters
8. Custom software: `LegacyDatabaseImporter` / custom-api importer
9. Products: importer → normalizer → validate → upsert
10. Customers: only after official export/DB access
11. Orders: same, never via public crawl
12. Reviews: snapshot now; later API/DB sync
13. Old URLs: `migration/url-map.json`
14. 301s: generated from url-map at go-live
15. Needed from customer: see `CUSTOMER_REQUIREMENTS.md`
16. Missing env vars: payment/email/commerce secrets
17. Replace demo repos/services listed in DEMO_TO_PRODUCTION
18. Risks: custom OpenCart extensions, promo logic, B2B pricing
19. Pre-go-live tests: checklist in PRODUCTION_CHECKLIST.md
20. Next step: crawl/normalize 20 products, then homepage UI
