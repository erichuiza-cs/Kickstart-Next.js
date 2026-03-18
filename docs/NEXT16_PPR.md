# Optional: Partial Prerendering with `cacheComponents` (Next.js 16+)

The project uses **stable Next.js** (currently **16.x**). The `/news` **“For you”** block uses **React Suspense** + **`cookies()`** so the personalized region **streams after** the main shell.

**Stronger PPR** (framework-level static shell + dynamic holes) is optional via **`cacheComponents: true`** in `next.config.mjs` (see [Next.js `cacheComponents` docs](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents)). If you enable it:

1. **Root layout:** wrapping the whole app in `PersonalizeProvider` can block prerender of routes like `/[[...slug]]`. Either:
   - scope `PersonalizeProvider` to `app/news/layout.tsx` only, or
   - wrap it in `<Suspense>` in the root layout, or
   - use `'use cache'` on segments that should stay static.
2. Do **not** use deprecated `experimental_ppr` with `cacheComponents`.

The default setup **does not** enable `cacheComponents`, so builds stay straightforward with the global Personalize provider.
