# One Campus — Project State & Handoff

> Read this first in a new session. It captures everything about the project, accounts, file layout, what's built, what's pending, and the gotchas.

## What it is
**One Campus** — a mobile + web app for **college and high school students** to connect through clubs, events, and campus life. First campus: **Purdue University**. Founder: **Leighton Bailey** (high school student). Goal: **10,000 users**.

## The two surfaces
1. **Native mobile app = THE PRODUCT** (React Native + Expo SDK 54)
   - Local dir: `C:\Users\krisb\onecampus-app` — the entire app is in **`App.js`**.
   - Published to **Expo** via EAS Update on branch/channel **`production`**.
   - Expo owner org: **`one-campus`** (account `leightonbailey4523@gmail.com` is Owner).
   - Project ID: `9c104cf3-538a-4a62-993d-018c35693c9a`.
   - Runs in **Expo Go** (SDK 54) via QR. App-open link: `exp://u.expo.dev/9c104cf3-538a-4a62-993d-018c35693c9a?channel-name=production&runtime-version=exposdk:54.0.0`
2. **Website + web apps** (vanilla HTML/CSS/JS) in the GitHub repo:
   - `index.html` — landing page (drives app downloads), Firebase Google sign-in.
   - `demo.html` — student web app (browser version of One Campus); Firebase auth + Firestore per-user save.
   - `business.html` — advertiser portal; Firebase login; responsive; $10/day ad pricing.
   - `admin.html` — admin dashboard; locked behind Firebase login + **email allowlist** (`ADMIN_EMAILS`).
   - `app-qr.html` — standalone QR page to get the app.
   - `auth.js` — website Google sign-in + routing into demo.html.
   - `app.js`, `styles.css` — landing page logic/styles.
   - `logo.png` (full logo), `logo-icon.png` (cropped C-icon).
   - `native-app/` — **backup copy** of the native app source (App.js, app.json, package.json, logos).
   - `daily-updates/leighton-bailey/` — daily progress reports.

## Accounts & services
- **GitHub repo:** `sokainc/onecampus` (org "sokainc"). ⚠️ The user is a **collaborator, NOT admin** → cannot enable GitHub Pages. Local repo: `C:\Users\krisb\OneDrive\Documents\GitHub\onecampus`.
- **Firebase project:** `one-campus-acdc6`. Auth: **Google + Email/Password enabled**. Firestore: **enabled**. Web config apiKey `AIzaSyBZme2DEX_aubcTBjMviqgEpPk0Z15CzGs` (public, in code).
- **Netlify (live public website):** **https://gleaming-mochi-1d023d.netlify.app** — deployed by dragging the `C:\Users\krisb\onecampus-site` folder/zip to app.netlify.com/drop. ⚠️ **Manual re-deploy** (not auto from GitHub); may be unclaimed.
- **Expo org:** `one-campus`.

## Tech stack
- Native: React Native, Expo SDK 54, Firebase (Auth + Firestore), `react-native-maps`, `react-native-webview`, `expo-location`, `expo-notifications`.
- Web: vanilla HTML/CSS/JS, Firebase web SDK v10, Chart.js (dashboards), Leaflet (web demo map), Google Maps embed (directions).

## Native app features (student side) — all built
- **Auth:** email/password login screen. (Google sign-in is web-only; native needs a dev build.)
- **Onboarding** (first launch): campus → major → interests, saved to Firestore. Home campus is unlocked free.
- **Discover:** club cards with representative emoji icons, **tap → full club detail page**, swipe join/skip/super, interest filter, club search, recommendation sort, campus toggle (home free, others Premium).
- **Events:** week calendar, RSVP (conflict detection + schedules a local notification reminder), create event, availability filter, "My Day" time-blocking.
- **Campus:** native map (Apple/Google Maps) with building/friend/club pins, **real GPS** ("My location"), Google Maps walking **directions** in a WebView.
- **Points:** hero, badges, weekly leaderboard, **Rewards Shop** (Greyhouse/Domino's/Chick-fil-A/charity) with redemption codes. Fresh accounts start at **0 points**.
- **Connect:** **REAL shared feed** (Firestore `posts` collection — post/like/comment, real-time). Friends list + DMs (DMs are still **canned auto-replies** — real DMs pending).
- **Premium ($7.99/mo):** paywall → Apple Pay / card checkout (demo) → 2x points, AI organizer, cross-campus.
- **Settings:** dark mode, 5 accent colors, editable profile, notifications (+ test notification), location toggle, **Switch to Business Portal** (native screens), reset demo data, sign out.
- **Local notifications:** event reminders + test button. (Remote cross-user push pending.)
- **Branding:** logo in header/login/splash; app icon set in config (shows on a real build).
- **Business Portal (native):** Dashboard / Campaigns / Create Ad; $10/day flat ad pricing.

## Pending / known gaps
- **🔴 Firestore `posts` rule** must be added in Firebase console or the shared feed won't work. Rule:
  ```
  match /posts/{postId} {
    allow read: if request.auth != null;
    allow create: if request.auth != null;
    allow update: if request.auth != null;
    allow delete: if request.auth != null && resource.data.uid == request.auth.uid;
  }
  ```
- **Firebase Authorized domains:** add `gleaming-mochi-1d023d.netlify.app` (Auth → Settings) so Google sign-in works on the live site + business WebView.
- **Real DMs** (currently canned auto-replies) — next big student-side build.
- **Friends are hardcoded** (Maya, Jordan, etc.), not real users.
- **GitHub Pages** blocked (user not admin on sokainc org).
- Deferred (need paid accounts / parent-guardian since user is under 18): real cross-user push, **App Store build** (Apple Dev $99), real **Stripe** payments, **Claude API** AI organizer (Anthropic billing).

## Workflow & gotchas
- User is on **iPhone + Windows**; tests via **Expo Go** → after every publish: **shake phone → Reload**. Internet is sometimes flaky.
- **Publish flow:** edit `C:\Users\krisb\onecampus-app\App.js` → `npx eas-cli update --branch production --message "..."` → copy App.js (and app.json/package.json if changed) to `native-app/` backup → `git add` + commit + push.
- **PowerShell:** Node is at `C:\Program Files\nodejs` — prefix commands with `$env:Path = "C:\Program Files\nodejs;$env:Path"`. Plain `npx` is blocked by execution policy → use `npx.cmd` or the PATH prefix. `gh` CLI is NOT installed.
- **Auto-commit + push ALL One Campus work** to GitHub without asking each time (standing instruction). Maintain `daily-updates/` files.
- **Keep features real** — no fake/placeholder buttons; be honest about paid gates and limitations.
