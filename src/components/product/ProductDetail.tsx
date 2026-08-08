"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { Category, Product, Review } from "@/domain";
import { useCommerce } from "@/components/commerce/CommerceProvider";
import { CategoryCarousel } from "@/components/product/CategoryCarousel";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGallery } from "@/components/product/ProductGallery";
import { Button } from "@/components/ui/Button";
import { PaymentMethodsStrip } from "@/components/ui/PaymentMethodsStrip";
import { StarRating } from "@/components/ui/StarRating";
import { formatMoney, formatRating } from "@/lib/format";
import {
  formatPieceLabel,
  parseProductDescription,
} from "@/lib/product-description";

const DEMO_PROMOS = [
  { id: "promo-2plus1", label: "2+1 GRATIS" },
  { id: "promo-3plus1", label: "3+1 GRATIS" },
  { id: "promo-5plus1", label: "5+1 GRATIS" },
  { id: "promo-sale", label: "Aktionspreis" },
];

export function ProductDetail({
  product,
  related,
  reviews,
  saleProducts,
  categories,
  categoryImages,
}: {
  product: Product;
  related: Product[];
  reviews: Review[];
  saleProducts: Product[];
  categories: Category[];
  categoryImages: Record<string, string | undefined>;
}) {
  const router = useRouter();
  const { addToCart, toggleWishlist, hasWishlist } = useCommerce();
  const [qty, setQty] = useState(1);
  const [infoTab, setInfoTab] = useState<"description" | "legal">("description");

  const sections = useMemo(
    () => parseProductDescription(product.description),
    [product.description],
  );

  const teaser = useMemo(() => {
    const source = product.shortDescription?.trim();
    if (!source) return "";
    const intro = parseProductDescription(source)[0]?.body?.trim();
    const text = intro || source;
    if (text.length <= 180) return text;
    const cut = text.slice(0, 180);
    const lastStop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "));
    return lastStop > 60 ? cut.slice(0, lastStop + 1) : `${cut.trimEnd()}…`;
  }, [product.shortDescription]);

  const savings =
    product.compareAtPrice && product.compareAtPrice.amount > product.price.amount
      ? {
          amount: product.compareAtPrice.amount - product.price.amount,
          percent: Math.round(
            ((product.compareAtPrice.amount - product.price.amount) /
              product.compareAtPrice.amount) *
              100,
          ),
        }
      : null;

  const setQuantity = (next: number) => {
    setQty(Math.max(1, Math.min(999, next)));
  };

  const add = (openCart = true) => {
    addToCart({ productId: product.id, quantity: qty, openCart });
  };

  const buyNow = () => {
    add(false);
    router.push("/kasse");
  };

  const promoItems = saleProducts.slice(0, 4).map((item, index) => ({
    product: item,
    badge: DEMO_PROMOS[index % DEMO_PROMOS.length]?.label ?? "Aktion",
  }));

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 pb-28 md:px-6 md:py-12 md:pb-12">
      <nav
        aria-label="Brotkrumen"
        className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs tracking-wide text-[var(--color-text-muted)]"
      >
        <Link href="/" className="transition hover:text-[var(--color-wood)]">
          Start
        </Link>
        <span aria-hidden className="text-[var(--color-border)]">
          /
        </span>
        <Link href="/shop" className="transition hover:text-[var(--color-wood)]">
          Shop
        </Link>
        <span aria-hidden className="text-[var(--color-border)]">
          /
        </span>
        <span className="max-w-[16rem] truncate text-[var(--color-wood)] sm:max-w-md">
          {product.name}
        </span>
      </nav>

      <header className="mt-5 max-w-4xl">
        <div className="flex flex-wrap gap-2">
          {product.flags?.sale ? <Badge tone="sale">Sale</Badge> : null}
          {product.flags?.new ? <Badge>Neu</Badge> : null}
          {product.flags?.bestseller ? <Badge>Bestseller</Badge> : null}
        </div>

        <h1 className="mt-4 font-display text-3xl leading-tight text-[var(--color-primary-dark)] md:text-4xl lg:text-[2.75rem]">
          {product.name}
        </h1>

        {product.rating ? (
          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            <StarRating rating={product.rating} showValue />
            <span className="text-sm text-[var(--color-text-muted)]">
              {product.reviewCount ?? 0} Echte Bewertungen
            </span>
            <span className="text-sm font-semibold text-[var(--color-wood)]">
              {formatRating(product.rating)} / 5
            </span>
          </div>
        ) : null}
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <ProductGallery images={product.images} productName={product.name} />

        <div>
          <div className="space-y-2 border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            {product.compareAtPrice ? (
              <p className="text-sm text-[var(--color-text-muted)]">
                Statt:{" "}
                <span className="line-through">
                  {formatMoney(product.compareAtPrice)}
                </span>
              </p>
            ) : null}
            <p className="text-3xl font-semibold text-[var(--color-sale)]">
              Jetzt: {formatMoney(product.price)}
            </p>
            {savings ? (
              <p className="text-sm font-medium text-[var(--color-wood)]">
                Sie sparen:{" "}
                {formatMoney({
                  amount: savings.amount,
                  currency: product.price.currency,
                })}{" "}
                (−{savings.percent}%)
              </p>
            ) : null}
            <p className="text-sm text-[var(--color-text-muted)]">
              {product.shippingInformation ??
                "Preise inkl. USt., zzgl. Versand laut Shopangabe."}
            </p>
          </div>

          {teaser ? (
            <p className="mt-5 text-sm leading-relaxed text-[var(--color-text-muted)]">
              {teaser}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-sm">
            <p className="font-semibold text-[var(--color-sale)]">
              {stockMessage(product)}
            </p>
            {product.deliveryTime ? (
              <p className="inline-flex items-center gap-1.5 font-medium text-[var(--color-success)]">
                <TruckIcon />
                {product.deliveryTime}
              </p>
            ) : null}
          </div>

          <div className="mt-4 flex w-full items-center justify-between gap-3 rounded-[var(--radius-craft)] border border-[var(--color-wood)]/45 bg-white/70 px-4 py-3">
            <span className="text-sm font-medium text-[var(--color-text-muted)]">
              {formatPieceLabel(qty)}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Menge verringern"
                onClick={() => setQuantity(qty - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] text-lg leading-none text-[var(--color-text)]"
              >
                −
              </button>
              <button
                type="button"
                aria-label="Menge erhöhen"
                onClick={() => setQuantity(qty + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] text-lg leading-none text-[var(--color-text)]"
              >
                +
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => add(true)}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-[var(--radius-craft)] bg-[var(--color-wood)] px-5 py-3.5 text-sm font-semibold text-[#fff8ef] shadow-[0_10px_24px_rgba(139,90,43,0.28)] transition hover:bg-[var(--color-accent)]"
          >
            <CartIcon />
            In den Warenkorb
          </button>

          <button
            type="button"
            onClick={buyNow}
            className="mt-2 w-full rounded-[var(--radius-craft)] bg-[var(--color-sale)] px-5 py-3.5 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Jetzt kaufen
          </button>

          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            className="mt-3 text-sm font-medium text-[var(--color-wood)] underline-offset-4 hover:underline"
          >
            {hasWishlist(product.id) ? "Auf Merkliste" : "Auf Merkliste setzen"}
          </button>

          <PaymentMethodsStrip />

          <dl className="mt-6 grid gap-2 text-sm text-[var(--color-text-muted)]">
            {product.sku ? (
              <div className="flex justify-between gap-4">
                <dt>Art.-Nr.</dt>
                <dd className="text-[var(--color-text)]">{product.sku}</dd>
              </div>
            ) : null}
            {product.ean ? (
              <div className="flex justify-between gap-4">
                <dt>EAN</dt>
                <dd className="text-[var(--color-text)]">{product.ean}</dd>
              </div>
            ) : null}
          </dl>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <MediaPlaceholder
              eyebrow="Audioinfo"
              title="Produkt per Audio entdecken"
              text="Platzhalter für die Original-Sprachinfos (APlayer). In der Demo ohne Tonwiedergabe."
              icon="♪"
            />
            <MediaPlaceholder
              eyebrow="Produktvideo"
              title="Video zum Produkt"
              text="Platzhalter für Produktclips aus der Galerie. Später per Adapter mit echten Videos befüllt."
              icon="▶"
            />
          </div>
        </div>
      </div>

      <section className="mt-14">
        <div className="flex flex-wrap gap-2 border-b border-[var(--color-border)]">
          <TabButton
            active={infoTab === "description"}
            onClick={() => setInfoTab("description")}
          >
            Beschreibung
          </TabButton>
          <TabButton
            active={infoTab === "legal"}
            onClick={() => setInfoTab("legal")}
          >
            Gesetzliche Hinweise
          </TabButton>
        </div>

        {infoTab === "description" ? (
          <div className="mt-8 max-w-3xl space-y-8">
            {sections.length ? (
              sections.map((section, index) => (
                <div key={`${section.title ?? "intro"}-${index}`}>
                  {section.title ? (
                    <h3 className="font-display text-xl text-[var(--color-wood)] md:text-2xl">
                      {titleCaseHeading(section.title)}
                    </h3>
                  ) : null}
                  <p
                    className={`leading-relaxed text-[var(--color-text-muted)] ${
                      section.title ? "mt-3" : ""
                    }`}
                  >
                    {section.body}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-[var(--color-text-muted)]">
                Keine Beschreibung verfügbar.
              </p>
            )}
          </div>
        ) : (
          <LegalNotices product={product} />
        )}
      </section>

      <section className="mt-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[var(--color-wood)]">
              Stimmen
            </p>
            <h2 className="mt-2 font-display text-3xl text-[var(--color-primary-dark)] md:text-4xl">
              Kundenbewertungen
            </h2>
          </div>
          {product.rating ? (
            <div className="text-right">
              <StarRating rating={product.rating} showValue />
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                {product.reviewCount ?? reviews.length} Bewertungen
              </p>
            </div>
          ) : null}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {reviews.length ? (
            reviews.map((review) => (
              <blockquote
                key={review.id}
                className="border border-[var(--color-border)] bg-[var(--color-surface)]/70 p-5"
              >
                <StarRating rating={review.rating} size="sm" showValue />
                <p className="mt-3 text-sm leading-relaxed">{review.body}</p>
                <footer className="mt-3 text-xs font-semibold text-[var(--color-text-muted)]">
                  {review.authorName}
                </footer>
              </blockquote>
            ))
          ) : (
            <p className="text-sm text-[var(--color-text-muted)] md:col-span-2">
              Keine importierten Einzelbewertungen für dieses Produkt.
            </p>
          )}
        </div>
      </section>

      {related.length ? (
        <section className="mt-16">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[var(--color-wood)]">
            Empfohlen
          </p>
          <h2 className="mt-2 font-display text-3xl text-[var(--color-primary-dark)] md:text-4xl">
            Passt dazu
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}

      {promoItems.length ? (
        <section className="mt-16">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[var(--color-wood)]">
            Aktionen
          </p>
          <h2 className="mt-2 font-display text-3xl text-[var(--color-primary-dark)] md:text-4xl">
            Aktuelle Aktionsartikel
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-[var(--color-text-muted)]">
            Beispielhafte Aktionsprodukte für die Demo. X+1-Logik folgt später über
            den Commerce-Adapter.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-4">
            {promoItems.map(({ product: item, badge }) => (
              <div key={item.id} className="relative">
                <span className="absolute left-2 top-2 z-10 bg-[var(--color-sale)] px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                  {badge}
                </span>
                <ProductCard product={item} />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <CategoryCarousel
        categories={categories}
        imagesByCategory={categoryImages}
      />

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--color-border)] bg-[var(--color-surface)]/95 p-3 backdrop-blur md:hidden">
        <div className="mb-2 flex items-center justify-between gap-3 text-sm">
          <span className="font-semibold">{formatPieceLabel(qty)}</span>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Menge verringern"
              onClick={() => setQuantity(qty - 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)]"
            >
              −
            </button>
            <button
              type="button"
              aria-label="Menge erhöhen"
              onClick={() => setQuantity(qty + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)]"
            >
              +
            </button>
          </div>
        </div>
        <Button className="w-full" onClick={() => add(true)}>
          In den Warenkorb · {formatMoney(product.price)}
        </Button>
      </div>
    </main>
  );
}

function LegalNotices({ product }: { product: Product }) {
  return (
    <div className="mt-8 grid max-w-3xl gap-8">
      <LegalBlock title="Zertifizierung">
        Zertifizierung Zirbenholz: PEFC Austria / Holzforschung Austria.
        Zertifikat Nummer: HFA-PEFC-COC-0608 | Logo-Nummer: PEFC/06-38-357.
        Späne – Schnittholz – Haushaltsartikel – Möbel – Drechslereiprodukte.
        „Dieses Holzprodukt ist zu 100% PEFC-zertifiziert und stammt aus nachhaltig
        bewirtschafteten Wäldern und kontrollierten Quellen.“
      </LegalBlock>

      <LegalBlock title="Textilkennzeichnung / Materialien">
        {product.materials?.length
          ? product.materials.join(" · ")
          : "Angaben zu Materialien und Füllung folgen dem jeweiligen Produktdatenblatt. Bei Kissen typisch: Bezug aus Baumwolle, Füllung aus Zirbenspänen."}
        {product.dimensions ? (
          <>
            <br />
            Maße: {product.dimensions}
          </>
        ) : null}
        {product.careInstructions ? (
          <>
            <br />
            Pflege: {product.careInstructions}
          </>
        ) : null}
      </LegalBlock>

      <LegalBlock title="Herstellerinformation">
        KISSEN1 Zirbenprodukte GmbH
        <br />
        Ziegeleistraße 29
        <br />
        9020 Klagenfurt am Wörthersee, Kärnten, AT
        <br />
        +43 463 27 60 12 · hallo@zirbenprodukte.at
      </LegalBlock>

      <LegalBlock title="Verantwortliche Person für die EU">
        In der EU ansässiger Wirtschaftsbeteiligter, der sicherstellt, dass das
        Produkt den erforderlichen Vorschriften entspricht:
        <br />
        KISSEN1 Zirbenprodukte GmbH, Ziegeleistraße 29, 9020 Klagenfurt am
        Wörthersee, AT · +43 463 27 60 12 · hallo@zirbenprodukte.at
      </LegalBlock>

      <p className="text-xs text-[var(--color-text-muted)]">
        Demo-Hinweis: Maßgeblich für verbindliche Angaben bleiben die aktuellen
        gesetzlichen Hinweise im Live-Shop unter zirbenprodukte.at.
      </p>
    </div>
  );
}

function LegalBlock({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h3 className="font-display text-xl text-[var(--color-wood)]">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
        {children}
      </p>
    </div>
  );
}

function MediaPlaceholder({
  eyebrow,
  title,
  text,
  icon,
}: {
  eyebrow: string;
  title: string;
  text: string;
  icon: string;
}) {
  return (
    <div className="border border-dashed border-[var(--color-border)] bg-[var(--color-surface)]/80 p-4">
      <div className="flex items-start gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-craft)] bg-[var(--color-wood)] text-[#fff7eb]"
          aria-hidden
        >
          {icon}
        </span>
        <div>
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--color-wood)]">
            {eyebrow}
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--color-primary-dark)]">
            {title}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-muted)]">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border-b-2 px-4 py-3 text-sm font-semibold transition ${
        active
          ? "border-[var(--color-wood)] text-[var(--color-primary-dark)]"
          : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-wood)]"
      }`}
    >
      {children}
    </button>
  );
}

function Badge({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "sale";
}) {
  return (
    <span
      className={`px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-white ${
        tone === "sale" ? "bg-[var(--color-sale)]" : "bg-[var(--color-wood)]"
      }`}
    >
      {children}
    </span>
  );
}

function stockMessage(product: Product): string {
  switch (product.availability) {
    case "out_of_stock":
      return "Derzeit nicht verfügbar.";
    case "preorder":
      return "Vorbestellung möglich.";
    case "request_only":
      return "Auf Anfrage verfügbar.";
    case "low_stock":
      return `Nur noch ${demoStockCount(product.id)} Stück verfügbar.`;
    default:
      if (product.flags?.sale) {
        return `Nur noch ${demoStockCount(product.id)} Stück verfügbar.`;
      }
      return "Auf Lager · sofort bestellbar.";
  }
}

function demoStockCount(productId: string): number {
  const sum = [...productId].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return (sum % 9) + 3;
}

function TruckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden
    >
      <path d="M3 7h11v10H3z" />
      <path d="M14 10h4l3 3v4h-7z" />
      <circle cx="7.5" cy="18.5" r="1.5" />
      <circle cx="17.5" cy="18.5" r="1.5" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden
    >
      <path d="M6 6h15l-1.5 9h-12z" />
      <path d="M6 6 5 3H2" />
      <circle cx="9" cy="20" r="1.2" />
      <circle cx="18" cy="20" r="1.2" />
    </svg>
  );
}

function titleCaseHeading(heading: string): string {
  return heading
    .toLowerCase()
    .split(" ")
    .map((word) => {
      if (!word) return word;
      if (word === "&" || word === "/" || word === "–" || word === "-") return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}
