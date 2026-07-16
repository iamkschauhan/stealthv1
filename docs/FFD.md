# StealthApp — Feature Flow Document (FFD)

**Product:** StealthApp  
**Stack:** React · TypeScript · Tailwind v4 · Lucide · React Router  
**Layout rule:** Mobile bottom nav · `md+` sidebar · `xl+` tip panel · content card `max-w-xl` / `lg:max-w-2xl` (never a lonely phone column on desktop)  
**Last updated:** 2026-07-16

---

## Backend status

Firebase project **datingpro-c8638** backs the UI (Auth · Firestore · Storage). Integration sprints **S0–S7** are complete for the v1 happy path: phone OTP → onboarding → create/join plans → My Plans → notifications/chat → profile/settings → logout/delete. See `docs/FIREBASE.md` and `docs/SPRINT_PLAN.md`.

Deferred (not required for v1): couples link-account polish, email delivery, Cloud Functions fanout, full Friends graph.

---

## 0. App chrome & breakpoints

| Breakpoint | Behavior |
|---|---|
| **&lt; md** | Full-bleed content · fixed `BottomNav` · sheets from bottom · safe-area padding |
| **md+** | Sticky brand bar · `SideNav` (icons; labels at `lg+`) · content card with radius/border/shadow · sheets centered |
| **xl+** | Right tip / “next plans” panel (`w-80`) |

| Nav item | Route |
|---|---|
| Home | `/home` |
| Calendar | `/plans` |
| Create (+) | `/create` |
| Bell | `/notifications` |
| Profile | `/profile` |

Entry: `/` → `/onboarding/splash`. Catch-all `*` → splash.

---

## 1. Module: Onboarding

**Path:** `src/onboarding/` · Routes: `/onboarding/*`  
**Shell:** `OnboardingShell` — mobile full-bleed; `md+` gold brand panel + form  
**Brand:** StealthApp (Playfair / gold `#e8a03a`)

### 1.1 Splash & welcome
| Flow | Steps |
|---|---|
| **Cold start** | `/` → `/onboarding/splash` → auto/tap → `welcome` → `principles` → `phone` |

### 1.2 Auth (phone)
| Flow | Steps |
|---|---|
| **Phone verify** | `phone` → enter number → Continue → `verify-code` → OTP → Continue → `personal-info` |

### 1.3 Profile basics
| Flow | Steps |
|---|---|
| **Personal info** | `personal-info` → name / birthday → `birthday-confirm` → `identity` → `pronouns` → `looking-for` |
| **Photos** | `add-profile-photo` → `add-photos` → optional `upload-photo` → `location` |
| **Permissions** | `notifications` (opt-in) → `verify-yourself` |

### 1.4 Lifestyle questionnaire
| Flow | Steps |
|---|---|
| **About you** | `interests` → `your-life` → `relationship` → `children` → `education` → `ethnicity` → `exercise` → `habits` → `political` → **exit `/home`** |

**Exit:** Last Continue → home feed. Logout from settings returns to splash.

---

## 2. Module: Home Feed

**Path:** `src/HomeFeed.tsx` + `src/feed/` · Routes: `/home`, `/home/report/:postId`

### 2.1 Browse
| Flow | Steps |
|---|---|
| **Open feed** | Nav Home → `/home` → category pills · cards · optional made-plans banner |
| **Filter** | Filter icon → Filter sheet (type, distance, date, time, categories, couples/last-minute) → Apply |
| **Date range** | Filter → date → DatePicker sheet → confirm |
| **Search** | Search → overlay Plans/People → select or dismiss |

### 2.2 Plan discovery actions
| Flow | Steps |
|---|---|
| **Expand plan** | Tap card / expand → detail sheet → Join / Watch / Share / spots |
| **Join (open)** | Join → confirm → **Going** |
| **Join (full)** | Join → confirm → **waiting pool** |
| **Spots** | Spots link → people-joined sheet |
| **Watch from feed** | Watch on card/sheet → watching state |

### 2.3 Post menu (`…`)
| Flow | Steps |
|---|---|
| **Share (found)** | `…` → Share plan → Share modal · copy `found` message + URL |
| **Request to edit** | `…` → Request to edit → field + note → Submit → “Request sent!” |
| **Report** | `…` → Report → `/home/report/:postId` → details (+ optional photo) → Submit → back `/home` |
| **Not interested** | `…` → Not interested → card removed from local feed |

---

## 3. Module: Create & Manage Plan

**Path:** `src/create/` · Routes: `/create`, `/create/edit`, `/create/posting`, `/create/plan`, `/create/requests`

### 3.1 Create
| Flow | Steps |
|---|---|
| **New plan** | Nav `+` → `/create` → activity / location pickers · date/time sheets · spots · type pills · details · toggles → **Post** |
| **Posting** | Post → `/create/posting` splash → `/create/plan` (host view) |

