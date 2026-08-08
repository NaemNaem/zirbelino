import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { DemoLoginForm } from "@/components/commerce/DemoLoginForm";

export const metadata: Metadata = {
  title: "Konto / Login",
  description:
    "Kundenkonto und Login – in der Demo als Platzhalter, echte Anmeldung folgt mit Backend-Anbindung.",
};

export default function AccountPage() {
  return (
    <main className="mx-auto max-w-xl px-4 py-12 md:px-6 md:py-16">
      <nav className="flex items-center gap-2 text-xs tracking-wide text-[var(--color-text-muted)]">
        <Link href="/" className="hover:text-[var(--color-wood)]">
          Start
        </Link>
        <span aria-hidden>/</span>
        <span className="text-[var(--color-wood)]">Konto</span>
      </nav>

      <h1 className="mt-5 font-display text-4xl text-[var(--color-primary-dark)]">
        Konto / Login
      </h1>
      <p className="mt-4 text-[var(--color-text-muted)]">
        Hier entsteht später der Login- und Kundenbereich (Bestellungen,
        Adressen, Merkliste). In dieser Demo ist die Anmeldung noch nicht an ein
        Backend angebunden.
      </p>

      <DemoLoginForm />

      <div className="mt-6 flex flex-wrap gap-3">
        <ButtonLink href="/shop" variant="secondary">
          Weiter einkaufen
        </ButtonLink>
        <ButtonLink href="/kontakt" variant="ghost">
          Hilfe kontaktieren
        </ButtonLink>
      </div>
    </main>
  );
}
