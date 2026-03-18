import Link from "next/link";
import Image from "next/image";
import type { NewsArticle } from "@/lib/news-types";

export default function HeadlineCard({ article }: { article: NewsArticle }) {
  const href = article.url.startsWith("/") ? article.url : `/news/${article.url}`;
  const meta = [
    article.publish_date,
    article.read_time != null ? `${article.read_time} min read` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="group border-b border-slate-200 bg-white px-4 py-5 transition hover:bg-slate-50 sm:px-6">
      <div className="mx-auto flex max-w-4xl gap-4">
        {article.image?.url ? (
          <Link href={href} className="relative h-24 w-32 shrink-0 overflow-hidden rounded bg-slate-100 no-underline sm:h-28 sm:w-40">
            <Image
              src={article.image.url}
              alt={article.image.title || article.title}
              fill
              className="object-cover"
              sizes="160px"
              {...(article.image.$?.url as object)}
            />
          </Link>
        ) : (
          <div className="hidden h-24 w-32 shrink-0 rounded bg-gradient-to-br from-teal-100 to-slate-200 sm:block sm:h-28 sm:w-40" />
        )}
        <div className="min-w-0 flex-1">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-teal-700">
            Headline News
          </p>
          <h2 className="text-lg font-bold leading-snug text-slate-900 sm:text-xl">
            <Link
              href={href}
              className="text-inherit no-underline group-hover:text-teal-800 group-hover:underline"
              {...(article.$?.title as object)}
            >
              {article.title}
            </Link>
          </h2>
          {article.summary || article.headline ? (
            <p
              className="mt-2 line-clamp-2 text-sm text-slate-600"
              {...((article.$?.headline ?? article.$?.summary) as object)}
            >
              {article.summary || article.headline}
            </p>
          ) : null}
          {meta ? (
            <p className="mt-2 text-xs text-slate-500">{meta}</p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
