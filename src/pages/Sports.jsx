import React, { useState, useEffect, useCallback } from 'react';
import { PlaySquare, RefreshCw, Search, AlertCircle, Users } from 'lucide-react';
import {
  SPORTS,
  LIVE_ENDPOINT,
  AUTO_REFRESH_MS,
  formatLiveResponse,
  // --- NEW SQUAD UTILS FOR THE LIVE ACCORDION PANEL ---
  buildLineupsUrl,
  formatLineupsResponse
} from '../data/index.js';

function TeamCrest({ name, logo }) {
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    setBroken(false);
  }, [logo]);

  if (logo && !broken) {
    return (
      <img
        src={logo}
        alt=""
        onError={() => setBroken(true)}
        className="h-7 w-7 shrink-0 rounded-full bg-white/5 object-contain"
      />
    );
  }

  return (
    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/10 text-[10px] font-bold text-white/60">
      {name?.slice(0, 2).toUpperCase()}
    </span>
  );
}

// ─── SQUAD COLUMN RENDERER FOR LIVE FIXTURES ────────────────────────────────
function LiveSquadColumn({ teamData, title }) {
  if (!teamData || !teamData.starters?.length) {
    return <div className="text-xs text-white/30 italic py-2">Lineup unconfirmed</div>;
  }

  return (
    <div className="flex-1 min-w-0">
      <div className="mb-2">
        <h4 className="text-xs font-bold text-white/80 truncate">{teamData.teamName}</h4>
        <p className="text-[10px] text-cyan-400 font-semibold">{teamData.formation} · {teamData.coach}</p>
      </div>
      
      <div className="space-y-2">
        <div>
          <span className="text-[9px] uppercase tracking-wider text-white/30 font-bold block mb-1">{title} XI</span>
          <div className="space-y-0.5 max-h-36 overflow-y-auto no-scrollbar bg-black/30 p-1.5 rounded-lg border border-white/5">
            {teamData.starters.map((p) => (
              <div key={p.id || p.name} className="flex gap-1.5 text-xs py-0.5 truncate">
                <span className="text-cyan-400 font-bold w-4 text-right shrink-0">{p.number ?? '-'}</span>
                <span className="text-white/70 truncate">{p.name}</span>
                <span className="text-[9px] text-white/30 ml-auto uppercase font-bold shrink-0">{p.position}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <span className="text-[9px] uppercase tracking-wider text-white/30 font-bold block mb-1">Subs</span>
          <div className="space-y-0.5 max-h-24 overflow-y-auto no-scrollbar bg-black/30 p-1.5 rounded-lg border border-white/5">
            {teamData.bench.map((p) => (
              <div key={p.id || p.name} className="flex gap-1.5 text-xs py-0.5 truncate">
                <span className="text-white/40 font-bold w-4 text-right shrink-0">{p.number ?? '-'}</span>
                <span className="text-white/60 truncate">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Sports() {
  const [activeSport, setActiveSport] = useState('football');
  const [query, setQuery] = useState('');
  const [matches, setMatches] = useState([]);
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // --- NEW STATES FOR INTERACTIVE LIVE DRAWERS ---
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [squadData, setSquadData] = useState(null);
  const [squadLoading, setSquadLoading] = useState(false);

  const sport = SPORTS.find((s) => s.id === activeSport);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetch(LIVE_ENDPOINT);
      if (!res.ok) throw new Error(`Request failed (${res.status})`);

      const payload = await res.json();
      setMatches(formatLiveResponse(payload));
      setStatus('success');
      setLastUpdated(Date.now());
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message || 'Something went wrong');
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, AUTO_REFRESH_MS);
    return () => clearInterval(interval);
  }, [refresh]);

  // --- NEW LAZY FETCH ROUTINE FOR EXPANDING SQUADS ---
  const handleToggleSquads = async (matchId) => {
    if (selectedMatchId === matchId) {
      setSelectedMatchId(null);
      return;
    }

    setSelectedMatchId(matchId);
    setSquadLoading(true);
    setSquadData(null);

    try {
      const res = await fetch(buildLineupsUrl(matchId));
      if (!res.ok) throw new Error();
      const rawPayload = await res.json();
      setSquadData(formatLineupsResponse(rawPayload));
    } catch (err) {
      setSquadData({ home: null, away: null });
    } finally {
      setSquadLoading(false);
    }
  };

  // Reset selected match when swapping sports tabs
  const handleSportChange = (sportId) => {
    setActiveSport(sportId);
    setSelectedMatchId(null);
  };

  const filteredMatches = matches.filter(
    (m) =>
      m.sport === activeSport &&
      `${m.home.name} ${m.away.name}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      className="min-h-screen w-full bg-[#0a0e17] px-4 pb-24 pt-5 text-white"
      style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700;800&display=swap');
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes pulse-soft { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>

      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlaySquare size={20} className="text-emerald-400" strokeWidth={2.2} />
            <h1 className="text-lg font-extrabold tracking-tight">Live Now</h1>
          </div>
          <button
            type="button"
            onClick={refresh}
            disabled={refreshing}
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-semibold text-cyan-400 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400 ${
              refreshing ? 'cursor-not-allowed opacity-50' : 'hover:text-white'
            }`}
          >
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Sport tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
          {SPORTS.map((s) => {
            const active = activeSport === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSportChange(s.id)}
                className={`flex-none flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400 ${
                  active
                    ? 'bg-gradient-to-r from-cyan-400 to-violet-500 text-[#0a0e17] shadow-md shadow-violet-500/20'
                    : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="text-base leading-none">{s.emoji}</span>
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative mt-4">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${sport.label} teams...`}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white placeholder-white/35 outline-none transition focus:border-cyan-400/50 focus:bg-white/[0.07]"
          />
        </div>

        {status === 'success' && lastUpdated && (
          <p className="mt-2 text-right text-[11px] text-white/25">
            Updated{' '}
            {new Date(lastUpdated).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        )}

        {/* Loading skeleton */}
        {status === 'loading' && (
          <div className="mt-5 flex flex-col gap-2.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-[74px] rounded-2xl border border-white/10 bg-white/[0.03]"
                style={{
                  animation: 'pulse-soft 1.4s ease-in-out infinite',
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Error state */}
        {status === 'error' && (
          <div className="mt-16 flex flex-col items-center gap-3 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-red-500/10">
              <AlertCircle size={26} className="text-red-400" />
            </div>
            <p className="font-bold text-white/80">Couldn't load live matches</p>
            <p className="max-w-[260px] text-sm text-white/40">{errorMessage}</p>
            <button
              type="button"
              onClick={refresh}
              className="mt-1 rounded-full border border-white/15 px-4 py-2 text-sm font-bold text-white/80 transition hover:bg-white/5 hover:text-white"
            >
              Try again
            </button>
          </div>
        )}

        {/* Matches */}
        {status === 'success' && filteredMatches.length > 0 && (
          <ul className="mt-4 flex flex-col gap-2.5">
            {filteredMatches.map((m) => {
              const isDrawerOpen = selectedMatchId === m.id;
              return (
                <li
                  key={m.id}
                  className={`rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden ${
                    isDrawerOpen ? 'border-cyan-500/40 bg-white/[0.06]' : 'border-white/10 bg-white/[0.04]'
                  }`}
                  onClick={() => handleToggleSquads(m.id)}
                >
                  {/* Top Summary Info */}
                  <div className="p-3.5 pb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-white/35 truncate max-w-[70%]">
                        {m.league || 'Football'}
                      </span>
                      <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 shrink-0">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {typeof m.minute === 'number' ? `${m.minute}'` : m.status}
                      </span>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <TeamCrest name={m.home.name} logo={m.home.logo} />
                        <span className="truncate text-sm font-semibold">{m.home.name}</span>
                      </div>
                      <span className="shrink-0 text-sm font-extrabold tabular-nums">
                        {m.home.score ?? 0}
                      </span>
                    </div>

                    <div className="mt-1.5 flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <TeamCrest name={m.away.name} logo={m.away.logo} />
                        <span className="truncate text-sm font-semibold">{m.away.name}</span>
                      </div>
                      <span className="shrink-0 text-sm font-extrabold tabular-nums">
                        {m.away.score ?? 0}
                      </span>
                    </div>

                    {/* Interactive Lineup Action Hint */}
                    {activeSport === 'football' && (
                      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-center gap-1 text-[10px] font-bold text-white/25 hover:text-cyan-400 transition">
                        <Users size={11} />
                        {isDrawerOpen ? 'Close Lineup Details' : 'Tap to View Lineups'}
                      </div>
                    )}
                  </div>

                  {/* --- EXPANDABLE LINEUP PANEL --- */}
                  {isDrawerOpen && activeSport === 'football' && (
                    <div 
                      className="border-t border-white/10 bg-black/20 p-3.5 pt-2.5 flex gap-4 transition-all"
                      onClick={(e) => e.stopPropagation()} // Guard click events
                    >
                      {squadLoading ? (
                        <div className="w-full py-6 flex flex-col items-center justify-center gap-2 text-white/30 text-xs font-semibold">
                          <RefreshCw size={13} className="animate-spin text-cyan-400" />
                          Loading Live Squad configurations...
                        </div>
                      ) : (
                        <>
                          <LiveSquadColumn teamData={squadData?.home} title="Starting" />
                          <div className="w-[1px] bg-white/5 self-stretch" />
                          <LiveSquadColumn teamData={squadData?.away} title="Starting" />
                        </>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {/* Empty state */}
        {status === 'success' && filteredMatches.length === 0 && (
          <div className="mt-16 flex flex-col items-center gap-3 text-center">
            <div className="relative grid h-20 w-20 place-items-center rounded-full bg-white/5">
              <span
                className="absolute h-20 w-20 rounded-full bg-gradient-to-br from-cyan-400/20 to-violet-500/20 blur-xl"
                aria-hidden="true"
              />
              <span className="relative text-4xl">{sport.emoji}</span>
            </div>
            <p className="font-bold text-white/80">No live {sport.label} matches right now</p>
            <p className="text-sm text-white/40">Refreshes every 30 seconds</p>
          </div>
        )}
      </div>
    </div>
  );
}