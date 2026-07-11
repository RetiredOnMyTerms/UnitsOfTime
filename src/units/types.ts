export interface Category {
  id: string;
  name: string;
  color: string;
  /** Whether time in this category counts toward "Island of me". */
  self: boolean;
}

/** A single 30-minute unit assigned by the user. */
export interface UnitEntry {
  cat: string | null;
  label: string;
}

/** dateISO -> slot index (0-47) -> entry */
export type EntriesByDate = Record<string, Record<number, UnitEntry>>;

export type ProviderId = 'google' | 'outlook' | 'apple' | 'amazon';

export type SyncState = Record<ProviderId, boolean>;

export interface Provider {
  id: ProviderId;
  name: string;
  glyph: string;
}

/** A cell as rendered on the grid: either a user entry or a synced calendar event. */
export interface GridCell {
  key: string;
  user: boolean;
  cat: string | null;
  label: string;
  locked: boolean;
  provider?: string;
  glyph?: string;
}

export interface PersistedState {
  entries: EntriesByDate;
  cats: Category[];
  sync: SyncState;
}

export type DragPayload = { type: 'cat'; catId: string } | { type: 'entry'; date: string; slot: number };
