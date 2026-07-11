import { SimulatedCalendarProvider } from './simulatedProvider';

export * from './types';

/** Swap this for a real-provider implementation when OAuth sync ships. */
export const calendarProvider = new SimulatedCalendarProvider();
