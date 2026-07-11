import { useCallback, useEffect, useRef, useState } from 'react';
import { DEFAULT_CATS, PROVIDERS, STORAGE_KEY, SWATCHES } from './constants';
import { calendarProvider } from './calendar';
import { fmtSlot, isoOf, shiftISO, weekOf } from './dateUtils';
import { catName, cellsFor, nextEmptySlot, runBoundsAt, runSpanAt } from './logic';
import type { Category, DragPayload, EntriesByDate, PersistedState, SyncState } from './types';

const EMPTY_SYNC: SyncState = { google: false, outlook: false, apple: false, amazon: false };

function seedDemoEntries(dateISO: string): EntriesByDate {
  return {
    [dateISO]: {
      19: { cat: 'bath', label: '' },
      21: { cat: 'exercise', label: '' },
      22: { cat: 'exercise', label: '' },
      25: { cat: 'meals', label: 'Lunch' },
      26: { cat: 'meals', label: 'Lunch' },
      27: { cat: 'meals', label: 'Lunch' },
      30: { cat: 'research', label: '' },
      33: { cat: 'telly', label: 'Countdown' },
      40: { cat: 'nothing', label: '' },
    },
  };
}

function loadPersisted(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.entries) return null;
    return {
      entries: parsed.entries,
      cats: parsed.cats || DEFAULT_CATS,
      sync: parsed.sync || EMPTY_SYNC,
    };
  } catch {
    return null;
  }
}

