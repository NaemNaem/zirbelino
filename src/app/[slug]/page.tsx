import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContentRepository } from "@/repositories";

const CONTENT_SLUGS = [
  "ueber-zirbelino",
  "produktion",
  "die-zirbe",
  "versand",
  "zahlung",
  "faq",
  "impressum",
  "datenschutz",
  "agb",
  "kontakt",
  "zertifizierung",
];

export async function generateStaticParams() {
  return CONTENT_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getContentRepository().getPageBySlug(slug);
  if (!page) return { title: "Seite" };
  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || page.excerpt,
  };
}

export default async function ContentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!CONTENT_SLUGS.includes(slug)) notFound();
  const page = await getContentRepository().getPageBySlug(slug);
  if (!page) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
      <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
        {page.type}
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[var(--color-primary-dark)] md:text-5xl">
        {page.title}
      </h1>
      {page.excerpt ? (
        <p className="mt-5 text-lg text-[var(--color-text-muted)]">{page.excerpt}</p>
      ) : null}
      <div className="prose-zirbelino mt-10 whitespace-pre-line text-base leading-relaxed text-[var(--color-text)]">
        {page.body}
      </div>
      {page.source?.originalUrl ? (
        <p className="mt-10 text-xs text-[var(--color-text-muted)]">
          Quelle: {page.source.originalUrl}
        </p>
      ) : null}
    </main>
  );
}
