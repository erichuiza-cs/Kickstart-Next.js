# Content type: `news_page` (News Page)

This app is wired to your **News Page** content type (`uid: news_page`).

## Schema summary (from stack)

| Field UID | Type | App usage |
|-----------|------|-----------|
| `title` | Text (unique) | List + article H1 |
| `url` | Text | Must match generated page URL (see below) |
| `headline` | Text | Deck / card summary |
| `publication_date` | Date | Meta line, sort order |
| `authored_by` | Reference → author | Byline |
| `fact_checked_by` | Reference → author | (available for future UI) |
| `researchers` | Reference (multiple) | (available for future UI) |
| `key_takeaways` | Text (multiple) | Article aside list |
| `copy` | JSON (JSON RTE) | Main body → HTML via `@contentstack/utils` |
| `perspective` | Group | `expert_commentary` (JSON RTE) rendered below body |
| `sources_disclosures` | Group | `disclosures` text list in footer |
| `taxonomies` | Taxonomy | `specialties` terms used for filtering / Personalize attributes |

## URL pattern

Stack option: **`url_pattern`** `news/:year/:month/:day/:title`, **`url_prefix`** `/`.

Example entry URL: **`/news/2026/03/18/my-article-slug`**

Next.js route: **`/news/[...segments]`** — the app joins segments and queries Contentstack with `where('url', EQUALS, '/news/2026/03/18/my-article-slug')`.

If your stack generates single-digit months without a leading zero, the app also tries an alternate path when the first query misses.

## Contentstack Personalize

1. **Delivery API variants:** `sdk.getVariantAliases()` is sent as the `variants` query param to `/api/news/trending`, `/api/news/for-you`, and can be passed as `?variants=` on article pages for SSR variant content.
2. **Env:** `NEXT_PUBLIC_PERSONALIZE_PROJECT_UID`, optional `NEXT_PUBLIC_PERSONALIZE_FOR_YOU_EXPERIENCE_UID` (short UID, e.g. `a`) for impressions on the “For you” block.
3. **Specialty chips:** `NEXT_PUBLIC_PERSONALIZE_SPECIALTY_ATTR` (default `specialty`) must exist as a user attribute in Personalize if you use the specialty picker with `sdk.set`.

## Live Preview

Pass through `searchParams` on all server fetches; enable preview in `.env` as for the rest of the kickstart.
