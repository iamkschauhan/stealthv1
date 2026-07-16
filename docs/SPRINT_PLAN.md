# StealthApp — Integration Sprint Plan

**Goal:** Turn the complete UI into a working product on Firebase  
**Project:** [datingpro-c8638](https://console.firebase.google.com/project/datingpro-c8638/overview)  
**Firestore:** [(default)](https://console.firebase.google.com/project/datingpro-c8638/firestore/databases/-default-/data)  
**Storage:** `gs://datingpro-c8638.firebasestorage.app`  
**Repo:** [iamkschauhan/stealthv1](https://github.com/iamkschauhan/stealthv1)  
**Source of truth:** `docs/FFD.md` + UI mocks + existing React screens  

**Operating rule:** Agent implements everything (schema, rules, Auth wiring, Storage, seed data, UI hooks, deploy). No owner console work unless Google blocks automated setup.

**Definition of Done (product):** A real user can sign in with phone OTP, finish onboarding, create a plan with photos, appear on the feed, join/watch, get notifications, message in a plan thread, manage My Plans, edit profile/settings, and log out — all backed by Firestore + Storage (no mock-only happy path for core flows).

---

## Current baseline

| Layer | Status |
|---|---|
| UI (all FFD modules) | Done |
| Firebase web app + `.env` client | Done |
| Auth providers (Phone + Email) | Enabled |
| Firestore DB `(default)` + rules | Done (S7 tightened) |
| Storage bucket + rules | Done |
| Auth gate / session routing | Done |
| Real CRUD / queries / Storage uploads | Done (S1–S6) |
| Hardening / seed / README | Done (S7) |

---

## Architecture (target)

```
React UI (existing)
  → AuthContext (onAuthStateChanged)
  → repositories (users, plans, joins, notifications, threads, settings)
  → Firebase Auth · Firestore · Storage
```

- Keep screens; replace mock `data.ts` / contexts with repository hooks.
- Prefer thin `src/data/` (types + repos) over scattering Firebase calls in UI.
- Optimistic UI only where FFD already feels instant; always reconcile with server.
- Phone Auth needs reCAPTCHA (invisible) on web — wire once in onboarding shell.

### Firestore collections (v1)

| Collection | Purpose |
|---|---|
| `users/{uid}` | Profile, lifestyle answers, prefs, onboardingComplete |
| `users/{uid}/photos/{photoId}` | Photo metadata (URL, order, tags) |
| `plans/{planId}` | Hosted plans (activity, location, when, type, spots, status) |
| `plans/{planId}/members/{uid}` | Role: host \| going \| invited \| waiting \| requested |
| `plans/{planId}/ratings/{uid}` | Past ratings |
| `watches/{uid}_{planId}` | Watching index |
| `reports/{reportId}` | Plan / account reports |
| `editRequests/{id}` | Request-to-edit |
| `notifications/{id}` | Inbox rows + action state |
| `threads/{threadId}` | Plan chat threads |
| `threads/{threadId}/messages/{id}` | Chat bubbles + attachments |
| `blocks/{uid}/blocked/{otherUid}` | Privacy blocks |
| `feedHidden/{uid}/plans/{planId}` | “Not interested” |

### Storage paths (v1)

| Path | Use |
|---|---|
| `users/{uid}/avatar.jpg` | Profile photo |
| `users/{uid}/gallery/{id}` | Extra photos |
| `users/{uid}/verify/{id}` | Verify-yourself uploads |
| `plans/{planId}/cover/{id}` | Plan imagery |
| `plans/{planId}/past/{id}` | Past plan uploads |
| `reports/{uid}/{id}` | Report attachments |
| `chat/{threadId}/{id}` | Message photos |

### Plan lifecycle (status)

`draft` → `open` → `full` → `confirmed` → `past` · or `cancelled`

Join path: open spots → `going`; full → `waiting`; host Accept from requests → `going`.

---

## Sprint overview

| Sprint | Name | Outcome | Est. |
|---|---|---|---|
| **S0** | Platform lock-in | Storage rules live, schema types, seed helpers, Auth shell | ✅ Done |
| **S1** | Auth + Onboarding | Real phone login → profile written → gate to `/home` | ✅ Done |
| **S2** | Create + Host manage | Real plans in Firestore + Storage; host CRUD | ✅ Done |
| **S3** | Feed + discovery | Live feed, filter/search, join/watch/report | ✅ Done |
| **S4** | My Plans | Watching / Requested / Upcoming / Past + rate/upload | ✅ Done |
| **S5** | Notify + Messages | Real inbox + plan threads + photo attach | ✅ Done |
| **S6** | Profile + Settings | Edit profile, prefs, logout/delete, invite | ✅ Done |
| **S7** | Hardening | Rules tighten, indexes, empty/error states, seed demo, ship | ✅ Done |

**Total:** ~3–4 weeks of focused agent work (sequential; some S5/S6 can overlap after S3).

---

## Sprint 0 — Platform lock-in

**Done when:** App boots with Firebase session listener; Storage rules deployed; TypeScript data model + repo stubs exist; protected routes redirect unauthenticated users to onboarding.

### Tasks
1. Deploy `storage.rules` to `datingpro-c8638.firebasestorage.app`.
2. Expand `firestore.rules` for v1 collections (owner / member / public-read patterns).
3. Add `firestore.indexes.json` stubs for feed + plans queries.
4. Create `src/data/types.ts` + `src/data/{users,plans,joins,notifications,threads,storage}.ts`.
5. Add `AuthProvider` + `useAuth`; wire `onAuthStateChanged` in `App`.
6. Route guard: no session → `/onboarding/*`; session + `!onboardingComplete` → resume onboarding; complete → `/home`.
7. Dev seed script (optional) writing 2–3 demo plans after first host exists.

### Exit criteria
- Rules deploy succeeds for Firestore + Storage.
- Hard refresh keeps session.
- Typecheck / build green.

---

## Sprint 1 — Auth + Onboarding (FFD §1)

**Done when:** Phone OTP works end-to-end; all onboarding steps persist; finish lands on home with real user doc.

### Tasks
1. Phone screen → `signInWithPhoneNumber` + invisible reCAPTCHA.
2. Verify-code → `confirmationResult.confirm(otp)`.
3. Upsert `users/{uid}` on first login (`createdAt`, `phone`).
4. Persist personal info, identity, pronouns, looking-for, lifestyle answers to user doc.
5. Upload avatar + gallery to Storage; write photo URLs/metadata.
6. Location fields + notification opt-in flags.
7. Verify-yourself image upload (stored; manual review later).
8. Set `onboardingComplete: true` on last step → navigate `/home`.
9. Replace mock onboarding context with Firestore-backed draft (resume mid-flow).

### Exit criteria
- New number → OTP → profile photos → home.
- User visible in [Firestore data](https://console.firebase.google.com/project/datingpro-c8638/firestore/databases/-default-/data).
- Photos visible under Storage `users/{uid}/…`.

---

## Sprint 2 — Create & Manage Plan (FFD §3)

**Done when:** Host can post/edit/delete a plan; members + requests are real documents.

### Tasks
1. Create form → `plans/{id}` + `members/{host}=host`; status `open`.
2. Optional cover upload to `plans/{id}/cover/…`.
3. Posting splash → host view from live doc (not mock).
4. Edit plan updates Firestore; delete soft-cancels or deletes + storage cleanup.
5. Invite friends / reserve spots → `members` role `invited` + invite token/link fields.
6. Requests list: Accept / Deny updates member role + writes notification.
7. Remove participant / delete invite.
8. Share modal keeps client copy; deep link uses real `planId`.

### Exit criteria
- Create → appears in Firestore; host manage mutations reflected immediately.
- Second test account can be invited / request join (prep for S3).

---

## Sprint 3 — Home Feed & discovery (FFD §2)

**Done when:** Feed reads live open plans; join/watch/share/report/not-interested work.

### Tasks
1. Feed query: `status in [open, full]` · not blocked · not hidden · optional geo/date filters.
2. Category pills + filter sheet map to query constraints / client filters.
3. Search overlay: plans by activity/location; people by displayName.
4. Expand sheet from live plan + members count.
5. Join → member `going` or `waiting`; update spots / status `full`.
6. Watch → `watches` doc; unwatch deletes.
7. Report → `reports` + optional Storage attach.
8. Request to edit → `editRequests`.
9. Not interested → `feedHidden`.
10. Made-plans banner from user’s upcoming count.

### Exit criteria
- Two browsers/users: host posts, guest sees card, joins, host sees request/going.
- Report creates Firestore doc.

---

## Sprint 4 — My Plans (FFD §4)

**Done when:** Four tabs are query-backed; detail actions mutate server state.

### Tasks
1. Hub tabs:
   - Watching ← `watches`
   - Requested ← `members` role requested/waiting
   - Upcoming ← going/host + not past
   - Past ← status `past` or endTime &lt; now
2. Watching detail: join / waiting pool / stop watching / couples gate (link-account stub → user field).
3. Requested: cancel request.
4. Upcoming: leave (if allowed) · confirmed lock · calendar toast · chat deep link.
5. Past: upload photos + caption/tags · rate 1–10 · delete · share kinds.
6. Card `…` menus wired to real share/rate/delete.

### Exit criteria
- Same plan moves Watching → Requested → Upcoming → Past as lifecycle advances.
- Ratings + past photos stored.

---

## Sprint 5 — Notifications & Messages (FFD §5)

**Done when:** Bell and mail show real data; chat sends/receives with optional photos.

### Tasks
1. Write notifications on: join request, accept/deny, invite, edit request, friend-ish events (minimal set).
2. Notifications page: list + Accept/Deny/Join actions mutate + mark read.
3. Create/open `threads` when plan has ≥2 members (or on first message).
4. Messages list: unread counts; chat composer writes `messages`.
5. Photo attach → Storage `chat/{threadId}/…` + message doc.
6. Search-in-chat client-side over loaded messages.
7. Manage → view plan / delete thread (hide for user).
8. Unread badge on nav mail icon.

### Exit criteria
- Guest joins → host gets notification → accept → both can chat.

---

## Sprint 6 — Profile & Settings (FFD §6–7)

**Done when:** Profile reads/writes user doc; settings persist; logout/delete work.

### Tasks
1. Profile hub from `users/{uid}` + photos subcollection.
2. Tabs: Photos / About / Activities (hosted+past) / Friends (simple follow or mutual going — v1: friends list field or `friends` subcollection).
3. Edit hometown/company/ethnicity + change photo + verify identity upload.
4. Settings: plan-type prefs, theme, notification category toggles (Push|Email flags on user).
5. Privacy: private mode, blocked users, static tips/principles.
6. Invite friends: `appInvite` share (client).
7. Contact / report problem → Firestore `supportTickets`.
8. Logout → `signOut` → splash.
9. Delete account → type DELETE → delete user data + Storage + Auth user (batched best-effort).

### Exit criteria
- Edit profile survives refresh; logout clears session; delete removes Auth user.

---

## Sprint 7 — Hardening & ship

**Done when:** Rules least-privilege, indexes deployed, empty/error UI, demo seed, README runbook, push to `stealthv1`.

### Tasks
1. Tighten rules (no over-broad reads); add composite indexes from failed queries.
2. Loading / empty / error states on feed, plans, chat, profile.
3. reCAPTCHA / Auth error copy; rate-limit UX on OTP resend.
4. Seed demo users/plans for screenshots (script).
5. Optional: Cloud Function later for phone fanout / scheduled `open→past` — **not required for v1** if client cron/ cron-on-read advances past.
6. Update `docs/FIREBASE.md` + FFD “backend status”.
7. Commit + push `main` on [stealthv1](https://github.com/iamkschauhan/stealthv1).

### Exit criteria
- Cold install: `.env` → `npm run dev` → full happy path on two accounts.
- Build + lint clean.

---

## Priority cuts (if timeboxed)

Ship order if we must truncate:

1. S0 + S1 + S2 + Join on feed (slice of S3)  
2. My Plans upcoming/past (slice of S4)  
3. Notifications accept/deny (slice of S5)  
4. Profile edit + logout (slice of S6)  

Defer: couples link-account, email notification delivery, dark mode persistence polish, Cloud Functions, full Friends graph, Change password (phone-only users).

---

## Test matrix (per sprint)

| Case | Accounts |
|---|---|
| Host A creates plan | A |
| Guest B sees feed + joins | A + B |
| Host accepts request | A + B |
| Chat + photo | A + B |
| B watches then stops | B |
| Past rate + upload | A or B after status past |
| Logout / delete | A or B |

Use Firebase Auth test numbers where possible; otherwise two real devices/browsers.

---

## Execution order (agent)

1. Confirm Storage rules deploy + Auth phone still enabled.  
2. Start **S0** immediately after this plan is approved.  
3. Land each sprint as a coherent commit(s) on `main` (or `sprint/N` then merge — default `main` unless asked).  
4. Do not ask the owner to click Console unless an API is permission-blocked.

---

## Approval

**Next step after OK:** Begin Sprint 0 (Storage rules deploy, AuthProvider, schema/repos, route guards).
