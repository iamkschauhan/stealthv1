# Firebase (datingpro-c8638)

Project: [datingpro-c8638](https://console.firebase.google.com/project/datingpro-c8638/overview)  
Web app: **StealthApp** (`1:914222547298:web:402ce3a9be6d2c3ad56c3b`)  
Repo: [iamkschauhan/stealthv1](https://github.com/iamkschauhan/stealthv1)

## Local setup

1. Copy `.env.example` → `.env` (do not commit `.env`).
2. Fill `VITE_FIREBASE_*` from Firebase Console → Project settings → Your apps.
3. Optional: `VITE_RECAPTCHA_ENTERPRISE_SITE_KEY` for production App Check (skipped in local DEV by default).
4. `npm install` then `npm run dev`.

## Client usage

```ts
import { getFirebaseAuth, getDb, getFirebaseStorage } from './firebase'
```

- **Auth** — Phone + Email enabled
- **Firestore** — `(default)` (nam5); rules in `firestore.rules`
- **Storage** — `gs://datingpro-c8638.firebasestorage.app`; rules in `storage.rules`

## Deploy rules / indexes

```bash
npx firebase deploy --only "firestore:rules,firestore:indexes,storage" --project datingpro-c8638
```

PowerShell: quote the `--only` list as above.

## Backend status (S0–S7)

| Area | Status |
|---|---|
| Auth gate + phone OTP | Live |
| Onboarding → `users/{uid}` + Storage photos | Live |
| Create / host manage plans | Live |
| Feed join / watch / report | Live |
| My Plans tabs + rate / past upload | Live |
| Notifications + plan threads + chat photos | Live |
| Profile + settings + logout / delete | Live |
| Rules least-privilege pass | Live (S7) |
| Demo seed helpers | `src/data/seed.ts` |

## SMS region policy (required for real numbers)

If you see `SMS unable to be sent until this region enabled` / `auth/operation-not-allowed`:

1. Open [Authentication → Settings](https://console.firebase.google.com/project/datingpro-c8638/authentication/settings)
2. Under **SMS region policy**, allow the country (e.g. **IN**, **US**) — or allow all regions while testing
3. Save, wait about a minute, retry

## reCAPTCHA / App Check

Local DEV skips App Check by default (avoids `appCheck/recaptcha-error`). Phone Auth sets `appVerificationDisabledForTesting` so **test numbers** work without a real captcha.

Production: set a valid reCAPTCHA Enterprise site key as `VITE_RECAPTCHA_ENTERPRISE_SITE_KEY`. Force App Check in DEV only with `VITE_APP_CHECK_FORCE=true`.

## Test phone numbers (no SMS)

| Phone | Code |
|---|---|
| `+1 555-555-0100` | `123456` |
| `+1 555-555-0101` | `654321` |

Use country **United States (+1)** and digits `5555550100`. Register them under Authentication → Phone → Phone numbers for testing if missing.

## Seed (dev)

```js
const { seedDemoBundle } = await import('/src/data/seed.ts')
await seedDemoBundle(firebaseAuthUid, { displayName: 'Alex', guestUid: optionalGuestUid })
```

## App wiring

- `src/auth` — `AuthProvider`, guards, `phoneAuth`, friendly Auth errors
- `src/data` — types + repos (users, plans, joins, notifications, threads, account, seed)
- `src/onboarding` · `src/feed` · `src/create` · `src/plans` · `src/notify` · `src/profile` · `src/settings`

## Console links

- [Overview](https://console.firebase.google.com/project/datingpro-c8638/overview)
- [Firestore](https://console.firebase.google.com/project/datingpro-c8638/firestore)
- [Storage](https://console.firebase.google.com/project/datingpro-c8638/storage)
- [Authentication](https://console.firebase.google.com/project/datingpro-c8638/authentication)
