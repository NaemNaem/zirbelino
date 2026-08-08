"use client";

import { useState } from "react";

export function DemoLoginForm() {
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <form
      className="mt-8 space-y-4 border border-[var(--color-border)] bg-[var(--color-surface)]/90 p-6"
      onSubmit={(event) => {
        event.preventDefault();
        setNotice(
          "Demo: Login ist dargestellt, aber noch nicht mit einem Backend verbunden.",
        );
      }}
    >
      <label className="block text-sm">
        E-Mail
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="name@email.at"
          className="mt-2 w-full rounded-[var(--radius-craft)] border border-[var(--color-border)] bg-white/80 px-3 py-2.5"
        />
      </label>
      <label className="block text-sm">
        Passwort
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className="mt-2 w-full rounded-[var(--radius-craft)] border border-[var(--color-border)] bg-white/80 px-3 py-2.5"
        />
      </label>
      <button
        type="submit"
        className="w-full rounded-[var(--radius-craft)] bg-[var(--color-wood)] px-5 py-3 text-sm font-semibold text-[#fff8ef] transition hover:bg-[var(--color-accent)]"
      >
        Anmelden
      </button>
      {notice ? (
        <p className="text-sm text-[var(--color-wood)]">{notice}</p>
      ) : (
        <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">
          Keine echte Authentifizierung – Formular dient der Darstellung.
          Produktiv folgt Auth über den Commerce-/Customer-Adapter.
        </p>
      )}
    </form>
  );
}
