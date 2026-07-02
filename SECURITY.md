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

## Current Data Surfaces

- `waitlist_leads`: email, source, consent version, privacy acceptance timestamp.
- `profiles`: Supabase user id, email, display name, avatar URL.
- `template_packs`: user-owned generated pack JSON and Notion payload JSON.
- `launch_events`: user-owned launch asset metadata.
- Browser local storage: local waitlist fallback and local saved packs when cloud is not configured.

## Before Public Launch

- Replace placeholder privacy contact language with a real support/privacy email.
- Review the privacy notice with counsel for target launch countries.
- Add a user-facing data deletion/export workflow.
- Add rate limiting or CAPTCHA to public waitlist capture if spam appears.
- Fully implement Notion API calls inside `supabase/functions/notion-publish` before advertising live publish.
