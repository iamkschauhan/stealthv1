# Profile build plan (`Profile/` → app)

167 PNG mocks → **~40 unique bases** → interactive routes below.

## Hub (done)

| Surface | Route | Notes |
|---|---|---|
| My Profile | `/profile` | Photos / About / Activities / Friends tabs |
| Settings sheet | overlay | Preferences → Delete account |
| Photo viewer + delete | overlay | Matches Profile photos delete modal |
| Change photo | `/profile/change-photo` | |
| Verify identity | `/profile/verify-identity` | |
| Edit hometown / work / ethnicity | `/profile/edit-*` | |
| Report account | `/profile/report-account` | |

## Remaining mock variants (states of above)

- Upload photo series, verify identity fills, friends populated, report post, connections, interests edit variants

## Responsive

- Mobile: full-width profile + bottom nav (Profile active)
- `md+`: sidebar + centered profile card
- `xl+`: tips panel

Source: `Profile/*.png` + `src/profile/`
