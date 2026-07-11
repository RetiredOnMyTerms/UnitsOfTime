export const WEEKDAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function isoOf(d: Date): string {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

export function parseISO(s: string): Date {
  const p = s.split('-').map(Number);
  return new Date(p[0], p[1] - 1, p[2]);
}

export function shiftISO(s: string, n: number): string {
  const d = parseISO(s);
  d.setDate(d.getDate() + n);
  return isoOf(d);
}

/** Monday-first week containing the given ISO date. */
export function weekOf(s: string): string[] {
  const d = parseISO(s);
  const wd = (d.getDay() + 6) % 7;
  const out: string[] = [];
  for (let i = 0; i < 7; i++) {
    const x = new Date(d);
    x.setDate(d.getDate() - wd + i);
    out.push(isoOf(x));
  }
  return out;
}

export function fmtHour(h: number): string {
  const ap = h < 12 ? 'AM' : 'PM';
  let x = h % 12;
  if (x === 0) x = 12;
  return x + ' ' + ap;
}

export function fmtSlot(i: number): string {
  const h = Math.floor(i / 2);
  const m = i % 2 ? ':30' : ':00';
  const ap = h < 12 ? 'am' : 'pm';
  let x = h % 12;
  if (x === 0) x = 12;
  return x + m + ' ' + ap;
}

export function dayOfYear(d: Date): number {
  return Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000);
}
