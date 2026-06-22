import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Search, AlertCircle, ChevronRight } from 'lucide-react';
import { SPORTS, AUTO_REFRESH_MS, MATCHES_ENDPOINT } from '../data/constants.js';
import { formatLiveResponse } from '../data/formatters.js';

// ─── TEAM CREST ───────────────────────────────────────────────────────────────
function TeamCrest({ name, logo }) {
  const [broken, setBroken] = useState(false);
  useEffect(() => { setBroken(false); }, [logo]);

  if (logo && !broken) {
    return (
      <img
        src={logo}
        alt=""
        onError={() => setBroken(true)}
        className="h-8 w-8 shrink-0 rounded-full object-contain bg-gray-50 border border-gray-100 p-0.5"
      />
    );
  }
  return (
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gray-100 text-[10px] font-bold text-gray-500 border border-gray-200">
      {name?.slice(0, 2).toUpperCase()}
    </span>
  );
}

// ─── LIVE MATCH CARD ─────────────────────────────────────────────────────────
function MatchCard({ m }) {
  const homeScore = m.home.score ?? 0;
  const awayScore = m.away.score ?? 0;

  return (
    <div
      className="rounded-2xl bg-white overflow-hidden ring-1 ring-emerald-200 shadow-sm shadow-emerald-50"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── Header strip: League | Live minute ── */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-100">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
          {m.league}
        </span>
        <span className="flex items-center gap-1.5 text-[10px] font-extrabold text-emerald-500 uppercase tracking-wider">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {m.status}
        </span>
      </div>

      {/* ── Teams ── */}
      <div className="px-4 pt-3 pb-1">
        {/* Home */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <TeamCrest name={m.home.name} logo={m.home.logo} />
            <span className="text-[13.5px] font-semibold text-gray-900 truncate">{m.home.name}</span>
          </div>
          <span className="text-[15px] font-extrabold text-gray-900 tabular-nums ml-3">{homeScore}</span>
        </div>

        {/* Indented divider */}
        <div className="my-2.5 border-t border-gray-100 ml-[42px]" />

        {/* Away */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <TeamCrest name={m.away.name} logo={m.away.logo} />
            <span className="text-[13.5px] font-semibold text-gray-900 truncate">{m.away.name}</span>
          </div>
          <span className="text-[15px] font-extrabold text-gray-900 tabular-nums ml-3">{awayScore}</span>
        </div>
      </div>

      {/* ── Footer: LIVE · big score · Details ── */}
      <div className="flex items-center justify-between px-4 py-2.5 mt-1 border-t border-gray-100">
        <span className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-emerald-500 w-16">Live</span>
        <span className="text-base font-black tabular-nums text-gray-800">
          {homeScore} – {awayScore}
        </span>
        <button className="flex items-center gap-0.5 text-[11px] font-semibold text-blue-500 w-16 justify-end">
          Details <ChevronRight size={11} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

// ─── LEAGUE GROUP ─────────────────────────────────────────────────────────────
function LeagueGroup({ leagueName, matches }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2.5 px-0.5">
        <span className="text-[11px] font-black uppercase tracking-[0.12em] text-gray-900">{leagueName}</span>
        <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gray-800 px-1 text-[9px] font-extrabold text-white">
          {matches.length}
        </span>
      </div>
      <div className="space-y-2">
        {matches.map((m) => <MatchCard key={m.id} m={m} />)}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Sports() {
  const [activeSport, setActiveSport]   = useState('football');
  const [query, setQuery]               = useState('');
  const [matches, setMatches]           = useState([]);
  const [status, setStatus]             = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [refreshing, setRefreshing]     = useState(false);
  const [lastUpdated, setLastUpdated]   = useState(null);

  const sport = SPORTS.find((s) => s.id === activeSport) || SPORTS[0];

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await fetch(MATCHES_ENDPOINT);
      if (!response.ok) throw new Error(`Request failed (${response.status})`);
      const payload = await response.json();
      setMatches(formatLiveResponse(payload));
      setStatus('success');
      setLastUpdated(Date.now());
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message || 'Unable to fetch matches');
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, AUTO_REFRESH_MS);
    return () => clearInterval(interval);
  }, [refresh]);

  // Filter by sport + search query
  const filtered = matches.filter(
    (m) =>
      m.sport === activeSport &&
      `${m.home.name} ${m.away.name}`.toLowerCase().includes(query.toLowerCase())
  );

  // Group by league
  const grouped = filtered.reduce((acc, m) => {
    (acc[m.league] = acc[m.league] || []).push(m);
    return acc;
  }, {});

  return (
    <div
      className="min-h-screen w-full bg-[#f0f1f6] px-4 pb-28 pt-5 text-gray-900"
      style={{ fontFamily: "'Inter', ui-sans-serif, system-ui" }}
    >
      <div className="mx-auto max-w-md space-y-4">

        {/* ── Sport filter tabs ── */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
          {SPORTS.map((s) => (
            <button
              key={s.id}
              onClick={() => { setActiveSport(s.id); setQuery(''); }}
              className={`flex-none rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                activeSport === s.id
                  ? 'bg-gray-900 text-white shadow'
                  : 'bg-white text-gray-500 shadow-sm hover:bg-gray-50'
              }`}
            >
              {s.emoji} {s.label}
            </button>
          ))}

          {/* Sync */}
          <button
            onClick={refresh}
            disabled={refreshing}
            className="flex-none ml-auto flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-bold text-gray-500 shadow-sm hover:bg-gray-50 transition"
          >
            <RefreshCw size={12} className={refreshing ? 'animate-spin text-emerald-500' : ''} />
            Sync
          </button>
        </div>

        {/* ── Search ── */}
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${sport.label}…`}
            className="w-full rounded-xl bg-white py-2.5 pl-9 pr-4 text-sm text-gray-800 placeholder-gray-400 shadow-sm outline-none focus:ring-2 focus:ring-emerald-300 transition"
          />
        </div>

        {/* ── Live header ── */}
        {status === 'success' && filtered.length > 0 && (
          <div className="flex items-center justify-between px-0.5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-black text-gray-900">
                Live Now ({filtered.length})
              </span>
            </div>
            {lastUpdated && (
              <span className="text-[10px] font-medium text-gray-400">
                {new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
        )}

        {/* ── Loading skeletons ── */}
        {status === 'loading' && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-36 rounded-2xl bg-white/80 animate-pulse shadow-sm" />
            ))}
          </div>
        )}

        {/* ── Error ── */}
        {status === 'error' && (
          <div className="mt-16 flex flex-col items-center gap-2 text-center">
            <AlertCircle size={22} className="text-red-400" />
            <p className="text-sm font-semibold text-gray-500">{errorMessage}</p>
            <button
              onClick={refresh}
              className="mt-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-sm"
            >
              Try again
            </button>
          </div>
        )}

        {/* ── League groups ── */}
        {status === 'success' && filtered.length > 0 && (
          <div className="space-y-5">
            {Object.entries(grouped).map(([league, ms]) => (
              <LeagueGroup key={league} leagueName={league} matches={ms} />
            ))}
          </div>
        )}

        {/* ── Empty state ── */}
        {status === 'success' && filtered.length === 0 && (
          <div className="mt-20 text-center text-sm font-medium text-gray-400">
            {query
              ? `No results for "${query}"`
              : `No live ${sport.label} matches right now`}
          </div>
        )}

      </div>
    </div>
  );
}