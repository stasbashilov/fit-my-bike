# AI Workflow — fit-my-bike

How Claude Code is used in this repository: which subagents exist, in what order to call them, and which rules to follow so agents don't step on each other's responsibilities.

## Subagents (`.claude/agents/`)

| Agent | Responsibility | File access |
|---|---|---|
| `planner` | breaks a feature into tickets [BACKEND]/[FRONTEND]/[DESIGN]/[QA] | read-only |
| `design-agent` | design tokens in `tailwind.config.ts`, base UI primitives | `tailwind.config.ts`, `assets/css/`, base components |
| `backend-dev` | `server/api/`, `server/utils/fit-calculations.ts` | does not touch `components/`, `pages/` |
| `frontend-dev` | `components/`, `pages/`, forms | does not touch `server/**` |
| `code-reviewer` | diff review, read-only | read only + bash for lint/typecheck |
| `qa-tester` | tests (Vitest, Playwright) | full repo, but does not edit production code on test failure |
| `deploy-vercel` | deploy readiness checklist | configs, not business logic |

## Standard flow for a new feature

```
1. planner      → decompose into tickets
2. design-agent → only if the feature needs new UI patterns not covered by existing tokens
3. backend-dev  → implement API/logic
4. frontend-dev → implement UI
5. code-reviewer → review diff (CHANGES REQUESTED → back to step 3/4)
6. qa-tester    → tests
7. deploy-vercel → before release
```

Steps 3 and 4 can run in parallel if the API contract (schema in `shared/schemas/`) was locked by the planner/backend-dev before frontend work begins.

## Rules for the main Claude Code session

- Before delegating a task — make sure the planner ticket is unambiguous. If not — ask the user, don't guess
- Do not skip `code-reviewer` before merging, even for small changes — it's a cheap safety check
- If `backend-dev` explicitly flagged uncovered edge cases in their report — pass them to `qa-tester` explicitly, don't lose them between steps
- If a feature contradicts `docs/PROJECT_OVERVIEW.md` (e.g. requires accounts) — stop and ask the user, don't implement it on the fly

## What Claude should read itself, not wait to be told

- Fit formulas → `.claude/docs/FIT-METHODOLOGY.md`
- Code style → `.claude/docs/CODING_STANDARDS.md`
- Product scope → `.claude/docs/PROJECT_OVERVIEW.md`

(`CLAUDE.md` in the root already links to them and is loaded automatically at session start — but subagents start with a clean context and must explicitly go read these files themselves when needed.)

## When NOT to delegate to a subagent — handle in the main session

- Small one-liner edits (typo, text fix) — not worth spending a separate subagent context
- Exploratory questions like "how should we do X" — discuss with the user in the main session first, then delegate the concrete implementation

## Agent versioning

When you change a subagent prompt — update the version in a comment at the top of the file (`<!-- v2, changed: ... -->`) and briefly note the reason in the commit message `docs: update backend-dev agent prompt`.
