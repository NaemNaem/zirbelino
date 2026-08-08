import type { RawSourceBundle, SourceImporter } from "../shared/types";

/** Stub — only implement if production target/source is Shopify. */
export class ShopifyImporter implements SourceImporter {
  readonly name = "shopify";
  async import(): Promise<RawSourceBundle> {
    throw new Error("ShopifyImporter stub. Activate only if Shopify is the chosen source/target.");
  }
}
