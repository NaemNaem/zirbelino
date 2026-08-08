import type { RawSourceBundle, SourceImporter } from "../shared/types";

/** Stub — only implement if production source/target is WooCommerce. */
export class WooCommerceImporter implements SourceImporter {
  readonly name = "woocommerce";
  async import(): Promise<RawSourceBundle> {
    throw new Error(
      "WooCommerceImporter stub. Activate only if WooCommerce is the chosen source/target.",
    );
  }
}
