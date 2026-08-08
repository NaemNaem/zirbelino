import Image from "next/image";

const LOGOS = [
  {
    name: "Falstaff",
    src: "https://www.zirbenprodukte.at/image/cache/webp/config/store/0/config_content_known_from/falstaff-96x96-scale.webp",
  },
  {
    name: "BR",
    src: "https://www.zirbenprodukte.at/image/cache/webp/config/store/0/config_content_known_from/br-96x96-scale.webp",
  },
  {
    name: "ORF",
    src: "https://www.zirbenprodukte.at/image/cache/webp/config/store/0/config_content_known_from/orf-logo-96x96-scale.webp",
  },
  {
    name: "Trusted Shops",
    src: "https://www.zirbenprodukte.at/image/cache/webp/config/store/0/config_content_known_from/trusted-shops-96x96-scale.webp",
  },
  {
    name: "Tiroler Tageszeitung",
    src: "https://www.zirbenprodukte.at/image/cache/webp/config/store/0/config_content_known_from/tiroler-tageszeitung-96x96-scale.webp",
  },
  {
    name: "Kleine Zeitung",
    src: "https://www.zirbenprodukte.at/image/cache/webp/config/store/0/config_content_known_from/kleine-zeitung-96x96-scale.webp",
  },
  {
    name: "WDR",
    src: "https://www.zirbenprodukte.at/image/cache/webp/config/store/0/config_content_known_from/wdr-dachmarke.svg-96x96-scale.webp",
  },
  {
    name: "ARTE",
    src: "https://www.zirbenprodukte.at/image/cache/webp/config/store/0/config_content_known_from/arte-logo-rgb-96x96-scale.webp",
  },
  {
    name: "APA",
    src: "https://www.zirbenprodukte.at/image/cache/webp/config/store/0/config_content_known_from/apa-comm-logo-rgb-96x96-scale.webp",
  },
  {
    name: "Kronen Zeitung",
    src: "https://www.zirbenprodukte.at/image/cache/webp/config/store/0/config_content_known_from/kronen-zeitung-96x96-scale.webp",
  },
] as const;

export function BekanntAus() {
  return (
    <section className="border-b border-[var(--color-border)] bg-[rgba(247,238,226,0.7)]">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-wood)]">
          Bekannt aus
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-5">
          {LOGOS.map((logo) => (
            <div
              key={logo.name}
              className="flex h-12 w-24 items-center justify-center opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0"
              title={logo.name}
            >
              <Image
                src={logo.src}
                alt={logo.name}
                width={96}
                height={48}
                className="max-h-10 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
