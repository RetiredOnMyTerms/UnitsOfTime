import { fmtSlot } from '../dateUtils';
import type { GridCell } from '../types';
import type { UnitsApp } from '../useUnitsApp';

export function AssignBar({ app, cells }: { app: UnitsApp; cells: (GridCell | null)[] }) {
  const { sel, date, cats, selLabel, setSelLabel, assignRun, closeAssign } = app;
  const selOpen = sel !== null && !cells[sel];
  if (!selOpen || sel === null) return null;

  return (
    <div className="assign">
      <div className="fx ac jb">
        <span className="atitle">Assign {fmtSlot(sel)} – {fmtSlot(sel + 1)} · one unit</span>
        <button className="cdel" style={{ opacity: 1 }} onClick={closeAssign}>×</button>
      </div>
      <div className="fx wrap gap8 mt12">
        {cats.map((c) => (
          <button
            key={c.id}
            className="achip"
            style={{ background: c.color }}
            onClick={() => assignRun(date, sel, { cat: c.id, label: selLabel.trim() })}
          >
            {c.name}
          </button>
        ))}
      </div>
      <input
        className="nin mt12"
        placeholder="Or name it yourself, then press Enter — 'Bath, but longer'"
        value={selLabel}
        onChange={(e) => setSelLabel(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && selLabel.trim()) assignRun(date, sel, { cat: null, label: selLabel.trim() });
        }}
      />
    </div>
  );
}
