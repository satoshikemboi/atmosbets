import { MATCHES_ENDPOINT, SEASON } from './constants.js';

// ─────────────────────────────────────────────────────────────
// URL BUILDERS
// ─────────────────────────────────────────────────────────────

/**
 * Builds the matches URL for a selected competition.
 * Uses unified backend route:
 * /api/football/matches?competition=PL
 */
export function buildFixturesUrl(league) {
  const season = league?.season ?? SEASON;

  const params = new URLSearchParams({
    season: String(season),
  });

  if (league?.apiId) {
    params.set('competition', league.apiId);
  }

  return `${MATCHES_ENDPOINT}?${params.toString()}`;
}

// ─────────────────────────────────────────────────────────────
// RESPONSE FORMATTERS
// ─────────────────────────────────────────────────────────────

/**
 * Shapes Football-Data.org response
 * into Fixtures/Matches UI format.
 */
export function formatFixturesResponse(payload) {
  if (!payload?.matches) {
    return [];
  }

  return payload.matches.map((match) => ({
    id: match.id,

    league: match.competition?.name ?? 'League',

    date: match.utcDate,

    status: match.status ?? 'SCHEDULED',

    matchday: match.matchday,

    home: {
      name:
        match.homeTeam?.shortName ||
        match.homeTeam?.name ||
        'Unknown',

      logo: match.homeTeam?.crest || '',

      score: match.score?.fullTime?.home,
    },

    away: {
      name:
        match.awayTeam?.shortName ||
        match.awayTeam?.name ||
        'Unknown',

      logo: match.awayTeam?.crest || '',

      score: match.score?.fullTime?.away,
    },
  }));
}

/**
 * Formats live matches only.
 */
export function formatLiveResponse(payload) {
  return (payload?.matches ?? [])
    .filter(
      (match) =>
        match.status === 'IN_PLAY' ||
        match.status === 'PAUSED'
    )
    .map((match) => ({
      id: match.id,

      sport: 'football',

      league: match.competition?.name ?? '',

      status: match.status,

      minute: null,

      home: {
        name:
          match.homeTeam?.shortName ||
          match.homeTeam?.name ||
          'Unknown',

        logo: match.homeTeam?.crest || '',

        score: match.score?.fullTime?.home,
      },

      away: {
        name:
          match.awayTeam?.shortName ||
          match.awayTeam?.name ||
          'Unknown',

        logo: match.awayTeam?.crest || '',

        score: match.score?.fullTime?.away,
      },
    }));
}

// ─────────────────────────────────────────────────────────────
// DISPLAY HELPERS
// ─────────────────────────────────────────────────────────────

/**
 * Converts ISO date → readable kickoff label
 */
export function formatKickoff(isoDate) {
  if (!isoDate) return 'TBD';

  const date = new Date(isoDate);

  if (isNaN(date.getTime())) {
    return 'TBD';
  }

  const today = new Date();

  const isToday =
    date.toDateString() === today.toDateString();

  const day = isToday
    ? 'Today'
    : date.toLocaleDateString([], {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      });

  const time = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${day} · ${time}`;
}