import type { Category, Provider } from './types';

export const DEFAULT_CATS: Category[] = [
  { id: 'bath', name: 'Bath', color: 'oklch(0.82 0.08 235)', self: true },
  { id: 'telly', name: 'Telly', color: 'oklch(0.82 0.08 300)', self: true },
  { id: 'exercise', name: 'Exercise', color: 'oklch(0.82 0.1 145)', self: true },
  { id: 'research', name: 'Web-based research', color: 'oklch(0.82 0.08 195)', self: true },
  { id: 'shopping', name: 'Shopping', color: 'oklch(0.82 0.09 20)', self: false },
  { id: 'meals', name: 'Meals out', color: 'oklch(0.84 0.09 80)', self: false },
  { id: 'nothing', name: 'Doing nothing', color: 'oklch(0.87 0.02 90)', self: true },
  { id: 'work', name: 'Actual work', color: 'oklch(0.8 0.06 260)', self: false },
];

export const SWATCHES = [
  'oklch(0.82 0.09 20)', 'oklch(0.82 0.09 55)', 'oklch(0.84 0.09 80)', 'oklch(0.82 0.1 145)',
  'oklch(0.82 0.08 195)', 'oklch(0.82 0.08 235)', 'oklch(0.82 0.08 300)', 'oklch(0.82 0.08 340)',
];

export const PROVIDERS: Provider[] = [
  { id: 'google', name: 'Google Calendar', glyph: 'G' },
  { id: 'outlook', name: 'Outlook', glyph: 'O' },
  { id: 'apple', name: 'Apple Calendar', glyph: 'A' },
  { id: 'amazon', name: 'Amazon Alexa', glyph: 'a' },
];

export const QUOTES = [
  'I find the key is to think of a day as units of time, each unit consisting of no more than thirty minutes.',
  'Full hours can be a little bit intimidating. Most activities take about half an hour.',
  'Doing nothing, done properly, is a full-time occupation.',
  'A bath is one unit. A good bath, run correctly, is still one unit. Discipline.',
  'The trick is to fill the units so completely that there is no room left for questions.',
  'Some people have jobs. I have a schedule.',
  'Every man is an island. Some islands simply have better daytime television.',
];

export const RECAP_QUIPS: Record<string, string> = {
  telly: 'Countdown doesn’t watch itself.',
  bath: 'Cleanliness, at scale.',
  nothing: 'Mastery takes practice.',
  exercise: 'Somebody’s training for something.',
  research: 'Very important research, no doubt.',
  work: 'Who are you, and what have you done with Will?',
};

export const STORAGE_KEY = 'units-tracker-v1';

/** Display settings the prototype exposed as design-tool knobs; fixed here since there's no host UI for them yet. */
export const DENSITY: 'cozy' | 'compact' = 'compact';
export const DIM_QUIET_HOURS = true;
export const SHOW_QUOTES = true;