### 3.2 Edit
| Flow | Steps |
|---|---|
| **Edit plan** | Host Manage → Edit plan → `/create/edit` → Update → back to `/create/plan` (optionally share `hosting`) |

### 3.3 Host manage
| Flow | Steps |
|---|---|
| **Invite friends** | Manage → Invite → friends list (reserve spots) and/or invite via link → **Link created** → copy / share via text (`inviteReserved` message) |
| **Share (hosting)** | Manage → Share plan → Share modal (`hosting`) |
| **Requests** | Manage → Requests **or** pending banner → `/create/requests` → Accept / Deny |
| **Delete plan** | Manage → Delete → confirm → `/home` |
| **Going · Remove** | Going list `…` → Remove → confirm |
| **Invited · Delete invite** | Invited list `…` → Delete invite → confirm |
| **View All** | Going / Invited → View All sheets |

---

## 4. Module: My Plans

**Path:** `src/plans/` · Hub: `/plans` · Tabs: Watching · Requested · Upcoming · Past

### 4.1 Hub
| Flow | Steps |
|---|---|
| **Open My Plans** | Nav Calendar → `/plans` (default Past) · switch tab via pills or `?tab=` |
| **Sort** | Sort icon → sheet (tab-specific options) → select |
| **Open detail** | Tap card → tab detail route |
| **Card manage** | Card `…` → Share (kind by tab) · Past also Rate / Delete |

### 4.2 Watching — `/plans/watching/:id`
| Flow | Steps |
|---|---|
| **Join (open)** | Join → confirm → Request sent → pending banner · Chat disabled |
| **Join waiting pool** | Full plan → Join waiting pool → confirm → Joined waiting pool |
| **Leave waiting** | Tap Joined waiting pool → Leave confirm → idle |
| **Couples plan** | Join → Unable to join → Link account → couple confirm → requested |
| **Stop watching** | Watching CTA → Stop watching → back to Watching list |
| **Share / edit request** | Manage → Share (`found`) · Request to edit → Submit → requested |
| **Going sheet** | Spots → Going (couple pairs) |

### 4.3 Requested — `/plans/requested/:id`
| Flow | Steps |
|---|---|
| **Cancel request** | Requested CTA → Cancel confirm (No / Yes) → list |
| **Pending info** | Expand pending banner |
| **Share** | Manage → Share (`found`) · Chat disabled |

### 4.4 Upcoming — `/plans/upcoming/:id`
| Flow | Steps |
|---|---|
| **Leave (open)** | Going CTA → Leave confirm → list |
| **Confirmed lock** | Going on confirmed plan → “already confirmed” → Okay (suggest chat) |
| **Chat / calendar** | Chat → `/messages/…` · Add to calendar → toast |
| **Share** | Manage → Share (`going`) |

### 4.5 Past — `/plans/past/:id`
| Flow | Steps |
|---|---|
| **Upload photos** | Upload photos → `/plans/past/:id/upload` → picker → Next → compose (tag · share to feed · caption) → Post |
| **Tag friends** | Compose → Tag friends → tap photo → Friends sheet → Tag |
| **Rate plan** | Rate / Manage → `/plans/past/:id/rate` → 1–10 · feedback · traits · no-show · Done |
| **Share** | Manage → Share (`went` or `hostedPast`) |
| **Delete** | Manage → Delete → confirm → list |
| **Participants** | Spots → Participants · Add friend |

---

## 5. Module: Notifications & Messages

**Path:** `src/notify/` · Routes: `/notifications`, `/messages`, `/messages/:threadId`

### 5.1 Notifications
| Flow | Steps |
|---|---|
| **Inbox** | Nav Bell → `/notifications` → list (avatar · bold entities · time) |
| **Respond** | Deny / Accept / Join on row |
| **Manage row** | `…` → remove / manage sheet |
| **To messages** | Header mail → `/messages` (unread badge) |

### 5.2 Messages
| Flow | Steps |
|---|---|
| **Threads** | `/messages` → plan threads (unread tint + badge) → tap → chat |
| **Chat** | `/messages/:threadId` → bubbles · sticky composer · send |
| **Search in chat** | Search → hit nav prev/next |
| **Manage chat** | Manage → View plan · Delete chat |
| **Attach photos** | Paperclip → Select photos → Add to composer |

---

## 6. Module: Profile

**Path:** `src/profile/` · Route: `/profile` (+ edit subroutes)

### 6.1 Hub
| Flow | Steps |
|---|---|
| **Open profile** | Nav Profile → `/profile` → avatar · badges · Link account CTA |
| **Tabs** | Photos · About · Activities · Friends |
| **Photo viewer** | Tap photo → viewer · delete optional |
| **Settings sheet** | Gear → sheet → navigate to settings routes · Logout · Delete account |

