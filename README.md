
Personal Portfolio
================================

Modern React (TanStack Router) single-page app served by a Cloudflare Worker with smart placement and a strict CSP. The Worker serves static assets and exposes a few APIs for contact, Last.fm, and runtime metadata.

Tech stack
----------
- React 19, TypeScript, Vite 7
- TanStack Router/Start (SPA build) + vite-tsconfig-paths
- Tailwind CSS v4, Radix UI primitives, Iconify
- Cloudflare Workers ([assets] binding) + Smart Placement
- Biome (lint/format), Vitest (tests)

Local development
-----------------
- SPA only (fast HMR): Vite dev server for the SPA (http://localhost:5174)

```bash
pnpm dev:spa
```

- Full Worker preview (serves assets + APIs): builds SPA+Worker, then runs wrangler dev (http://127.0.0.1:8787)

```bash
pnpm cf:workers:dev
```

Build
-----
- SPA only:

```bash
pnpm build:spa
```

- Worker bundle (includes SPA build + worker):

```bash
pnpm build:worker
```

Deploy (Cloudflare Workers)
---------------------------
The Worker entry is `dist/worker.mjs` and serves static assets from `.tanstack/start/build/client-dist` via the `ASSETS` binding configured in `wrangler.toml`.

Typical flow:

```bash
wrangler login
```

```bash
pnpm cf:workers:deploy
```

Environment variables
---------------------
Set non-secrets under `[vars]` in `wrangler.toml`. Set secrets via `wrangler secret put NAME` or the Cloudflare dashboard.

Important values:
- Public (client, must be prefixed VITE_)
  - VITE_APP_TITLE, VITE_APP_DESCRIPTION, VITE_APP_AUTHOR, etc.
  - VITE_REPO_URL – public repo URL, used to link the commit badge
  - VITE_TURNSTILE_SITE_KEY – optional Turnstile site key
  - Socials: VITE_SOCIALS_GITHUB, VITE_SOCIALS_X, etc.
- Server-only (no VITE_ prefix)
  - DISCORD_WEBHOOK – Discord webhook for contact form
  - TURNSTILE_SECRET – Turnstile secret (optional)
  - LASTFM_API_KEY, LASTFM_USER – enable Last.fm proxy
- Commit display
  - VITE_COMMIT_SHA or COMMIT_SHA – if set, footer shows this short SHA
  - If not set, the client falls back to GitHub’s public API to fetch the latest short SHA when VITE_REPO_URL is public.

APIs (Worker)
-------------
All endpoints are CORS-enabled for this site.

- POST /api/contact
  - Body: { name, email, subject, message, turnstileToken? }
  - Turnstile verification is attempted if TURNSTILE_SECRET is set
  - Rate limiting: uses KV if bound (RATE_LIMIT_KV), otherwise a short in-memory window
  - Sends an embed to DISCORD_WEBHOOK on success

- GET /api/lastfm
  - Proxies Last.fm to avoid exposing the API key
  - Requires LASTFM_API_KEY and LASTFM_USER (or their VITE_ variants)
  - If not configured, returns 200 with { track: null } (quiet in dev)

- GET /api/placement
  - Returns Cloudflare placement info (header or colo/country/city) and the commit short SHA when available

Security headers / CSP
----------------------
The CSP is defined in `public/_headers` and copied into the built client assets. Highlights:
- No 'unsafe-eval' or wasm-eval allowed
- connect-src allows only required origins (api.github.com, iTunes, Iconify, Last.fm, etc.)
- img-src includes https: data: blob:
- frame-src limited to Turnstile

Testing, linting, formatting
---------------------------
Run with:

```bash
pnpm test
pnpm lint
pnpm format
pnpm check
```

Notes & gotchas
---------------
- Last.fm: without credentials, the Now Playing card shows a friendly fallback; iTunes lookups are tried client-side for better album art.
- Commit badge: shows “Commit: abcdefg” and “Edge: <colo/dev>”. If env commit is missing, the client calls GitHub’s API (public repos only).
- Fonts are fetched during build by `scripts/fetch-fonts.mjs`.

Licensing
---------
- Code is licensed under the MIT License. See `LICENSE.md`.
- Site content and branding are All Rights Reserved. See `LICENSE-CONTENT.md`.
- Third‑party licenses are listed in `NOTICE.md`.

Folder map (high level)
-----------------------
- public/ – static assets and `_headers` (CSP)
- src/components – UI components (Footer, Header, forms, media, etc.)
- src/routes – TanStack Router SPA routes
- src/worker.ts – Cloudflare Worker entry (assets + APIs)
- wrangler.toml – Worker configuration, assets binding, KV, vars
- vite.spa.config.ts / vite.worker.config.ts – separate SPA/Worker builds

Copyright
---------
© 2025 Nova Bowley
