# Demo → Production Migration

This is the go-live playbook. Goal: once backend data/access exists, cut over without weeks of architectural rework.

## Non-negotiable rule

```text
UI → Service → Repository → Adapter → External System
```

Never:

```text
UI → External API / OpenCart / Shopify
```

If this rule holds, go-live is mostly **adapter + import + validation + redirects**, not a rebuild.

---

## Step 1 – Existing System Discovery

Collect from customer (see also `CUSTOMER_REQUIREMENTS.md`):

- [ ] Confirm shop system (public analysis points to customized OpenCart)
- [ ] Backend access / developer contact
- [ ] Hosting + DB access
- [ ] Product / variant / media export
- [ ] Customer + address export
- [ ] Order history export
- [ ] Stock / ERP
- [ ] Payment provider credentials + webhooks
- [ ] Shipping rules
- [ ] Newsletter tool
- [ ] Tracking / consent tools
- [ ] Invoice software

---

## Step 2 – Determine Source Adapter

```text
IF official OpenCart/DB access available
  → LegacyDatabaseImporter / custom OpenCart adapter

ELSE IF stable Admin/API/export available
  → CustomApiImporter or FileImporter (CSV/XML/JSON)

ELSE IF Shopify/Shopware/Woo is actually the source (unexpected)
  → matching stub importer in src/importers/*

ELSE
  → CustomMigrationStrategy (document in DECISIONS.md)
```

Public crawler becomes validation/compare only after this step.

---

## Step 3 – Build Source Adapter

Implement against `SourceImporter` (`src/importers/shared/types.ts`):

- map source fields → Canonical Commerce Model
- keep `source.externalId` + `source.originalUrl`
- idempotent upserts (no duplicate products on re-run)
- structured logs: sourceId, targetId, entityType, status, warnings, errors

---

## Step 4 – Import Master Data

Recommended order:

1. Categories
2. Products
3. Variants
4. Media
5. Content
6. Reviews
7. Customers
8. Addresses
9. Orders
10. Discounts / vouchers

After each entity: run count validation (`validateMigrationCounts`).

---

## Step 5 – Connect Commerce Backend

Replace only composition-root bindings in `src/repositories/index.ts` and services:

```text
DemoProductRepository      → ProductionProductRepository
DemoCategoryRepository     → ProductionCategoryRepository
CartService (localStorage) → CommerceCartService
CheckoutService (demo)     → CommerceCheckoutService
DemoPaymentService         → Real PaymentService
WishlistService (local)    → CustomerWishlistService
```

UI components stay.

---

## Step 6 – Connect Payments

- Provider + keys + webhook endpoints
- Test mode first
- Success / failure / cancel routes
- Never store raw card data in this app
- Map provider statuses → canonical order status

## Step 7 – Connect Shipping

- Methods, countries, free-shipping threshold (site claims ab 70 €)
- Tracking integration if available

## Step 8 – Connect Email

- Order confirmation, shipping, reset password, contact
- Keep disabled while `NEXT_PUBLIC_DEMO_MODE=true`

## Step 9 – Customer Migration

- Export customers/addresses/orders via official access only
- Decide password strategy (usually reset-on-first-login)
- Document GDPR handling

## Step 10 – SEO Migration

- Build final redirects from `migration/url-map.json`
- Keep old slugs where possible
- Generate sitemap + robots
- Validate product/breadcrumb/organization schema

## Step 11 – QA

- Import counts match
- 20+ smoke products + random full-catalog samples
- Checkout test order
- Mobile + desktop
- Redirect spot checks for top SEO URLs
- No demo watermarks / demo payment paths in prod

## Step 12 – Go Live

- DNS / SSL
- `NEXT_PUBLIC_DEMO_MODE=false`
- Monitoring + backups + rollback plan
- Freeze catalog edits during cutover window if needed

---

## Why this avoids “weeks of problems”

1. Frontend already consumes stable canonical types.
2. Importer contract is fixed (`SourceImporter` → normalizer → validation).
3. URL map exists before cutover.
4. Demo vs production replacements are named and localized.
5. Count validation catches incomplete imports early.
6. OpenCart suspicion is documented, but not hardcoded into UI.
