import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const file = path.join(process.cwd(), "data/products/products.json");
const products = JSON.parse(await readFile(file, "utf8"));

function normalizeRating(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
  if (value > 5 && value <= 500) return Math.round((value / 100) * 100) / 100;
  if (value >= 0 && value <= 5) return value;
  return undefined;
}

let fixed = 0;
for (const product of products) {
  const next = normalizeRating(product.rating);
  if (next !== undefined && next !== product.rating) {
    product.rating = next;
    fixed += 1;
  } else if (next === undefined && product.rating !== undefined) {
    delete product.rating;
    fixed += 1;
  }
}

await writeFile(file, JSON.stringify(products, null, 2));
console.log(`Fixed ${fixed} product ratings. Total products: ${products.length}`);
