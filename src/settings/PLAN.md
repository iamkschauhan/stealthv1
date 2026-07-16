# Settings plan (`SETTINGS/` → app)

78 PNG mocks (many misnamed) → full settings tree under `/profile/settings/*`.

## Entry

Profile gear → Settings sheet → each menu item routes to a screen.

## Layout (responsive)

Same shell as feed/profile via `SettingsShell`:
- **Mobile**: full-bleed white card + bottom nav + safe-area padding
- **md+**: brand top bar + sidebar + rounded content card
- **xl+**: right “Settings” tip panel
- Sheets/modals: bottom sheet on mobile, centered on `md+`

## Routes

| Path | Screen |
|---|---|
| `/profile/settings/preferences` | Preferences |
| `.../preferences/theme` | Dark/Light mode |
| `.../preferences/plans` | Type of plans |
| `.../security` | Security & Login |
| `.../security/password` | Change password |
| `.../notifications` | Notifications hub |
| `.../notifications/{joining,hosting,photos,friends,stealth}` | Push/Email toggles |
| `.../invite` | Invite + share sheet |
| `.../privacy` | Privacy (+ snooze, private mode) |
| `.../privacy/{blocked,safe-tips,principles}` | Subpages |
| `.../help` | Help Center |
| `.../help/{report,faq,support}` | Report / FAQ / Reports empty |
| `.../legal` | Legal |
| `.../legal/{privacy-policy,terms,download-data}` | Docs |
| `.../contact` | Contact form |

## Modals on profile

- Logout confirm
- Delete account (2-step + type DELETE)

Source: `SETTINGS/*.png` + `src/settings/`
