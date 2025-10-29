# 1030 — Next.js App Router shell

This is a clean Next.js App Router scaffold that mirrors your existing tabs and runs without any backend.

## Scripts
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm start` — start production server
- `npm run typecheck` — TypeScript check

## Deploy on Vercel
- Import this repo into Vercel
- Framework preset: Next.js
- Build command: `next build`
- Output dir: `.next`

## Future backend (Supabase)
Set these env vars in Vercel when ready:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Create `lib/supabaseClient.ts` using those values when you’re ready to connect.

