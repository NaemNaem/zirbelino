import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "light";

const styles: Record<Variant, string> = {
  primary:
    "bg-[var(--color-wood)] text-[#fff8ef] hover:bg-[var(--color-accent)] shadow-[0_10px_24px_rgba(139,90,43,0.28)]",
  secondary:
    "bg-[var(--color-surface)] text-[var(--color-primary-dark)] border border-[var(--color-border)] hover:border-[var(--color-wood)] hover:bg-[var(--color-surface-deep)]",
  ghost:
    "bg-transparent text-[var(--color-primary-dark)] hover:bg-[var(--color-wood)]/10",
  light:
    "border border-white/35 bg-white/12 text-white backdrop-blur-sm hover:bg-white/22",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-craft)] px-5 py-2.5 text-sm font-semibold tracking-wide transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-wood)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50";

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={`${base} ${styles[variant]} ${className}`} {...props} />;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Link href={href} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </Link>
  );
}
