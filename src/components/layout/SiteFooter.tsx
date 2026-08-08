import Image from "next/image";
import Link from "next/link";
import { TrustCtaBand } from "@/components/layout/TrustCtaBand";

export function SiteFooter() {
  return (
    <>
      <TrustCtaBand />
      <footer className="wood-panel mt-auto text-[#fff7eb]">
        <div className="wood-band h-[3px] w-full" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-6">
          <div className="md:col-span-2">
            <Link href="/" className="relative block h-12 w-[200px]">
              <Image
                src="/brand/zirbelino-logo.svg"
                alt="Zirbelino"
                fill
                className="object-contain object-left"
                sizes="200px"
              />
            </Link>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-[#f0e2cf]">
              Echte Zirbe aus den Alpen. Handwerk aus Kärnten. Regional, sorgfältig
              gefertigt und mit nachvollziehbarer Herkunft.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-resin)]">
              Shop
            </p>
            <ul className="mt-4 space-y-2 text-sm text-[#f0e2cf]">
              <li>
                <Link className="hover:text-white" href="/shop">
                  Alle Produkte
                </Link>
              </li>
              <li>
                <Link className="hover:text-white" href="/kategorie/schlafen">
                  Kissen & Schlafen
                </Link>
              </li>
              <li>
                <Link className="hover:text-white" href="/kategorie/wohnen-duft">
                  Späne & Öl
                </Link>
              </li>
              <li>
                <Link className="hover:text-white" href="/kategorie/geschenke">
                  Geschenke
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-resin)]">
              Service & Rechtliches
            </p>
            <ul className="mt-4 space-y-2 text-sm text-[#f0e2cf]">
              <li>
                <Link className="hover:text-white" href="/ueber-zirbelino">
                  Über Zirbelino
                </Link>
              </li>
              <li>
                <Link className="hover:text-white" href="/die-zirbe">
                  Die Zirbe
                </Link>
              </li>
              <li>
                <Link className="hover:text-white" href="/kontakt">
                  Kontakt
                </Link>
              </li>
              <li>
                <Link className="hover:text-white" href="/versand">
                  Versand
                </Link>
              </li>
              <li>
                <Link className="hover:text-white" href="/zahlung">
                  Zahlung
                </Link>
              </li>
              <li>
                <Link className="hover:text-white" href="/faq">
                  FAQ
                </Link>
              </li>
              <li>
                <Link className="hover:text-white" href="/impressum">
                  Impressum
                </Link>
              </li>
              <li>
                <Link className="hover:text-white" href="/datenschutz">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link className="hover:text-white" href="/agb">
                  AGB & Widerruf
                </Link>
              </li>
              <li>
                <Link className="hover:text-white" href="/zertifizierung">
                  Zertifizierung
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-[#d9c4a8]">
          Demo-Shop · Keine echten Bestellungen · Datenquelle: zirbenprodukte.at
          (öffentlich)
        </div>
      </footer>
    </>
  );
}
