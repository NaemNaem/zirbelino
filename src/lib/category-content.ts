export type CategoryPageContent = {
  headline: string;
  intro: string;
  highlights: string[];
  productHeading: string;
};

/** Curated copy inspired by public zirbenprodukte.at category pages. */
export const CATEGORY_CONTENT: Record<string, CategoryPageContent> = {
  schlafen: {
    headline: "Zirbenkissen mit frischen Zirbenspänen",
    intro:
      "Zirbenkissen bringen den natürlichen Duft der Alpen direkt in dein Zuhause. Unsere Kissen werden in Kärnten mit frisch gehobelten, harzreichen Zirbenspänen aus eigener Produktion befüllt – luftgetrocknet und mit Reißverschluss zum Nachfüllen.",
    highlights: [
      "Zirbenkissen aus Kärnten",
      "frisch gehobelte Zirbenspäne aus eigener Tischlerei",
      "luftgetrocknetes Zirbenholz aus den Alpen",
      "Reißverschluss zum Auffrischen und Nachfüllen",
      "natürliche Stoffe und hochwertige Verarbeitung",
    ],
    productHeading: "Zirbenkissen",
  },
  "wohnen-duft": {
    headline: "Wohnen & Duft mit echter Zirbe",
    intro:
      "Zirbenspäne, Bio-Zirbenöl und Duftaccessoires für Wohnraum und Alltag. Frisch gehobelt, klar in der Herkunft und gemacht für intensiven, natürlichen Zirbenduft.",
    highlights: [
      "Frisch gehobelte Zirbenspäne „1. Wahl“",
      "Bio-Zirbenöl aus regionalem Wildwuchs",
      "Dufttürme und Raumaccessoires aus Massivholz",
      "Ideal zum Auffrischen von Kissen und Diffusern",
    ],
    productHeading: "Späne, Öl & Duft",
  },
  "kueche-genuss": {
    headline: "Küche & Genuss aus Zirbenholz",
    intro:
      "Brotdosen und Genussstücke aus massivem Zirbenholz – handwerklich in Kärnten gefertigt. Langlebig, schön und mit dem typischen Charakter echter Zirbe.",
    highlights: [
      "Massives Zirbenholz aus den Alpen",
      "Handwerk aus eigener Tischlerei",
      "Für Brot, Gebäck und den Alltag",
      "Besonderes Geschenk mit alpinem Charakter",
    ],
    productHeading: "Küche & Genuss",
  },
  geschenke: {
    headline: "Geschenkideen rund um die Zirbe",
    intro:
      "Erlebnisboxen, kleine Holzstücke und Duftgeschenke – ein Stück Alpen zum Verschenken. Kuratiert für Geburtstag, Dankeschön und alpine Momente.",
    highlights: [
      "Fertige Geschenkboxen und Sets",
      "Kleine Holzobjekte mit Charakter",
      "Ideal kombinierbar mit Spänen und Öl",
      "Regional und handwerklich",
    ],
    productHeading: "Geschenke",
  },
  "natur-garten": {
    headline: "Natur & Garten – Zirbe zum Einpflanzen",
    intro:
      "Junge Zirbenbäume, Zapfen und Pflegeprodukte für Balkon und Garten. Frische Saisonware und klare Herkunft aus den Alpen.",
    highlights: [
      "Junge Zirben für Garten und Balkon",
      "Saisonale Zirbenzapfen",
      "Mit Pflegehinweisen und klarer Herkunft",
      "Direkt von den Zirben-Spezialisten",
    ],
    productHeading: "Natur & Garten",
  },
};

export function getCategoryContent(
  slug: string,
  fallbackName: string,
  fallbackDescription?: string,
): CategoryPageContent {
  return (
    CATEGORY_CONTENT[slug] ?? {
      headline: fallbackName,
      intro:
        fallbackDescription ||
        "Echte Zirbenprodukte aus Österreich – kuratierte Auswahl aus dem öffentlichen Sortiment.",
      highlights: [
        "Echte Zirbe aus den Alpen",
        "Handwerk aus Kärnten",
        "Nachvollziehbare Herkunft",
      ],
      productHeading: fallbackName,
    }
  );
}
