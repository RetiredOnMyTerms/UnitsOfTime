import type { ProviderId } from '../types';

/** A calendar event as it appears on the grid: a run of one or more 30-min units. */
export interface CalendarEvent {
  slot: number;
  span: number;
  label: string;
}

/**
 * Abstraction over "where synced calendar events come from" so the simulated
 * demo data can later be swapped for real OAuth-backed providers (Google,
 * Outlook, Apple, Amazon) without touching any UI or state code.
 *
 * A real implementation would: perform OAuth connect/disconnect against the
 * provider's API from a backend (client secrets can't live in the browser),
 * cache tokens server-side, and fetch real events for the requested date
 * range on `getEventsForDate`.
 */
export interface CalendarProvider {
  connect(id: ProviderId): Promise<void>;
  disconnect(id: ProviderId): Promise<void>;
  getEventsForDate(id: ProviderId, dateISO: string): CalendarEvent[];
}
