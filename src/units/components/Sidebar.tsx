import { SHOW_QUOTES } from '../constants';
import type { UnitsApp } from '../useUnitsApp';
import { CalendarSyncPanel } from './CalendarSyncPanel';
import { CategoryPanel } from './CategoryPanel';
import { IslandOfMe } from './IslandOfMe';
import { QuoteCard } from './QuoteCard';

export function Sidebar({ app, catCounts, mePct, meLine, quote }: {
  app: UnitsApp;
  catCounts: Record<string, number>;
  mePct: number | null;
  meLine: string;
  quote: string;
}) {
  return (
    <aside className="side">
      <div>
        <h1 className="logo">Units<span className="adot">.</span></h1>
        <p className="tag">A day, in thirty-minute pieces.</p>
      </div>
      <CategoryPanel app={app} catCounts={catCounts} />
      <IslandOfMe mePct={mePct} meLine={meLine} />
      <CalendarSyncPanel app={app} />
      {SHOW_QUOTES && <QuoteCard quote={quote} />}
    </aside>
  );
}
