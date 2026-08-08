# Testing

Every enhancement lands with the whole suite green. The suite is one command,
one runner (vitest), and it runs automatically on every push.

```bash
npm test          # watch mode while developing
npm run test:run  # the full suite once — what CI runs
npm run typecheck # TypeScript across the project
```

## The layers

| Layer | Where | What it protects |
|---|---|---|
| Content invariants | `src/content/*.test.ts` | All 400+ stars: unique IDs, valid choice indices, non-empty accept lists, picture/art keys exist, per-constellation minimums, the 30-hour floor, BSF week completeness and grade differentiation |
| Answer matching | `src/core/match.test.ts` | The leniency contract for every spoken/typed answer — number words, filler stripping, misspelling thresholds, recogniser alternatives |
| Store & economy | `src/core/store.test.ts` | Stardust math, best-score tracking, shop purchases, seed-explorer resets, deploy-version resets, deletion tombstones, persistence across reload |
| Merge semantics | `tests/merge.test.mjs` | The server merge: max/union rules that make two devices safe, tombstones, same-child stitching, symmetry |
| Server integration | `tests/server.test.mjs` | Boots the real `server.mjs`: password gate serves nothing unauthenticated, forged sessions rejected, sync round-trips and merges |
| Components | `src/activities/*.test.tsx` | Real interaction flows in jsdom: Next always appears, crossed-out options answer back, second chances count, no dead ends |

## Conventions

- **Every bug fix ships with a test that would have caught it.** The component
  suite exists because of three real bugs (frozen matching round, silent
  crossed-out options, off-screen Next button) — keep adding to it whenever a
  child finds something by hand.
- **New content needs no new tests.** The content invariants run against
  whatever `starsForGrade` returns, so new stars are covered the moment they
  are added. If a constellation grows, raise its floor in `MIN_STARS`
  (`src/content/content.test.ts`) so it can never silently shrink.
- **New challenge kinds do need tests** — one content invariant (shape) and one
  component flow (a child can always finish it).
- DOM tests start with `// @vitest-environment jsdom`; everything else runs in
  node and stays fast.

## Continuous execution

`.github/workflows/ci.yml` runs typecheck → tests → build on every push and
pull request to `main`.

To make CI an actual deploy gate (recommended): in Railway, open the service →
**Settings → Deploy → Wait for CI** and enable it. Railway will then hold each
deploy until the GitHub checks pass, so a red test run blocks the release
instead of shipping it.
