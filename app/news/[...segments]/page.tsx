import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import { getNewsPageByPath } from "@/lib/news-contentstack";
import { newsPathFromSegments } from "@/lib/news-types";
import NewsDemoBadge from "../../components/news/NewsDemoBadge";

function parseVariants(
  sp: Record<string, string | string[] | undefined>
): string[] | null {
  const raw = sp.variants ?? sp.personalize_variants;
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (!v || typeof v !== "string") return null;
  const aliases = v.split(",").map((s) => s.trim()).filter(Boolean);
  return aliases.length ? aliases : null;
}

export default async function NewsArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ segments: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { segments } = await params;
  const sp = await searchParams;
  const path = newsPathFromSegments(segments);
  const variants = parseVariants(sp);
  const article = await getNewsPageByPath(path, sp, variants);

  if (!article) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Article not found</h1>
        <Link href="/news" className="mt-4 inline-block text-teal-700">
          ← Back to News
        </Link>
      </main>
    );
  }

  const meta = [article.publish_date, article.authored_by]
    .filter(Boolean)
    .join(" · ");

  const html = article.body || "";

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-4 flex flex-wrap gap-2">
        <NewsDemoBadge label="SSR · news_page" />
        {variants?.length ? (
          <NewsDemoBadge label="Personalize variants (query)" />
        ) : null}
      </div>
      <Link
        href="/news"
        className="mb-6 inline-block text-sm font-medium text-teal-700 no-underline hover:underline"
      >
        ← Headline News
      </Link>
      <header className="mb-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-teal-700">
          News
        </p>
        <h1
          className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl"
          {...(article.$?.title as object)}
        >
          {article.title}
        </h1>
        {article.headline ? (
          <p className="mt-2 text-xl text-slate-600" {...(article.$?.headline as object)}>
            {article.headline}
          </p>
        ) : null}
        {meta ? <p className="mt-3 text-sm text-slate-500">{meta}</p> : null}
      </header>
      {article.key_takeaways && article.key_takeaways.length > 0 ? (
        <aside className="mb-8 rounded-lg border border-teal-100 bg-teal-50/50 p-4">
          <h2 className="mb-2 text-sm font-bold uppercase text-teal-900">
            Key takeaways
          </h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-800">
            {article.key_takeaways.map((k, i) => (
              <li key={i}>{k}</li>
            ))}
          </ul>
        </aside>
      ) : null}
      {html ? (
        <div
          className="prose prose-slate max-w-none prose-headings:font-bold prose-a:text-teal-700"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(html),
          }}
          {...(article.$?.copy as object)}
        />
      ) : (
        <p className="text-slate-600">No copy content.</p>
      )}
      {article.expert_commentary ? (
        <section className="mt-10 border-t border-slate-200 pt-8">
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            Expert commentary
          </h2>
          <div
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(article.expert_commentary),
            }}
          />
        </section>
      ) : null}
      {article.disclosures && article.disclosures.length > 0 ? (
        <footer className="mt-10 text-xs text-slate-500">
          <p className="font-semibold text-slate-600">Disclosures</p>
          <ul className="mt-1 list-disc pl-4">
            {article.disclosures.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </footer>
      ) : null}
    </article>
  );
}
