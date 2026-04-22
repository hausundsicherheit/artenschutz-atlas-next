# Artenschutz-Atlas Next.js

Programmatic SEO Atlas für 10.953 Kommunen Deutschlands.

## Stack

- **Framework:** Next.js 15 (App Router) + React 19
- **TypeScript:** strict
- **Styling:** Tailwind CSS 3 + Atlas Design Tokens
- **Daten:** Supabase Wissensdatenbank (`wsubvpdyakzpnapgsrnm`)
- **Deployment:** Vercel (ISR, revalidate=86400)

## Routing

| Pfad | Beschreibung | Caching |
|---|---|---|
| `/` | Startseite mit Top-12 Städten | ISR 1h |
| `/[slug]` | Dynamic Route je Kommune | ISR 24h, on-demand long tail |

## ENV

```bash
NEXT_PUBLIC_SUPABASE_ANON_KEY=...   # Wissensdatenbank Public Key
```

## Build

```bash
npm install
npm run build      # generateStaticParams pre-rendered Top-20 Städte
npm start
```

## Deployment

- **Vercel-Projekt:** wird via API angelegt
- **Domain:** atlas.artgerecht-bauen.com
- **GitHub:** hausundsicherheit/artenschutz-atlas-next (main)

## Datenfluss

```
SW6 atgerecht-bauen.com → atlas_art_produkte (Junction)
                          ↓
                    Supabase Wissensdatenbank
                          ↓
                  lib/queries.ts (typed, REST)
                          ↓
                  Next.js Server Components (ISR)
                          ↓
                       Vercel Edge
```

## Komponenten

- `Header`, `Footer` — Layout-Wrapper
- `HeroSection` — Stats, CTAs, Pflichten-Card (Server)
- `ArtGrid` — 6-Tiergruppen mit Color-Coding (Server)
- `SolutionsSection` — Verfügbare + geplante Produkte (Server, DB-driven)
- `MobileShopBar` — Sticky-Bar Mobile (Client, Scroll-Logik)

Siehe Notion: <https://www.notion.so/34a7dc57c5e881738b0af3fd1ad7d718>
