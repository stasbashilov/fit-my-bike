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

## 6. Tire pressure calculator

Used by `server/utils/tire-pressure.ts` and exposed via `POST /api/tire-pressure`.

### Inputs

| Field | Type | Required | Bounds |
|---|---|---|---|
| `riderWeight` | kg | yes | 20–200 kg |
| `bikeWeight` | kg | no, default 8 | 3–30 kg |
| `tireWidthMm` | mm | yes | 18–80 mm |
| `tireType` | enum | yes | `clincher`, `tubeless`, `tubular` |
| `surface` | enum | yes | `road`, `gravel`, `mtb` |

### Formula

```
system_weight_kg = riderWeight + bikeWeight
front_load_kg    = system_weight_kg × 0.45   // 45 % on front wheel
rear_load_kg     = system_weight_kg × 0.55   // 55 % on rear wheel

front_bar = (front_load_kg × K) / tireWidthMm
rear_bar  = (rear_load_kg  × K) / tireWidthMm

front_psi = front_bar × 14.504
rear_psi  = rear_bar  × 14.504
```

Pressure coefficient **K** by surface + tire type combination:

| Surface | Clincher | Tubeless | Tubular |
|---|---|---|---|
| road | 3.7 | 3.1 | 3.9 |
| gravel | 2.5 | 2.1 | — (clincher value) |
| mtb | 2.2 | 1.9 | — (clincher value) |

**Calibration reference** (83 kg system = 75 kg rider + 8 kg bike, 25 mm road clincher):
- Rear load = 83 × 0.55 = 45.65 kg → 45.65 × 3.7 / 25 ≈ 6.75 bar (97.9 psi) ✓
- Front load = 83 × 0.45 = 37.35 kg → 37.35 × 3.7 / 25 ≈ 5.52 bar (80.0 psi) ✓

Results are rounded: bar to 1 decimal, psi to nearest integer.

### Limitations

- Does not account for altitude, temperature, or rim width (all affect optimal pressure by ±0.2–0.5 bar)
- Tubular gravel/MTB falls back to clincher coefficient — tubulars are uncommon in these disciplines
- Model is calibrated for recreational/sportive riding; racers may fine-tune ±0.3 bar for rolling resistance optimisation

## 7. What this model explicitly does NOT cover (risks backend-dev should flag in their report)

- Leg length asymmetry (>5 mm difference) — the formula does not account for this
- Crank length — the formula assumes an "average" crank length; real-world correction must factor it in
- Hip flexor / hamstring flexibility — riders with tight hamstrings should be 3–5 mm lower than the formula output
- This is a guidance model, not injury/pain diagnosis — if pain/discomfort data is ever collected, that requires a different level of product responsibility (possibly a "not a medical recommendation" disclaimer)
