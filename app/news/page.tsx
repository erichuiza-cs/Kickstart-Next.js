import { Suspense } from "react";
import { getNewsLanding, getNewsArticles } from "@/lib/news-contentstack";
import HeadlineCard from "../components/news/HeadlineCard";
import NewsDemoBadge from "../components/news/NewsDemoBadge";
import TrendingHeadlinesCSR from "../components/news/TrendingHeadlinesCSR";
import PersonalizedNewsForYou from "../components/news/PersonalizedNewsForYou";
import SpecialtyPicker from "../components/news/SpecialtyPicker";

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const landing = await getNewsLanding(sp);
  const articles = await getNewsArticles(sp, 12);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <NewsDemoBadge label="SSR · landing + list" />
      </div>
      <header className="mb-8 border-b border-slate-200 pb-6">
        <p className="mb-2 text-sm font-medium text-teal-700">News</p>
        <h1
          className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
          {...(landing.$?.title as object)}
        >
          {landing.title}
        </h1>
        {landing.description ? (
          <p
            className="mt-3 max-w-3xl text-lg text-slate-600"
            {...(landing.$?.description as object)}
          >
            {landing.description}
          </p>
        ) : null}
      </header>

      <Suspense fallback={<div className="mb-6 h-24 animate-pulse rounded-lg bg-slate-200" />}>
        <SpecialtyPicker />
      </Suspense>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <section>
          <h2 className="mb-0 bg-white px-4 py-3 text-lg font-bold text-slate-900 sm:px-6">
            Headline News
          </h2>
          <div className="overflow-hidden rounded-t-lg border border-b-0 border-slate-200 bg-white shadow-sm">
            {articles.map((article) => (
              <HeadlineCard key={article.uid} article={article} />
            ))}
          </div>
        </section>

        <aside className="space-y-6 lg:sticky lg:top-4 lg:self-start">
          <TrendingHeadlinesCSR />
          <PersonalizedNewsForYou />
        </aside>
      </div>
    </main>
  );
}
