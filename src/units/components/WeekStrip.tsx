import { WEEKDAY_NAMES } from '../dateUtils';
import { cellsFor } from '../logic';
import type { UnitsApp } from '../useUnitsApp';

function allowDrop(e: React.DragEvent) {
  e.preventDefault();
}

export function WeekStrip({ app }: { app: UnitsApp }) {
  const { week, date, entries, sync, pickDay, dropOnDay } = app;
  return (
    <div className="weekstrip fx gap8">
      {week.map((iso, i) => {
        const n = cellsFor(entries, sync, iso).filter(Boolean).length;
        return (
          <button
            key={iso}
            className={`daychip ${iso === date ? 'on' : ''}`}
            onClick={() => pickDay(iso)}
            onDragOver={allowDrop}
            onDrop={(e) => { e.preventDefault(); dropOnDay(iso); }}
          >
            <span className="dcw">{WEEKDAY_NAMES[i].slice(0, 3)}</span>
            <span className="dcn">{Number(iso.slice(8, 10))}</span>
            <span className="dcbar"><span className="dcfill" style={{ width: Math.round((n / 48) * 100) + '%' }} /></span>
          </button>
        );
      })}
    </div>
  );
}
