# Current Project State

Last updated: 2026-08-08

## Working

- Next.js storefront with design system shell
- Homepage (hero, trust, categories, bestsellers, story, craft, reviews, gifts, knowledge, newsletter)
- Header / mobile drawer / search overlay / cart drawer / footer
- Shop PLP with filters + sort
- Category pages
- 20 product PDPs with gallery, ATC, related products, reviews
- Wishlist (local)
- Cart page + cart drawer + free-shipping progress
- Checkout demo (no real payment/email)
- Content pages: über, produktion, die-zirbe, versand, zahlung, faq
- robots.txt + sitemap.xml
- Crawler/import pipeline + migration artifacts
- Canonical architecture + go-live docs

## Demo / Mock

- Checkout / payment / newsletter side effects
- Login / customer accounts not implemented
- Catalog intentionally limited to 20 products

## Not implemented

- Real payment provider
- Real email provider
- Customer/order migration (requires backend access)
- Full-catalog import

## In progress

- Demo polish / presentation readiness

## Next recommended task

Start `npm run dev`, walk through homepage → product → cart → checkout for customer presentation. After contract: follow `docs/DEMO_TO_PRODUCTION.md` with OpenCart/backend access.
