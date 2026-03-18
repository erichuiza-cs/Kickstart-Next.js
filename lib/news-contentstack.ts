import contentstack, { QueryOperation } from "@contentstack/delivery-sdk";
import { jsonToHTML } from "@contentstack/utils";
import { stack } from "./contentstack";
import type { NewsArticle, NewsLanding } from "./news-types";
import {
  FALLBACK_ARTICLES,
  FALLBACK_LANDING,
  fallbackBodyForPath,
} from "./news-fallback";

const CT_NEWS_PAGE = "news_page";

const REFS = [
  "authored_by",
  "fact_checked_by",
  "researchers",
  "perspective.perspective_from",
] as const;

function applyPreview(
  searchParams?: Record<string, string | string[] | undefined>
) {
  if (searchParams && Object.keys(searchParams).length > 0) {
    stack.livePreviewQuery(
      searchParams as unknown as Parameters<typeof stack.livePreviewQuery>[0]
    );
  }
}

function withVariants(q: any, variantAliases?: string[] | null) {
  if (variantAliases?.length) {
    return q.variants(variantAliases);
  }
  return q;
}

function isJsonRte(val: unknown): boolean {
  return (
    typeof val === "object" &&
    val !== null &&
    "children" in val &&
    Array.isArray((val as { children: unknown }).children)
  );
}

function enrichJsonRteFields(entry: Record<string, unknown>) {
  const paths: string[] = [];
  if (isJsonRte(entry.copy)) paths.push("copy");
  const persp = entry.perspective as Record<string, unknown> | undefined;
  if (persp && isJsonRte(persp.expert_commentary)) {
    paths.push("perspective.expert_commentary");
  }
  if (paths.length) {
    try {
      jsonToHTML({ entry: entry as any, paths });
    } catch {
      /* keep raw if serializer fails */
    }
  }
}

function refTitle(ref: unknown): string | undefined {
  if (!ref) return undefined;
  const r = Array.isArray(ref) ? ref[0] : ref;
  if (r && typeof r === "object" && "title" in r) {
    return String((r as { title: string }).title);
  }
  return undefined;
}

function extractSpecialtyTerms(entry: any): string[] {
  const t = entry.taxonomies;
  if (!t) return [];
  const out: string[] = [];
  const pushTerms = (arr: unknown) => {
    if (!Array.isArray(arr)) return;
    for (const item of arr) {
      if (typeof item === "string") out.push(item.toLowerCase());
      else if (item && typeof item === "object") {
        const n = (item as { name?: string; uid?: string }).name;
        const u = (item as { uid?: string }).uid;
        if (n) out.push(String(n).toLowerCase());
        else if (u) out.push(String(u).toLowerCase());
      }
    }
  };
  if (Array.isArray(t)) {
    for (const block of t) {
      if (block?.taxonomy_uid === "specialties" && block.terms) {
        pushTerms(block.terms);
      }
    }
  } else if (typeof t === "object") {
    const specs = (t as Record<string, unknown>).specialties;
    if (Array.isArray(specs)) pushTerms(specs);
  }
  return [...new Set(out)];
}

function mapNewsPageEntry(entry: any): NewsArticle {
  const clone = JSON.parse(JSON.stringify(entry)) as Record<string, unknown>;
  enrichJsonRteFields(clone);

  const copy = clone.copy;
  const body =
    typeof copy === "string"
      ? copy
      : copy
        ? JSON.stringify(copy)
        : "";
  const persp = clone.perspective as Record<string, unknown> | undefined;
  const expert =
    typeof persp?.expert_commentary === "string"
      ? persp.expert_commentary
      : "";

  const pub = clone.publication_date as string | undefined;
  const sd = clone.sources_disclosures as
    | { disclosures?: string[] }
    | undefined;
  const disclosures = sd?.disclosures;

  const rawUrl = String(clone.url || "");
  const url = rawUrl.startsWith("/") ? rawUrl : `/${rawUrl.replace(/^\//, "")}`;

  return {
    uid: String(clone.uid),
    url,
    title: String(clone.title || ""),
    headline: clone.headline ? String(clone.headline) : undefined,
    summary: clone.headline
      ? String(clone.headline)
      : body
        ? body.replace(/<[^>]+>/g, "").slice(0, 220)
        : undefined,
    body,
    expert_commentary: expert || undefined,
    publish_date: pub,
    specialtyTerms: extractSpecialtyTerms(clone),
    key_takeaways: Array.isArray(clone.key_takeaways)
      ? (clone.key_takeaways as string[])
      : undefined,
    authored_by: refTitle(clone.authored_by),
    disclosures: Array.isArray(disclosures) ? disclosures : undefined,
    $: clone.$ as Record<string, unknown>,
  };
}

