"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import type { Category } from "@/domain";

export function CategoryCarousel({
  categories,
  imagesByCategory,
}: {
  categories: Category[];
  imagesByCategory: Record<string, string | undefined>;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  if (!categories.length) return null;

  const scrollBy = (direction: -1 | 1) => {
    const node = scrollerRef.current;
    if (!node) return;
    node.scrollBy({ left: direction * Math.max(260, node.clientWidth * 0.7), behavior: "smooth" });
  };

  return (
    <section className="mt-16 border-t border-[var(--color-border)] pt-14">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[var(--color-wood)]">
            Entdecken
          </p>
          <h2 className="mt-2 font-display text-3xl text-[var(--color-primary-dark)] md:text-4xl">
            Produktkategorien
          </h2>
        </div>
        <div className="hidden gap-2 md:flex">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Kategorien nach links"
            className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-craft)] border border-[var(--color-border)] bg-[var(--color-surface)] text-xl text-[var(--color-wood)]"
          >
            {"\u2039"}
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Kategorien nach rechts"
            className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-craft)] border border-[var(--color-border)] bg-[var(--color-surface)] text-xl text-[var(--color-wood)]"
          >
            {"\u203A"}
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {categories.map((category) => {
          const image = imagesByCategory[category.id];
          return (
            <Link
              key={category.id}
              href={`/kategorie/${category.slug}`}
              className="group relative min-h-48 w-[72%] shrink-0 snap-start overflow-hidden text-white shadow-[0_16px_34px_rgba(42,34,24,0.16)] sm:w-[46%] md:w-[30%] lg:w-[22%]"
            >
              {image ? (
                <Image
                  src={image}
                  alt={category.name}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="280px"
                />
              ) : (
                <div className="absolute inset-0 wood-panel" />
              )}
              <div className="category-fade absolute inset-0" />
              <div className="relative flex h-full min-h-48 flex-col justify-end p-5">
                <h3 className="font-display text-2xl">{category.name}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-[#f0e2cf]">
                  {category.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
