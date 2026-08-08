import Image from "next/image";
import Link from "next/link";
import { BekanntAus } from "@/components/content/BekanntAus";
import { HeroSlider, type HeroSlide } from "@/components/content/HeroSlider";
import { ProductCard } from "@/components/product/ProductCard";
import { ButtonLink } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import type { Category } from "@/domain";
import {
  formatTrustedShopsCount,
  formatTrustedShopsRating,
  TRUSTED_SHOPS_RATING,
} from "@/lib/trust";
import {
  getCategoryRepository,
  getContentRepository,
  getProductRepository,
  getReviewRepository,
} from "@/repositories";

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "kissen",
    image: "/media/products/zirbenpolster-bw-40x80-03-f19abc16b423.jpg",
    alt: "Zirbenkissen aus Kärnten",
    eyebrow: "Zirbelino · Kärnten",
    title: "Der Duft der Alpen.",
    text: "Zirbenkissen mit frischen Spänen aus eigener Fertigung – für Schlafzimmer und Geschenk.",
    href: "/kategorie/schlafen",
    cta: "Kissen entdecken",
  },
  {
    id: "spaene",
    image: "/media/products/zirbenholzflocken-lose-spaene-01-9155e6a867f7.jpg",
    alt: "Frische Zirbenspäne",
    eyebrow: "Wohnen & Duft",
    title: "Echte Zirbenspäne.",
    text: "Frisch gehobelt, luftgetrocknet und bereit für Kissen, Duft und Alltag.",
    href: "/kategorie/wohnen-duft",
    cta: "Späne entdecken",
  },
  {
    id: "zapfen",
    image: "/media/products/zirbenzapfen-02-53652ebc7354.jpg",
    alt: "Frische Zirbenzapfen",
    eyebrow: "Saison",
    title: "Frische Zirbenzapfen.",
    text: "Für Sirup, Likör und saisonale Spezialitäten – direkt aus den Alpen.",
    href: "/kategorie/natur-garten",
    cta: "Zapfen entdecken",
  },
  {
    id: "baeume",
    image: "/media/products/zirbenbaum-biotopf-02-c872cf0a1145.jpg",
    alt: "Junge Zirbenbäume",
    eyebrow: "Natur & Garten",
    title: "Echte Zirbenbäume.",
    text: "Junge Zirben für Garten und Balkon – mit Pflegeanleitung und klarer Herkunft.",
    href: "/kategorie/natur-garten",
    cta: "Bäume entdecken",
  },
  {
    id: "brotdose",
    image: "/media/products/zirbenbrotdose-klassisch-02-d1616140c5ab.jpg",
    alt: "Zirbenholz Brotdose",
    eyebrow: "Küche & Genuss",
    title: "Brotdosen aus Zirbe.",
    text: "Massives Zirbenholz für den Alltag – langlebig, schön und handwerklich.",
    href: "/kategorie/kueche-genuss",
    cta: "Zur Küche",
  },
  {
    id: "geschenk",
    image: "/media/products/geschenksbox3-02-948b60f24eed.jpg",
    alt: "Zirben Geschenkbox",
    eyebrow: "Schenken",
    title: "Ein Stück Alpen verschenken.",
    text: "Erlebnisboxen und Geschenkideen aus Holz, Duft und Handwerk.",
    href: "/kategorie/geschenke",
    cta: "Geschenke ansehen",
  },
  {
    id: "oel",
    image: "/media/products/zirbenoel-bio-10ml-zirbenoel-zirbe-02-e2f45dd50649.jpg",
    alt: "Bio Zirbenöl",
    eyebrow: "Raumduft",
    title: "Bio-Zirbenöl.",
    text: "Naturreiner Duft aus regionalem Wildwuchs – für Diffuser, Späne und Alltag.",
    href: "/kategorie/wohnen-duft",
    cta: "Öl entdecken",
  },
  {
    id: "beercap",
    image: "/media/products/beercap-achtkant-04-73ff2ad87707.jpg",
    alt: "Zirbelino BeerCap",
    eyebrow: "Original",
    title: "Schütz dein Bier.",
    text: "Der Zirbelino BeerCap – Wespenschutz aus der Manufaktur.",
    href: "/shop",
    cta: "BeerCap ansehen",
  },
];

