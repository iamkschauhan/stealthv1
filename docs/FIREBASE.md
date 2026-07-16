# Firebase (datingpro-c8638)

Project: [datingpro-c8638](https://console.firebase.google.com/project/datingpro-c8638/overview)  
Web app: **StealthApp** (`1:914222547298:web:402ce3a9be6d2c3ad56c3b`)

## Local setup

1. Copy `.env.example` → `.env` (repo already has `.env` for this machine; do not commit it).
2. Fill `VITE_FIREBASE_*` from Firebase Console → Project settings → Your apps.
3. `npm install` then `npm run dev`.

## Client usage

```ts
import { getFirebaseAuth, getDb, getFirebaseStorage } from './firebase'
```

- **Auth** — phone / email (enable providers in Console → Authentication)
- **Firestore** — `(default)` database (nam5); rules in `firestore.rules`
- **Storage** — bucket `datingpro-c8638.firebasestorage.app`; rules in `storage.rules`

## One-time Console steps

1. **Storage** — open [Storage](https://console.firebase.google.com/project/datingpro-c8638/storage) → **Get Started** (CLI cannot create the default bucket until this is done). Then:

   ```bash
   firebase deploy --only storage --project datingpro-c8638
   ```

2. **Authentication** — [Authentication](https://console.firebase.google.com/project/datingpro-c8638/authentication) → enable **Phone** (and any other providers you need).

## Deploy rules

```bash
firebase deploy --only firestore:rules --project datingpro-c8638
firebase deploy --only storage --project datingpro-c8638   # after Storage Get Started
```

## Console links

- [Overview](https://console.firebase.google.com/project/datingpro-c8638/overview)
- [Firestore](https://console.firebase.google.com/project/datingpro-c8638/firestore)
- [Storage](https://console.firebase.google.com/project/datingpro-c8638/storage)
- [Authentication](https://console.firebase.google.com/project/datingpro-c8638/authentication)
