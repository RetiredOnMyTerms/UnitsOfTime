import { PROVIDERS, RECAP_QUIPS } from './constants';
import { calendarProvider } from './calendar';
import { fmtHour, isoOf } from './dateUtils';
import type { Category, EntriesByDate, GridCell, SyncState } from './types';

/** Pure grid-building helpers shared between the state hook and its view model. Kept
 * outside the hook so they can be unit tested without rendering React. */

export function syncedCellsFor(sync: SyncState, dateISO: string): Record<number, GridCell> {
  const out: Record<number, GridCell> = {};
  PROVIDERS.forEach((p) => {
    if (!sync[p.id]) return;
    calendarProvider.getEventsForDate(p.id, dateISO).forEach((ev) => {
      for (let k = 0; k < ev.span; k++) {
        out[ev.slot + k] = {
          key: 'sync:' + p.id + ':' + ev.label,
          user: false,
          cat: null,
          label: ev.label,
          locked: true,
          provider: p.name,
          glyph: p.glyph,
        };
      }
    });
  });
  return out;
}

export function cellsFor(entries: EntriesByDate, sync: SyncState, dateISO: string): (GridCell | null)[] {
  const dayMap = entries[dateISO] || {};
  const synced = syncedCellsFor(sync, dateISO);
  const cells: (GridCell | null)[] = [];
  for (let i = 0; i < 48; i++) {
    const e = dayMap[i];
    if (e) {
      cells.push({ key: 'u:' + (e.cat || '') + ':' + (e.label || ''), user: true, cat: e.cat, label: e.label, locked: false });
    } else if (synced[i]) {
      cells.push(synced[i]);
    } else {
      cells.push(null);
    }
  }
  return cells;
}

export function runSpanAt(cells: (GridCell | null)[], i: number): number {
  const k = cells[i]?.key;
  if (!k) return 0;
  let a = i;
  let b = i;
  while (a > 0 && cells[a - 1]?.key === k) a--;
  while (b < 47 && cells[b + 1]?.key === k) b++;
  return b - a + 1;
}

export function runBoundsAt(cells: (GridCell | null)[], i: number): [number, number] | null {
  const k = cells[i]?.key;
  if (!k) return null;
  let a = i;
  let b = i;
  while (a > 0 && cells[a - 1]?.key === k) a--;
  while (b < 47 && cells[b + 1]?.key === k) b++;
  return [a, b];
}

export function nextEmptySlot(entries: EntriesByDate, sync: SyncState, dateISO: string): number | null {
  const cells = cellsFor(entries, sync, dateISO);
  const now = new Date();
  let from = 16;
  if (dateISO === isoOf(now)) from = Math.min(47, now.getHours() * 2 + (now.getMinutes() >= 30 ? 1 : 0));
  for (let i = from; i < 48; i++) if (!cells[i]) return i;
  for (let i = from - 1; i >= 0; i--) if (!cells[i]) return i;
  return null;
}

export function catName(cats: Category[], id: string | null): string {
  const c = cats.find((x) => x.id === id);
  return c ? c.name : 'One-off';
}

export function catColor(cats: Category[], id: string | null): string {
  const c = cats.find((x) => x.id === id);
  return c ? c.color : '#e3e0da';
}

export interface SlotView {
  cls: string;
  tlab: string;
  filled: boolean;
  blkCls: 'solo' | 'rs' | 'rm' | 're';
  bg: string;
  isStart: boolean;
  label: string;
  units: string;
  locked: boolean;
  provider?: string;
  glyph?: string;
  canDel: boolean;
  draggable: boolean;
}

