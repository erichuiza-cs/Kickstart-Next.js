"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import ContentstackLivePreview from "@contentstack/live-preview-utils";
import { usePersonalize } from "../../context/PersonalizeProvider";

type TrendItem = {
  uid: string;
  url: string;
  title: string;
  summary?: string;
  read_time?: number;
};

export default function TrendingHeadlinesCSR() {
  const { sdk, ready } = usePersonalize();
  const [items, setItems] = useState<TrendItem[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!ready) return;
    try {
      const base =
        typeof window !== "undefined" ? window.location.search || "" : "";
      let path = `/api/news/trending${base}`;
      if (sdk) {
        const aliases = sdk.getVariantAliases();
        if (aliases.length) {
          const u = new URL(path, window.location.origin);
          const sp = new URLSearchParams(u.search);
          sp.set("variants", aliases.join(","));
          u.search = sp.toString();
          path = u.pathname + u.search;
        }
      }
      const res = await fetch(path, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load");
      const data = (await res.json()) as TrendItem[];
      setItems(data);
      setErr(null);
    } catch {
      setErr("Could not load trending");
      setItems([]);
    }
  }, [ready, sdk]);

  useEffect(() => {
    void load();
    if (process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW !== "true") return;
    const uid = ContentstackLivePreview.onEntryChange(() => {
      void load();
    });
    return () => {
      ContentstackLivePreview.unsubscribeOnEntryChange(uid);
    };
  }, [load]);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-800">
          Trending
        </h3>
        <span className="shrink-0 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-violet-800">
          CSR
        </span>
      </div>
      <p className="mb-3 text-xs text-slate-500">
        Client fetch; passes Contentstack Personalize variant aliases when the
        SDK is active. Refetches on Live Preview changes.
      </p>
      {err ? (
        <p className="text-sm text-red-600">{err}</p>
      ) : items === null ? (
        <ul className="space-y-3">
          {[1, 2, 3].map((i) => (
            <li
              key={i}
              className="h-4 animate-pulse rounded bg-slate-200"
              style={{ width: `${85 - i * 10}%` }}
            />
          ))}
        </ul>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.uid}>
              <Link
                href={item.url.startsWith("/") ? item.url : `/news/${item.url}`}
                className="text-sm font-semibold text-slate-900 no-underline hover:text-teal-700 hover:underline"
              >
                {item.title}
              </Link>
              {item.summary ? (
                <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                  {item.summary}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
