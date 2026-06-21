import { FIXTURES_ENDPOINT, SEASON } from './constants.js';

// ─── URL builder ─────────────────────────────────────────────────────────────

/** Builds the fixtures query URL for a given league (or all leagues). */
export function buildFixturesUrl(league) {
  const season = league?.season ?? SEASON;
  const params = new URLSearchParams({ season: String(season) });
  if (league?.apiId) params.set('league', String(league.apiId));
  return `${FIXTURES_ENDPOINT}?${params.toString()}`;
}

// ─── Response shapers ────────────────────────────────────────────────────────

/**
 * Shapes a raw API-Football /fixtures response into the format Fixtures.jsx
 * expects. Accepts the full JSON payload (with a .response array).
 */
export function formatFixturesResponse(payload) {
  if (!payload?.response) throw new Error('Invalid API response');

  return payload.response.map((fx) => ({
    id:     fx?.fixture?.id ?? crypto.randomUUID(),
    league: fx?.league?.name            ?? '',
    date:   fx?.fixture?.date           ?? null,
    status: fx?.fixture?.status?.short  ?? 'NS',
    home: {
      name:  fx?.teams?.home?.name  ?? 'Unknown',
      logo:  fx?.teams?.home?.logo  ?? '',
      score: fx?.goals?.home,
    },
    away: {
      name:  fx?.teams?.away?.name  ?? 'Unknown',
      logo:  fx?.teams?.away?.logo  ?? '',
      score: fx?.goals?.away,
    },
  }));
}

/**
 * Shapes a raw API-Football live response into the format Sports.jsx expects.
 * Gracefully handles missing fields with safe fallbacks.
 */
export function formatLiveResponse(payload) {
  return (payload?.response ?? []).map((fx) => ({
    id:     fx?.fixture?.id ?? crypto.randomUUID(),
    sport:  'football',
    league: fx?.league?.name           ?? '',
    status: fx?.fixture?.status?.short ?? 'LIVE',
    minute: fx?.fixture?.status?.elapsed,
    home: {
      name:  fx?.teams?.home?.name  ?? 'Unknown',
      logo:  fx?.teams?.home?.logo  ?? '',
      score: fx?.goals?.home,
    },
    away: {
      name:  fx?.teams?.away?.name  ?? 'Unknown',
      logo:  fx?.teams?.away?.logo  ?? '',
      score: fx?.goals?.away,
    },
  }));
}

// ─── Display helpers ─────────────────────────────────────────────────────────

/**
 * Converts an ISO date string to a human-readable kickoff label.
 * Returns 'TBD' for null, empty, or invalid values.
 */
export function formatKickoff(isoDate) {
  if (!isoDate) return 'TBD';

  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return 'TBD';

  const today   = new Date();
  const isToday = date.toDateString() === today.toDateString();

  const day = isToday
    ? 'Today'
    : date.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' });

  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return `${day} · ${time}`;
}