import type { RawSourceBundle, SourceImporter } from "../shared/types";

/**
 * Placeholder for OpenCart / custom PHP shop / proprietary DB imports.
 * After customer provides backend access, implement mapping here.
 * Frontend stays untouched.
 */
export class LegacyDatabaseImporter implements SourceImporter {
  readonly name = "legacy-database";

  async import(): Promise<RawSourceBundle> {
    // TODO(MIGRATION): Implement OpenCart/legacy DB mapping once access exists.
    // See: /docs/DATA_MAPPING.md and /migration/source-analysis.md
    throw new Error(
      "LegacyDatabaseImporter requires customer DB/API access. See docs/CUSTOMER_REQUIREMENTS.md",
    );
  }
}