### 6.2 Edits
| Flow | Steps |
|---|---|
| **Change photo** | `/profile/change-photo` |
| **Verify identity** | `/profile/verify-identity` |
| **Edit fields** | `/profile/edit-hometown` · `edit-company` · `edit-ethnicity` |
| **Report account** | `/profile/report-account` |

---

## 7. Module: Settings

**Path:** `src/settings/` · Base: `/profile/settings/*`

### 7.1 Preferences & security
| Flow | Steps |
|---|---|
| **Preferences** | → Type of plans · Dark/Light mode (theme preview with StealthApp mark) → Save |
| **Security** | → Change password → Save |

### 7.2 Notifications
| Flow | Steps |
|---|---|
| **Categories** | Notifications → Joining / Hosting / Photos / Friends / From StealthApp → Push|Email segment · toggles → Save |

### 7.3 Invite friends
| Flow | Steps |
|---|---|
| **SMS** | Invite → SMS → prefilled `appInvite` message + invite URL |
| **Email** | Invite → mailto with same payload |
| **System share** | Invite by… → native share or copy sheet |

### 7.4 Privacy · Help · Legal · Contact
| Flow | Steps |
|---|---|
| **Privacy** | Private mode · Blocked · Safe tips · Principles |
| **Help** | Report problem · FAQ · Support |
| **Legal** | Privacy policy · Terms · Download data |
| **Contact** | Form → submit |
| **Logout / Delete** | From profile settings sheet · Delete requires typing DELETE |

---

## 8. Module: Share (cross-cutting)

**Path:** `src/share/` · No dedicated routes · `ShareModal` + `messages.ts`

### 8.1 Share kinds → message

| Kind | When used | Prefill |
|---|---|---|
| `found` | Feed join · Watching · Requested | Check out this awesome plan I found on StealthApp! |
| `hosting` | Host Manage · feed host | Check out this awesome plan I'm hosting on StealthApp! |
| `inviteReserved` | Invite link / reserve spots | Hey! I've reserved a spot… Grab it within the hour… |
| `going` | Upcoming participant | Check out this awesome plan I'm going to on StealthApp! |
| `went` | Past joiner | Check out this awesome plan I went to on StealthApp! |
| `hostedPast` | Past host | Check out this awesome plan I hosted on StealthApp! |
| `profile` | Profile photo (when wired) | Check out what I've been up to on StealthApp! |
| `appInvite` | Settings invite | Come join me and start making plans on StealthApp! |

**Channels:** Social icons (native share fallback) · copy message+URL · SMS · email.

---

## 9. Responsive checklist (verified patterns)

| Surface | Mobile | Desktop |
|---|---|---|
| Feed / Plans / Profile / Create / Notify / Settings | Bottom nav · full-width card | Brand bar · SideNav · card · xl tip |
| Onboarding | Full-bleed form | Split brand panel + form |
| Sheets | Bottom sheet + grabber | Centered dialog |
| Share modal | Bottom sheet on small · centered `sm+` | Centered |
| Report post | Full-height column | Centered card with radius |
| Safe areas | `env(safe-area-inset-bottom)` on nav/sheets | N/A |

**Fix applied in this pass:** SideNav sticky offset defaults to brand-bar height (`57px`); Home feed still uses taller header offset (`108px`). Report post & Share modal improved for `md+` / small screens.

---

## 10. Route map (quick reference)

```
/                          → onboarding/splash
/onboarding/*              Onboarding (25 steps → /home)
/home                      Feed
/home/report/:postId       Report post
/create                    Create form
/create/edit               Edit plan
/create/posting            Posting splash
/create/plan               Host plan
/create/requests           Join requests
/plans                     My Plans hub (?tab=)
/plans/watching/:id        Watching detail
/plans/requested/:id       Requested detail
/plans/upcoming/:id        Upcoming detail
/plans/past/:id            Past detail
/plans/past/:id/upload     Upload photos
/plans/past/:id/rate       Rate plan
/notifications             Notifications
/messages                  Threads
/messages/:threadId        Chat
/profile                   Profile hub
/profile/settings/*        Settings tree
```

---

## 11. Related docs

| Doc | Focus |
|---|---|
| `.cursor/rules/andplan-ui-guide.mdc` | Tokens, layout Do/Don’t |
| `src/*/PLAN.md` | Per-module implementation notes |
| `src/share/PLAN.md` | Share copy kinds |
| Mock folders | `Login/` · `FEED/` · `CREATE PLAN/` · `mANAGE PLAN/` · `PAST/` · `REQUEST/` · `UPCOMING/` · `WATCHING TAB/` · `NOTIFY AND MESSAGE/` · `Profile/` · `SETTINGS/` · `sharemessage/` |
