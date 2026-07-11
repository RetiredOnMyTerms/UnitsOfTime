import type { UnitsApp } from '../useUnitsApp';
import { NewCategoryForm } from './NewCategoryForm';

export function CategoryPanel({ app, catCounts }: { app: UnitsApp; catCounts: Record<string, number> }) {
  const { cats, newCatOpen, setNewCatOpen, startCatDrag, deleteCat } = app;
  return (
    <div className="scard">
      <div className="fx jb ac">
        <span className="stitle">Categories</span>
        <button className="ghost" onClick={() => setNewCatOpen(!newCatOpen)}>{newCatOpen ? 'Close' : '+ New'}</button>
      </div>
      {newCatOpen && <NewCategoryForm app={app} />}
      <div className="catlist">
        {cats.map((c) => {
          const count = catCounts[c.id] || 0;
          return (
            <div key={c.id} className="catrow fx ac gap10" draggable onDragStart={() => startCatDrag(c.id)} title="Drag onto a unit">
              <span className="cdot" style={{ background: c.color }} />
              <span className="f1 cname">{c.name}</span>
              <span className="ccount">{count}{count === 1 ? ' unit' : ' units'}</span>
              <button className="cdel" onClick={(e) => { e.stopPropagation(); deleteCat(c.id); }}>×</button>
            </div>
          );
        })}
      </div>
      <p className="hint">Drag a category onto any unit. Click an empty unit to assign it. Drag a block to another time — or onto a day above.</p>
    </div>
  );
}