export function useUnitsApp() {
  const today = isoOf(new Date());
  const initial = useRef(loadPersisted()).current;

  const [date, setDate] = useState(today);
  const [entries, setEntries] = useState<EntriesByDate>(initial?.entries ?? seedDemoEntries(today));
  const [cats, setCats] = useState<Category[]>(initial?.cats ?? DEFAULT_CATS);
  const [sync, setSync] = useState<SyncState>(initial?.sync ?? EMPTY_SYNC);

  const [sel, setSel] = useState<number | null>(null);
  const [selLabel, setSelLabel] = useState('');
  const [qaText, setQaText] = useState('');
  const [qaOpen, setQaOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [recapOpen, setRecapOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [newCatOpen, setNewCatOpen] = useState(false);
  const [ncName, setNcName] = useState('');
  const [ncColor, setNcColor] = useState(SWATCHES[3]);
  const [ncSelf, setNcSelf] = useState(true);

  const dragRef = useRef<DragPayload | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const qaInputRef = useRef<HTMLInputElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Persist whenever the durable slice of state changes.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ entries, cats, sync }));
    } catch {
      // storage may be unavailable (private browsing, quota) — persistence is best-effort
    }
  }, [entries, cats, sync]);

  const showToast = useCallback((msg: string, ms = 4200) => {
    window.clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = window.setTimeout(() => setToast(null), ms);
  }, []);

  // Keyboard shortcuts: "/" focuses quick-add, Escape closes overlays.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const typing = /input|textarea/i.test(document.activeElement?.tagName || '');
      if (e.key === '/' && !typing) {
        e.preventDefault();
        qaInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setSel(null);
        setRecapOpen(false);
        setQaOpen(false);
        setAboutOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Scroll the grid to mid-morning on first mount, matching the prototype's default viewport.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const g = gridRef.current;
      if (g) g.scrollTop = Math.round(g.scrollHeight * (14.5 / 48));
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  /** Assigns one unit and follows up with a dry aside if the resulting run is notably long. Returns the run's span. */
  const assignRun = useCallback(
    (dateISO: string, slot: number, entry: { cat: string | null; label: string }) => {
      const day = { ...(entries[dateISO] || {}) };
      day[slot] = { cat: entry.cat, label: entry.label || '' };
      const nextEntries = { ...entries, [dateISO]: day };
      setEntries(nextEntries);
      setSel(null);
      setSelLabel('');

      const cells = cellsFor(nextEntries, sync, dateISO);
      const span = runSpanAt(cells, slot);
      const name = entry.label || catName(cats, entry.cat);
      if (span === 2) showToast(`That’s a full hour of ${name}. “Full hours can be a little bit intimidating.”`);
      else if (span >= 4) showToast(`${span} units of ${name} in a row. Bold. Ambitious, even.`);
      return span;
    },
    [entries, sync, cats, showToast],
  );

  const deleteRun = useCallback(
    (dateISO: string, slot: number) => {
      const bounds = runBoundsAt(cellsFor(entries, sync, dateISO), slot);
      if (!bounds) return;
      const [a, b] = bounds;
      const day = { ...(entries[dateISO] || {}) };
      for (let i = a; i <= b; i++) delete day[i];
      setEntries({ ...entries, [dateISO]: day });
      const n = b - a + 1;
      showToast(`${n} ${n > 1 ? 'units' : 'unit'} reclaimed. Do with them what you will.`);
    },
    [entries, sync, showToast],
  );

  const moveRun = useCallback(
    (from: { date: string; slot: number }, toDate: string, toSlot: number) => {
      const bounds = runBoundsAt(cellsFor(entries, sync, from.date), from.slot);
      if (!bounds) return;
      const [a, b] = bounds;
      const span = b - a + 1;
      const entry = (entries[from.date] || {})[a];
      if (!entry) return;

      const src = { ...(entries[from.date] || {}) };
      for (let i = a; i <= b; i++) delete src[i];
      const dst = { ...(from.date === toDate ? src : entries[toDate] || {}) };
      const start = Math.min(toSlot, 48 - span);
      for (let i = 0; i < span; i++) dst[start + i] = { ...entry };

      setEntries({ ...entries, [from.date]: src, [toDate]: dst });
      setSel(null);
    },
    [entries, sync],
  );

  const qaAssign = useCallback(
    (cat: Category | null) => {
      const text = qaText.trim();
      const cellsNow = cellsFor(entries, sync, date);
      const slot = sel !== null && !cellsNow[sel] ? sel : nextEmptySlot(entries, sync, date);
      if (slot === null) {
        showToast('All 48 units are spoken for. An impressively full day.');
        return;
      }
      const span = assignRun(date, slot, cat ? { cat: cat.id, label: '' } : { cat: null, label: text || 'Something' });
      setQaText('');
      setQaOpen(false);
      if (span !== 2 && span < 4) {
        showToast(`${cat ? cat.name : text || 'Something'} → ${fmtSlot(slot)}. One unit, allocated.`);
      }
    },
    [qaText, entries, sync, date, sel, assignRun, showToast],
  );

  const addCatNow = useCallback(() => {
    const name = ncName.trim();
    if (!name) return;
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString(36);
    setCats((prev) => [...prev, { id, name, color: ncColor, self: ncSelf }]);
    setNcName('');
    setNewCatOpen(false);
    showToast(`“${name}” added. May it fill many units.`);
  }, [ncName, ncColor, ncSelf, showToast]);

  const deleteCat = useCallback((id: string) => {
    setCats((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const toggleSync = useCallback(
    (id: keyof SyncState) => {
      const provider = PROVIDERS.find((p) => p.id === id)!;
      const on = !sync[id];
      setSync({ ...sync, [id]: on });
      if (on) calendarProvider.connect(id);
      else calendarProvider.disconnect(id);
      showToast(on ? `${provider.name} connected. Its events have wandered into your week.` : `${provider.name} disconnected. Blissfully unreachable.`);
    },
    [sync, showToast],
  );

  const prevDay = useCallback(() => {
    setDate((d) => shiftISO(d, -1));
    setSel(null);
  }, []);
  const nextDay = useCallback(() => {
    setDate((d) => shiftISO(d, 1));
    setSel(null);
  }, []);
  const goToday = useCallback(() => {
    setDate(isoOf(new Date()));
    setSel(null);
  }, []);
  const pickDay = useCallback((iso: string) => {
    setDate(iso);
    setSel(null);
  }, []);

  const startEntryDrag = useCallback(
    (idx: number) => {
      const bounds = runBoundsAt(cellsFor(entries, sync, date), idx);
      dragRef.current = { type: 'entry', date, slot: bounds ? bounds[0] : idx };
    },
    [entries, sync, date],
  );

  const startCatDrag = useCallback((catId: string) => {
    dragRef.current = { type: 'cat', catId };
  }, []);

  const dropOnCell = useCallback(
    (idx: number) => {
      const g = dragRef.current;
      dragRef.current = null;
      if (!g) return;
      if (g.type === 'cat') assignRun(date, idx, { cat: g.catId, label: '' });
      else if (g.type === 'entry') {
        if (g.date === date && g.slot === idx) return;
        moveRun(g, date, idx);
      }
    },
    [date, assignRun, moveRun],
  );

  const dropOnDay = useCallback(
    (iso: string) => {
      const g = dragRef.current;
      dragRef.current = null;
      if (g && g.type === 'entry' && g.date !== iso) moveRun(g, iso, g.slot);
    },
    [moveRun],
  );

  const clickCell = useCallback(
    (idx: number) => {
      const cc = cellsFor(entries, sync, date)[idx];
      if (!cc) {
        setSel(idx);
        setSelLabel('');
        setQaOpen(false);
      } else if (cc.locked) {
        showToast(`That one came from ${cc.provider}. Take it up with them.`);
      }
    },
    [entries, sync, date, showToast],
  );

  const closeAssign = useCallback(() => {
    setSel(null);
    setSelLabel('');
  }, []);

  return {
    // raw state
    date,
    entries,
    cats,
    sync,
    sel,
    selLabel,
    qaText,
    qaOpen,
    toast,
    recapOpen,
    aboutOpen,
    newCatOpen,
    ncName,
    ncColor,
    ncSelf,

    // refs
    qaInputRef,
    gridRef,

    // setters
    setSelLabel,
    setQaText,
    setQaOpen,
    setRecapOpen,
    setAboutOpen,
    setNewCatOpen,
    setNcName,
    setNcColor,
    setNcSelf,

    // actions
    showToast,
    assignRun,
    deleteRun,
    moveRun,
    qaAssign,
    addCatNow,
    deleteCat,
    toggleSync,
    prevDay,
    nextDay,
    goToday,
    pickDay,
    startEntryDrag,
    startCatDrag,
    dropOnCell,
    dropOnDay,
    clickCell,
    closeAssign,

    // derived helpers other modules need
    week: weekOf(date),
    today,
  };
}

export type UnitsApp = ReturnType<typeof useUnitsApp>;
