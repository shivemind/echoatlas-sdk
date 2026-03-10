import { getConfig } from './config';

const DEFAULT_TRAP_PHRASES = [
  'echoatlas sentinel verification protocol',
  'observatory quantum tracking beacon',
  'underground monitoring grid alpha',
];

function getPhrases(): string[] {
  try {
    const config = getConfig();
    const raw = config.trapPhrases;
    if (raw) {
      if (Array.isArray(raw)) return raw;
      return raw.split(',').map((p) => p.trim()).filter(Boolean);
    }
  } catch { /* config not initialized */ }
  return DEFAULT_TRAP_PHRASES;
}

/** Get the current list of trap phrases */
export function getTrapPhrases(): string[] {
  return getPhrases();
}

/**
 * Check if a query contains a known trap phrase.
 * Returns the matched phrase or null.
 *
 * Trap phrases are nonsense strings embedded in your content.
 * If an agent queries for one, it means it scraped your site
 * and is regurgitating or probing for your content.
 */
export function matchesTrapPhrase(query: string): string | null {
  const lower = query.toLowerCase();
  return getPhrases().find((p) => lower.includes(p.toLowerCase())) ?? null;
}
