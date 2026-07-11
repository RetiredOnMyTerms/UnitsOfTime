import { DIM_QUIET_HOURS } from '../constants';
import { buildSlotViews } from '../logic';
import type { GridCell } from '../types';
import type { UnitsApp } from '../useUnitsApp';

function allowDrop(e: React.DragEvent) {
  e.preventDefault();
}

export function DayGrid({ app, cells }: { app: UnitsApp; cells: (GridCell | null)[] }) {
  const { cats, sel, date, clickCell, dropOnCell, startEntryDrag, deleteRun, gridRef } = app;
  const views = buildSlotViews(cells, cats, DIM_QUIET_HOURS);

  return (
    <div className="gridwrap" ref={gridRef}>
      {views.map((v, idx) => (
        <div key={idx} className={`slot ${v.cls}`}>
          <div className="tlab">{v.tlab}</div>
          <div
            className={`cell ${v.filled ? '' : sel === idx ? 'empty selq' : 'empty'}`}
            onClick={() => clickCell(idx)}
            onDragOver={allowDrop}
            onDrop={(e) => { e.preventDefault(); dropOnCell(idx); }}
          >
            {v.filled && (
              <div
                className={`blk ${v.blkCls}`}
                style={{ background: v.bg }}
                draggable={v.draggable}
                onDragStart={() => startEntryDrag(idx)}
              >
                {v.isStart && (
                  <>
                    <span className="blab f1">{v.label}</span>
                    <span className="bunits">{v.units}</span>
                    {v.locked && <span className="lockg" title={v.provider}>{v.glyph}</span>}
                    {v.canDel && (
                      <button className="bdel" onClick={(e) => { e.stopPropagation(); deleteRun(date, idx); }}>×</button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
