// Season: most football APIs key by start year (2025 = the 2025/26 season).
// July is a safe cutover month between seasons.
export const SEASON =
  new Date().getMonth() >= 6
    ? new Date().getFullYear()
    : new Date().getFullYear() - 1;

export const AUTO_REFRESH_MS = 30_000;

// Swap these for your real backend routes.
export const FIXTURES_ENDPOINT = 'http://localhost:5000/api/football/fixtures';
export const LIVE_ENDPOINT     = 'http://localhost:5000/api/football/live';

export const LEAGUES = [
  { id: 'all',        label: 'All',            apiId: null },
  { id: 'worldcup',  label: 'World Cup',       apiId: 1,   season: 2026 },
  { id: 'pl',         label: 'Premier League', apiId: 39   },
  { id: 'laliga',     label: 'La Liga',        apiId: 140  },
  { id: 'bundesliga', label: 'Bundesliga',     apiId: 78   },
  { id: 'seriea',     label: 'Serie A',        apiId: 135  },
  { id: 'ligue1',     label: 'Ligue 1',        apiId: 61   },
  { id: 'mls',        label: 'MLS',            apiId: 253  },
];

export const SPORTS = [
  { id: 'football',   label: 'Football',   emoji: '⚽' },
  { id: 'basketball', label: 'Basketball', emoji: '🏀' },
  { id: 'tennis',     label: 'Tennis',     emoji: '🎾' },
  { id: 'baseball',   label: 'Baseball',   emoji: '⚾' },
];