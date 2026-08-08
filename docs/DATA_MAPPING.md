# Data Mapping

## Public crawler → Canonical (demo)

| Source Field | Canonical Field | Required | Transformation |
| ------------ | --------------- | -------: | -------------- |
| product URL slug | Product.slug | Yes | lowercase/kebab keep |
| product name | Product.name | Yes | trim/sanitize |
| gross price | Product.price.amount | Yes | parse EUR |
| compare price | Product.compareAtPrice | No | parse EUR |
| images | Product.images | No | download + dedupe |
| description HTML | Product.description | No | sanitize |
| rating | Product.rating | No | float |
| review count | Product.reviewCount | No | int |
| original URL | Product.source.originalUrl | Yes | absolute |
| OpenCart product id (if visible) | Product.source.externalId | No | string |

## OpenCart / legacy (pending customer access)

| Source Field | Canonical Field | Required | Transformation |
| ------------ | --------------- | -------: | -------------- |
| product_id | Product.source.externalId | Yes | string |
| model / sku | Product.sku | No | trim |
| price | Product.price | Yes | currency normalize |
| special | Product.compareAtPrice logic | No | map sale price carefully |
| seo_url | Product.slug / url-map | Yes | preserve |

Extend this table as soon as real schema access exists. Do not guess production column names into UI code.
