# Coding Standards — fit-my-bike

## TypeScript

- Strict mode is enabled — do not disable without an explicit reason
- No `any` without a comment explaining why it can't be typed otherwise
- Business logic (fit calculations) — pure functions with explicit input/output signatures, no side effects

## Vue / Nuxt

- Composition API only, `<script setup lang="ts">`
- Composables for logic shared across multiple components (`composables/useFitRecommendation.ts`)
- Component names — PascalCase, files — `ComponentName.vue`
- Base UI primitives (`BaseInput`, `BaseButton`, `Card`) — do not duplicate field styling manually in each component; use primitives from the design system

## Validation

- Schemas — zod, single source in `shared/schemas/`, imported by both the frontend (vee-validate resolver) and backend endpoints
- Do not duplicate validation rules (height/inseam ranges, etc.) in two places

## Styling

- Only tokens from `tailwind.config.ts` (colors, spacing, radius, typography) — see the design system defined by `design-agent`
- No arbitrary inline values (`mt-[13px]`, custom hex colors in class strings)

## File structure

```
server/api/        — backend endpoints (Nitro)
server/utils/      — business logic (fit-calculations.ts)
shared/schemas/    — zod schemas (shared between frontend and backend)
components/        — Vue components
composables/       — reusable client-side logic
pages/             — routes
docs/              — project documentation
```

## Tests

- Unit tests are required for everything in `server/utils/fit-calculations.ts` — this is the core of the product
- Test framework — Vitest (+ Vue Test Utils for components, Playwright for e2e smoke)
- Do not merge a feature without tests covering the fit calculation business logic

## Commits

- Format: `type: short description` (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`)
- One commit — one logical unit of change; do not mix refactoring with a new feature

## What NOT to do without an explicit request

- Do not add DB, ORM, or auth — the product is stateless (see `docs/PROJECT_OVERVIEW.md`)
- Do not swap the stack (Nuxt/Tailwind/Vitest) for alternatives just because they seem better
- Do not introduce new external dependencies without a clear need — the MVP should stay lightweight
