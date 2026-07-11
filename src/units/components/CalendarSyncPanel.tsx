import { PROVIDERS } from '../constants';
import { weekSyncCount } from '../logic';
import type { UnitsApp } from '../useUnitsApp';

export function CalendarSyncPanel({ app }: { app: UnitsApp }) {
  const { sync, toggleSync, week } = app;
  const syncCount = weekSyncCount(sync, week);
  const syncLine = syncCount
    ? `${syncCount} synced events this week, marked with a badge. They are not yours to drag.`
    : 'Nothing connected. Simulated sync — flip one on and watch events appear.';

  return (
    <div className="scard">
      <span className="stitle">Calendar sync</span>
      <div className="mt8">
        {PROVIDERS.map((p) => (
          <div key={p.id} className="fx ac gap10 prow">
            <span className="pglyph">{p.glyph}</span>
            <span className="f1 pname">{p.name}</span>
            <button className={`sw2 ${sync[p.id] ? 'on' : ''}`} onClick={() => toggleSync(p.id)}>
              <span className="knob" />
            </button>
          </div>
        ))}
      </div>
      <p className="hint">{syncLine}</p>
    </div>
  );
}
