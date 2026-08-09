"use client";

import { useRef } from "react";
import { PaymentBadges } from "@/components/ui/PaymentBadges";

export function PaymentMethodsStrip() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (direction: -1 | 1) => {
    scrollerRef.current?.scrollBy({
      left: direction * 160,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative mt-5 min-w-0 max-w-full">
      <button
        type="button"
        aria-label="Zahlungsarten nach links"
        onClick={() => scrollBy(-1)}
        className="absolute left-0 top-1/2 z-10 -translate-y-1/2 text-lg text-[var(--color-border)] hover:text-[var(--color-wood)]"
      >
        {"\u2039"}
      </button>
      <div
        ref={scrollerRef}
        className="mx-5 min-w-0 max-w-full overflow-x-auto overscroll-x-contain py-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <PaymentBadges wrap={false} className="w-max max-w-none" />
      </div>
      <button
        type="button"
        aria-label="Zahlungsarten nach rechts"
        onClick={() => scrollBy(1)}
        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 text-lg text-[var(--color-border)] hover:text-[var(--color-wood)]"
      >
        {"\u203A"}
      </button>
    </div>
  );
}
