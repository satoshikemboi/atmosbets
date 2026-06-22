// Season: most football APIs key by start year (2025 = the 2025/26 season).
// July is a safe cutover month between seasons.
export const SEASON =
  new Date().getMonth() >= 6
    ? new Date().getFullYear()
    : new Date().getFullYear() - 1;

export const AUTO_REFRESH_MS = 30_000;

// --- UPDATED: Unified Football-Data.org Backend Route ---
export const MATCHES_ENDPOINT = 'https://atmosbets.onrender.com/api/football/matches';

// --- UPDATED: Replaced numeric IDs with Football-Data.org v4 string codes ---
export const LEAGUES = [
  { id: 'all',        label: 'All Timeline',     apiId: null },
  { id: 'pl',         label: 'Premier League',   apiId: 'PL' },
  { id: 'laliga',     label: 'La Liga',          apiId: 'PD' },
  { id: 'bundesliga', label: 'Bundesliga',       apiId: 'BL1' },
  { id: 'seriea',     label: 'Serie A',          apiId: 'SA' },
  { id: 'ligue1',     label: 'Ligue 1',          apiId: 'FL1' },
  { id: 'champions',  label: 'Champions League', apiId: 'CL' }
];

export const SPORTS = [
  { id: 'football',   label: 'Football',   emoji: '⚽' },
  { id: 'basketball', label: 'Basketball', emoji: '🏀' },
  { id: 'tennis',     label: 'Tennis',     emoji: '🎾' },
  { id: 'baseball',   label: 'Baseball',   emoji: '⚾' },
];