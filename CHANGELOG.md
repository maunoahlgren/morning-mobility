# Changelog

All notable changes to Morning Mobility are documented here.

---

## [Unreleased]

---

## 2024 — Initial Release

### Commit 1 — Initial commit: single-page HTML app

**Summary:** Shipped the first version of Morning Mobility as a single self-contained HTML file with no build step or external runtime dependencies.

**Features added:**

- **Branding:** DM Serif Display (headings) and DM Sans (body) typefaces via Google Fonts.
- **Exercise data:** Full exercise library embedded in JS — daily mobility, pre/post-skate, and pre/post-run sections.
- **Day detection:** `getDayType(dayIndex)` derives the routine type (skate / run / rest) from the JS `Date.getDay()` value.
- **Routine builder:** `getRoutine(type)` returns the ordered section/exercise structure for the detected day.
- **Accordion cards:** One exercise card open at a time; chevron rotates on expand.
- **Countdown timer:** Per-exercise timer with start, pause, resume, and reset. Vibrates on completion via `navigator.vibrate`.
- **Mark as done:** Toggling an exercise writes a `{dateKey + exerciseId: true}` entry to `localStorage` under the key `ilves_completed`. Progress bar and label update immediately.
- **"Begin Today's Routine" button:** Scrolls to and opens the first incomplete exercise.
- **Week tab:** Seven-day grid showing the routine type and badge for each day; today highlighted.
- **Why tab:** Four informational cards explaining the rationale behind the routine.
- **PWA metadata:** `<meta name="apple-mobile-web-app-capable">` and `theme-color` for Add-to-Home-Screen support on iOS and Android.

---

### Commit 2 — Rebrand to Ilves Hockey identity

**Summary:** Replaced the generic DM Serif / DM Sans visual identity with the Ilves Hockey club brand and added the "Be More Ilves" motivational banner.

**Changes:**

- **Color palette updated:**
  - Primary green: `#006934` (Ilves green)
  - Accent yellow: `#FFCB05` (Ilves yellow)
  - Supporting tones: `#004d25` (dark green), `#e6f2ec` (light green tint)
- **Typography updated:** DM Serif Display and DM Sans replaced by **Barlow Condensed** (weights 400–900) and **Barlow** (weights 300–500).
- **App title updated:** Header now reads "Morning Mobility × Ilves".
- **Day pill styles:** Skate day uses yellow background; run day uses white; rest uses a translucent white overlay — all consistent with Ilves palette.
- **"Be More Ilves" banner added** to the Why tab: green background card with hockey stick emoji, bold yellow headline ("Be More Ilves"), and subline "Every day is your day if you claim it."
- **Theme color meta tag:** Changed to `#006934`.
- **localStorage key:** Confirmed as `ilves_completed` (unchanged from initial commit).
