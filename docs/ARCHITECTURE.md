# Architecture

## System Overview

```text
Source Shop (OpenCart/custom/API/CSV/…)
    ↓
Importer (Source Adapter)
    ↓
Normalizer
    ↓
Canonical Commerce Model
    ↓
Validation + Migration Report
    ↓
Repository Layer
    ↓
Service Layer
    ↓
Frontend (Next.js)
```

## Frontend

Next.js App Router UI under `src/app` and `src/components/*`.

Components may call repositories/services only. They must not parse OpenCart HTML, call shop APIs, or import raw crawler output.

## Domain Layer

`src/domain/*` — system-agnostic entities:

Product, ProductVariant, Category, Collection, MediaAsset, Customer, Address, Order, OrderItem, Discount, Voucher, Review, ContentPage, BlogArticle, FAQ, NavigationItem, SEOData, ShippingMethod, PaymentMethod, InventoryItem

## Repository Layer

Interfaces in `src/repositories/types.ts`.  
Composition root: `src/repositories/index.ts`.

## Service Layer

Business logic:

- CartService
- WishlistService
- CheckoutService
- PaymentService

(Additional catalog/search/customer/order/shipping/email services added as needed.)

## Adapter Layer

- `src/adapters/demo/*` — file-backed demo repositories
- `src/adapters/commerce/*` — future production adapters
- `src/importers/*` — source adapters for migration

## Demo Layer

- `NEXT_PUBLIC_DEMO_MODE=true`
- Local cart/wishlist
- Simulated checkout/payment
- Snapshot data in `/data`

## Production Layer (to replace)

- Demo repositories/services
- Disabled email/payment side effects
- Crawler as primary product source (becomes validation-only)

## Go-live invariant

If a production change requires editing product cards or PDP components to support a new backend, the architecture was violated and must be fixed at the adapter boundary instead.
