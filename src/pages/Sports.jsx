import React, { useState, useEffect, useCallback } from 'react';
import { PlaySquare, RefreshCw, Search } from 'lucide-react';

const SPORTS = [
  { id: 'football', label: 'Football', emoji: '⚽' },
  { id: 'basketball', label: 'Basketball', emoji: '🏀' },
  { id: 'tennis', label: 'Tennis', emoji: '🎾' },
  { id: 'baseball', label: 'Baseball', emoji: '⚾' },
];

const AUTO_REFRESH_MS = 30000;

// Wire this up to your live-matches feed/socket. Empty by default to
// reflect the "nothing live right now" state from the reference design.
const LIVE_MATCHES = [];

export default function Sports() {
  const [activeSport, setActiveSport] = useState('football');
  const [query, setQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(Date.now());

  const sport = SPORTS.find((s) => s.id === activeSport);

  const refresh = useCallback(() => {
    setRefreshing(true);
    // Replace with a real fetch/socket re-sync
    setLastUpdated(Date.now());
    const t = setTimeout(() => setRefreshing(false), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(refresh, AUTO_REFRESH_MS);
    return () => clearInterval(interval);
  }, [refresh]);

  const matches = LIVE_MATCHES.filter(
    (m) => m.sport === activeSport && m.teams.toLowerCase().includes(query.toLowerCase())
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
        @media (prefers-reduced-motion: reduce) {
          .live-ball { animation: none !important; }
        }
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
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-semibold text-cyan-400 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
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
                    ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-[#0a0e17] '
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
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${sport.label} teams...`}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white placeholder-white/35 outline-none transition focus:border-cyan-400/50 focus:bg-white/[0.07]"
          />
        </div>

        {/* Results / empty state */}
        {matches.length > 0 ? (
          <ul className="mt-5 flex flex-col gap-2.5">
            {matches.map((m) => (
              <li
                key={m.id}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3"
              >
                <span className="text-sm font-semibold text-white">{m.teams}</span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {m.minute}'
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-16 flex flex-col items-center gap-3 text-center">
            <div className="relative grid h-20 w-20 place-items-center rounded-full bg-white/5">
              <span
                className="absolute h-20 w-20 rounded-full"
                aria-hidden="true"
              />
              <span className="live-ball relative text-4xl" style={{ animation: 'bounce 2.4s ease-in-out infinite' }}>
                {sport.emoji}
              </span>
            </div>
            <p className="font-bold text-white/80">
              No live {sport.label} matches right now
            </p>
            <p className="text-sm text-white/40">Refreshes every 30 seconds</p>
          </div>
        )}
      </div>
    </div>
  );
}