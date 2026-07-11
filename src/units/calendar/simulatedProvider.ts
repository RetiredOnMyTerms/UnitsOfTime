import { parseISO } from '../dateUtils';
import type { ProviderId } from '../types';
import type { CalendarEvent, CalendarProvider } from './types';

/**
 * Demo events keyed by weekday (0 = Monday .. 6 = Sunday), so the same
 * events recur every week. Stands in for real calendar data until a
 * provider is wired up to an actual account.
 */
const SIMULATED_WEEKLY_EVENTS: Record<ProviderId, Array<CalendarEvent & { wd: number }>> = {
  google: [
    { wd: 0, slot: 19, span: 1, label: 'Stand-up' },
    { wd: 2, slot: 19, span: 1, label: 'Stand-up' },
    { wd: 3, slot: 29, span: 2, label: 'Design review' },
  ],
  outlook: [
    { wd: 1, slot: 28, span: 1, label: '1:1 with Rachel' },
    { wd: 3, slot: 22, span: 2, label: 'Budget review' },
  ],
  apple: [
    { wd: 5, slot: 20, span: 2, label: 'Farmers market' },
    { wd: 6, slot: 36, span: 1, label: 'Call Mum' },
  ],
  amazon: [
    { wd: 4, slot: 36, span: 1, label: 'Package arriving' },
  ],
};

/**
 * Connects instantly and serves fixed demo events. This is the only
 * `CalendarProvider` implementation today; a real one (backed by OAuth +
 * a backend token store) can be added later and swapped in without
 * changing any consumer of the `CalendarProvider` interface.
 */
export class SimulatedCalendarProvider implements CalendarProvider {
  async connect(_id: ProviderId): Promise<void> {}
  async disconnect(_id: ProviderId): Promise<void> {}

  getEventsForDate(id: ProviderId, dateISO: string): CalendarEvent[] {
    const wd = (parseISO(dateISO).getDay() + 6) % 7;
    return SIMULATED_WEEKLY_EVENTS[id].filter((ev) => ev.wd === wd).map(({ wd: _wd, ...ev }) => ev);
  }
}
