# API Contracts

Frontend depends on these contracts. Production systems must satisfy them via adapters.

## ProductRepository

- `getAll(): Promise<Product[]>`
- `getById(id): Promise<Product | null>`
- `getBySlug(slug): Promise<Product | null>`
- `getFeatured(): Promise<Product[]>`
- `getByCategory(categoryId): Promise<Product[]>`
- `search(query): Promise<Product[]>`

Errors: return `null` for missing entities; throw only on infrastructure failure.

## CategoryRepository / ContentRepository / ReviewRepository / SearchRepository

See `src/repositories/types.ts`.

## CartService

Side effects: local demo storage now; production may sync server cart.

## CheckoutService

- `getShippingMethods()`
- `getPaymentMethods()`
- `placeOrder(draft)`

Demo: no payment capture, no email.  
Production: must be idempotent against provider webhooks.

## PaymentService

- `createIntent(input) -> PaymentIntentResult`

Never store PAN/CVC in app logs or DB.
