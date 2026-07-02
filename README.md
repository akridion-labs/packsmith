# Packsmith

Packsmith turns a rough niche idea into a ready-to-sell template pack blueprint.

The current MVP is a React workspace for three sellable niche presets:

- **AI Agency Launch Kit**
- **SaaS Launch Kit**
- **Healthcare Practice Growth Kit**

Each preset generates:

- Notion workspace structure and connector payload
- Canva pitch deck, content pack, and brand kit plan
- Figma UI kit, design token, and screen plan
- Gumroad/Etsy-style listing copy
- Launch checklist and premortem risks
- Video scripts, social posts, launch prompts, and Canva deck outline

## Run Locally

```bash
npm install --cache ./.npm-cache
npm run dev
```

Then open:

- `http://127.0.0.1:5173/` for the public landing page
- `http://127.0.0.1:5173/launch` for the launch/traction page
- `http://127.0.0.1:5173/app` for the Packsmith forge workspace
- `http://127.0.0.1:5173/privacy` for the MVP privacy notice

Generated repo graphs are written to `graphify-out/`, which is ignored by git.

## Supabase Setup

Packsmith works without Supabase credentials, but cloud features stay in local fallback mode.

1. Copy `.env.example` to `.env.local`.
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. Run `supabase/schema.sql` in the Supabase SQL editor.
4. Enable Google as an auth provider in Supabase.
5. Deploy `supabase/functions/notion-publish` when ready for Notion publishing.
6. Add `NOTION_TOKEN` as a Supabase Edge Function secret.
7. Share the target Notion parent page with the Notion integration.

Cloud features:

- Google login
- Waitlist lead capture
- Saved template packs
- Notion publish Edge Function for pages, databases, and seed records
- Browser data export and local data clearing controls
- In-app beta setup checklist for Supabase, Google login, privacy, and Notion publish readiness

## Privacy and Security Baseline

- Users can try Packsmith before login.
- Waitlist forms require explicit privacy consent before saving emails.
- Waitlist rows store consent version and acceptance timestamp.
- Saved packs and launch events are protected with Supabase row-level security.
- Notion tokens, Google OAuth secrets, and Supabase service-role keys must stay server-side only.
- `.env` and `.env.local` are ignored and must never be committed.
- See `SECURITY.md` before adding new auth, database, or connector behavior.

## Current Scope

- React + Vite app
- Polished Packsmith creator workspace
- Multi-niche preset engine
- Public landing page
- Dedicated launch/traction page
- Supabase-ready Google login
- Supabase schema for waitlist, profiles, saved packs, and launch events
- In-app local data export/delete controls
- Local/mock custom pack generator
- Editable generated outputs isolated per niche
- Niche comparison view
- Marketing command center
- Local save history through browser storage
- Markdown export
- Notion connector JSON export
- Marketplace listing JSON export
- Launch calendar markdown export
- Marketing script markdown export
- Social launch copy JSON export
- Connector roadmap cards for Notion, Figma, and Canva

## Connector Direction

Notion is the first full MVP connector target. The current app creates a payload with:

- Parent workspace page
- Child pages
- Database names
- Database properties

The connector stub lives at `src/integrations/notionConnector.js`.

The Supabase Edge Function lives at `supabase/functions/notion-publish/index.ts`.
It validates login, keeps `NOTION_TOKEN` server-side only, creates a Packsmith root page, creates child pages, creates databases, and seeds sample records. Relation fields are safely published as text until target-database mapping is added.

Figma and Canva are intentionally spec-first for now. They generate the design and pack plan before direct file creation is added.

Healthcare templates are workflow and marketing operations templates only. They are not medical, legal, diagnostic, or treatment advice.

## Next Scope

- Add relation-aware Notion database mapping
- Add cloud account deletion/export workflow after Supabase project setup
- Connect NVIDIA/OpenAI generation for new niches
- Add image/screenshot inspiration input
- Replace local fallback saves with production Supabase flows after credentials are added
- Add Figma plugin/API export workflow
