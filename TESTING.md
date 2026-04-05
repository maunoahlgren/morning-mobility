# Manual Test Checklist — Morning Mobility PWA

Run through these checks in a browser (preferably mobile Chrome or Safari) after any change to `index.html`.

Mark each item **Pass / Fail / N/A** and note the device/browser/OS when filing a report.

---

## 1. Day Detection

| # | Step | Expected result |
|---|------|-----------------|
| 1.1 | Open the app on a **Tuesday** (day index 2). | Day pill shows "🏒 Skate day" (yellow badge). Today tab renders three sections: Daily Mobility, Pre-Skate Warm-Up, Post-Skate Cool-Down. |
| 1.2 | Open the app on a **Thursday** (day index 4). | Day pill shows "🏒 Skate day". Same three sections as Tuesday. |
| 1.3 | Open the app on a **Sunday** (day index 0). | Day pill shows "🏃 Run day" (white badge). Today tab renders: Daily Mobility, Pre-Run Warm-Up, Post-Run Cool-Down. |
| 1.4 | Open the app on a **Saturday** (day index 6). | Day pill shows "🏃 Run day". Same three sections as Sunday. |
| 1.5 | Open the app on **Monday, Wednesday, or Friday** (day indices 1, 3, 5). | Day pill shows "✦ Mobility only" (translucent badge). Today tab renders a single section: Daily Mobility (4 exercises). |
| 1.6 | Check the header date label. | Shows today's date in the format "Sat 4 Apr" (abbreviated weekday, numeric day, abbreviated month). |

---

## 2. Tab Navigation

| # | Step | Expected result |
|---|------|-----------------|
| 2.1 | On load, check which tab is active. | "Today" tab is active (yellow underline, yellow text). Today view is visible. |
| 2.2 | Tap the **Week** tab. | Week view appears. Today tab loses active state. Week tab gains yellow underline. |
| 2.3 | Tap the **Why** tab. | Why view appears. Week tab loses active state. Why tab gains active state. |
| 2.4 | Tap **Today** from the Why tab. | Today view reappears. Only one view is visible at a time. |
| 2.5 | Tap a day card in the Week tab. | Navigates to Today tab. |

---

## 3. Exercise Card Accordion

| # | Step | Expected result |
|---|------|-----------------|
| 3.1 | Tap any exercise card header. | Card expands to show video, cue list, timer (if applicable), and "Mark as done" button. Chevron rotates 90°. |
| 3.2 | Tap the same card header again. | Card collapses. Chevron returns to original position. |
| 3.3 | Open card A, then tap card B. | Card B opens. Card A closes automatically. Only one card is open at a time. |
| 3.4 | Open a completed (faded) card. | Card still expands; "Mark as done" button shows "✓ Done" and is green. |

---

## 4. Timer

| # | Step | Expected result |
|---|------|-----------------|
| 4.1 | Open an exercise that has a timer (e.g., 90/90 Hip Stretch, 90 sec). | Timer displays "1:30". Start button is visible. |
| 4.2 | Tap **Start**. | Timer counts down every second. Button label changes to "Pause". |
| 4.3 | Tap **Pause** while running. | Countdown stops. Button label changes to "Resume". |
| 4.4 | Tap **Resume**. | Countdown resumes from where it was paused. |
| 4.5 | Tap **Reset** at any point. | Timer returns to the original duration. Button label resets to "Start". |
| 4.6 | Let the timer run to completion (0:00). | Display shows "0:00". Button label changes to "Done ✓". Device vibrates (two short pulses) if vibration is supported. |
| 4.7 | Check an exercise without a timer (e.g., Dead Bug — "3 × 8 reps"). | No timer section is rendered for that card. |

---

## 5. Mark as Done / localStorage Persistence

