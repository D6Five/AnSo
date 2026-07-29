# AnSo — A Universe of Learning

A learning app for two girls, a 1st grader and a 3rd grader. AnSo is the guide
who travels with them: she talks out loud, listens to spoken answers, explains
why an answer was right, and never makes a wrong answer feel like a failure.

The universe is the map. Six constellations, each a subject. Each star is a
lesson, and stars light up as they are finished.

| Constellation | Subject |
| --- | --- |
| The Storyteller | Reading comprehension |
| The Wordsmith | Vocabulary |
| The Counting Crown | Math |
| The Puzzle Weaver | Critical thinking |
| The Swift Hand | Typing |
| The Lamp | Bible Study Fellowship |

## Running it

```bash
npm install
```

```bash
npm run dev
```

Then open <http://localhost:5180> in **Chrome or Edge**. Both work in any
browser, but speech recognition (answering out loud) only exists in Chromium
browsers. Everything has a typing fallback, so nothing is blocked without it.

To produce a build you can open without a dev server:

```bash
npm run build
```

## Deploying it privately

The app is deployed behind a password. **Nothing** is served without a valid
session — not the HTML, not the JavaScript, not a single asset. The server
refuses to start if no password is set, so it cannot accidentally become public.

Set one variable in Railway → **Variables**:

| Variable | Required | Notes |
| --- | --- | --- |
| `AUTH_PASSWORD` | yes | Minimum 8 characters. Server exits without it. |
| `SESSION_DAYS` | no | Days a device stays signed in. Default 180. |

Then Railway → **Settings → Networking → Generate Domain**.

Signing in once per device sets an HttpOnly, Secure, SameSite=Strict cookie that
lasts six months, so the girls are not asked for a password each time. Changing
`AUTH_PASSWORD` signs every device out immediately — that is the way to revoke
access.

After 8 wrong guesses from one address, that address is locked out for 15
minutes, including for the correct password.

To run the production server locally:

```bash
$env:AUTH_PASSWORD="something-long"; npm start
```

## How much content is here

Run this any time — it measures the real content files rather than quoting a
number someone wrote down:

```bash
npm run content:report
```

As of the initial build:

| | Grade 1 | Grade 3 |
| --- | --- | --- |
| Stars | 66 | 62 |
| Challenges | 650 | 669 |
| First-pass hours | 12.9 | 13.4 |

**This is short of the 30-hour target.** Reading, vocabulary, critical thinking
and BSF are hand-authored and are the parts that need more volume. Math and
typing are generator-driven and marked `∞ replayable` in the report: they build
fresh problems from a new seed every replay, so their practice time is not
capped by the hours figure. Adding content is additive data editing — see below.

## Adding curriculum

Everything lives in `src/content/`. No React knowledge needed for any of it.

**BSF weeks** — edit `src/content/bsfWeeks.ts` only. Add an object to the array
with the week's passage and questions, save, and a new star appears in The Lamp
for both girls. The file's header comment documents every field. Mark a question
`grades: [1]` or `grades: [3]` to show it to only one child.

**Reading passages** — `src/content/grade1/reading.ts`, `grade3/reading.ts`.
Each star is a passage plus its questions.

**Vocabulary** — `src/content/grade1/vocabulary.ts`, `grade3/vocabulary.ts`.
Supply words with a meaning, a fill-in-the-blank sentence, and three plausible
wrong meanings. The builder generates three passes per word automatically.

**Critical thinking** — `grade1/thinking.ts`, `grade3/thinking.ts`.

**Math and typing** — `grade1/mathTyping.ts`, `grade3/mathTyping.ts`. A star is
a short spec naming which skills to draw on; the generators in
`src/content/generators/` produce the actual problems. To add a new math skill,
write one function in `generators/math.ts` and add its name to `MathSkill` in
`src/types.ts`.

## How it works

- **No accounts, no server, no network.** Progress is saved in this browser's
  local storage on this computer. Nothing about either child leaves the machine.
- **Speech** uses the browser's built-in Web Speech API — AnSo's voice and the
  transcription of spoken answers. No API keys, nothing to pay for.
- **Sound** is synthesised at runtime with the Web Audio API. No audio files.
- **Art** is SVG and CSS. No image assets.
- Answer matching is deliberately lenient: number words map to digits, filler
  like "I think it's…" is stripped, and close spellings are accepted. A child
  should never lose a point to a transcription error.
- Stars unlock in sequence, so there is always exactly one obvious next thing.
- Two wrong answers reveals the answer with an explanation and moves on. Nothing
  is ever a dead end.

## Project layout

```
src/
  core/         audio, speech, seeded RNG, answer matching, save data
  content/      all curriculum — the only place you add lessons
    generators/ math and typing problem generation
    grade1/     grade 1 curriculum
    grade3/     grade 3 curriculum
    bsfWeeks.ts drop BSF weekly material here
  activities/   the six challenge engines
  components/   galaxy map, star runner, AnSo, settings
scripts/
  content-report.mjs   measures actual curriculum hours
```
