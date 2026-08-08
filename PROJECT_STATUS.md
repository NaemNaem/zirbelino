# Project Status

## Implemented

- Migrationsfähige Architektur (Canonical Model, Repositories, Services, Importer)
- 20 echte Produkte inkl. Bilder, Preise, Bewertungen
- Homepage, Shop, Kategorien, PDPs, Suche, Merkliste, Warenkorb, Checkout-Demo
- Content-Seiten + SEO Basics (sitemap/robots/schema on PDP)
- Source Analysis (OpenCart evidence) + Go-live Playbook

## Demo Only

- Checkout/Payment/Newsletter simuliert
- Cart/Wishlist lokal
- Katalog auf 20 Produkte begrenzt

## Migration Ready

- SourceImporter contract
- url-map.json + report.json
- Adapter stubs (legacy/shopify/shopware/woocommerce)
- DEMO_MODE guards

## Production Requirements

- Backend access / exports
- Real payment + email + auth
- Production repository bindings
- Redirect cutover

## Source System Questions

See `docs/CUSTOMER_REQUIREMENTS.md`

## Risks

- Custom OpenCart extensions
- Cloudflare may hinder naive re-crawls
- Promo/B2B logic needs official data

## Recommended Production Architecture

Pending confirmation. Best current path:

1. Confirm OpenCart + get DB/API/export access
2. Implement Legacy/OpenCart importer into Canonical Model
3. Keep this Next.js storefront via adapters
4. Apply 301s from url-map

No irreversible target-platform lock-in yet.
