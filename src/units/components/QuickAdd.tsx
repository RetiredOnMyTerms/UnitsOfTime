import type { UnitsApp } from '../useUnitsApp';

export function QuickAdd({ app }: { app: UnitsApp }) {
  const { qaText, qaOpen, setQaText, setQaOpen, cats, qaAssign, qaInputRef } = app;

  const q = qaText.trim().toLowerCase();
  const filtered = q ? cats.filter((c) => c.name.toLowerCase().includes(q)) : cats;
  const matches = filtered.slice(0, 5).map((c, i) => ({
    key: c.id,
    name: c.name,
    color: c.color,
    hint: i === 0 ? '↵' : '',
    onPick: () => qaAssign(c),
  }));
  if (q && filtered.length === 0) {
    matches.push({ key: '_oneoff', name: `“${qaText.trim()}” — one-off`, color: '#e3e0da', hint: '↵', onPick: () => qaAssign(null) });
  }

  return (
    <div className="posrel">
      <input
        className="qain"
        placeholder="Quick add — press /"
        value={qaText}
        ref={qaInputRef}
        onChange={(e) => {
          setQaText(e.target.value);
          setQaOpen(true);
        }}
        onFocus={() => setQaOpen(true)}
        onBlur={() => setTimeout(() => setQaOpen(false), 150)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            qaAssign(filtered[0] ?? null);
            (e.target as HTMLInputElement).blur();
          }
          if (e.key === 'Escape') {
            setQaOpen(false);
            setQaText('');
          }
        }}
      />
      {qaOpen && matches.length > 0 && (
        <div className="qadrop">
          {matches.map((m) => (
            <button key={m.key} className="qam fx ac gap8" onMouseDown={(e) => { e.preventDefault(); m.onPick(); }}>
              <span className="cdot" style={{ background: m.color }} />
              {m.name}
              <span className="qahint">{m.hint}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
