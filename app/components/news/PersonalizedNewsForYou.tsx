"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import ContentstackLivePreview from "@contentstack/live-preview-utils";
import { usePersonalize } from "../../context/PersonalizeProvider";

type Item = { uid: string; url: string; title: string; headline?: string };

/**
 * Contentstack Personalize: uses active variant aliases on the Delivery API
 * so entries reflect the user’s assigned experience variants.
 */
export default function PersonalizedNewsForYou() {
  const { sdk, ready } = usePersonalize();
  const [items, setItems] = useState<Item[] | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const experienceUid =
    process.env.NEXT_PUBLIC_PERSONALIZE_FOR_YOU_EXPERIENCE_UID || "";

  const load = useCallback(async () => {
    try {
      const sp = typeof window !== "undefined" ? window.location.search : "";
      let url = `/api/news/for-you${sp}`;
      if (sdk) {
        const aliases = sdk.getVariantAliases();
        if (aliases.length) {
          setNote(null);
          const u = new URL(url, window.location.origin);
          u.searchParams.set("variants", aliases.join(","));
          url = u.pathname + u.search;
        } else {
          setNote(
            "No active Personalize variants — showing default Delivery content. Configure experiences in Contentstack Personalize."
          );
        }
      } else if (!process.env.NEXT_PUBLIC_PERSONALIZE_PROJECT_UID) {
        setNote(
          "Set NEXT_PUBLIC_PERSONALIZE_PROJECT_UID to enable Contentstack Personalize."
        );
      } else {
        setNote(null);
      }
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("fetch failed");
      const data = (await res.json()) as Item[];
      setItems(data);
    } catch {
      setItems([]);
    }
  }, [sdk]);

  useEffect(() => {
    if (!ready) return;
    void load();
    if (experienceUid && sdk) {
      void sdk.triggerImpression(experienceUid).catch(() => {});
    }
  }, [ready, sdk, load, experienceUid]);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW !== "true") return;
    const uid = ContentstackLivePreview.onEntryChange(() => {
      void load();
    });
    return () => ContentstackLivePreview.unsubscribeOnEntryChange(uid);
  }, [load]);

  return (
    <div className="mt-6 rounded-lg border border-indigo-200 bg-indigo-50/40 p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-bold uppercase tracking-wide text-indigo-950">
          For you
        </h3>
        <span className="rounded-full bg-indigo-200 px-2 py-0.5 text-[10px] font-bold uppercase text-indigo-900">
          Contentstack Personalize
        </span>
      </div>
      <p className="mb-3 text-xs text-indigo-900/80">
        List is fetched with your active{" "}
        <strong>variant aliases</strong> on the Delivery API (same pattern as
        personalized entries in the CMS).
      </p>
      {note ? (
        <p className="mb-2 rounded border border-amber-200 bg-amber-50 p-2 text-xs text-amber-950">
          {note}
        </p>
      ) : null}
      {items === null ? (
        <ul className="space-y-2">
          {[1, 2, 3].map((i) => (
            <li
              key={i}
              className="h-4 animate-pulse rounded bg-indigo-100"
              style={{ width: `${90 - i * 8}%` }}
            />
          ))}
        </ul>
      ) : (
        <ul className="space-y-3 border-t border-indigo-200/60 pt-3">
          {items.map((item) => (
            <li key={item.uid}>
              <Link
                href={
                  item.url.startsWith("/") ? item.url : `/news/${item.url}`
                }
                className="text-sm font-semibold text-indigo-950 no-underline hover:underline"
              >
                {item.title}
              </Link>
              {item.headline ? (
                <p className="mt-0.5 text-xs text-indigo-800/90">
                  {item.headline}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
