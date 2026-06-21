import React, { useState, useEffect, useCallback } from 'react';
import { PlaySquare, RefreshCw, Search, AlertCircle } from 'lucide-react';
import {
  SPORTS,
  LIVE_ENDPOINT,
  AUTO_REFRESH_MS,
  formatLiveResponse,
} from '../data/index.js';

function TeamCrest({ name, logo }) {
  const [broken, setBroken] = useState(false);

  // Reset broken state when logo prop changes so a new valid URL is retried.
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

export default function Sports() {
  const [activeSport, setActiveSport] = useState('football');
  const [query, setQuery] = useState('');
  const [matches, setMatches] = useState([]);
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

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
                onClick={() => setActiveSport(s.id)}
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
            {filteredMatches.map((m) => (
              <li
                key={m.id}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-white/35">
                    {m.league || 'Football'}
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
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
              </li>
            ))}
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