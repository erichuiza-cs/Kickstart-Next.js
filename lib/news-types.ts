/** Normalized shapes for news_page → UI */

export interface NewsImage {
  url: string;
  title: string;
  $?: Record<string, unknown>;
}

export interface NewsArticle {
  uid: string;
  url: string;
  title: string;
  headline?: string;
  summary?: string;
  body?: string;
  expert_commentary?: string;
  publish_date?: string;
  read_time?: number;
  image?: NewsImage | null;
  /** Taxonomy / specialty hints (e.g. from `specialties`) */
  specialtyTerms?: string[];
  key_takeaways?: string[];
  authored_by?: string;
  disclosures?: string[];
  $?: Record<string, unknown>;
}

export interface NewsLanding {
  uid: string;
  title: string;
  description?: string;
  url: string;
  $?: Record<string, unknown>;
}

/** Full path under /news/... matching Contentstack URL pattern */
export function newsPathFromSegments(segments: string[]): string {
  return `/news/${segments.map((s) => s.replace(/^\/+/, "")).join("/")}`;
}
