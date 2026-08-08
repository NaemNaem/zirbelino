export type DescriptionSection = {
  title?: string;
  body: string;
};

/**
 * Split crawled product descriptions into intro + titled blocks.
 * Original texts often use ALL-CAPS headings inline without newlines.
 */
export function parseProductDescription(raw?: string): DescriptionSection[] {
  if (!raw?.trim()) return [];

  const text = raw
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const headingRe =
    /(?:^|\s)([A-ZÄÖÜ][A-ZÄÖÜ0-9/:.–\-]*(?:\s+[A-ZÄÖÜ0-9/&:.–\-]+){0,12})(?=\s+(?:[A-ZÄÖÜ]?[a-zäöüß]|\d))/g;

  const matches = [...text.matchAll(headingRe)].filter((match) => {
    const title = match[1]?.trim() ?? "";
    return title.length >= 5 && /[A-ZÄÖÜ]{3,}/.test(title);
  });

  if (!matches.length) {
    return [{ body: text }];
  }

  const sections: DescriptionSection[] = [];
  const firstIndex = matches[0]?.index ?? 0;
  const intro = text.slice(0, firstIndex).trim();
  if (intro) sections.push({ body: intro });

  matches.forEach((match, index) => {
    const title = match[1]?.trim();
    if (!title) return;
    const start = (match.index ?? 0) + match[0].length;
    const end = matches[index + 1]?.index ?? text.length;
    const body = text.slice(start, end).trim();
    sections.push({ title, body });
  });

  return sections.length ? sections : [{ body: text }];
}

export function formatPieceLabel(qty: number): string {
  return qty === 1 ? "1 Stück" : `${qty} Stücke`;
}
