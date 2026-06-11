# 🎓 One Campus

**Your campus. Your people. One app.**

One Campus is a mobile and web platform that helps college and high school students connect through clubs, events, and campus life — starting at Purdue University, with a goal of reaching **10,000 students**.

Built by a student, for students. 💜

---

## 🚀 What's Inside

| File / Folder | What it is |
|---|---|
| `index.html` | Marketing website with portal links and **real Google sign-in** (Firebase) |
| `demo.html` | Full student app demo — works in any browser, fits phone screens |
| `admin.html` | Admin dashboard — user management, content moderation, ad revenue |
| `business.html` | Advertiser portal — create ad campaigns, analytics, billing |
| `native-app/` | **True native app** (React Native + Expo SDK 54) — runs in Expo Go |
| `daily-updates/` | Daily progress reports |
| `auth.js` | Firebase authentication for the website |

## ✨ App Features

### For Students
- 🧭 **Discover** — swipe through clubs at your campus, filter by interest (Tech, Engineering, Business, Science, Arts, Sports)
- 📅 **Events** — campus events calendar, RSVP with one tap, create your own events
- 🗺️ **Campus** — see which friends are at WALC, PMU, the CoRec & more; join clubs where they meet
- 🏆 **Points** — earn points for joining clubs, RSVPing, and making friends (anti-farming protected)
- 🎁 **Rewards Shop** — spend points on real rewards: free Greyhouse coffee, Domino's discounts, Chick-fil-A, or donate to a student-voted charity
- 👥 **Connect** — social feed with posts, likes, and real DM chats
- ⚙️ **Settings** — dark mode, 5 accent color themes, editable profile, notification controls, quiet hours

### Premium — $7.99/month 👑
- ⚡ **2x points** on every action
- 🤖 **AI Day/Night Organizer** — your campus day, planned for you
- 🌎 **Cross-campus access** — browse clubs at IU Bloomington, Notre Dame, Butler, Ball State, Rose-Hulman & IUPUI
- 💳 Checkout flow with Apple Pay and card (demo)

### Monetization
- 📢 Sponsored posts in the social feed (Domino's, Chegg, Spotify, Amazon Prime)
- 🏪 Sponsor-funded rewards shop
- 👑 Premium subscriptions

## 🔧 Tech Stack

- **Website & demos:** HTML / CSS / JavaScript (no build step — just open in a browser)
- **Native app:** React Native + Expo SDK 54
- **Backend:** Firebase (Authentication + Firestore)
  - Google sign-in on the web
  - Email/password accounts in the native app
  - User data (points, clubs, RSVPs, settings) syncs to the cloud per account
- **Maps:** Leaflet + OpenStreetMap (web demo)
- **Charts:** Chart.js (admin & business portals)

## 📱 Running the Native App

```bash
cd native-app
npm install
npx expo start
```

Then scan the QR code (or enter the `exp://` URL) in **Expo Go** on your phone. Requires Expo Go with SDK 54.

> Note: the full native project lives locally at `onecampus-app/` — this repo keeps the source files (`App.js`, `package.json`, `app.json`) backed up.

## 🌐 Running the Website

Just open `index.html` in a browser — or serve it locally for Google sign-in to work:

```bash
npx serve -l 3000 .
```

Then visit `http://localhost:3000`.

## 🗺️ Roadmap

- [x] Website with student / business / admin portals
- [x] Investor demo app with Purdue data
- [x] Points system with anti-farming
- [x] Ad monetization in social feed
- [x] Premium subscription with checkout flow
- [x] DM chat
- [x] Rewards shop with charity donations
- [x] True native app (React Native / Expo SDK 54)
- [x] Real authentication (Firebase — Google + email/password)
- [x] Cloud backend (Firestore)
- [ ] GitHub Pages / public link
- [ ] Publish to Expo (EAS Update)
- [ ] Onboarding flow (pick campus, major, interests)
- [ ] Real payments (Stripe)
- [ ] App Store / Google Play release
- [ ] 10,000 students 🎯

## 👥 Team

- **Leighton Bailey** — Founder / Lead Business Director

---

*One Campus · Made with 💜 at Purdue*
