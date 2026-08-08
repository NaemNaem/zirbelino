import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Loads normalized demo JSON written by the importer pipeline.
 * UI never imports JSON files directly — only via repositories.
 */
export async function loadDemoJson<T>(relativePath: string): Promise<T> {
  const absolutePath = path.join(process.cwd(), "data", relativePath);
  const raw = await readFile(absolutePath, "utf8");
  return JSON.parse(raw) as T;
}

export async function loadDemoJsonOrEmpty<T>(
  relativePath: string,
  fallback: T,
): Promise<T> {
  try {
    return await loadDemoJson<T>(relativePath);
  } catch {
    return fallback;
  }
}
