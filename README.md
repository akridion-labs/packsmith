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
- `http://127.0.0.1:5173/ai-agency-launch-kit` for the first revenue product page
- `http://127.0.0.1:5173/platforms` for the ChatGPT, Claude, Adobe, Figma, Canva, and browser extension roadmap
- `http://127.0.0.1:5173/api-console` for the OpenAPI/ChatGPT Actions console
- `http://127.0.0.1:5173/app` for the Packsmith forge workspace
- `http://127.0.0.1:5173/privacy` for the MVP privacy notice

Generated repo graphs are written to `graphify-out/`, which is ignored by git.

## Test

```bash
npm test
npm run build
```

The current suite covers preset generation, custom pack generation, Notion payload safety, simulation states, and marketing kit exports.

## Shared API and MCP Prototype

Packsmith now has a shared local contract in `src/packsmithApiContract.js`. It defines the route shapes and export behavior that can power the web app, ChatGPT Actions, Claude MCP, Figma plugin flows, and creative marketplace add-ons.

Current contract routes:

- `POST /api/packsmith/generate`
- `GET /api/packsmith/packs/{packId}`
- `POST /api/packsmith/exports/markdown`
- `POST /api/packsmith/exports/notion`
- `POST /api/packsmith/exports/figma`
- `POST /api/packsmith/exports/gumroad`
- `POST /api/packsmith/exports/marketplace`

The Claude-style MCP prototype lives in `src/mcp/packsmithMcpPrototype.js` and exposes:

- `generate_template_pack`
- `export_pack_markdown`
- `export_notion_payload`
- `export_figma_schema`
- `export_gumroad_listing`
- `get_packsmith_api_contract`

Run the local prototype server:

```bash
npm run mcp:packsmith
```

This prototype is intentionally local and tool-limited. It does not execute shell commands, does not accept arbitrary file paths, and strips token-like fields from tool input. Production remote MCP should sit behind Packsmith auth and use the same server-side secret rules as Notion publishing.

The in-app API console lives at `/api-console`. It exports:

- `packsmith-openapi.json` for ChatGPT Actions
- `packsmith-chatgpt-action-samples.json` with safe sample requests and responses
- a starter Custom GPT prompt for Packsmith generation and exports

Recommended ChatGPT Action flow:

1. Export `packsmith-openapi.json`.
2. Create a Custom GPT and import the schema under Actions.
3. Start with unauthenticated generation/export routes.
4. Add Packsmith login only for saved history, cloud exports, and publish actions.
5. Keep Notion, Supabase, OAuth provider, and payment secrets server-side only.

## Supabase Setup

Packsmith works without Supabase credentials, but cloud features stay in local fallback mode.

1. Copy `.env.example` to `.env.local`.
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. Add `VITE_GUMROAD_AI_AGENCY_URL` after the Gumroad product page is created.
4. Run `supabase/schema.sql` in the Supabase SQL editor.
5. Enable Google and Facebook as auth providers in Supabase.
6. Deploy `supabase/functions/notion-publish` when ready for Notion publishing.
7. Add `NOTION_TOKEN` as a Supabase Edge Function secret.
8. Share the target Notion parent page with the Notion integration.
9. Treat Instagram login as a Meta/Instagram Business setup path; the app can generate Instagram template packs today, but direct Instagram OAuth is not enabled in this frontend.

Cloud features:

- Google and Facebook login
- Waitlist lead capture
- Saved template packs
- Cloud analytics events for page views, exports, CTA clicks, and pricing intent
- Notion publish Edge Function for pages, databases, and seed records
- Browser data export and local data clearing controls
- In-app beta setup checklist for Supabase, social login, privacy, and Notion publish readiness

## Privacy and Security Baseline

- Users can try Packsmith before login.
- Waitlist forms require explicit privacy consent before saving emails.
- Waitlist rows store consent version and acceptance timestamp.
- Saved packs and launch events are protected with Supabase row-level security.
- Analytics events store metadata only; generated pack bodies, connector tokens, OAuth secrets, and payment details must not be stored in analytics.
- Notion tokens, OAuth secrets, and Supabase service-role keys must stay server-side only.
- `.env` and `.env.local` are ignored and must never be committed.
- See `SECURITY.md` before adding new auth, database, or connector behavior.

## Current Scope

- React + Vite app
- Polished Packsmith creator workspace
- Multi-niche preset engine including AI Agency, SaaS, Healthcare, and Instagram Creator packs
- Public landing page
- Dedicated launch/traction page
- Supabase-ready Google and Facebook login
- Supabase schema for waitlist, profiles, saved packs, and launch events
- In-app local data export/delete controls
- Automated unit tests for preset, custom generator, Notion connector, and marketing export contracts
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
- AI Agency revenue page with Gumroad listing, license, refund policy, setup checklist, and local pricing-intent analytics
- Supabase-ready cloud analytics events with local fallback and dashboard cloud/local counters
- Platform expansion roadmap for ChatGPT Apps/GPT Actions, Claude MCP, Adobe Express add-on, Photoshop UXP, Figma plugin, Canva importer, and browser extension paths
- API console for exporting the ChatGPT Action OpenAPI schema, safe sample payloads, and starter prompt

## Connector Direction

Notion is the first full MVP connector target. The current app creates a payload with:

- Parent workspace page
- Child pages
- Database names
- Database properties

The connector stub lives at `src/integrations/notionConnector.js`.

The Supabase Edge Function lives at `supabase/functions/notion-publish/index.ts`.
It validates login, keeps `NOTION_TOKEN` server-side only, creates a Packsmith root page, creates child pages, creates databases, and seeds sample records. Relation fields are mapped when Packsmith can infer an already-created target database; otherwise they safely publish as text with a warning.

Figma and Canva are intentionally spec-first for now. They generate the design and pack plan before direct file creation is added.

The plugin/app expansion strategy is to build one shared Packsmith API/MCP contract first, then ship ChatGPT and Claude assistant surfaces before heavier creative marketplace plugins. Adobe Express is the first Adobe target; Photoshop UXP is later because it carries higher build and support cost.

Healthcare templates are workflow and marketing operations templates only. They are not medical, legal, diagnostic, or treatment advice.

## Next Scope

- Add explicit user-controlled Notion relation mapping
- Add cloud account deletion/export workflow after Supabase project setup
- Connect NVIDIA/OpenAI generation for new niches
- Add image/screenshot inspiration input
- Replace local fallback saves with production Supabase flows after credentials are added
- Add Figma plugin/API export workflow
