# Source Analysis – zirbenprodukte.at

Last updated: 2026-08-08

## Existing website

- Canonical shop: https://www.zirbenprodukte.at/
- Brand: Zirbelino® / KISSEN1 Zirbenprodukte GmbH (Klagenfurt, Kärnten, AT)

## Detected technologies

| Signal | Evidence | Confidence |
| ------ | -------- | ---------- |
| OpenCart (customized) | Asset paths `catalog/view/theme/zirbenprodukte/...` | High |
| OpenCart routing | `index.php?route=common/home`, `product/request`, `product/preorder`, `product/gifts_plus` | High |
| Custom theme | Theme folder name `zirbenprodukte` | High |
| Not Shopify | No `cdn.shopify` / `myshopify` | High |
| Not WooCommerce | No `wp-content/plugins/woocommerce` | High |
| Not Shopware / Magento | No matching fingerprints | High |
| Cloudflare | `static.cloudflareinsights.com` beacon | Medium |
| Trusted Shops | Widget + review integration | High |
| Payments (public claims) | Rechnung, PayPal, Kreditkarte/Stripe mentioned on site copy | Medium |
| Tracking | Google Tag Manager / gtag present | High |

## Possible shop system

**Most likely: OpenCart + heavily customized theme and extensions.**

This is NOT a vanilla OpenCart storefront. Custom routes observed:

- `product/gifts_plus` (X+1 free actions)
- `product/preorder`
- `product/request`
- `product/unavailable`
- `product/category_list`
- `common/home/set-customer-group` (B2C/B2B switch)
- `account/providers/google/login`

## Architecture impact

**None on frontend architecture.**

Detected platform is documented here only. The demo frontend talks exclusively to the Canonical Commerce Model via repositories/services. A later OpenCart/legacy adapter plugs into `src/importers/legacy` and/or production repositories without rewriting UI.

## SEO / URL patterns

- Pretty SEO URLs: `/zirbenpolster-bw-40x80`
- Legacy/route URLs still reachable: `/index.php?route=...`
- HTML sitemap: `/sitemap`
- `llms.txt` and markdown mirrors exist for AI/context use
- `robots.txt` disallows `/admin`, `/cart`, `/checkout`, `/account`, `/*ajax*`

## Public integrations visible

- Trusted Shops reviews
- Google login button/flow references
- Newsletter signup
- Country/customer-group selector (AT B2C etc.)

## Demo data strategy

- Import **20 curated public products** across categories for the demo
- Capture categories, content pages, selected reviews, media, URL map
- Do **not** crawl customers, orders, vouchers, passwords, internal stock

## Go-live implication

Once backend access exists, preferred migration path is likely:

1. Confirm OpenCart version + custom extensions with customer
2. Prefer DB/API/export over re-crawling
3. Implement `LegacyDatabaseImporter` or custom OpenCart adapter
4. Validate counts (products/variants/customers/orders/images)
5. Wire production repositories/services
6. Apply 301s from `migration/url-map.json`

Frontend redesign work should not be repeated at go-live.
