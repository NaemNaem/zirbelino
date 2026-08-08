# Integrations

| System | Status | Demo | Production | Adapter | Access needed |
| ------ | ------ | ---- | ---------- | ------- | ------------- |
| Product data | Demo JSON via crawler | Yes | Replace | ProductRepository / Importers | Backend export or DB/API |
| Categories | Demo JSON | Yes | Replace | CategoryRepository | Yes |
| Reviews | Snapshot import | Yes | Replace/live | ReviewRepository | Trusted Shops or shop DB |
| Content | Demo JSON | Yes | Replace | ContentRepository | Yes |
| Cart | localStorage | Yes | Replace | CartService | Session/API |
| Checkout | Simulated | Yes | Required | CheckoutService | Yes |
| Payment | Mock | Yes | Required | PaymentService | Provider keys |
| Email | Disabled | Yes | Required | EmailService | Provider keys |
| Shipping | Static demo methods | Yes | Required | ShippingService | Rules from customer |
| Search | In-memory demo | Yes | Optional upgrade | SearchRepository | Later |
| Auth / Customer | Not implemented | Partial | Required | CustomerService | Yes |
| Legacy OpenCart | Detected, not wired | No | Likely | LegacyDatabaseImporter | Yes |