export default async function HomePage() {
  const [products, categories, reviews, pages] = await Promise.all([
    getProductRepository().getAll(),
    getCategoryRepository().getAll(),
    getReviewRepository().getFeatured(6),
    getContentRepository().getPages(),
  ]);

  const featured = products.filter((p) => p.flags?.featured).slice(0, 8);
  const bestsellers = (featured.length ? featured : products).slice(0, 8);
  const gifts = products
    .filter((p) => p.categoryIds.includes("cat-geschenke"))
    .slice(0, 4);
  const storyImage =
    products.find(
      (p) => p.slug.includes("wuerfel") || p.slug.includes("brotdose"),
    ) ??
    bestsellers[1] ??
    products[1];
  const story = pages.find((page) => page.slug === "ueber-zirbelino");
  const knowledge = pages.find((page) => page.slug === "die-zirbe");

  return (
    <main>
      <HeroSlider slides={HERO_SLIDES} />

      <section className="relative border-b border-[var(--color-border)] bg-[rgba(247,238,226,0.85)]">
        <div className="wood-band absolute inset-x-0 top-0 h-[3px]" />
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-9 md:grid-cols-4 md:px-6">
          <TrustItem
            label="Echte Bewertungen"
            value={formatTrustedShopsCount()}
          />
          <TrustItem
            label="Durchschnitt"
            value={`${formatTrustedShopsRating()} / 5`}
            showStar
          />
          <TrustItem label="Herkunft" value="Made in Austria" />
          <TrustItem label="Garantie" value="100 Tage" />
        </div>
        <p className="mx-auto max-w-7xl px-4 pb-6 text-xs text-[var(--color-text-muted)] md:px-6">
          Trusted-Shops-Note {formatTrustedShopsRating(TRUSTED_SHOPS_RATING)} /
          5 · öffentlich ausgewiesene Gesamtbewertungen (nicht Summe der
          Produkt-Reviews in dieser Demo).
        </p>
      </section>

      <BekanntAus />

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Entdecken</p>
            <h2 className="mt-3 font-display text-4xl text-[var(--color-primary-dark)] md:text-5xl">
              Finde deine Zirbe
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-sm font-semibold text-[var(--color-wood)] underline decoration-[var(--color-resin)] underline-offset-4"
          >
            Alle ansehen
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {categories.map((category) => (
            <CategoryTile
              key={category.id}
              category={category}
              image={
                products.find((p) => p.categoryIds.includes(category.id))
                  ?.images[0]?.url
              }
            />
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="section-wash absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-10 max-w-2xl">
            <p className="eyebrow">Bestseller</p>
            <h2 className="mt-3 font-display text-4xl text-[var(--color-primary-dark)] md:text-5xl">
              Beliebt bei Zirbelino
            </h2>
            <p className="mt-3 text-[var(--color-text-muted)]">
              Ausgewählte Stücke aus Holz, Duft und Handwerk – direkt aus dem
              öffentlichen Sortiment.
            </p>
          </div>
          <div className="grid grid-cols-2 items-stretch gap-5 md:grid-cols-4 md:gap-7">
            {bestsellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-stretch gap-0 px-4 py-16 md:grid-cols-2 md:px-6 md:py-24">
        <div className="surface-warm flex flex-col justify-center p-8 md:p-12">
          <p className="eyebrow">Marke</p>
          <h2 className="mt-3 font-display text-4xl leading-tight text-[var(--color-primary-dark)] md:text-5xl">
            Vom Tischler-Enkel zur eigenen Zirbenwelt
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--color-text-muted)]">
            {story?.excerpt ||
              "Zirbelino verbindet Zirbenholz und echtes Handwerk – mit eigener Fertigung in Kärnten und Produkten, die Herkunft nicht verstecken müssen."}
          </p>
          <ButtonLink href="/ueber-zirbelino" className="mt-8 w-fit">
            Geschichte lesen
          </ButtonLink>
        </div>
        <div className="relative min-h-[22rem] overflow-hidden md:min-h-full">
          {storyImage?.images[0] ? (
            <Image
              src={storyImage.images[0].url}
              alt={storyImage.name}
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 50vw"
            />
          ) : null}
          <div className="story-fade absolute inset-0" />
          <p className="absolute bottom-5 left-5 rounded-[var(--radius-craft)] bg-[rgba(31,24,16,0.72)] px-4 py-2 font-display text-2xl text-[#fff7eb]">
            Handwerk aus Kärnten
          </p>
        </div>
      </section>

      <section className="wood-panel relative overflow-hidden py-16 text-[#fff7eb] md:py-20">
        <div className="craft-glow absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <p className="eyebrow text-[var(--color-resin)]">Manufaktur</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">
            Echte Zirbe. Echtes Handwerk.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-4">
            {[
              {
                step: "Herkunft",
                text: "Zirbenholz aus den Alpen – nachvollziehbar und PEFC-bezogen ausgewiesen.",
              },
              {
                step: "Holzauswahl",
                text: "Sorgfältig gewählt: Maserung, Duft und Charakter bleiben sichtbar.",
              },
              {
                step: "Lufttrocknung",
                text: "Schonende Trocknung erhält die natürlichen Inhaltsstoffe der Zirbe.",
              },
              {
                step: "Fertigung",
                text: "Viele Stücke entstehen in der eigenen Tischlerei in Kärnten.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="border-t border-[rgba(217,160,102,0.45)] pt-4"
              >
                <p className="font-display text-2xl text-[var(--color-resin)]">
                  {item.step}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[#f0e2cf]">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <div className="mb-8">
          <p className="eyebrow">Stimmen</p>
          <h2 className="mt-3 font-display text-4xl text-[var(--color-primary-dark)] md:text-5xl">
            Was Kund:innen sagen
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {reviews.map((review) => (
            <blockquote
              key={review.id}
              className="border border-[rgba(139,90,43,0.28)] bg-[rgba(247,238,226,0.75)] p-5 shadow-[0_10px_30px_rgba(42,34,24,0.05)]"
            >
              <StarRating rating={review.rating} showValue />
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-text)]">
                {review.body}
              </p>
              <footer className="mt-4 text-sm text-[var(--color-text-muted)]">
                {review.authorName}
                {review.authorLocation ? ` · ${review.authorLocation}` : ""}
                {review.createdAt
                  ? ` · ${new Date(review.createdAt).toLocaleDateString("de-AT")}`
                  : ""}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="gift-wash absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="eyebrow">Schenken</p>
              <h2 className="mt-3 font-display text-4xl text-[var(--color-primary-dark)] md:text-5xl">
                Ein Stück Alpen zum Verschenken
              </h2>
            </div>
            <Link
              href="/kategorie/geschenke"
              className="text-sm font-semibold text-[var(--color-wood)] underline decoration-[var(--color-resin)] underline-offset-4"
            >
              Geschenke entdecken
            </Link>
          </div>
          <div className="grid grid-cols-2 items-stretch gap-5 md:grid-cols-4">
            {gifts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-16 md:grid-cols-[1.15fr_0.85fr] md:px-6 md:py-24">
        <div className="surface-warm p-8 md:p-10">
          <p className="eyebrow">Wissen</p>
          <h2 className="mt-3 font-display text-4xl text-[var(--color-primary-dark)]">
            Die Welt der Zirbe
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--color-text-muted)]">
            {knowledge?.excerpt ||
              "Hintergrund zu Herkunft, Studienlage und Anwendung – ohne erfundene Versprechen."}
          </p>
          <ButtonLink href="/die-zirbe" className="mt-8" variant="secondary">
            Mehr erfahren
          </ButtonLink>
        </div>
        <form
          id="newsletter"
          className="wood-panel relative overflow-hidden p-8 text-[#fff7eb] md:p-10"
        >
          <div className="newsletter-glow absolute inset-0" />
          <div className="relative">
            <h3 className="font-display text-3xl">Post aus den Alpen</h3>
            <p className="mt-3 text-sm text-[#f0e2cf]">
              Newsletter-Anmeldung in der Demo nur simuliert – keine E-Mails
              werden versendet.
            </p>
            <label
              className="mt-6 block text-sm font-medium"
              htmlFor="newsletter-email"
            >
              E-Mail
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="name@email.at"
              className="mt-2 w-full rounded-[var(--radius-craft)] border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/55"
            />
            <button
              type="submit"
              className="mt-4 w-full rounded-[var(--radius-craft)] bg-[var(--color-resin)] px-5 py-3 text-sm font-semibold text-[var(--color-primary-dark)]"
            >
              Anmelden
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

function TrustItem({
  label,
  value,
  showStar = false,
}: {
  label: string;
  value: string;
  showStar?: boolean;
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-wood)]">
        {label}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <p className="font-display text-2xl text-[var(--color-primary-dark)] md:text-3xl">
          {value}
        </p>
        {showStar ? (
          <span
            className="text-2xl leading-none text-[var(--color-resin)] md:text-3xl"
            aria-hidden
          >
            {"\u2605"}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function CategoryTile({
  category,
  image,
}: {
  category: Category;
  image?: string;
}) {
  return (
    <Link
      href={`/kategorie/${category.slug}`}
      className="group relative min-h-52 overflow-hidden text-white shadow-[0_16px_34px_rgba(42,34,24,0.16)]"
    >
      {image ? (
        <Image
          src={image}
          alt={category.name}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(max-width:768px) 100vw, 20vw"
        />
      ) : (
        <div className="absolute inset-0 wood-panel" />
      )}
      <div className="category-fade absolute inset-0" />
      <div className="relative flex h-full min-h-52 flex-col justify-end p-5">
        <h3 className="font-display text-2xl">{category.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-[#f0e2cf]">
          {category.description}
        </p>
      </div>
    </Link>
  );
}
