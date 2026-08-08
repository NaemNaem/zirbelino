import type { RawSourceBundle, SourceImporter } from "../shared/types";

/** Stub — only implement if production source/target is Shopware. */
export class ShopwareImporter implements SourceImporter {
  readonly name = "shopware";
  async import(): Promise<RawSourceBundle> {
    throw new Error("ShopwareImporter stub. Activate only if Shopware is the chosen source/target.");
  }
}
