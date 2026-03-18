import type { NewsArticle, NewsLanding } from "./news-types";

export const FALLBACK_LANDING: NewsLanding = {
  uid: "fallback-landing",
  url: "/news",
  title: "Headline News",
  description:
    "Connect Contentstack entries of type **news_page** (see docs/CT_MAPPING.md). URLs follow your stack pattern, e.g. /news/2026/03/18/article-slug.",
};

const DEMO_DATE = "2026/03/18";

export const FALLBACK_ARTICLES: NewsArticle[] = [
  {
    uid: "fb1",
    url: `/news/${DEMO_DATE}/fda-reproxalap-dry-eye`,
    title: "For third time, FDA does not approve reproxalap for dry eye disease",
    headline: "Aldeyra Therapeutics press release",
    summary:
      "The FDA has declined to approve reproxalap for dry eye disease, according to a press release from Aldeyra Therapeutics.",
    publish_date: "2026-03-18",
    specialtyTerms: ["ophthalmology"],
  },
  {
    uid: "fb2",
    url: `/news/${DEMO_DATE}/icotrokinra-plaque-psoriasis`,
    title: "FDA approves icotrokinra, first oral peptide for plaque psoriasis",
    headline: "Johnson & Johnson announcement",
    summary:
      "The FDA approved icotrokinra for adults and adolescents 12+ with moderate to severe plaque psoriasis.",
    publish_date: "2026-03-18",
    specialtyTerms: ["dermatology"],
  },
  {
    uid: "fb3",
    url: `/news/${DEMO_DATE}/orthopedic-tka-trends`,
    title: "Orthopedic trend toward cementless fixation in total knee arthroplasty",
    headline: "Meeting coverage",
    summary:
      "Between 2012 and 2023, TKA saw a trend toward cementless fixation and unresurfaced patellae.",
    publish_date: "2026-03-18",
    specialtyTerms: ["orthopedics"],
  },
  {
    uid: "fb4",
    url: `/news/${DEMO_DATE}/cdc-director-public-health`,
    title: "US less safe without permanent CDC director, experts warn",
    headline: "Public health",
    summary:
      "Turnover atop the CDC continues to draw concern from public health experts.",
    publish_date: "2026-03-18",
    specialtyTerms: ["primary care"],
  },
];

const FALLBACK_BODIES: Record<string, string> = {
  "fda-reproxalap-dry-eye": `<p>The FDA has, for a third time, declined to approve reproxalap for the treatment of dry eye disease, according to a press release from Aldeyra Therapeutics.</p><p>Add a <strong>news_page</strong> entry in Contentstack to replace this demo copy.</p>`,
  "icotrokinra-plaque-psoriasis": `<p>The FDA approved icotrokinra for adults and adolescents aged 12 years and older with moderate to severe plaque psoriasis, Johnson & Johnson announced.</p>`,
  "orthopedic-tka-trends": `<p>Between 2012 and 2023, there was a trend in total knee arthroplasty toward cementless fixation and an unresurfaced patellae, according to results presented at a major meeting.</p>`,
  "cdc-director-public-health": `<p>Experts continue to discuss leadership stability at the CDC and its impact on national public health readiness.</p>`,
};

export function fallbackBodyForPath(segments: string[]): string {
  const last = segments[segments.length - 1] || "";
  return FALLBACK_BODIES[last] ?? `<p>No matching <code>news_page</code> entry for <code>/news/${segments.join("/")}</code>.</p>`;
}
