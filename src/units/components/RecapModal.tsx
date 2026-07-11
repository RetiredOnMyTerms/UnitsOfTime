import { buildRecap } from '../logic';
import type { UnitsApp } from '../useUnitsApp';

export function RecapModal({ app }: { app: UnitsApp }) {
  const { recapOpen, setRecapOpen, entries, sync, cats, week } = app;
  if (!recapOpen) return null;
  const recap = buildRecap(entries, sync, cats, week);
  const close = () => setRecapOpen(false);

  return (
    <div className="ovl" onClick={close}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="fx jb ac">
          <h3 className="m0 mtitle">The week in units</h3>
          <button className="cdel" style={{ opacity: 1 }} onClick={close}>×</button>
        </div>
        <p className="msub">You accounted for {recap.weekFilled} of 336 units this week.</p>
        {recap.rows.map((r, i) => (
          <div key={i} className="rrow">
            <div className="fx jb ac">
              <span className="rname fx ac gap8">
                <span className="cdot" style={{ background: r.color }} />
                {r.name}
              </span>
              <span className="runits">{r.units}</span>
            </div>
            <div className="rbar"><div className="rfill" style={{ width: r.w, background: r.color }} /></div>
          </div>
        ))}
        <p className="mfoot">{recap.foot}</p>
      </div>
    </div>
  );
}
