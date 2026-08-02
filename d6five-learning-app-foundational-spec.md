# D6Five Learning App Pipeline — Foundational Spec v0.1

## Purpose
This document defines what is **fixed** across every client build (the engine) versus what is **configurable** per client (the skin). It is the source of truth that gets merged with questionnaire output to generate the Claude Code build prompt for each new app.

---

## 1. Foundational Layer (never changes per client)

### 1.1 Core Loop
- Lesson/activity completion → currency awarded
- Currency accrual → threshold-based unlock triggers
- Unlocked items → added to child's inventory
- Inventory items → equippable/displayable on avatar and in "home base" scene
- Progression difficulty scaling as lessons advance

### 1.2 Data Model (entities, not labels)
- Child profile (age, grade/level, progress state)
- Lesson/activity records (type, completion status, score/attempts)
- Currency ledger (earn events, running balance)
- Inventory (unlocked items, equipped state)
- Parent/guardian account (linked to 1+ child profiles)
- Session state

### 1.3 Architecture / Infra
- Hosting: Railway
- Repo strategy: [TBD — shared core package vs. fork-per-client, see open question below]
- Auth: parent-level login, child-level profile switch (no direct child auth)
- Custom domain per client app

### 1.4 Governance & Safety (non-negotiable, not exposed in questionnaire)
- COPPA-aligned data handling — no PII collection from child directly
- Parental consent + visibility into all child activity
- Content moderation boundaries for any AI-generated lesson content
- No external links/chat/social features exposed to child user
- Data retention and deletion policy

### 1.5 Baseline UX Patterns
- Progress feedback (immediate, positive reinforcement on completion)
- Reward reveal moment (unlock animation/interaction)
- Home base / avatar view as persistent "return point"
- Parent dashboard (progress reporting, settings)

---

## 2. Customizable Layer (driven by questionnaire → config)

| Category | Example values |
|---|---|
| Theme | Galaxy, underwater, dinosaur dig, enchanted forest, etc. |
| Currency name + icon | Stardust, gems, fossils, sea glass |
| Avatar type | Princess, astronaut, explorer, animal companion |
| Reward category | Dresses/accessories, gear, habitat items |
| Home base concept | Royal chamber, spaceship, treehouse, reef |
| Color palette | Per theme |
| Character art | Pre-built theme (default) or custom commissioned art (upsell) |
| Subject focus | Reading, math, phonics, etc. |
| Age/grade range | e.g. 4–6, 7–9 |
| Difficulty pacing | Standard, accelerated, remedial |
| Lesson content source | Client-provided curriculum vs. D6Five default library |
| Parent reporting depth | Basic (completion %) vs. detailed (per-skill breakdown) |

---

## 3. Config Schema (draft — this is what the questionnaire populates)

```json
{
  "client_id": "",
  "app_name": "",
  "domain_subdomain": "",
  "theme": {
    "id": "galaxy | underwater | dino_dig | custom",
    "currency_name": "",
    "currency_icon": "",
    "avatar_type": "",
    "reward_category": "",
    "home_base_name": "",
    "art_tier": "prebuilt | custom",
    "color_palette": ""
  },
  "learner": {
    "age_range": "",
    "subject_focus": [],
    "difficulty_pacing": "standard | accelerated | remedial"
  },
  "content": {
    "source": "d6five_default | client_provided",
    "curriculum_ref": ""
  },
  "reporting": {
    "parent_dashboard_tier": "basic | detailed"
  }
}
```

---

## 4. Open Questions to Resolve Next
1. **Repo/versioning strategy** — does a core engine update propagate to live client apps automatically, or is each client app a frozen fork at build time?
2. **Custom art intake process** — if a client wants custom theme art, what's the workflow (who commissions/generates it, what format does it need to arrive in for the build)?
3. **Content authoring workflow** — for client-provided curriculum, what format do you need it in before it can be mapped into the lesson data model?
