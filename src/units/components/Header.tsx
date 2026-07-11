import type { UnitsApp } from '../useUnitsApp';
import { QuickAdd } from './QuickAdd';

export function Header({ app, dayTitle, tally }: { app: UnitsApp; dayTitle: string; tally: string }) {
  const { prevDay, nextDay, goToday, setRecapOpen } = app;
  return (
    <header className="top fx ac gap16 wrap">
      <div className="f1">
        <div className="fx ac gap10">
          <button className="navb" onClick={prevDay}>‹</button>
          <h2 className="dayname m0">{dayTitle}</h2>
          <button className="navb" onClick={nextDay}>›</button>
          <button className="ghost" onClick={goToday}>Today</button>
        </div>
        <p className="tally m0">{tally}</p>
      </div>
      <QuickAdd app={app} />
      <button className="btn" onClick={() => setRecapOpen(true)}>Weekly recap</button>
    </header>
  );
}
