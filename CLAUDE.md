# CLAUDE.md

Project: **fit-my-bike** — MVP bike fit calculator (stateless, no accounts).

## Stack
Nuxt 3 (Vue 3, TypeScript) + Tailwind CSS v3. Backend — Nuxt Server API (`server/api/*.ts`, Nitro). Deploy — Vercel. No DB, no auth.

## Commands
```
npm run dev        # local dev server
npm run build      # production build (same build used by Vercel)
npm run test       # Vitest unit/integration
npm run typecheck
npm run lint
```

## Structure
`srcDir` is set to `app/` in `nuxt.config.ts`, so all frontend code lives there:
- `app/pages/` — routes (one main flow: form → result)
- `app/components/` — Vue components; `BaseInput`/`BaseButton`/`Card` — reusable design system primitives
- `app/composables/` — shared client-side logic
- `server/api/` — backend endpoints
- `server/utils/fit-calculations.ts` — core fit calculation logic (pure functions)
- `shared/schemas/` — zod validation schemas (shared between frontend and backend)
- `assets/css/main.css` — Tailwind entry point
- `tailwind.config.ts` — design tokens

## Sources of truth (read before working in these areas)
- Bike fit formulas and coefficients by discipline → `docs/FIT-METHODOLOGY.md`
- Code style and conventions → `docs/CODING_STANDARDS.md`
- How to work with subagents (planner/backend-dev/frontend-dev/design-agent/code-reviewer/qa-tester/deploy-vercel) → `docs/AI_WORKFLOW.md`
- Product scope, what's in/out of MVP → `docs/PROJECT_OVERVIEW.md`

## Hard rules
- Do not add DB/auth/sessions without an explicit request — the product is intentionally stateless
- Do not invent your own bike fit coefficients — use only those from `docs/FIT-METHODOLOGY.md`; otherwise explicitly flag as an open question
- Design — only through tokens in `tailwind.config.ts`, no arbitrary inline values
- Do not add Claude as a co-author in commits (`Co-Authored-By: Claude` must not appear in commit messages)
