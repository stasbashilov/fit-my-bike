# Project Overview — fit-my-bike

## What it is

A web-based bike fit calculator. The user enters their body measurements once, selects a discipline, and receives recommended fit parameters (saddle height, target torso angle / handlebar drop, handlebar width).

## Target user

A cyclist who wants a quick starting point for fit setup without visiting a professional fitter — or who wants to estimate parameters before buying or adjusting a new bike.

## Disciplines in MVP

- `road` — road racing
- `tt_triathlon` — time trial / triathlon
- `mtb_xc` — MTB cross-country
- `gravel` — gravel
- `cyclocross` — cyclocross
- `touring` — touring
- `kids` — children's bikes

## In scope for MVP (v1)

- Input form: height, inseam, arm length, shoulder width, discipline
- Calculation: saddle height, body position recommendation (handlebar drop), handlebar width
- A single result screen with a clear explanation of each number
- An explicit disclaimer: this is a starting recommendation, not a substitute for a professional fit

## Intentionally out of scope for MVP (do not implement without a separate decision)

- Accounts, login, calculation history
- Photo/video pose analysis
- Leg length asymmetry, flexibility, injury history
- Specific bike model/size matching (fit parameters only, not model selection)
- Multilingual support (unless specified separately)

## Formula source

`docs/FIT-METHODOLOGY.md` — also contains a list of model limitations to keep in mind whenever changing calculation logic.

## Status

MVP in development. Stack: Nuxt 3 + Tailwind, deployed on Vercel, no DB.
