# Contentstack Kickstart: Next.js

Contentstack Kickstarts are the minimum amount of code needed to connect to Contentstack.
This kickstart covers the following items:

- SDK initialization
- Live preview and Visual building setup

More details about this codebase can be found on the [Contentstack docs](https://www.contentstack.com/docs/developers).

[![Join us on Discord](https://img.shields.io/badge/Join%20Our%20Discord-7289da.svg?style=flat&logo=discord&logoColor=%23fff)](https://community.contentstack.com)

## How to get started

Before you can run this code, you will need a Contentstack "Stack" to connect to.
Follow the following steps to seed a Stack that this codebase understands.

> If you installed this Kickstart via the Contentstack Markertplace or the new account onboarding, you can skip this step.

### Install the CLI

```bash
npm install -g @contentstack/cli
```

#### Using the CLI for the first time?

It might ask you to set your default region.
You can get all regions and their codes [here](https://www.contentstack.com/docs/developers/cli/configure-regions-in-the-cli) or run `csdx config:get:region`.

> Beware, Free Contentstack developer accounts are bound to the EU region. We still use the CDN the API is lightning fast.

Set your region like so:

```bash
csdx config:set:region EU
```

### Log in via the CLI

```bash
csdx auth:login
```

### Get your organization UID

In your Contentstack Organization dashboard find `Org admin` and copy your Organization ID (Example: `blt481c598b0d8352d9`).

### Create a new stack

Make sure to replace `<YOUR_ORG_ID>` with your actual Organization ID and run the below.

```bash
csdx cm:stacks:seed --repo "contentstack/kickstart-stack-seed" --org "<YOUR_ORG_ID>" -n "Kickstart Stack"
```

## Create a new delivery token.

Go to `Settings > Tokens` and create a delivery token. Select the `preview` scope and turn on `Create preview token`

## Fill out your .env file.

Now that you have a delivery token, you can fill out the .env file in your codebase.

> You can find the API key, Delivery Token and Preview Token in Settings > Tokens > Your token.

```
NEXT_PUBLIC_CONTENTSTACK_API_KEY=<YOUR_API_KEY>
NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN=<YOUR_DELIVERY_TOKEN>
NEXT_PUBLIC_CONTENTSTACK_PREVIEW_TOKEN=<YOUR_PREVIEW_TOKEN>
NEXT_PUBLIC_CONTENTSTACK_REGION=EU
NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT=preview
NEXT_PUBLIC_CONTENTSTACK_PREVIEW=true
```

## Turn on Live Preview

Go to Settings > Live Preview. Click enable and select the `Preview` environment in the drop down. Hit save.

## Install the dependencies

```bash
npm install
```

### Run your app

```bash
npm run dev
```

### See your page visually

### In the browser

Go to `http://localhost:3000`.

#### In the CMS

Go to Entries and select the only entry in the list.
In the sidebar, click on the live preview icon.
Or, see your entry in the visual builder

---

## Healio-inspired news demo (`/news`)

Uses Content Type **`news_page`** (see [docs/CT_MAPPING.md](docs/CT_MAPPING.md)).

| Area | Mode | Description |
|------|------|-------------|
| Landing + article pages | **SSR** | Fetches `news_page` entries; **JSON RTE** `copy` / `perspective.expert_commentary` → HTML via `@contentstack/utils`. Optional `?variants=alias1,alias2` for **Personalize** variant content on articles. |
| **Trending** | **CSR** | `/api/news/trending` + **Personalize** `getVariantAliases()` when the SDK is active. Live Preview refetch on entry change. |
| **For you** | **CSR + Personalize** | `/api/news/for-you` with variant aliases so Delivery returns **personalized entry variants**. |

**URLs** (match stack URL pattern `news/:year/:month/:day/:title`):

- Landing: `/news`
- With CMS: `/news/2026/03/18/your-entry-slug` (exact `url` field on the entry)
- Fallback demos: `/news/2026/03/18/fda-reproxalap-dry-eye` etc.

**Contentstack Personalize**

```env
NEXT_PUBLIC_PERSONALIZE_PROJECT_UID=<project_uid>
# Optional: impression when “For you” renders (experience short UID, e.g. a)
NEXT_PUBLIC_PERSONALIZE_FOR_YOU_EXPERIENCE_UID=a
# Optional: attribute key for specialty chips (must exist in Personalize)
NEXT_PUBLIC_PERSONALIZE_SPECIALTY_ATTR=specialty
```

`PersonalizeProvider` loads **`@contentstack/personalize-edge-sdk`** in the root layout.
