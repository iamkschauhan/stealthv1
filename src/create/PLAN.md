# Create plan (`CREATE PLAN/` + `mANAGE PLAN/` → app)

Create / edit / host manage flow under `/create/*`.

## Entry

Center **+** → `/create`. After Post → host plan at `/create/plan`. Open Manage anytime from host view (sample plan loads if empty).

## Routes

| Path | Screen |
|---|---|
| `/create` | Create plan form |
| `/create/posting` | Posting splash |
| `/create/plan` | Host plan detail |
| `/create/edit` | Edit plan |
| `/create/requests` | Join + change requests |

## Host Manage (`mANAGE PLAN/`)

Manage sheet:
- Edit plan
- Invite friends and reserve spots → friends list **or** invite via link → Link created / Copied
- Share plan modal
- Requests
- Delete plan (confirm)

Participant `…`:
- Going → Remove (confirm with avatar)
- Invited → Delete invite (confirm)

View All → Going / Invited sheets.

## Layout

Feed-style shell: bottom nav · `md+` sidebar · `xl+` tip · card `max-w-xl` / `lg:max-w-2xl`.

Source: `CREATE PLAN/*.png` + `mANAGE PLAN/*.png` + `src/create/`
