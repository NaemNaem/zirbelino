"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type TouchEvent } from "react";
import { ButtonLink } from "@/components/ui/Button";

export type HeroSlide = {
  id: string;
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  text: string;
  href: string;
  cta: string;
};

const AUTO_MS = 6500;
const SWIPE_THRESHOLD = 48;

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (paused || reduceMotion || slides.length <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, AUTO_MS);
    return () => window.clearInterval(timer);
  }, [paused, reduceMotion, slides.length]);

  if (!slides.length) return null;
  const slide = slides[index] ?? slides[0];

  const goTo = (nextIndex: number) => {
    const total = slides.length;
    setIndex(((nextIndex % total) + total) % total);
  };

  const goPrev = () => goTo(index - 1);
  const goNext = () => goTo(index + 1);

  const onTouchStart = (event: TouchEvent) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event: TouchEvent) => {
    const startX = touchStartX.current;
    const endX = event.changedTouches[0]?.clientX;
    touchStartX.current = null;
    if (startX == null || endX == null || slides.length <= 1) return;
    const delta = endX - startX;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    if (delta < 0) goNext();
    else goPrev();
  };

  return (
    <section
      className="relative isolate min-h-[85vh] touch-pan-y"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
      aria-label="Zirbelino Highlights"
    >
      <div className="absolute inset-0 overflow-hidden">
        {slides.map((item, slideIndex) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              slideIndex === index ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={slideIndex !== index}
          >
            <Image
              src={item.image}
              alt={item.alt}
              fill
              priority={slideIndex === 0}
              className="object-cover object-[68%_center]"
              sizes="100vw"
            />
          </div>
        ))}
        <div className="hero-overlay absolute inset-0" />
      </div>

      {slides.length > 1 ? (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Vorherige Folie"
            className="absolute left-3 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-[var(--radius-craft)] border border-white/35 bg-[rgba(42,31,22,0.35)] text-2xl text-[#fff7eb] backdrop-blur-sm transition hover:border-white/55 hover:bg-[rgba(42,31,22,0.55)] md:left-5 md:flex lg:left-8"
          >
            <span aria-hidden>{"\u2039"}</span>
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Nächste Folie"
            className="absolute right-3 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-[var(--radius-craft)] border border-white/35 bg-[rgba(42,31,22,0.35)] text-2xl text-[#fff7eb] backdrop-blur-sm transition hover:border-white/55 hover:bg-[rgba(42,31,22,0.55)] md:right-5 md:flex lg:right-8"
          >
            <span aria-hidden>{"\u203A"}</span>
          </button>
        </>
      ) : null}

      <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-end px-4 pb-16 pt-36 md:px-6 md:pb-20 md:pt-40">
        <div className="max-w-2xl">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[#f3e6d4] [text-shadow:0_1px_2px_rgba(0,0,0,0.7),0_2px_10px_rgba(0,0,0,0.4)]">
            {slide.eyebrow}
          </p>
          <h1 className="mt-4 font-display text-5xl leading-[1.12] text-[#fff7eb] md:text-7xl">
            {slide.title}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[#f3e6d4] md:text-lg">
            {slide.text}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={slide.href}>{slide.cta}</ButtonLink>
            <ButtonLink href="/shop" variant="light">
              Produkte entdecken
            </ButtonLink>
          </div>
        </div>

        <div className="mt-10 flex gap-2" role="tablist" aria-label="Folien">
          {slides.map((item, slideIndex) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={slideIndex === index}
              aria-label={`Folie ${slideIndex + 1}: ${item.alt}`}
              onClick={() => setIndex(slideIndex)}
              className={`h-2.5 w-2.5 rounded-sm transition ${
                slideIndex === index
                  ? "bg-[var(--color-resin)]"
                  : "bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
