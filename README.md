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

## Run Locally

```bash
npm install --cache ./.npm-cache
npm run dev
```

Then open `http://127.0.0.1:5173/`.

## Current Scope

- React + Vite app
- Polished Packsmith creator workspace
- Multi-niche preset engine
- Editable generated outputs isolated per niche
- Niche comparison view
- Local save history through browser storage
- Markdown export
- Notion connector JSON export
- Marketplace listing JSON export
- Launch calendar markdown export
- Connector roadmap cards for Notion, Figma, and Canva

## Connector Direction

Notion is the first full MVP connector target. The current app creates a payload with:

- Parent workspace page
- Child pages
- Database names
- Database properties

The connector stub lives at `src/integrations/notionConnector.js`.

Figma and Canva are intentionally spec-first for now. They generate the design and pack plan before direct file creation is added.

Healthcare templates are workflow and marketing operations templates only. They are not medical, legal, diagnostic, or treatment advice.

## Next Scope

- Add a backend route for Notion API publishing
- Connect OpenAI generation for new niches
- Add image/screenshot inspiration input
- Add editable output blocks
- Add reusable niche presets
- Add Figma plugin/API export workflow
