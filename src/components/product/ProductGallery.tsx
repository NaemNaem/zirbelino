"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type TouchEvent } from "react";
import type { MediaAsset } from "@/domain";

const SWIPE_THRESHOLD = 48;

export function ProductGallery({
  images,
  productName,
}: {
  images: MediaAsset[];
  productName: string;
}) {
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const gallery = images.length ? images : [];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[index] as HTMLElement | undefined;
    if (!slide) return;
    track.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
  }, [index]);

  if (!gallery.length) {
    return (
      <div className="flex aspect-[4/3] w-full items-center justify-center bg-[var(--color-surface-deep)] text-sm text-[var(--color-text-muted)] sm:aspect-square">
        Kein Bild verfügbar
      </div>
    );
  }

  const goTo = (next: number) => {
    const total = gallery.length;
    setIndex(((next % total) + total) % total);
  };

  const onTouchStart = (event: TouchEvent) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event: TouchEvent) => {
    const startX = touchStartX.current;
    const endX = event.changedTouches[0]?.clientX;
    touchStartX.current = null;
    if (startX == null || endX == null || gallery.length <= 1) return;
    const delta = endX - startX;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    if (delta < 0) goTo(index + 1);
    else goTo(index - 1);
  };

  return (
    <div className="relative w-full min-w-0 max-w-full overflow-hidden">
      <div
        ref={trackRef}
        className="flex w-full aspect-[4/3] snap-x snap-mandatory overflow-x-auto scroll-smooth touch-pan-y [-ms-overflow-style:none] [scrollbar-width:none] sm:aspect-square [&::-webkit-scrollbar]:hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {gallery.map((asset, slideIndex) => (
          <div
            key={asset.id}
            className="relative aspect-[4/3] w-full min-w-0 shrink-0 grow-0 basis-full snap-center bg-[var(--color-surface)] sm:aspect-square"
            aria-hidden={slideIndex !== index}
          >
            <Image
              src={asset.url}
              alt={asset.alt || productName}
              fill
              priority={slideIndex === 0}
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 50vw"
            />
          </div>
        ))}
      </div>

      {gallery.length > 1 ? (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Vorheriges Bild"
            className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-[var(--radius-craft)] border border-white/40 bg-[rgba(42,31,22,0.4)] text-2xl text-[#fff7eb] backdrop-blur-sm transition hover:bg-[rgba(42,31,22,0.6)] md:left-3 md:h-11 md:w-11"
          >
            <span aria-hidden>{"\u2039"}</span>
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Nächstes Bild"
            className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-[var(--radius-craft)] border border-white/40 bg-[rgba(42,31,22,0.4)] text-2xl text-[#fff7eb] backdrop-blur-sm transition hover:bg-[rgba(42,31,22,0.6)] md:right-3 md:h-11 md:w-11"
          >
            <span aria-hidden>{"\u203A"}</span>
          </button>
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
            {gallery.map((asset, slideIndex) => (
              <button
                key={asset.id}
                type="button"
                aria-label={`Bild ${slideIndex + 1}`}
                onClick={() => setIndex(slideIndex)}
                className={`h-2 w-2 rounded-sm ${
                  slideIndex === index ? "bg-[var(--color-resin)]" : "bg-white/55"
                }`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