/** Builds the 48 half-hour slot rows for the day grid, including run styling (rounded start/mid/end of a block). */
export function buildSlotViews(cells: (GridCell | null)[], cats: Category[], dimQuietHours: boolean): SlotView[] {
  const views: SlotView[] = [];
  for (let i = 0; i < 48; i++) {
    const c = cells[i];
    const prevSame = i > 0 && !!cells[i - 1] && !!c && cells[i - 1]!.key === c.key;
    const nextSame = i < 47 && !!cells[i + 1] && !!c && cells[i + 1]!.key === c.key;
    const isStart = !!c && !prevSame;
    let blkCls: SlotView['blkCls'] = 'solo';
    if (c) {
      if (!prevSame && nextSame) blkCls = 'rs';
      else if (prevSame && nextSame) blkCls = 'rm';
      else if (prevSame && !nextSame) blkCls = 're';
    }
    let span = 0;
    if (c && isStart) {
      span = 1;
      let j = i + 1;
      while (j < 48 && cells[j] && cells[j]!.key === c.key) {
        span++;
        j++;
      }
    }
    views.push({
      cls: (i % 2 === 0 ? 'hr' : '') + (dimQuietHours && i < 14 && !c ? ' quiet' : ''),
      tlab: i % 2 === 0 ? fmtHour(i / 2) : '',
      filled: !!c,
      blkCls,
      bg: c ? (c.locked ? '#e8e5df' : catColor(cats, c.cat)) : '',
      isStart,
      label: c ? c.label || catName(cats, c.cat) : '',
      units: span > 1 ? span + ' units' : '1 unit',
      locked: !!c?.locked,
      provider: c?.provider,
      glyph: c?.glyph,
      canDel: isStart && !!c && !c.locked,
      draggable: !!c && !c.locked && isStart,
    });
  }
  return views;
}

export function buildCatCounts(cells: (GridCell | null)[]): Record<string, number> {
  const counts: Record<string, number> = {};
  cells.forEach((c) => {
    if (c && c.user && c.cat) counts[c.cat] = (counts[c.cat] || 0) + 1;
  });
  return counts;
}

export interface IslandOfMe {
  mePct: number | null;
  meLine: string;
}

export function buildIslandOfMe(cells: (GridCell | null)[], cats: Category[]): IslandOfMe {
  let userUnits = 0;
  let meUnits = 0;
  cells.forEach((c) => {
    if (!c || !c.user) return;
    userUnits++;
    const cat = cats.find((x) => x.id === c.cat);
    if (cat?.self) meUnits++;
  });
  if (!userUnits) return { mePct: null, meLine: 'No units logged yet. The day, in its entirety, is yours.' };
  const ratio = meUnits / userUnits;
  const mePct = Math.round(ratio * 100);
  let meLine: string;
  if (ratio >= 0.6) meLine = `${meUnits} of ${userUnits} units spent on yourself. You are, in every sense, an island.`;
  else if (ratio >= 0.3) meLine = `${meUnits} of ${userUnits} units for you. A respectable balance.`;
  else meLine = `Only ${meUnits} of ${userUnits} units for yourself. Will would be concerned.`;
  return { mePct, meLine };
}

/** Total events across a week for a connected provider — used for the "N synced events" sync-status line. */
export function weekSyncCount(sync: SyncState, week: string[]): number {
  let count = 0;
  PROVIDERS.forEach((p) => {
    if (!sync[p.id]) return;
    week.forEach((iso) => {
      count += calendarProvider.getEventsForDate(p.id, iso).length;
    });
  });
  return count;
}

export interface RecapRow {
  name: string;
  color: string;
  units: string;
  w: string;
}

export interface Recap {
  weekFilled: number;
  rows: RecapRow[];
  foot: string;
}

export function buildRecap(entries: EntriesByDate, sync: SyncState, cats: Category[], week: string[]): Recap {
  const totals: Record<string, number> = {};
  let weekFilled = 0;
  let syncedTotal = 0;
  week.forEach((iso) => {
    cellsFor(entries, sync, iso).forEach((c) => {
      if (!c) return;
      weekFilled++;
      if (c.user && c.cat) totals[c.cat] = (totals[c.cat] || 0) + 1;
      else if (!c.user) syncedTotal++;
    });
  });
  const rows = Object.entries(totals)
    .map(([id, n]) => ({ id, n, name: catName(cats, id), color: catColor(cats, id) }))
    .sort((a, b) => b.n - a.n);
  if (syncedTotal) rows.push({ id: '_sync', n: syncedTotal, name: 'From calendars', color: '#d8d4cc' });

  const maxN = rows.length ? rows[0].n : 1;
  const recapRows = rows.map((r) => ({
    name: r.name,
    color: r.color,
    units: r.n + (r.n === 1 ? ' unit' : ' units'),
    w: Math.max(4, Math.round((r.n / maxN) * 100)) + '%',
  }));

  const top = rows[0];
  const foot = top
    ? `Top of the table: ${top.name}, ${top.n} units. ${RECAP_QUIPS[top.id] || 'A commitment, freely chosen.'}`
    : 'Nothing logged yet. A week of pure, unallocated potential.';

  return { weekFilled, rows: recapRows, foot };
}
