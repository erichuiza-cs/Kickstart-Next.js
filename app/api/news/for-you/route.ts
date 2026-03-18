import { NextRequest, NextResponse } from "next/server";
import { getNewsArticles } from "@/lib/news-contentstack";

function toPreviewRecord(sp: URLSearchParams) {
  const record: Record<string, string | string[]> = {};
  sp.forEach((v, k) => {
    if (k === "variants") return;
    const cur = record[k];
    if (cur === undefined) record[k] = v;
    else if (Array.isArray(cur)) (cur as string[]).push(v);
    else record[k] = [cur as string, v];
  });
  return record;
}

/**
 * Personalized news_for_you: pass Contentstack Personalize variant aliases
 * (from sdk.getVariantAliases()) so Delivery returns variant-specific entries.
 */
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const record = toPreviewRecord(sp);
  const raw = sp.get("variants");
  const variantAliases = raw
    ? raw.split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  const articles = await getNewsArticles(
    record,
    8,
    variantAliases.length ? variantAliases : null
  );
  const safe = articles.map((a) => ({
    uid: a.uid,
    url: a.url,
    title: a.title,
    headline: a.headline,
  }));
  return NextResponse.json(safe);
}
