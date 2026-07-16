# Share messages (`sharemessage/` → app)

Canonical share copy for plans, profile, and app invites. Source: `sharemessage/*.png`.

## Kinds (`src/share/messages.ts`)

| Kind | When | Prefill message |
|---|---|---|
| `found` | Feed joining · Watching · Requested | Check out this awesome plan I found on StealthApp! |
| `hosting` | Feed hosting · Create/Manage host · after Edit | Check out this awesome plan I'm hosting on StealthApp! |
| `inviteReserved` | Invite friends / reserve spots link | Hey! I've reserved a spot for you… Grab it within the hour… |
| `hostedPast` | Past plan as host | Check out this awesome plan I hosted on StealthApp! |
| `going` | Upcoming as participant | Check out this awesome plan I'm going to on StealthApp! |
| `went` | Past as joiner | Check out this awesome plan I went to on StealthApp! |
| `profile` | Profile photo share | Check out what I've been up to on StealthApp! |
| `appInvite` | Settings → Invite Friends | Come join me and start making plans on StealthApp! |

Clipboard / SMS / email / native share always use **message + URL** (`sharePayload`).

## UI

`ShareModal` — title from kind · message preview · social icons · link + copy.

## Entry points

Feed post menu · Create Manage · My Plans list/detail · Settings invite · Profile (when wired).
