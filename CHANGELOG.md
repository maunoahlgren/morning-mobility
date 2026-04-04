# Changelog

All notable changes to Morning Mobility are documented here.

---

## [Unreleased]

---

## 2026-04-04 — Fix PWA installability

**Summary:** The PWA was not installable on mobile due to icon path issues and manifest configuration. Moved icons to `icons/` subfolder, simplified the manifest (removed separate maskable purpose entries), updated all references in index.html and sw.js.

**Changed:**

- **`manifest.json`** — Simplified `name` to "Morning Mobility", removed orientation/description fields, consolidated icon entries (removed separate `purpose` declarations that some browsers reject), updated icon `src` to `icons/` subfolder.
- **`index.html`** — Updated manifest link to absolute path `/morning-mobility/manifest.json`, updated `apple-mobile-web-app-title` to "Morning Mobility", updated all icon `href` attributes to `icons/` subfolder.
- **`sw.js`** — Bumped cache version to v6, updated icon cache paths to `icons/` subfolder.
- **`generate-icons.js`** — Updated output directory to `icons/`.
- **Icons** moved from root to `icons/icon-192.png` and `icons/icon-512.png`.

**Known issues:** None.

---

## 2026-04-04 — PWA install support + YouTube embed fix

### Commit 3 — Add PWA manifest, service worker, icons; fix YouTube embed origin

**Summary:** Made the app fully installable as a PWA on iOS and Android, added offline caching via a service worker, and fixed YouTube embeds that were blocked on GitHub Pages due to missing origin header.

**Added:**

- **`manifest.json`** — Web App Manifest with correct `name`, `short_name`, `start_url` (`/morning-mobility/`), `scope`, `display: standalone`, `theme_color: #006934`, `background_color: #006934`, and references to both icon sizes.
- **`sw.js`** — Service worker using a cache-first strategy for the app shell (index.html, manifest.json, icons). YouTube and Google Fonts requests are always passed to the network. Old caches deleted on activate. Falls back to cached `index.html` for navigation requests when offline.
- **`icon-192.png` + `icon-512.png`** — Generated with pure Node.js (no external dependencies): Ilves green background, yellow circle, green "M" lettermark. Used for both the home screen icon and the manifest.
- **Service worker registration** added to `index.html` via `navigator.serviceWorker.register('/morning-mobility/sw.js')` on `window load`.
- **Apple PWA meta tags added:**
  - `apple-mobile-web-app-title` → `"Mobility"`
  - `apple-touch-icon` → `icon-192.png`
  - `mobile-web-app-capable` for Android Chrome
- **`<link rel="manifest">`** linked in `<head>`.
- **Favicon links** for 192 and 512 px PNG icons.

**Fixed:**

- **YouTube embed URLs** now include `&origin=https://maunoahlgren.github.io` to satisfy YouTube's domain-verification requirement and prevent "Video unavailable" errors on GitHub Pages.

**Known issues / notes:**

- iOS does not show a native install banner — users must manually use Share → Add to Home Screen. All required meta tags are in place.
- YouTube video availability depends on the video IDs being publicly accessible; original IDs retained (well-known exercise demos).
- `generate-icons.js` left in repo root for future icon regeneration; not served to users.

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
