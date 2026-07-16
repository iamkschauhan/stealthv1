# Onboarding build plan (`Login/` → app)

99 PNG mocks → **25 unique interactive screens**.

## Status: complete flow wired

| Batch | Screens | Status |
|---|---|---|
| 1 | Splash → Welcome → Principles → Phone → OTP → Personal Info → Birthday confirm | ✅ |
| 2 | Identity → Pronouns → Looking for | ✅ |
| 3 | Profile photo → Photos → Upload → Location → Notifications → Verify | ✅ |
| 4 | Interests → Life → Relationship → Children → Education → Ethnicity → Exercise → Habits → Political → `/home` | ✅ |

## Entry

- `/` and `/onboarding/*` → splash start
- Done → `/home` feed
- Replay: link on home

## Source

`src/onboarding/flow.ts` + `Login/*.png`
