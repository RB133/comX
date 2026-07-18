/**
 * Shared read/write helpers for the small pieces of Redux state (active
 * server/channel, tab, theme, calendar year) that persist as a single raw
 * string in localStorage. Every slice was hand-rolling this same get/set
 * logic — centralized here so there's one correct implementation.
 */
export function readPersisted<T>(key: string, fallback: T, parse: (raw: string) => T): T {
  const raw = window.localStorage.getItem(key);
  if (raw === null) return fallback;
  const parsed = parse(raw);
  return Number.isNaN(parsed as unknown as number) ? fallback : parsed;
}

export function writePersisted(key: string, value: string | number): void {
  window.localStorage.setItem(key, String(value));
}
