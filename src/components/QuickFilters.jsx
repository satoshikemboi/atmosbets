import React, { useState } from 'react';

// Swap with real payout events from your socket/feed
const WINNERS = [
  { id: 1, masked: '+1 •••-•••-9927', time: '28m', amount: 1240, online: false },
  { id: 2, masked: '+91 ••••-•••-334', time: '32m', amount: 2300, online: true },
  { id: 3, masked: '+1 (••) •••-1158', time: '36m', amount: 19900, online: true },
  { id: 4, masked: '+44 ••••-••-208', time: '41m', amount: 615, online: true },
];

const SPORTS = [
  { id: 'football', label: 'Football', emoji: '⚽' },
  { id: 'basketball', label: 'Basketball', emoji: '🏀' },
  { id: 'tennis', label: 'Tennis', emoji: '🎾' },
  { id: 'baseball', label: 'Baseball', emoji: '⚾' },
];

const LEAGUES = ['All', 'Premier League', 'La Liga', 'Bundesliga', 'Serie A', 'Ligue 1', 'MLS'];

export default function QuickFilters() {
  const [activeSport, setActiveSport] = useState('football');
  const [activeLeague, setActiveLeague] = useState('All');

  return (
    <section
      className="w-full max-w-md mx-auto px-4 pt-8 pb-2"
      style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700;800&display=swap');
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Live winners ticker */}
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
        {WINNERS.map((w) => (
          <div
            key={w.id}
            className="flex-none min-w-[168px] rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2.5 backdrop-blur-sm"
          >
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-white/40">
              {w.online && (
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
              )}
              <span className="truncate">{w.masked}</span>
              <span className="ml-auto shrink-0">{w.time}</span>
            </div>
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-emerald-500 text-[9px] font-bold text-[#0a0e17]">
                $
              </span>
              <span className="text-[15px] font-extrabold tracking-tight text-white">
                {w.amount.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Sport tabs */}
      <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
        {SPORTS.map((s) => {
          const active = activeSport === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveSport(s.id)}
              className={`flex-none flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400 ${
                active
                  ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-[#0a0e17]'
                  : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="text-base leading-none">{s.emoji}</span>
              {s.label}
            </button>
          );
        })}
      </div>

      {/* League filters */}
      <div className="mt-2.5 flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
        {LEAGUES.map((l) => {
          const active = activeLeague === l;
          return (
            <button
              key={l}
              type="button"
              onClick={() => setActiveLeague(l)}
              className={`flex-none rounded-full px-3.5 py-1.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400 ${
                active
                  ? 'bg-white text-[#0a0e17]'
                  : 'bg-white/5 text-white/55 border border-white/10 hover:text-white hover:border-white/20'
              }`}
            >
              {l}
            </button>
          );
        })}
      </div>
    </section>
  );
}