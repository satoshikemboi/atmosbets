import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CalendarDays, RefreshCw, AlertCircle, Play } from 'lucide-react';
import { LEAGUES, MATCHES_ENDPOINT } from '../data/constants.js'; // Adjust path if needed

function TeamCrest({ name, logo }) {
  const [broken, setBroken] = useState(false);
  useEffect(() => { setBroken(false); }, [logo]);

  if (logo && !broken) {
    return (
      <img src={logo} alt="" onError={() => setBroken(true)} className="h-6 w-6 shrink-0 object-contain bg-white/5 rounded-md p-0.5" />
    );
  }
  return <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-white/10 text-[9px] font-bold text-white/50">{name?.slice(0, 2).toUpperCase()}</span>;
}

export default function Matches() {
  const [activeLeagueId, setActiveLeagueId] = useState('all');
  const [matches, setMatches] = useState([]);
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const abortRef = useRef(null);
  const activeLeague = LEAGUES.find((l) => l.id === activeLeagueId) || LEAGUES[0];

  // ─── INTERNAL DISPLAY HELPER ──────────────────────────────────────────────
  const formatKickoff = (isoDate) => {
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
  };

  // ─── INTERNAL CORE DATA FETCH & SHAPER ────────────────────────────────────
  const fetchMatchTimeline = useCallback(async (league) => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setRefreshing(true);
    setErrorMessage('');

    try {
      // 1. Build the dynamic url string natively
      const url = league.apiId 
        ? `${MATCHES_ENDPOINT}?competition=${league.apiId}`
        : MATCHES_ENDPOINT;

      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) throw new Error(`Server error (${response.status})`);
      
      const payload = await response.json();
      
      // 2. Shape the raw Football-Data.org v4 payload inline right here!
      if (!payload || !payload.matches) {
        setMatches([]);
        setStatus('success');
        return;
      }

      const formatted = payload.matches.map((m) => ({
        id: m.id,
        league: m.competition?.name ?? 'League',
        date: m.utcDate,
        status: m.status, // IN_PLAY, FINISHED, TIMED, SCHEDULED
        matchday: m.matchday,
        home: {
          name: m.homeTeam?.shortName || m.homeTeam?.name || 'Unknown',
          logo: m.homeTeam?.crest || '',
          score: m.score?.fullTime?.home
        },
        away: {
          name: m.awayTeam?.shortName || m.awayTeam?.name || 'Unknown',
          logo: m.awayTeam?.crest || '',
          score: m.score?.fullTime?.away
        }
      }));

      setMatches(formatted);
      setStatus('success');
    } catch (error) {
      if (error.name !== 'AbortError') {
        setStatus('error');
        setErrorMessage(error.message || 'Timeline fetch failure');
      }
    } finally {
      if (abortRef.current === controller) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    setStatus('loading');
    setMatches([]);
    fetchMatchTimeline(activeLeague);
    return () => { if (abortRef.current) abortRef.current.abort(); };
  }, [activeLeague, fetchMatchTimeline]);

  return (
    <div className="min-h-screen w-full bg-[#0a0e17] px-4 pb-24 pt-5 text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="mx-auto max-w-md">
        
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays size={19} className="text-orange-400" />
            <h1 className="text-lg font-extrabold tracking-tight">Match Center</h1>
          </div>
          <button 
            onClick={() => fetchMatchTimeline(activeLeague)} 
            disabled={refreshing} 
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-bold text-orange-400 bg-orange-400/5 hover:bg-orange-400/10 transition"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
            Sync
          </button>
        </div>

        {/* Competitions */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2">
          {LEAGUES.map((l) => (
            <button
              key={l.id}
              onClick={() => setActiveLeagueId(l.id)}
              className={`flex-none rounded-xl border px-3.5 py-2 text-xs font-bold transition ${
                activeLeagueId === l.id ? 'border-transparent bg-orange-500 text-black shadow-lg shadow-orange-500/10' : 'border-white/5 bg-white/5 text-white/60'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Loading Skeletons */}
        {status === 'loading' && (
          <div className="mt-4 space-y-2.5">
            {[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-2xl bg-white/[0.03] animate-pulse border border-white/5" />)}
          </div>
        )}

        {/* Error Flag */}
        {status === 'error' && (
          <div className="mt-16 flex flex-col items-center text-center gap-2">
            <AlertCircle size={24} className="text-red-400" />
            <p className="text-sm font-bold text-white/80">{errorMessage}</p>
          </div>
        )}

        {/* Matches Mapping */}
        {status === 'success' && matches.length > 0 && (
          <ul className="mt-4 space-y-2.5">
            {matches.map((m) => {
              const isLive = m.status === 'IN_PLAY' || m.status === 'PAUSED';
              return (
                <li key={m.id} className={`rounded-2xl border p-3.5 transition bg-white/[0.04] ${isLive ? 'border-emerald-500/30' : 'border-white/5'}`}>
                  <div className="flex justify-between items-center text-[10px] text-white/40 font-medium">
                    <span>{m.league} {m.matchday ? `· Day ${m.matchday}` : ''}</span>
                    
                    {isLive ? (
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-bold tracking-wider animate-pulse uppercase">
                        <Play size={8} fill="currentColor" /> Live
                      </span>
                    ) : (
                      <span className={`px-1.5 py-0.5 rounded-md font-bold text-[9px] ${m.status === 'FINISHED' ? 'bg-white/10 text-white/60' : 'bg-orange-500/10 text-orange-400'}`}>
                        {m.status === 'FINISHED' ? 'FT' : formatKickoff(m.date)}
                      </span>
                    )}
                  </div>

                  {/* Team Layout Panel */}
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 min-w-0">
                        <TeamCrest name={m.home.name} logo={m.home.logo} />
                        <span className="text-sm font-semibold truncate text-white/90">{m.home.name}</span>
                      </div>
                      <span className="text-sm font-extrabold tabular-nums">{m.home.score ?? '–'}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 min-w-0">
                        <TeamCrest name={m.away.name} logo={m.away.logo} />
                        <span className="text-sm font-semibold truncate text-white/90">{m.away.name}</span>
                      </div>
                      <span className="text-sm font-extrabold tabular-nums">{m.away.score ?? '–'}</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {/* Empty state fallback */}
        {status === 'success' && matches.length === 0 && (
          <div className="mt-16 text-center text-white/40 text-sm font-medium">
            No active schedules found for {activeLeague.label}
          </div>
        )}
      </div>
    </div>
  );
}