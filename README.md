# Zirbelino – Demo Shop (Version 0.1)

## Project Overview

- **Customer / Brand:** Zirbelino® / zirbenprodukte.at
- **Existing website:** https://www.zirbenprodukte.at/
- **Goal of this repo:** Pre-sales demo of a modern storefront that can become the production shop after contract
- **Critical constraint:** Go-live after backend access must be uncomplicated — adapters + validated import, not a rebuild

Current stage:

```text
Current stage: DEMO / PRE-SALES
```

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript (strict)
- Tailwind CSS 4
- Local demo data JSON under `/data`
- No payment/email providers active in demo

## Local Development

Required: Node.js 20+ (repo tested with Node 24)

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Useful scripts

```bash
npm run dev
npm run build
npm run lint
npm run crawl   # public demo import (added with crawler)
```

## Environment Variables

See `.env.example`.

| Variable | Purpose | Required | Mode |
| -------- | ------- | -------- | ---- |
| `NEXT_PUBLIC_DEMO_MODE` | Disables real orders/payments/emails | Yes | Demo default `true` |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL | Yes | Demo/Prod |
| `COMMERCE_API_URL` / `COMMERCE_API_KEY` | Future commerce backend | Prod | Optional until go-live |
| `PAYMENT_*` | Payment provider | Prod | Optional until go-live |
| `EMAIL_*` | Transactional email | Prod | Optional until go-live |
| `DATABASE_URL` | Future persistence | Prod | Optional until go-live |

Never commit secrets.

## Architecture (short)

```text
Source → Importer → Normalizer → Canonical Model → Repository → Service → UI
```

Read:

- `docs/ARCHITECTURE.md`
- `docs/DEMO_TO_PRODUCTION.md` ← go-live playbook
- `migration/source-analysis.md` ← likely OpenCart findings
- `CURSOR_CONTINUATION.md` ← resume instructions

## Demo Mode

With `NEXT_PUBLIC_DEMO_MODE=true`:

- no real payments
- no real emails
- no remote order writes
- cart/wishlist local
- checkout creates demo confirmation only

## Migration / Go-live

Public crawler feeds the demo only.

After customer provides backend data:

1. Choose source adapter (`docs/DEMO_TO_PRODUCTION.md`)
2. Import + validate counts
3. Swap demo repositories/services
4. Apply SEO redirects from `migration/url-map.json`
5. Set `NEXT_PUBLIC_DEMO_MODE=false`

## Project Structure

```text
src/domain            Canonical commerce types
src/repositories      Interfaces + composition root
src/services          Cart/Checkout/Payment/...
src/adapters/demo     File-backed demo implementations
src/importers         Crawler + future source adapters
data/                 Normalized demo dataset
migration/            Source analysis, url map, reports
docs/                 Project documentation
public/media          Local product media
```
