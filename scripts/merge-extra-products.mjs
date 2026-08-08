import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const ROOT = process.cwd();
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

const extrasPath = path.join(ROOT, "migration", "browser-extras.json");
const extras = JSON.parse(await readFile(extrasPath, "utf8"));

async function downloadImage(url, slug, index) {
  const { stdout } = await execFileAsync(
    "curl.exe",
    ["-sL", "-A", UA, url],
    { encoding: "buffer", maxBuffer: 20 * 1024 * 1024 },
  );
  const buffer = stdout;
  if (!buffer?.length) return null;
  const checksum = createHash("sha1").update(buffer).digest("hex").slice(0, 12);
  const ext = path.extname(new URL(url).pathname) || ".jpg";
  const filename = `${slug}-${String(index + 1).padStart(2, "0")}-${checksum}${ext}`;
  const rel = `/media/products/${filename}`;
  await mkdir(path.join(ROOT, "public/media/products"), { recursive: true });
  await writeFile(path.join(ROOT, "public", rel), buffer);
  return {
    id: `media-${checksum}`,
    url: rel,
    alt: slug,
    role: index === 0 ? "primary" : "gallery",
    source: {
      system: "zirbenprodukte.at-public",
      originalUrl: url,
      importedAt: new Date().toISOString(),
      checksum,
    },
  };
}

function parseEuro(value) {
  if (typeof value === "number") return value;
  if (!value) return undefined;
  return Number(String(value).replace(",", "."));
}

const products = JSON.parse(
  await readFile(path.join(ROOT, "data/products/products.json"), "utf8"),
);
const reviews = JSON.parse(
  await readFile(path.join(ROOT, "data/reviews/reviews.json"), "utf8"),
);
const urlMap = JSON.parse(
  await readFile(path.join(ROOT, "migration/url-map.json"), "utf8"),
);

for (const extra of extras) {
  if (products.some((p) => p.slug === extra.slug)) {
    console.log(`skip existing ${extra.slug}`);
    continue;
  }
  const images = [];
  for (const [index, imageUrl] of (extra.images || []).entries()) {
    const asset = await downloadImage(imageUrl, extra.slug, index);
    if (asset) {
      asset.alt = extra.name;
      images.push(asset);
    }
  }
  const compare = parseEuro(extra.compare);
  const productId = `p-${extra.shopId || extra.slug}`;
  const product = {
    id: productId,
    externalId: String(extra.shopId || ""),
    slug: extra.slug,
    sku: extra.sku,
    ean: extra.ean,
    name: extra.name,
    shortDescription: String(extra.description || "").slice(0, 220),
    description: extra.description || "",
    price: { amount: Number(extra.price), currency: extra.currency || "EUR" },
    compareAtPrice:
      compare && compare > Number(extra.price)
        ? { amount: compare, currency: "EUR" }
        : undefined,
    images,
    categoryIds: extra.categoryIds || ["cat-duft"],
    tags: (extra.categoryIds || ["cat-duft"]).map((id) => id.replace("cat-", "")),
    rating: extra.rating,
    reviewCount: extra.reviewCount,
    availability: String(extra.availability || "").includes("InStock")
      ? "in_stock"
      : "unknown",
    deliveryTime: extra.delivery,
    shippingInformation: "Preise inkl. USt., zzgl. Versand laut Shopangabe.",
    relatedProductIds: [],
    flags: extra.flags || {},
    seo: {
      title: extra.metaTitle,
      description: extra.metaDescription,
      canonicalUrl: `https://www.zirbenprodukte.at/${extra.slug}`,
    },
    source: {
      system: "zirbenprodukte.at-public-browser",
      externalId: String(extra.shopId || ""),
      originalUrl: `https://www.zirbenprodukte.at/${extra.slug}`,
      importedAt: new Date().toISOString(),
    },
  };
  products.push(product);
  for (const [index, review] of (extra.reviews || []).entries()) {
    reviews.push({
      id: `${productId}-review-${index + 1}`,
      productId,
      authorName: review.author || "Kund:in",
      rating: review.rating || 5,
      body: review.body || "Sehr zufrieden.",
      createdAt: review.date,
      verified: true,
      source: {
        system: "zirbenprodukte.at-public-browser",
        importedAt: new Date().toISOString(),
      },
    });
  }
  urlMap.push({
    oldUrl: `https://www.zirbenprodukte.at/${extra.slug}`,
    contentType: "product",
    entityId: productId,
    futureUrl: `/produkt/${extra.slug}`,
  });
  console.log(`added ${extra.slug} with ${images.length} images`);
}

for (const product of products) {
  product.relatedProductIds = products
    .filter(
      (other) =>
        other.id !== product.id &&
        other.categoryIds.some((id) => product.categoryIds.includes(id)),
    )
    .slice(0, 4)
    .map((other) => other.id);
}

await writeFile(
  path.join(ROOT, "data/products/products.json"),
  JSON.stringify(products, null, 2),
);
await writeFile(
  path.join(ROOT, "data/reviews/reviews.json"),
  JSON.stringify(reviews, null, 2),
);
await writeFile(
  path.join(ROOT, "migration/url-map.json"),
  JSON.stringify(urlMap, null, 2),
);
console.log(`Total products: ${products.length}`);