| # | Step | Expected result |
|---|------|-----------------|
| 5.1 | Tap "Mark as done" on an exercise. | Button turns green ("✓ Done"). Card gains a green left border and fades (opacity ~0.55). Progress bar advances. Progress label updates (e.g., "1 of 11 done"). |
| 5.2 | Tap "✓ Done" again on the same exercise. | Exercise is un-marked. Card returns to normal appearance. Progress decrements. |
| 5.3 | Mark two exercises as done, then hard-refresh the page. | Both exercises are still marked as done. Progress bar reflects the correct count. |
| 5.4 | Open browser DevTools → Application → Local Storage. | Key `ilves_completed` exists. Its value is a JSON object whose keys are `{dateString}{exerciseId}` strings (e.g., `"Sat Apr 05 2025d1": true`). |
| 5.5 | Delete the `ilves_completed` key and reload. | All exercises appear incomplete. Progress bar is at 0%. |
| 5.6 | Mark exercises done on day X, then check on day Y. | Day Y shows 0 completed (progress is per-day; each day key includes the date string). |

---

## 6. "Begin Today's Routine" Button

| # | Step | Expected result |
|---|------|-----------------|
| 6.1 | With no exercises completed, tap the yellow "Begin Today's Routine" button. | Page scrolls to the first exercise card and opens it. |
| 6.2 | Mark the first exercise as done and tap the button again. | Page scrolls to and opens the second (first incomplete) exercise. |
| 6.3 | Mark all exercises as done and tap the button. | Nothing happens (no incomplete card to scroll to). No error in console. |

---

## 7. Week Tab — Badges and Today Highlight

| # | Step | Expected result |
|---|------|-----------------|
| 7.1 | Open the Week tab. | All 7 days are listed (Sunday through Saturday). |
| 7.2 | Check today's card. | It has a yellow left border. Its day name is followed by a small "← today" label. |
| 7.3 | Verify badge colours: skate days (Tue, Thu) show yellow "🏒 Skate" badge; run days (Sun, Sat) show green-tint "🏃 Run" badge; rest days (Mon, Wed, Fri) show grey "Mobility" badge. | All badges match expected colours. |
| 7.4 | Check the description text under each day name. | Skate: "Daily + Pre/Post skate · ~35 min". Run: "Daily + Pre/Post run · ~30 min". Rest: "Daily mobility · ~12 min". |

---

## 8. Why Tab — Ilves Banner and About Cards

| # | Step | Expected result |
|---|------|-----------------|
| 8.1 | Open the Why tab. | "Be More Ilves" banner is visible at the top with a green background, hockey stick emoji, yellow bold headline, and white subline "Every day is your day if you claim it." |
| 8.2 | Count the about cards below the banner. | Exactly 4 cards are present. |
| 8.3 | Verify card titles. | "Why this routine?", "The psoas muscle", "How to use this", "Sequence matters". |
| 8.4 | Each card has a yellow left border and a green `<h3>` heading. | Visual check passes. |

---

## 9. PWA — Add to Home Screen

| # | Step | Expected result |
|---|------|-----------------|
| 9.1 | Open the app in **Safari on iOS**. Tap Share → "Add to Home Screen". | App installs. Icon appears on the home screen. |
| 9.2 | Launch from the home screen icon on iOS. | App opens full-screen (no browser chrome). Status bar is dark/translucent. |
| 9.3 | Open in **Chrome on Android**. Browser prompts "Add to Home screen" (or use the menu). | App installs as a PWA. |
| 9.4 | Check the theme color in Android Chrome (or the meta tag in DevTools). | Browser toolbar matches `#006934` (Ilves green). |
| 9.5 | Open DevTools → Application → Manifest. | Manifest loads with no errors. `name` is "Morning Mobility", `start_url` is `/morning-mobility/`, icons resolve to `icons/icon-192.png` and `icons/icon-512.png`. |
| 9.6 | In DevTools → Application → Service Workers. | `sw.js` is registered and active. Cache name is `morning-mobility-v8`. |
| 9.7 | In DevTools → Application → Manifest → Installability. | No warnings. "Install" button is available (Chrome). |

---

## 10. localStorage Key Verification

| # | Step | Expected result |
|---|------|-----------------|
| 10.1 | Mark any exercise as done. Open DevTools → Application → Local Storage → the page origin. | One key named exactly `ilves_completed` exists (no other keys are written by the app). |
| 10.2 | Inspect the value. | Valid JSON object, e.g. `{"Sat Apr 05 2025d1":true}`. |

---

*Last updated: 2026-04-04*
