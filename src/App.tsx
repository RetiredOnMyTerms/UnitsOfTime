import { useMemo } from 'react';
import './units/units.css';
import { DENSITY, QUOTES } from './units/constants';
import { AboutModal } from './units/components/AboutModal';
import { AssignBar } from './units/components/AssignBar';
import { DayGrid } from './units/components/DayGrid';
import { Header } from './units/components/Header';
import { RecapModal } from './units/components/RecapModal';
import { Sidebar } from './units/components/Sidebar';
import { Toast } from './units/components/Toast';
import { WeekStrip } from './units/components/WeekStrip';
import { MONTH_NAMES, WEEKDAY_NAMES, dayOfYear, parseISO } from './units/dateUtils';
import { buildCatCounts, buildIslandOfMe, cellsFor } from './units/logic';
import { useUnitsApp } from './units/useUnitsApp';

function App() {
  const app = useUnitsApp();
  const { date, entries, sync, cats, today } = app;

  const cells = useMemo(() => cellsFor(entries, sync, date), [entries, sync, date]);
  const catCounts = useMemo(() => buildCatCounts(cells), [cells]);
  const { mePct, meLine } = useMemo(() => buildIslandOfMe(cells, cats), [cells, cats]);

  const d = parseISO(date);
  const wd = (d.getDay() + 6) % 7;
  const dayTitle = `${WEEKDAY_NAMES[wd]}, ${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`;
  const filled = cells.filter(Boolean).length;
  const tally =
    `${filled} of 48 units accounted for · ${48 - filled} unclaimed` +
    (date === today ? '' : ' · ' + (date < today ? 'in the past, where they’ll stay' : 'still hypothetical'));
  const quote = QUOTES[dayOfYear(d) % QUOTES.length];

  return (
    <div className={`app den-${DENSITY}`}>
      <main className="main">
        <Header app={app} dayTitle={dayTitle} tally={tally} />
        <WeekStrip app={app} />
        <DayGrid app={app} cells={cells} />
      </main>
      <Sidebar app={app} catCounts={catCounts} mePct={mePct} meLine={meLine} quote={quote} />
      <AssignBar app={app} cells={cells} />
      <Toast message={app.toast} />
      <RecapModal app={app} />
      <AboutModal app={app} />
    </div>
  );
}

export default App;
