# UnitsOfTime

Track your activities as units of time, inspired by Will Freeman from *About A Boy*: a day is 48 half-hour units, dragged and dropped into place.

## Features

- Single-day grid (48 half-hour units) with drag-and-drop assignment and rearranging
- Color-coded, user-defined categories
- Quick-add palette (press `/`, type a category name, hit Enter)
- "Island of me" — how many units today went to yourself vs. everything else
- Weekly recap modal with per-category totals
- Calendar sync panel (Google/Outlook/Apple/Amazon) — currently **simulated**: toggling a provider on fills in fixed demo events so the UI/UX can be evaluated before real OAuth integration is built. See `src/units/calendar/` for the swappable `CalendarProvider` interface.
- Responsive layout (sidebar moves below the grid on narrow viewports)

State persists to `localStorage` — there's no backend yet.

## Development

```bash
npm install
npm run dev      # start the dev server
npm run build     # type-check + production build
npm run lint       # oxlint
```

## Project layout

- `src/units/useUnitsApp.ts` — all app state and mutations (entries, categories, sync, drag state, quick add, etc.)
- `src/units/logic.ts` — pure view-model helpers (grid cells, slot rendering, recap/island-of-me calculations)
- `src/units/calendar/` — calendar sync abstraction; `simulatedProvider.ts` is the only implementation today
- `src/units/components/` — presentational components
