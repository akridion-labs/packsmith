# Packsmith Security Checklist

Packsmith currently handles emails, Google-authenticated profiles, saved template packs, launch events, and Notion publish payloads.

## Required Rules

- Never commit `.env`, `.env.local`, Supabase service-role keys, Notion tokens, Google OAuth secrets, or provider API keys.
- Keep Notion tokens in Supabase Edge Function secrets only.
- Keep Supabase row-level security enabled for every user-owned table.
- Do not add public `select` policies to `waitlist_leads`.
- Require explicit privacy consent before saving waitlist emails.
- Let users try the generator without login; require login only for cloud save and publishing.
- Store only the minimum Google profile fields needed for account display.
- Avoid saving payment details in Packsmith; use a payment provider if checkout is added later.
- Keep ChatGPT Actions, Claude MCP, and plugin surfaces limited to explicit Packsmith tools; never expose arbitrary shell, filesystem, or network actions.
- Strip token-like fields from API/MCP input and keep connector secrets on the server side only.
- Require explicit user intent before save, publish, checkout, or external export actions from assistant/plugin surfaces.
- Keep API console examples synthetic and secret-free; never paste real production tokens into OpenAPI samples or Custom GPT instructions.

## Current Data Surfaces

- `waitlist_leads`: email, source, consent version, privacy acceptance timestamp.
- `profiles`: Supabase user id, email, display name, avatar URL.
- `template_packs`: user-owned generated pack JSON and Notion payload JSON.
- `launch_events`: user-owned launch asset metadata.
- Browser local storage: local waitlist fallback and local saved packs when cloud is not configured.
- Assistant/plugin surfaces: generated pack requests and export payloads only; no OAuth secrets, Notion tokens, service-role keys, or payment data.
- Users can export or clear browser-stored Packsmith data from the app.

## Before Public Launch

- Replace placeholder privacy contact language with a real support/privacy email.
- Review the privacy notice with counsel for target launch countries.
- Add cloud account deletion/export workflow after Supabase project setup.
- Add rate limiting or CAPTCHA to public waitlist capture if spam appears.
- Test Notion publish against a dedicated sandbox workspace before advertising live publish.
- Confirm the Notion integration has access only to the workspace/page the user intends to publish into.
- Review inferred Notion relation mapping before using published workspaces with customer data.
- Red-team ChatGPT Actions, Claude MCP, and creative plugin flows for prompt injection before public distribution.
