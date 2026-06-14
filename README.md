# Next.js + Supabase hello world

A minimal Next.js 16 (App Router) app that reads a list of messages from
Supabase in a **Server Component** using `@supabase/ssr`. Built to reproduce a
clean reference setup for debugging a Supabase connection.

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19
- `@supabase/ssr` + `@supabase/supabase-js`
- pnpm

## Local setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com).
2. **Create the demo table.** In the Supabase Dashboard → SQL Editor, paste and
   run the contents of [`supabase/schema.sql`](./supabase/schema.sql). This
   creates a `messages` table, seeds one row, and adds a public read RLS policy.
3. **Set env vars.** Copy the example file and fill it in:
   ```bash
   cp .env.local.example .env.local
   ```
   Get the values from Supabase Dashboard → Project Settings → API:
   - `NEXT_PUBLIC_SUPABASE_URL` → "Project URL"
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → the public **anon** key
4. **Install & run:**
   ```bash
   pnpm install
   pnpm dev
   ```
   Open http://localhost:3000 — you should see the seeded message.

## Deploy to Vercel

1. Push this repo to GitHub and import it in Vercel (framework auto-detected as
   Next.js).
2. In the Vercel project → Settings → Environment Variables, add the **same two
   variables** (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) for
   the Production (and Preview) environments. They are not read from
   `.env.local`, which is gitignored.
3. Redeploy if you added the vars after the first deploy.

## Debugging checklist (compare against your friend's setup)

Connection problems almost always come from one of these — work top to bottom:

- [ ] **Env var names match exactly** — `NEXT_PUBLIC_SUPABASE_URL` and
      `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Typos or a missing `NEXT_PUBLIC_` prefix
      mean the value is `undefined` at runtime.
- [ ] **`NEXT_PUBLIC_` prefix is present** if the value is read in client
      components/the browser. Without it, the var is server-only and the browser
      sees `undefined`.
- [ ] **`.env.local` actually exists locally** (not just `.env.local.example`)
      and the dev server was **restarted** after editing it — Next.js only reads
      env files at startup.
- [ ] **Env vars are set in Vercel** for the right environment (Production /
      Preview), and a **redeploy** happened after adding them. Local working but
      prod failing = almost always this.
- [ ] **URL is the Project URL** (`https://<ref>.supabase.co`), not the
      dashboard URL, and has **no trailing slash**.
- [ ] **Using the `anon` key**, not the `service_role` key (never ship
      service_role to the browser) and not a JWT/secret from somewhere else.
- [ ] **The table exists** and the name/columns in the query match
      (`messages` here). A 404/relation-not-found error points here.
- [ ] **RLS policy allows the read.** Row Level Security is ON by default; with
      no `select` policy the anon key returns **zero rows and no error** — looks
      like an "empty" table. This is the single most common gotcha.
- [ ] **Inspect the actual error.** This app renders `error.message` on the page
      instead of swallowing it — read it. Supabase errors are specific
      (auth/permission/relation/network).
- [ ] **Network reachability** — corporate VPN/firewall or a paused (free-tier
      auto-paused) Supabase project will fail to connect. Check the project is
      "Active" in the dashboard.
