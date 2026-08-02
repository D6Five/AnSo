# D6Five Learning App Pipeline — Foundational Layer

Implementation notes for `d6five-learning-app-foundational-spec.md` v0.1.

This document records what has been built, the answers to the three open
questions, and what a new client build actually costs.

---

## What exists now

| Piece | Path | State |
| --- | --- | --- |
| Config contract | `core/config/schema.ts` | Built |
| Validator | `core/config/validate-cli.mjs` | Built, catches planted faults |
| Runtime provider | `core/runtime/ConfigProvider.tsx` | Built |
| Client 001 — AnSo | `core/clients/anso.config.ts` | Built, mirrors the live app |
| Client 002 — Reef | `core/clients/reef.config.ts` | Example, proves generality |
| Engine components | `src/` | **Still theme-coupled — see Gap below** |

Run the validator with:

```bash
npm run config:check
```

---

## Answers to the three open questions

### 1. Repo and versioning strategy

**Recommendation: versioned core package, thin per-client repo, updates pulled deliberately.**

- The engine (activity types, sync, economy, reward reveal, parent dashboard)
  ships as a versioned package.
- Each client repo holds only their config, their curriculum, and any
  commissioned art. It depends on a pinned engine version.
- A core improvement reaches a client when someone bumps that version and
  redeploys — never automatically.

The tempting alternative is automatic propagation, and it is wrong for client
work. This codebase is the argument: over its build, sync silently reverted
outfits, spending was refunded by a max-merge, and a profile picker locked new
users out entirely. Each was found by testing one app. Had those shipped
automatically to eight live customers, the first anyone would know is a support
call from a parent whose child lost a term of progress.

Deliberate pulls also mean a client on a frozen version keeps working while you
refactor, which is what makes the engine safe to change at all.

The third option — one multi-tenant deploy keyed by hostname — is rejected. It
couples every client's uptime, puts every client's children in one database,
and turns a config mistake into a cross-customer incident. Build-time
`CLIENT_ID` selection keeps the blast radius to one customer.

### 2. Custom art intake

**Recommendation: art is data, not code, and arrives as SVG against a fixed contract.**

Everything visual in AnSo is drawn in SVG at runtime — the avatar, the home
base, the reward icons, the picture vocabulary. Nothing is a raster asset. That
was originally about offline support and licensing, but it turns out to be the
thing that makes custom art tractable: a commissioned character is a set of
paths conforming to a documented viewBox and layer order, not a redesign.

The contract a custom-art client must be given:

- **Avatar**: `200 × 272` viewBox, layers back-to-front — behind-accessories,
  back hair, neck/shoulders, outfit, arms, head, face, front hair,
  front-accessories. Outfit silhouettes are supplied as path data keyed by
  silhouette name.
- **Home base**: `400 × 250` viewBox, one group per item slot, drawn in a fixed
  depth order.
- **Reward icons**: `48 × 48` viewBox, two-colour, gradient supplied by config.

Deliver as plain SVG paths with no embedded rasters, no external fonts, and no
IDs that could collide when inlined. Anything else goes back.

Open sub-question worth settling before the first custom-art client: whether
D6Five commissions the illustrator or the client supplies one. The contract
above works either way, but the review burden differs a lot.

### 3. Content authoring workflow

**Recommendation: client curriculum arrives as a spreadsheet, converts to typed data, never as prose.**

The lesson data model is already a small set of challenge shapes — choice, open
response, ordering, matching, arithmetic, typing — plus passages. Client
curriculum has to land in those shapes or it cannot be rendered.

The practical intake is one sheet per activity type, with fixed columns, which
a converter turns into the typed content modules. A client who sends a Word
document of lesson plans has sent something that still needs an author, and
that should be priced as authoring rather than absorbed as intake.

Two things learned building AnSo's curriculum that belong in the intake spec:

- **Drill subjects should be generated, not authored.** Maths and typing use
  seeded generators, which is why they offer unlimited practice instead of forty
  memorised problems. Asking a client to author 600 arithmetic questions is
  worse for them and worse for the child.
- **Ask which subjects need audio.** Vocabulary and any second-language strand
  need pronunciation, which changes what the intake sheet must carry — for
  Korean it needed hangul, a romanisation, *and* a plain phonetic spelling,
  because the correct romanisation tells a six-year-old nothing.

---

## The gap between this layer and a real pipeline

The config layer is real and validated. The engine is not yet reading from it.

`src/` still contains the theme in hardcoded form: the word "stardust" appears
in components, `princess` is a concrete concept rather than a configured avatar
noun, and subject definitions live in `src/content/subjects.ts` rather than
coming from `config.subjects`. AnSo works, and the config describes it exactly,
but changing `anso.config.ts` would not currently change the app.

Closing that gap is the next piece of work, in this order:

1. **Terminology** — replace hardcoded nouns with `useTerms()`. Highest value,
   lowest risk, and it is what makes a second theme visibly different.
2. **Subjects** — source `SUBJECTS` from `config.subjects` so a client can drop
   a strand without editing code.
3. **Economy** — read the award numbers from `config.economy` rather than the
   constants in `completeStar`.
4. **Avatar and home base** — the largest piece, because it means generalising
   `PrincessArt` and `RoomArt` into a configured character and scene.
5. **Parent dashboard** — specified in the foundational layer, not yet built in
   AnSo at all. Currently there is a settings panel, not a progress report.

Steps 1–3 are mechanical. Step 4 is a genuine refactor. Step 5 is new work.

---

## Cost of a new client, once the gap is closed

| Work | Prebuilt art | Custom art |
| --- | --- | --- |
| Config authoring | ~1 hour | ~1 hour |
| Curriculum intake and conversion | 1–3 days | 1–3 days |
| Art | none | commission lead time + ~1 day integration |
| Deploy, domain, certificate | ~1 hour | ~1 hour |

The number that dominates is curriculum, which is why the questionnaire should
ask about content source early and price on it.

---

## Governance

`core/config/schema.ts` exports a frozen `GOVERNANCE` object. It is typed with
literal `false`/`true` values, so a client config cannot switch any of it on or
off — the compiler refuses. It covers no child PII, no child-facing external
links, no chat or social, parent visibility of all activity, parent-level auth,
and a retention window.

This is deliberately not in the questionnaire. A customer asking for child chat
is asking for a different product.
