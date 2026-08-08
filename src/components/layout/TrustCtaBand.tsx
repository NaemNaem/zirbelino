import Link from "next/link";
import { PaymentBadges } from "@/components/ui/PaymentBadges";
import { ShippingBadges } from "@/components/ui/ShippingBadges";
import { formatTrustedShopsCount } from "@/lib/trust";

const VALUE_POINTS = [
  "Persönliche Ansprechpartner",
  "Eigene Frische-Produktion",
  "Regionaler, sozialer Betrieb",
  "Große Auswahl an Zirbenprodukten",
  "Zirben-Vollholz: zertifiziert & luftgetrocknet",
  `Mehr als ${formatTrustedShopsCount()} Bewertungen`,
] as const;

const ctaClass =
  "inline-flex min-w-[12rem] items-center justify-center gap-2 rounded-[var(--radius-craft)] bg-[var(--color-wood)] px-4 py-3 text-sm font-semibold text-[#fff8ef] shadow-[0_10px_24px_rgba(139,90,43,0.28)] transition hover:bg-[var(--color-accent)]";

export function TrustCtaBand() {
  return (
    <section className="wood-panel relative overflow-hidden text-[#fff7eb]">
      <div className="craft-glow absolute inset-0" />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-12 px-4 py-14 text-center md:px-6 md:py-16">
        <div>
          <h2 className="font-display text-3xl text-[var(--color-resin)] md:text-4xl">
            Zirbelino® – ein Stück Alpen für Zuhause
          </h2>
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-[#f0e2cf] md:text-base">
            <p>
              Seit vielen Jahren dreht sich bei uns alles um die Zirbe. In unserer
              eigenen Fertigung in Kärnten entstehen ausgewählte{" "}
              <strong className="font-semibold text-[#fff7eb]">
                Zirbenprodukte aus PEFC-zertifiziertem, luftgetrocknetem
                Zirbenholz
              </strong>{" "}
              – sorgfältig verarbeitet, mit viel Erfahrung und einem besonderen
              Blick für Material und Handwerk.
            </p>
            <p>
              Unsere Welt reicht von{" "}
              <strong className="font-semibold text-[#fff7eb]">
                Zirbenkissen, Zirbenspänen und Bio-Zirbenöl
              </strong>{" "}
              über{" "}
              <strong className="font-semibold text-[#fff7eb]">
                Zirbenzapfen und Zirbenbäume
              </strong>{" "}
              bis zu Zirbenwürfeln, Zirbenkugeln, Brotdosen und besonderen
              Produkten aus Massivholz.
            </p>
            <p>
              Was uns wichtig ist:{" "}
              <strong className="font-semibold text-[#fff7eb]">
                ehrliche Materialien, nachvollziehbare Herkunft und Produkte mit
                Charakter.
              </strong>
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-display text-xl text-[#fff7eb] md:text-2xl">
            Zirbelino® – ein Stück Alpen für Zuhause.
          </h3>
          <ul className="mt-5 space-y-2.5 text-sm text-[#f0e2cf] md:text-base">
            {VALUE_POINTS.map((point) => (
              <li key={point} className="flex items-center justify-center gap-2.5">
                <span className="text-[var(--color-resin)]" aria-hidden>
                  ✓
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-xl text-[#fff7eb] md:text-2xl">
            Benötigen Sie Hilfe zu Ihrer Bestellung? Wir beantworten gerne Ihre
            Fragen.
          </h3>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href="mailto:hallo@zirbenprodukte.at" className={ctaClass}>
              <EnvelopeIcon />
              hallo@zirbenprodukte.at
            </a>
            <a href="tel:+43463276012" className={ctaClass}>
              <PhoneIcon />
              +43 463 27 60 12
            </a>
            <Link href="/#newsletter" className={ctaClass}>
              <MegaphoneIcon />
              Newsletter anmelden
            </Link>
          </div>
          <a
            href="https://www.google.com/search?q=Zirbelino+Klagenfurt+Rezension"
            target="_blank"
            rel="noopener noreferrer"
            className={`${ctaClass} mt-3 min-w-[16rem]`}
          >
            <StarIcon />
            Google Rezension schreiben
          </a>
        </div>

        <div className="w-full border-t border-white/10 pt-10">
          <h3 className="font-display text-xl text-[var(--color-resin)]">
            Sicher bezahlen mit
          </h3>
          <PaymentBadges tone="dark" className="mt-5" />
        </div>

        <div>
          <h3 className="font-display text-xl text-[var(--color-resin)]">
            Versandkosten für Österreich
          </h3>
          <ShippingBadges tone="dark" className="mt-4" />
          <p className="mt-4 text-sm text-[#f0e2cf]">
            ab 70,00 € Versand kostenlos
            <br />
            bis 69,99 € Versand für 4,90 €
          </p>
          <div className="mt-4 flex flex-col items-center gap-2 text-sm">
            <Link
              href="/versand"
              className="text-[#fff7eb] underline decoration-[var(--color-resin)] underline-offset-4"
            >
              Infos zu Lieferung und Zahlung
            </Link>
            <Link
              href="/zahlung"
              className="text-[#fff7eb] underline decoration-[var(--color-resin)] underline-offset-4"
            >
              Zahlungsarten
            </Link>
            <a
              href="https://www.zirbenprodukte.at/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[var(--color-resin)]"
            >
              » Wo ist mein Paket?
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function EnvelopeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="m3 7 9 7 9-7" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3A2 2 0 0 1 18.5 19 14.5 14.5 0 0 1 5 5.5a2 2 0 0 1 1.5-2z" />
    </svg>
  );
}

function MegaphoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M3 10v4h3l6 3V7L6 10H3z" />
      <path d="M16 9.5a4 4 0 0 1 0 5" />
      <path d="M8 14.5 7 19h3l1-4.5" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="m12 3.5 2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 16.8 6.7 19.6l1-5.8L3.5 9.7l5.9-.9L12 3.5z" />
    </svg>
  );
}
