import { FIXTURES_ENDPOINT, LIVE_ENDPOINT, LINEUPS_ENDPOINT, SEASON } from './constants.js';

// ─── URL builders ────────────────────────────────────────────────────────────

/** Builds the fixtures query URL for a given league (or all leagues). */
export function buildFixturesUrl(league) {
  const season = league?.season ?? SEASON;
  const params = new URLSearchParams({ season: String(season) });
  if (league?.apiId) params.set('league', String(league.apiId));
  return `${FIXTURES_ENDPOINT}?${params.toString()}`;
}

/** NEW: Builds the url to get lineups for a specific match fixture ID */
export function buildLineupsUrl(fixtureId) {
  if (!fixtureId) return '';
  return `${LINEUPS_ENDPOINT}?fixture=${fixtureId}`;
}

// ─── Response shapers ────────────────────────────────────────────────────────

/**
 * Shapes a raw API-Football /fixtures response into the format Fixtures.jsx expects.
 */
export function formatFixturesResponse(payload) {
  if (!payload?.response) throw new Error('Invalid API response');

  return payload.response.map((fx) => ({
    id:     fx?.fixture?.id ?? crypto.randomUUID(),
    league: fx?.league?.name           ?? '',
    date:   fx?.fixture?.date          ?? null,
    status: fx?.fixture?.status?.short ?? 'NS',
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

/**
 * NEW: Shapes raw API-Football lineups response into UI-friendly structure.
 * Handles extracting the formation, Starting XI, and Bench (substitutes).
 */
export function formatLineupsResponse(payload) {
  if (!payload?.response || payload.response.length === 0) {
    return { home: null, away: null };
  }

  // API-Football returns an array where item 0 is Home and item 1 is Away
  const homeRaw = payload.response[0];
  const awayRaw = payload.response[1];

  const mapSquad = (squadArray) => 
    (squadArray ?? []).map(p => ({
      id: p.player?.id,
      name: p.player?.name,
      number: p.player?.number,
      position: p.player?.pos // 'G', 'D', 'M', 'F'
    }));

  return {
    home: {
      teamName: homeRaw?.team?.name ?? 'Home Team',
      formation: homeRaw?.formation ?? 'N/A',
      coach: homeRaw?.coach?.name ?? 'Unknown',
      starters: mapSquad(homeRaw?.startXI),
      bench: mapSquad(homeRaw?.substitutes) // Grabs the substitutes list
    },
    away: {
      teamName: awayRaw?.team?.name ?? 'Away Team',
      formation: awayRaw?.formation ?? 'N/A',
      coach: awayRaw?.coach?.name ?? 'Unknown',
      starters: mapSquad(awayRaw?.startXI),
      bench: mapSquad(awayRaw?.substitutes)
    }
  };
}

// ─── Display helpers ─────────────────────────────────────────────────────────

/**
 * Converts an ISO date string to a human-readable kickoff label.
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