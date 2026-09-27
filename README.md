# Jalaram Feeds ERP — Portfolio Case Study

A polished, single-page case-study website for the Jalaram Feeds ERP project — a full-scale
ERP for an animal-feed manufacturer, migrated from Google Apps Script to Cloudflare Workers + D1.

**Live preview**: TBD (deploy to Cloudflare Pages — see below)
**Companion PDF**: [`/public/Jalaram_Feeds_ERP_Case_Study.pdf`](public/Jalaram_Feeds_ERP_Case_Study.pdf) — 17 pages, 301 KB

---

## Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS 4
- **UI**: Lucide icons, custom components
- **Fonts**: Geist Sans + Geist Mono (via `next/font/google`)
- **Theme**: Crystal Blue (matches the PDF cover — Template 07)

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Single-page portfolio (Hero + 6 sections)
│   └── globals.css         # Tailwind + Crystal Blue palette
├── components/ui/          # shadcn/ui (pre-installed)
├── lib/
│   ├── db.ts               # Prisma client (unused in this portfolio)
│   └── utils.ts            # cn() helper
└── hooks/

public/
├── Jalaram_Feeds_ERP_Case_Study.pdf   # Downloadable 17-page case study
├── logo.svg
└── robots.txt
```

## Sections

1. **Hero** — title, subtitle, 4 headline stats (6 workers, 8 DBs, 22k lines, 39 tests)
2. **Architecture** — the Gate pattern diagram + 6-worker inventory table
3. **Features** — 4 deep dives: WhatsApp PDF fallback, Sahayak AI, Day End screenshot, Mobile Link
4. **Migration** — gas-shim.js proxy pattern + before/after table
5. **Engineering** — 39 tests, lazy senior dev philosophy, B-number changelog, code snippet
6. **Tech stack** — 16 badges
7. **Contact** — Abhinav Randai · GitHub · LinkedIn · Email · Phone

## Local Development

```bash
bun install        # install deps
bun run dev        # dev server on port 3000
bun run lint       # ESLint check
bun run build      # production build (do NOT use for Cloudflare deployment)
```

## Deploy to Cloudflare Pages

This site is fully static-friendly and can be deployed to Cloudflare Pages with the
[Next.js on Pages adapter](https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/).

### Option A — Cloudflare Pages (recommended, free for personal sites)

1. Push this repo to GitHub (it's git-ready — see `.gitignore`).
2. Log in to Cloudflare Dashboard → Pages → Create project → Connect to Git.
3. Pick this repo. Configure:
   - **Framework preset**: Next.js
   - **Build command**: `npx @cloudflare/next-on-pages`
   - **Build output directory**: `.vercel/output/static`
   - **Environment variables** (add):
     - `NEXT_ON_PAGES_VERSION` = `latest`
4. Click **Deploy**. Wait for first build to finish (~2-3 min).
5. Your site will be live at `https://<project-name>.pages.dev`.

### Option B — Wrangler CLI

```bash
# One-time setup
npm install -g wrangler
wrangler login

# Build with the Cloudflare adapter
npx @cloudflare/next-on-pages

# Deploy
wrangler pages deploy .vercel/output/static --project-name=jf-erp-portfolio
```

### Option C — Static export (simplest, but loses some Next.js features)

Add to `next.config.ts`:
```ts
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
}
```
Then:
```bash
bun run build
# Deploy `out/` to any static host (Cloudflare Pages, Netlify, Vercel, GitHub Pages)
```

## Customization Notes

- **Personal contact info**: All contact details (email, LinkedIn, GitHub, phone) are placeholders
  in `src/app/page.tsx`. Replace them with your real values before deploying.
- **PDF**: The 17-page case study PDF is bundled in `public/`. Regenerate it via the build
  scripts in `/scripts/` (not deployed, but kept in repo as backup artifacts).
- **Theme colors**: Crystal Blue palette is defined as a constant at the top of `page.tsx`.
  Change `COLORS` object to retheme the entire site.

## Author

**Abhinav Randai**
- GitHub: [github.com/Abhinavrandai](https://github.com/Abhinavrandai)
- LinkedIn: [linkedin.com/in/abhinavrandai](https://linkedin.com/in/abhinavrandai)
- Email: abhinavrandai@gmail.com

---

September 2026 · v1.0
