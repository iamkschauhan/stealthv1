# StealthApp

Plan-making social app (Vite + React + TypeScript + Tailwind + Firebase).

**Repo:** [iamkschauhan/stealthv1](https://github.com/iamkschauhan/stealthv1)  
**Firebase:** [datingpro-c8638](https://console.firebase.google.com/project/datingpro-c8638/overview)  
**Docs:** [`docs/FFD.md`](docs/FFD.md) · [`docs/SPRINT_PLAN.md`](docs/SPRINT_PLAN.md) · [`docs/FIREBASE.md`](docs/FIREBASE.md)

## Cold install

```bash
git clone https://github.com/iamkschauhan/stealthv1.git
cd stealthv1
cp .env.example .env   # fill VITE_FIREBASE_* (+ optional reCAPTCHA site key)
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

### Test phones (no SMS)

| Phone (US) | OTP |
|---|---|
| `5555550100` | `123456` |
| `5555550101` | `654321` |

Use two browsers/profiles for host + guest happy path.

### Happy path smoke

1. Sign in (test phone) → finish onboarding → land on `/home`
2. Create a plan → appears on feed
3. Second account joins / watches
4. Host accepts requests from Notifications
5. Open Messages for the plan thread
6. Profile → edit hometown → Settings → Log out

### Seed demo plans (optional)

Signed in as host, DevTools console:

```js
const { seedDemoBundle } = await import('/src/data/seed.ts')
await seedDemoBundle('<your-uid>', { displayName: 'Alex' })
```

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Local Vite server |
| `npm run build` | Typecheck + production build |
| `npm run lint` | Oxlint |
| `npm run preview` | Serve `dist/` |

## Deploy Firebase rules

```bash
npx firebase deploy --only "firestore:rules,firestore:indexes,storage" --project datingpro-c8638
```

See [`docs/FIREBASE.md`](docs/FIREBASE.md) for env vars, App Check, and Console links.

## Stack

React 19 · TypeScript · Tailwind v4 · Lucide · React Router · Firebase Auth / Firestore / Storage
