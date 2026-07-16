# Notifications & Messages (`NOTIFY AND MESSAGE/` → app)

~24 PNG mocks (misnamed `Profile friends*`) → inbox + chat under `/notifications` and `/messages`.

## Entry

Bottom / side nav **Bell** → `/notifications`. Mail icon in header → `/messages`.

## Routes

| Path | Screen |
|---|---|
| `/notifications` | Notification list (empty + filled) |
| `/messages` | Thread list (empty + unread badges) |
| `/messages/:threadId` | Chat (search, manage → View plan, attach photos) |

## Features

- Accept / Deny / Join actions on notifications
- Manage sheets: remove notification · delete chat · view plan
- Chat: bubbles, typing indicator, search hits, photo picker, pending attach strip
- Responsive: feed shell (bottom nav / sidebar / tip panel)

Source: `NOTIFY AND MESSAGE/*.png` + `src/notify/`
