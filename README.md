# BJJ Check-in (React + Tailwind + Firebase)

A single‑page, iPad‑friendly attendance app for a BJJ gym.

## Features

- **Practitioner View (default):**
  - Scrollable list of members with search-as-you-type
  - Large, touch-friendly **Check In** buttons
  - **New Member** modal (name, belt, stripes)
  - Subtle **Coach Area** button

- **Coach View (password = `bjj`):**
  - Simple password screen (no user accounts)
  - Dashboard with **Name, Belt, Stripes, Total Check-ins, Last Check-in**
  - Logout back to practitioner view

- **Firestore data model:**
  - `members` collection: `{ name, belt, stripes, createdAt }`
  - `attendance` collection: documents keyed by `${memberId}_${YYYY-MM-DD}`
    - `{ memberId, name, belt, stripes, date: 'YYYY-MM-DD', ts }`
  - Using deterministic keys ensures **one check-in per member per day**.

- **Offline‑resilient:** Firestore IndexedDB persistence enabled; entries sync once online.

---

## Quick Start

1. **Create Firebase project** → add a Web app → copy its config object.
2. **Enable Firestore** (in *Production* mode) in the Firebase Console.
3. In this project, open `src/firebase.js` and **paste your Firebase config** over the placeholders.
4. Install deps and run:

```bash
npm install
npm run dev
```

> Open the URL Vite prints (usually http://localhost:5173).

### Deploy

- Any static host works (Firebase Hosting, Vercel, Netlify).
- Consider enabling **Firebase App Check** to reduce abuse.
- For kiosk use on iPad, add to Home Screen from Safari for a full-screen experience.

---

## Firestore Security Rules (basic)

With no auth, allow-listing writes is hard. A simple starting point (test mode) is:

```
// WARNING: Public read/write. Add App Check or tighten rules for production.
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**Recommended:** Enforce App Check and consider per-IP restrictions via Cloud Functions, or add a simple password‑gated Cloud Function endpoint for writes.

---

## File Structure

```
bjj-checkin/
  src/
    components/
      BeltBadge.jsx
      CoachDashboard.jsx
      CoachLogin.jsx
      MemberCard.jsx
      NewMemberModal.jsx
    firebase.js
    App.jsx
    main.jsx
    index.css
    utils/date.js
  index.html
  package.json
  postcss.config.js
  tailwind.config.js
  vite.config.js
```

---

## Customization Tips

- Change the coach password in `src/App.jsx` → `COACH_PASSWORD`.
- Adjust belt colors in `BeltBadge.jsx`.
- Want duplicate check-ins per day? Replace the deterministic ID with `addDoc(...)` and remove the "already checked in" guard.
