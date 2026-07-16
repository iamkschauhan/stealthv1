# My Plans (`PAST/` + `REQUEST/` + `UPCOMING/` + `WATCHING TAB/` → app)

Calendar tab → `/plans` with Watching · Requested · Upcoming · Past.

## Routes

| Path | Screen |
|---|---|
| `/plans` | My Plans hub (default Past tab) |
| `/plans?tab=Watching` | Watching list (sort: Closing time) |
| `/plans?tab=Requested` | Requested list (sort: Closing time) |
| `/plans?tab=Upcoming` | Upcoming list (sort: Starting time) |
| `/plans/past/:id` | Past plan detail |
| `/plans/past/:id/upload` | Upload photos |
| `/plans/past/:id/rate` | Rate plan |
| `/plans/requested/:id` | Requested plan detail |
| `/plans/upcoming/:id` | Upcoming plan detail |
| `/plans/watching/:id` | Watching plan detail |

## Watching detail (`WATCHING TAB/`)

- **Join** / **Join waiting pool** / **Joined waiting pool** + **Watching** + Manage
- Join confirm → Request sent; full → waiting pool (leave confirm); couples → Unable to join / Link → couple join
- Watching → Stop watching; Manage → Share · Request to edit
- Spots → Going sheet (couple pairs); Chat disabled until accepted
- Suggested Plans carousel

## Past / Requested / Upcoming

See earlier sections — Past (upload/rate), Requested (cancel pending), Upcoming (Going/leave/confirmed).

## Layout

Feed-style shell: bottom nav · `md+` sidebar · `xl+` tip · card `max-w-xl` / `lg:max-w-2xl`.

Source: `PAST/` + `REQUEST/` + `UPCOMING/` + `WATCHING TAB/` + `src/plans/`
