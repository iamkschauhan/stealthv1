# Feed plan (`FEED/` → app)

~60 PNG mocks → interactive home feed under `/home`.

## Entry

Bottom / side nav **Home** → `/home`.

## Interactions

| Action | UI |
|---|---|
| Filter icon | Full Filter sheet (type, distance, date, time, categories, couples/last-minute, friendship demographics) |
| Search | Overlay: Plans / People + recent + results |
| Category pills | Soft filter on feed |
| Card grabber / image | Expanded plan sheet (deadline + note) |
| Join | Confirm modal → Going / waiting pool |
| Spots row | People joined sheet |
| … menu | Share · Request to edit · Report · Not interested |
| Share | Social + link modal |
| Request to edit | Select Start time / Location / Available spots → Request sent |
| Report | `/home/report/:postId` form |
| Made plans banner | Sticky “your plan” card above feed |

## Layout

Same responsive shell: bottom nav · `md+` sidebar · `xl+` right panel · feed column `max-w-xl` / `lg:max-w-2xl`.

Source: `FEED/*.png` + `src/feed/` + `src/components/FeedCard.tsx`
