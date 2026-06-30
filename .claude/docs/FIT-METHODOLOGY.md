# FIT-MY-BIKE — Fit Calculation Methodology (v0.1, working model)

This is a working model for the MVP, assembled from well-established, decades-proven formulas (LeMond/Hinault, KOPS, stack/reach conventions). It does NOT replace a professional bike fit with video analysis — it's a starting point, which should be clearly communicated in the UI ("approximate recommendation; precise fit should be dialed in individually").

Used by the backend-dev agent as the basis for `server/utils/fit-calculations.ts`.

---

## 1. Input data (common for all disciplines)

- `inseam` — inseam length, mm (floor to crotch, barefoot)
- `height` — height, mm
- `armLength` — arm length (shoulder to wrist), mm — optional, for reach refinement
- `shoulderWidth` — shoulder width between acromions, mm — optional, for handlebar width
- `discipline` — one of: `road`, `tt_triathlon`, `mtb_xc`, `gravel`, `cyclocross`, `touring`, `kids`
- `flexibility` (optional) — `low` / `average` / `high` — for a future flexibility correction

## 2. Saddle height (base for all disciplines)

```
baseSaddleHeight_mm = inseam_mm * 0.883
```

Source: LeMond/Hinault formula, measured from the bottom bracket center to the top of the saddle.

### Discipline adjustments (applied to the base):
| Discipline | Adjustment |
|---|---|
| road | 0 (base as-is) |
| tt_triathlon | +5..+10 mm (aggressive aero position changes effective leg length) |
| mtb_xc | -5 mm (clearance for standing maneuvers, slightly lower than road) |
| gravel | 0..-3 mm (close to road, slightly more conservative) |
| cyclocross | -5..-8 mm (quick dismounts over barriers required) |
| touring | -5 mm (comfort prioritized over efficiency) |
| kids | DO NOT apply the formula directly — for children the standover and touchdown criterion matters more (saddle height should allow the rider to touch the ground with the tip of their foot while seated; calculate from height/inseam with a generous safety margin, see section 5) |

## 3. Body position (stack/reach → torso angle)

Instead of absolute mm, it's more practical to express the target **torso angle from horizontal** (smaller angle = more aggressive/lower position) and the **stack/reach ratio** of the bike for which the handlebar height/stem recommendation is derived.

| Discipline | Target torso angle | Character |
|---|---|---|
| road (race) | 40–45° | aggressive, low stack / long reach |
| road (endurance) / gravel | 50–58° | more upright, higher stack |
| tt_triathlon | 10–25° | maximum low, aero |
| mtb_xc | 50–60° | sporty but more upright than road due to technical terrain handling |
| cyclocross | 48–52° | between road race and endurance — control on rough terrain |
| touring | 60–65° | maximum upright, comfort on long distances |
| kids | 65–70°+ | safety and road visibility are the priority, not aerodynamics |

These are ranges for a UI recommendation like "raise/lower the handlebar relative to the saddle by N mm" — the specific handlebar height (drop) is derived from `baseSaddleHeight` minus the desired drop, where the drop increases as the target torso angle decreases.

## 4. Handlebar width

```
handlebarWidth_road_gravel_mm ≈ shoulderWidth_mm   (± 10–20 mm by preference)
handlebarWidth_mtb_mm ≈ shoulderWidth_mm + (50..100 mm)   // typically 740–800 mm
```

Source: handlebar width should roughly match shoulder width (acromion-to-acromion) for drop bars; for flat MTB bars — shoulder width + 5–10 cm for maneuverability on technical terrain.

## 5. Kids (discipline = kids) — separate logic, not a scaled-down adult model

The LeMond formula does not apply directly to children — priorities are different:
- **Standover height** (frame clearance) matters more than an aggressive position — the child must be able to stand flat-footed over the frame
- Saddle height is set with extra margin so that the child can touch the ground with their tiptoe while seated (stop control matters more than pedaling efficiency)
- This block should be shown to the user with a clear warning: "for children, the recommendation is approximate — the parent must physically verify safety on the actual bike"

## 6. What this model explicitly does NOT cover (risks backend-dev should flag in their report)

- Leg length asymmetry (>5 mm difference) — the formula does not account for this
- Crank length — the formula assumes an "average" crank length; real-world correction must factor it in
- Hip flexor / hamstring flexibility — riders with tight hamstrings should be 3–5 mm lower than the formula output
- This is a guidance model, not injury/pain diagnosis — if pain/discomfort data is ever collected, that requires a different level of product responsibility (possibly a "not a medical recommendation" disclaimer)
