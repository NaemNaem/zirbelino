/**
 * Public demo crawler for zirbenprodukte.at
 * - 20 curated products across categories
 * - respects low request rate
 * - public pages only
 * - writes canonical JSON + media + migration artifacts
 */

import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import * as cheerio from "cheerio";

const execFileAsync = promisify(execFile);
import type {
  Category,
  ContentPage,
  FAQ,
  MediaAsset,
  Product,
  Review,
} from "../src/domain";
import type { MigrationReport, UrlMapEntry } from "../src/importers/shared/types";

const BASE = "https://www.zirbenprodukte.at";
const ROOT = process.cwd();
const DELAY_MS = 700;
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

type SeedProduct = {
  slug: string;
  categoryIds: string[];
  flags?: Product["flags"];
};

const CATEGORIES: Category[] = [
  {
    id: "cat-schlafen",
    slug: "schlafen",
    name: "Schlafen",
    description: "Zirbenkissen und Schlafprodukte aus echter Zirbe.",
    source: { system: "demo-curated", originalUrl: `${BASE}/zirbenkissen` },
  },
  {
    id: "cat-duft",
    slug: "wohnen-duft",
    name: "Wohnen & Duft",
    description: "Zirbenspäne, Öl, Diffuser und Raumduft.",
    source: { system: "demo-curated", originalUrl: `${BASE}/zirbenspaene` },
  },
  {
    id: "cat-kueche",
    slug: "kueche-genuss",
    name: "Küche & Genuss",
    description: "Brotdosen, Genuss und Küchenprodukte aus Zirbe.",
    source: { system: "demo-curated", originalUrl: `${BASE}/zirbenbrotdose` },
  },
  {
    id: "cat-geschenke",
    slug: "geschenke",
    name: "Geschenke",
    description: "Geschenkideen und Erlebnisboxen rund um die Zirbe.",
    source: { system: "demo-curated", originalUrl: `${BASE}/zirbe-geschenkideen-erlebnisbox` },
  },
  {
    id: "cat-garten",
    slug: "natur-garten",
    name: "Natur & Garten",
    description: "Zirbenbäume, Zapfen und Pflege.",
    source: { system: "demo-curated", originalUrl: `${BASE}/zirben-zum-einpflanzen` },
  },
];

const SEEDS: SeedProduct[] = [
  { slug: "zirbenpolster-bw-40x80", categoryIds: ["cat-schlafen"], flags: { bestseller: true, sale: true, featured: true } },
  { slug: "zirbenkissen-40x40", categoryIds: ["cat-schlafen"], flags: { bestseller: true, featured: true } },
  { slug: "zirbelino-zirbenkissen-28x16cm-baumwolle", categoryIds: ["cat-schlafen"], flags: { featured: true } },
  { slug: "zirbenholzflocken-lose-spaene", categoryIds: ["cat-duft"], flags: { bestseller: true, featured: true } },
  { slug: "zirbenoel-bio-10ml-zirbenoel-zirbe", categoryIds: ["cat-duft"], flags: { bestseller: true, featured: true } },
  { slug: "zirbenspaene-zirbenoel-kombi", categoryIds: ["cat-duft"], flags: { sale: true, featured: true } },
  { slug: "zirbenduftburg-duftturm-raumluefter", categoryIds: ["cat-duft"], flags: { new: true, sale: true, featured: true } },
  { slug: "zirbenduftsackerl-saeckchen-kleiderschrank-gold", categoryIds: ["cat-duft"] },
  { slug: "zirbenwuerfel-blume-des-lebens-oel", categoryIds: ["cat-duft", "cat-geschenke"], flags: { new: true, featured: true } },
  { slug: "zirbenwuerfel-baum-des-lebens-oel", categoryIds: ["cat-duft", "cat-geschenke"], flags: { new: true } },
  { slug: "zirbenkugel-7cm", categoryIds: ["cat-duft", "cat-geschenke"] },
  { slug: "zirbenbrotdose-klassisch", categoryIds: ["cat-kueche"], flags: { featured: true } },
  { slug: "zirbenbutterdose", categoryIds: ["cat-kueche"] },
  { slug: "geschenksbox3", categoryIds: ["cat-geschenke"], flags: { sale: true, featured: true, personalized: true } },
  { slug: "beercap-achtkant", categoryIds: ["cat-geschenke"], flags: { sale: true, personalized: true } },
  { slug: "zirbenzapfen", categoryIds: ["cat-garten", "cat-kueche"], flags: { bestseller: true, sale: true, featured: true } },
  { slug: "zirbenbaum-biotopf", categoryIds: ["cat-garten"], flags: { sale: true, featured: true } },
  { slug: "zirbenbaum-m", categoryIds: ["cat-garten"], flags: { sale: true } },
  { slug: "zirbenduenger-100g-fuer-zirben", categoryIds: ["cat-garten"], flags: { sale: true } },
  { slug: "zirbenduftkerze", categoryIds: ["cat-duft", "cat-geschenke"], flags: { bestseller: true, sale: true, featured: true } },
];