async function safeFind<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch {
    return null;
  }
}

export async function getNewsLanding(
  _searchParams?: Record<string, string | string[] | undefined>
): Promise<NewsLanding> {
  return { ...FALLBACK_LANDING };
}

export async function getNewsArticles(
  searchParams?: Record<string, string | string[] | undefined>,
  limit = 12,
  variantAliases?: string[] | null
): Promise<NewsArticle[]> {
  applyPreview(searchParams);
  const base = stack.contentType(CT_NEWS_PAGE).entry().query() as any;
  base.includeReference(...REFS).includeEmbeddedItems();
  const q = withVariants(base, variantAliases)
    .orderByDescending("publication_date")
    .limit(limit);
  const result = await safeFind(() => q.find());
  const entries = (result as { entries?: any[] } | null)?.entries;
  if (!entries?.length) return FALLBACK_ARTICLES.map((a) => ({ ...a }));

  return entries.map((e) => {
    if (process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === "true") {
      contentstack.Utils.addEditableTags(e as any, CT_NEWS_PAGE, true);
    }
    return mapNewsPageEntry(e);
  });
}

export async function getNewsPageByPath(
  path: string,
  searchParams?: Record<string, string | string[] | undefined>,
  variantAliases?: string[] | null
): Promise<NewsArticle | null> {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  applyPreview(searchParams);

  const runQuery = async (urlValue: string) => {
    const base = stack.contentType(CT_NEWS_PAGE).entry().query() as any;
    const chained = base
      .includeReference(...REFS)
      .includeEmbeddedItems()
      .where("url", QueryOperation.EQUALS, urlValue);
    const q = withVariants(chained, variantAliases);
    return safeFind(() => q.find());
  };

  let result = await runQuery(normalized);
  let entry = (result as { entries?: any[] } | null)?.entries?.[0];

  if (!entry && normalized.split("/").length > 2) {
    const alt = normalized.replace(/\/0(\d)\//g, "/$1/");
    if (alt !== normalized) {
      result = await runQuery(alt);
      entry = (result as { entries?: any[] } | null)?.entries?.[0];
    }
  }

  if (!entry) {
    const segments = normalized.replace(/^\/news\/?/, "").split("/").filter(Boolean);
    const fb = FALLBACK_ARTICLES.find(
      (a) => a.url === normalized || a.url.endsWith(segments.join("/"))
    );
    if (fb) {
      return {
        ...fb,
        body: fb.body || fallbackBodyForPath(segments),
      };
    }
    return {
      uid: "missing",
      url: normalized,
      title: "Article",
      body: fallbackBodyForPath(segments),
    };
  }

  if (process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === "true") {
    contentstack.Utils.addEditableTags(entry as any, CT_NEWS_PAGE, true);
  }
  return mapNewsPageEntry(entry);
}

export async function getTrendingArticles(
  searchParams?: Record<string, string | string[] | undefined>,
  limit = 6,
  variantAliases?: string[] | null
): Promise<NewsArticle[]> {
  const list = await getNewsArticles(searchParams, Math.max(limit, 8), variantAliases);
  return list.slice(0, limit);
}
