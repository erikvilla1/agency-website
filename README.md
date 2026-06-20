# IWA MEDIA — Agency Website (iwamedia.com)

Minimal, monochrome agency site (design ref: kaisaucedo.com). React + TypeScript + Vite + Tailwind v4.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build (tsc + vite)
```

## Structure

- `/` — single-page home: Hero, About/Team, Services, Portfolio, CTA, Contact
- `/book` — consultation booking page

```
src/
├── components/{layout,common,sections,forms}/
├── pages/          Home.tsx, Book.tsx
└── lib/
    ├── types.ts            data contracts (mirror future Supabase schema)
    ├── data/placeholders.ts  PLACEHOLDER content — edit real copy here
    └── api/index.ts        mock API — swap bodies for Supabase in Phase 4
```

## Current status

- Phase 1–3 complete (scaffold, design system, pages/components)
- Forms validate and "submit" to a mock API (console log)
- All content is placeholder — search `TODO` to find what needs real data

## Next: Phase 4 (needs accounts)

1. Create a Supabase project → tables per `../claude.md` schema + RLS
2. Add `.env.local` with `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`
3. `npm install @supabase/supabase-js`, swap mock bodies in `src/lib/api/index.ts`
4. GitHub repo → Netlify deploy → Cloudflare DNS (Phase 8)
