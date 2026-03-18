import { NextRequest, NextResponse } from "next/server";
import { getTrendingArticles } from "@/lib/news-contentstack";

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

function parseVariants(sp: URLSearchParams): string[] | null {
  const v = sp.get("variants");
  if (!v) return null;
  const aliases = v.split(",").map((s) => s.trim()).filter(Boolean);
  return aliases.length ? aliases : null;
}

/** CSR widget: forwards preview query + optional Personalize variant aliases to Delivery API */
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const record = toPreviewRecord(sp);
  const variants = parseVariants(sp);
  const articles = await getTrendingArticles(record, 6, variants);
  const safe = articles.map((a) => ({
    uid: a.uid,
    url: a.url,
    title: a.title,
    summary: a.summary,
    read_time: a.read_time,
  }));
  return NextResponse.json(safe);
}
