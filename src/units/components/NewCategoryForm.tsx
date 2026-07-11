import { SWATCHES } from '../constants';
import type { UnitsApp } from '../useUnitsApp';

export function NewCategoryForm({ app }: { app: UnitsApp }) {
  const { ncName, ncColor, ncSelf, setNcName, setNcColor, setNcSelf, addCatNow } = app;
  return (
    <div className="ncform">
      <input
        className="nin"
        placeholder="Name it"
        value={ncName}
        onChange={(e) => setNcName(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') addCatNow(); }}
      />
      <div className="fx gap8 wrap mt8">
        {SWATCHES.map((cl) => (
          <button key={cl} className={`sw ${ncColor === cl ? 'on' : ''}`} style={{ background: cl }} onClick={() => setNcColor(cl)} />
        ))}
      </div>
      <label className="fx ac gap8 mt8 selflab">
        <input type="checkbox" checked={ncSelf} onChange={(e) => setNcSelf(e.target.checked)} />
        Counts as time for me
      </label>
      <button className="btn mt8" onClick={addCatNow}>Add category</button>
    </div>
  );
}