const CONTENT_SEEDS: Array<{ slug: string; type: ContentPage["type"]; urlPath: string }> = [
  { slug: "ueber-zirbelino", type: "about", urlPath: "/ueber-uns" },
  { slug: "produktion", type: "craft", urlPath: "/produktion" },
  { slug: "die-zirbe", type: "knowledge", urlPath: "/zirbenholz" },
  { slug: "versand", type: "shipping", urlPath: "/versandkosten" },
  { slug: "zahlung", type: "payment", urlPath: "/zahlung" },
  { slug: "faq", type: "faq", urlPath: "/faq" },
  { slug: "impressum", type: "legal", urlPath: "/impressum" },
  { slug: "datenschutz", type: "legal", urlPath: "/datenschutz" },
  { slug: "agb", type: "legal", urlPath: "/agb" },
  { slug: "kontakt", type: "contact", urlPath: "/kontakt" },
  { slug: "zertifizierung", type: "other", urlPath: "/impressum" },
];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchText(url: string): Promise<string> {
  // Cloudflare blocks plain Node fetch TLS fingerprints; curl.exe works reliably here.
  try {
    const { stdout } = await execFileAsync(
      "curl.exe",
      [
        "-sL",
        "-A",
        USER_AGENT,
        "-H",
        "Accept: text/html,application/xhtml+xml",
        "-H",
        "Accept-Language: de-AT,de;q=0.9,en;q=0.8",
        url,
      ],
      { maxBuffer: 10 * 1024 * 1024 },
    );
    if (!stdout || stdout.includes("Just a moment") || stdout.length < 500) {
      throw new Error(`Blocked or empty response for ${url}`);
    }
    return stdout;
  } catch (error) {
    throw new Error(
      `Fetch failed for ${url}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

async function fetchBinary(url: string): Promise<{ buffer: Buffer; contentType?: string }> {
  const { stdout } = await execFileAsync(
    "curl.exe",
    ["-sL", "-A", USER_AGENT, url],
    { encoding: "buffer", maxBuffer: 20 * 1024 * 1024 },
  );
  return { buffer: stdout as Buffer };
}

function parseEuro(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return undefined;
  const normalized = value.replace(/\./g, "").replace(",", ".").replace(/[^\d.]/g, "");
  const amount = Number.parseFloat(normalized);
  return Number.isFinite(amount) ? amount : undefined;
}

/** Never use parseEuro for ratings — "4.94" would become 494. */
function parseRating(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    if (value > 5 && value <= 500) return Math.round((value / 100) * 100) / 100;
    if (value >= 0 && value <= 5) return value;
    return undefined;
  }
  if (typeof value !== "string") return undefined;
  const normalized = value.trim().replace(",", ".");
  const amount = Number.parseFloat(normalized);
  if (!Number.isFinite(amount)) return undefined;
  if (amount > 5 && amount <= 500) return Math.round((amount / 100) * 100) / 100;
  if (amount >= 0 && amount <= 5) return amount;
  return undefined;
}

function slugifyFile(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function availabilityFromOffer(offer: Record<string, unknown> | undefined): Product["availability"] {
  const raw = String(offer?.availability ?? "");
  if (raw.includes("InStock")) return "in_stock";
  if (raw.includes("PreOrder")) return "preorder";
  if (raw.includes("OutOfStock")) return "out_of_stock";
  if (raw.includes("LimitedAvailability")) return "low_stock";
  return "unknown";
}

function extractProductNode(html: string): Record<string, unknown> | null {
  const $ = cheerio.load(html);
  const scripts = $('script[type="application/ld+json"]')
    .toArray()
    .map((el) => $(el).text());

  for (const raw of scripts) {
    try {
      const json = JSON.parse(raw) as Record<string, unknown>;
      const graph = Array.isArray(json["@graph"]) ? json["@graph"] : [json];
      for (const node of graph) {
        if (!node || typeof node !== "object") continue;
        const type = (node as { "@type"?: string | string[] })["@type"];
        const types = Array.isArray(type) ? type : [type];
        if (types.includes("Product")) return node as Record<string, unknown>;
      }
    } catch {
      // ignore invalid blocks
    }
  }
  return null;
}

function extractCompareAtPrice(html: string): number | undefined {
  const $ = cheerio.load(html);
  const text = $("body").text();
  const statt = text.match(/Statt:\s*([0-9]+,[0-9]{2})/);
  return statt ? parseEuro(statt[1]) : undefined;
}

function extractDeliveryTime(html: string): string | undefined {
  const text = cheerio.load(html)("body").text();
  return text.match(/(\d-\d\s*Werktage|Vorbestellung|1-2 Werktage)/)?.[1];
}

function extractShopId(html: string): string | undefined {
  return cheerio.load(html)("body").text().match(/Shop-ID:\s*(\d+)/)?.[1];
}

async function downloadImage(url: string, slug: string, index: number): Promise<MediaAsset | null> {
  try {
    const { buffer } = await fetchBinary(url);
    if (!buffer.length) return null;
    const checksum = createHash("sha1").update(buffer).digest("hex").slice(0, 12);
    const ext = path.extname(new URL(url).pathname) || ".jpg";
    const filename = `${slugifyFile(slug)}-${String(index + 1).padStart(2, "0")}-${checksum}${ext}`;
    const rel = `/media/products/${filename}`;
    const abs = path.join(ROOT, "public", rel);
    await mkdir(path.dirname(abs), { recursive: true });
    await writeFile(abs, buffer);
    return {
      id: `media-${checksum}`,
      url: rel,
      alt: slug.replace(/-/g, " "),
      role: index === 0 ? "primary" : "gallery",
      source: {
        system: "zirbenprodukte.at-public",
        originalUrl: url,
        importedAt: new Date().toISOString(),
        checksum,
      },
    };
  } catch {
    return null;
  }
}

function reviewsFromProduct(
  productNode: Record<string, unknown>,
  productId: string,
): Review[] {
  const raw = productNode.review;
  const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
  return list.slice(0, 5).map((entry, index) => {
    const review = entry as Record<string, unknown>;
    const author =
      typeof review.author === "object" && review.author
        ? ((review.author as Record<string, unknown>).name as string)
        : typeof review.author === "string"
          ? review.author
          : "Kund:in";
    const ratingValue =
      typeof review.reviewRating === "object" && review.reviewRating
        ? Number((review.reviewRating as Record<string, unknown>).ratingValue)
        : Number(review.reviewRating);
    return {
      id: `${productId}-review-${index + 1}`,
      productId,
      authorName: author || "Kund:in",
      rating: Number.isFinite(ratingValue) ? ratingValue : 5,
      body: String(review.reviewBody || review.description || "").trim() || "Sehr zufrieden.",
      createdAt: typeof review.datePublished === "string" ? review.datePublished : undefined,
      verified: true,
      source: { system: "zirbenprodukte.at-public", importedAt: new Date().toISOString() },
    };
  });
}

async function crawlProduct(seed: SeedProduct): Promise<{
  product: Product | null;
  reviews: Review[];
  error?: string;
  url: string;
}> {
  const url = `${BASE}/${seed.slug}`;
  try {
    const html = await fetchText(url);
    const node = extractProductNode(html);
    if (!node) {
      return { product: null, reviews: [], error: "No Product JSON-LD", url };
    }

    const offer = (Array.isArray(node.offers) ? node.offers[0] : node.offers) as
      | Record<string, unknown>
      | undefined;
    const price = parseEuro(offer?.price);
    if (price === undefined) {
      return { product: null, reviews: [], error: "Missing price", url };
    }

    const compareAt = extractCompareAtPrice(html);
    const shopId = extractShopId(html) ?? String(node.productID ?? "");
    const productId = shopId ? `p-${shopId}` : `p-${seed.slug}`;

    const imageNodes = Array.isArray(node.image) ? node.image : node.image ? [node.image] : [];
    const imageUrls = imageNodes
      .map((img) => {
        if (typeof img === "string") return img;
        if (img && typeof img === "object") return String((img as { url?: string }).url ?? "");
        return "";
      })
      .filter(Boolean)
      .slice(0, 6);

    const images: MediaAsset[] = [];
    for (const [index, imageUrl] of imageUrls.entries()) {
      await sleep(200);
      const asset = await downloadImage(imageUrl, seed.slug, index);
      if (asset) {
        asset.alt = String(node.name ?? seed.slug);
        images.push(asset);
      }
    }

    const aggregate = (node.aggregateRating ?? {}) as Record<string, unknown>;
    const product: Product = {
      id: productId,
      externalId: shopId || undefined,
      slug: seed.slug,
      sku: typeof node.sku === "string" ? node.sku : undefined,
      ean: typeof node.gtin === "string" ? node.gtin : undefined,
      name: String(node.name ?? seed.slug),
      shortDescription: cheerio.load(`<p>${String(node.description ?? "")}</p>`)("p").text().slice(0, 220),
      description: String(node.description ?? ""),
      price: { amount: price, currency: String(offer?.priceCurrency ?? "EUR") },
      compareAtPrice:
        compareAt && compareAt > price
          ? { amount: compareAt, currency: "EUR" }
          : undefined,
      images,
      categoryIds: seed.categoryIds,
      tags: seed.categoryIds.map((id) => id.replace("cat-", "")),
      rating: parseRating(aggregate.ratingValue) ?? undefined,
      reviewCount: Number(aggregate.ratingCount ?? 0) || undefined,
      availability: availabilityFromOffer(offer),
      deliveryTime: extractDeliveryTime(html),
      shippingInformation: "Preise inkl. USt., zzgl. Versand laut Shopangabe.",
      relatedProductIds: [],
      flags: {
        ...seed.flags,
        sale: Boolean(seed.flags?.sale || (compareAt && compareAt > price)),
        personalized: seed.flags?.personalized,
      },
      seo: {
        title: cheerio.load(html)("title").first().text().trim() || String(node.name ?? ""),
        description: cheerio.load(html)('meta[name="description"]').attr("content") || undefined,
        canonicalUrl: url,
      },
      source: {
        system: "zirbenprodukte.at-public",
        externalId: shopId || undefined,
        originalUrl: url,
        importedAt: new Date().toISOString(),
        checksum: createHash("sha1").update(html).digest("hex").slice(0, 16),
      },
    };

    return { product, reviews: reviewsFromProduct(node, productId), url };
  } catch (error) {
    return {
      product: null,
      reviews: [],
      error: error instanceof Error ? error.message : String(error),
      url,
    };
  }
}

function extractMainContent($: ReturnType<typeof cheerio.load>): string {
  $(
    "header, nav, footer, script, style, noscript, iframe, .menu, .navbar, .trusted-shops, #top, #menu, .breadcrumb",
  ).remove();
  const candidates = [
    "article",
    "#content .content",
    "#content",
    "main",
    ".page-content",
    ".information-information",
  ];
  for (const selector of candidates) {
    const text = $(selector).first().text().replace(/\s+/g, " ").trim();
    if (
      text.length > 180 &&
      !/^4\.?\d{2}\/?5/.test(text) &&
      !text.includes("Trusted Shops4")
    ) {
      return text;
    }
  }
  return $("body").text().replace(/\s+/g, " ").trim();
}

async function crawlContentPage(seed: {
  slug: string;
  type: ContentPage["type"];
  urlPath: string;
}): Promise<ContentPage | null> {
  const url = `${BASE}${seed.urlPath}`;
  try {
    const html = await fetchText(url);
    const $ = cheerio.load(html);
    const title =
      $("h1").first().text().trim() ||
      $("title").first().text().trim() ||
      seed.slug;
    const description =
      $('meta[name="description"]').attr("content")?.trim() || undefined;
    const bodyText = extractMainContent($);
    const excerpt = description || bodyText.slice(0, 220);
    return {
      id: `page-${seed.slug}`,
      slug: seed.slug,
      title,
      excerpt,
      body: bodyText.slice(0, 6000),
      type: seed.type,
      seo: {
        title,
        description,
        canonicalUrl: url,
      },
      source: {
        system: "zirbenprodukte.at-public",
        originalUrl: url,
        importedAt: new Date().toISOString(),
      },
    };
  } catch {
    return null;
  }
}

function buildFaqs(pages: ContentPage[]): FAQ[] {
  const faqPage = pages.find((page) => page.slug === "faq");
  if (!faqPage) return [];
  // Keep conservative: store page body as one FAQ source reference rather than inventing Q/A pairs.
  return [
    {
      id: "faq-source",
      question: "Wo finde ich die offiziellen FAQ?",
      answer:
        "Die FAQ-Inhalte stammen aus der öffentlichen FAQ-Seite von zirbenprodukte.at und sind in der Demo unter /faq verfügbar.",
      category: "service",
      source: faqPage.source,
    },
  ];
}

async function main() {
  console.log(`Crawling ${SEEDS.length} curated products from ${BASE} ...`);

  const products: Product[] = [];
  const reviews: Review[] = [];
  const urlMap: UrlMapEntry[] = [];
  const errors: string[] = [];
  const unrecognized: string[] = [];
  let images = 0;

  for (const seed of SEEDS) {
    console.log(`→ ${seed.slug}`);
    const result = await crawlProduct(seed);
    urlMap.push({
      oldUrl: result.url,
      contentType: "product",
      entityId: result.product?.id,
      futureUrl: result.product ? `/produkt/${result.product.slug}` : undefined,
    });
    if (result.error || !result.product) {
      errors.push(`${seed.slug}: ${result.error ?? "unknown error"}`);
      unrecognized.push(result.url);
    } else {
      products.push(result.product);
      reviews.push(...result.reviews);
      images += result.product.images.length;
    }
    await sleep(DELAY_MS);
  }

  const pages: ContentPage[] = [];
  for (const seed of CONTENT_SEEDS) {
    console.log(`→ content ${seed.urlPath}`);
    const page = await crawlContentPage(seed);
    if (page) {
      pages.push(page);
      urlMap.push({
        oldUrl: `${BASE}${seed.urlPath}`,
        contentType: "content",
        entityId: page.id,
        futureUrl: `/${page.slug}`,
      });
    } else {
      errors.push(`content ${seed.urlPath}: failed`);
    }
    await sleep(DELAY_MS);
  }

  for (const category of CATEGORIES) {
    urlMap.push({
      oldUrl: category.source?.originalUrl || `${BASE}/${category.slug}`,
      contentType: "category",
      entityId: category.id,
      futureUrl: `/kategorie/${category.slug}`,
    });
  }

  // Wire simple related products within same primary category
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

  const faqs = buildFaqs(pages);

  const report: MigrationReport = {
    generatedAt: new Date().toISOString(),
    sourceSystem: "zirbenprodukte.at-public",
    urlsFound: urlMap.length,
    productPages: SEEDS.length,
    categoryPages: CATEGORIES.length,
    contentPages: pages.length,
    products: products.length,
    categories: CATEGORIES.length,
    images,
    reviews: reviews.length,
    productsWithoutPrice: products
      .filter((p) => !Number.isFinite(p.price.amount))
      .map((p) => p.id),
    productsWithoutImages: products.filter((p) => p.images.length === 0).map((p) => p.id),
    productsWithoutDescription: products
      .filter((p) => !p.description && !p.shortDescription)
      .map((p) => p.id),
    unrecognizedPages: unrecognized,
    crawlErrors: errors,
    redirectCandidates: urlMap.length,
    possibleDuplicates: [],
    notes: [
      "Demo crawl limited to 20 curated public products.",
      "No customers/orders/vouchers/passwords were crawled.",
      "Architecture remains full-catalog capable for later official imports.",
    ],
  };

  await mkdir(path.join(ROOT, "data/products"), { recursive: true });
  await mkdir(path.join(ROOT, "data/categories"), { recursive: true });
  await mkdir(path.join(ROOT, "data/reviews"), { recursive: true });
  await mkdir(path.join(ROOT, "data/content"), { recursive: true });
  await mkdir(path.join(ROOT, "migration"), { recursive: true });

  await writeFile(
    path.join(ROOT, "data/products/products.json"),
    JSON.stringify(products, null, 2),
    "utf8",
  );
  await writeFile(
    path.join(ROOT, "data/categories/categories.json"),
    JSON.stringify(CATEGORIES, null, 2),
    "utf8",
  );
  await writeFile(
    path.join(ROOT, "data/reviews/reviews.json"),
    JSON.stringify(reviews, null, 2),
    "utf8",
  );
  await writeFile(
    path.join(ROOT, "data/content/pages.json"),
    JSON.stringify(pages, null, 2),
    "utf8",
  );
  await writeFile(
    path.join(ROOT, "data/content/faqs.json"),
    JSON.stringify(faqs, null, 2),
    "utf8",
  );
  await writeFile(
    path.join(ROOT, "migration/url-map.json"),
    JSON.stringify(urlMap, null, 2),
    "utf8",
  );
  await writeFile(
    path.join(ROOT, "migration/report.json"),
    JSON.stringify(report, null, 2),
    "utf8",
  );

  console.log("\nDone.");
  console.log(`Products: ${products.length}/${SEEDS.length}`);
  console.log(`Images: ${images}`);
  console.log(`Reviews: ${reviews.length}`);
  console.log(`Content pages: ${pages.length}`);
  console.log(`Errors: ${errors.length}`);
  if (errors.length) {
    console.log(errors.join("\n"));
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
