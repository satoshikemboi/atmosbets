import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CalendarDays, RefreshCw, AlertCircle, Users } from 'lucide-react';
import {
  LEAGUES,
  buildFixturesUrl,
  formatFixturesResponse,
  formatKickoff,
  // --- NEW IMPORTS FOR THE LINEUP DRAWER ---
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
        alt={name}
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

// ─── NEW SQUAD COLUMN RENDERER ──────────────────────────────────────────────
function SquadColumn({ teamData, title }) {
  if (!teamData) return <div className="text-xs text-white/30 italic">No lineups announced</div>;

  return (
    <div className="flex-1 min-w-0">
      <div className="mb-2">
        <h4 className="text-xs font-bold text-white/80 truncate">{teamData.teamName}</h4>
        <p className="text-[10px] text-orange-400 font-semibold">{teamData.formation} · {teamData.coach}</p>
      </div>
      
      <div className="space-y-2">
        <div>
          <span className="text-[9px] uppercase tracking-wider text-white/30 font-bold block mb-1">{title} XI</span>
          <div className="space-y-0.5 max-h-40 overflow-y-auto no-scrollbar bg-black/20 p-1.5 rounded-lg border border-white/5">
            {teamData.starters.map((p) => (
              <div key={p.id || p.name} className="flex gap-1.5 text-xs py-0.5 truncate">
                <span className="text-orange-400 font-bold w-4 text-right shrink-0">{p.number ?? '-'}</span>
                <span className="text-white/70 truncate">{p.name}</span>
                <span className="text-[9px] text-white/30 ml-auto uppercase font-bold shrink-0">{p.position}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <span className="text-[9px] uppercase tracking-wider text-white/30 font-bold block mb-1">Substitutes</span>
          <div className="space-y-0.5 max-h-28 overflow-y-auto no-scrollbar bg-black/20 p-1.5 rounded-lg border border-white/5">
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

export default function Fixtures() {
  const [activeLeagueId, setActiveLeagueId] = useState('worldcup');
  const [fixtures, setFixtures] = useState([]);
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // --- NEW STATES FOR MATCH DETAIL DRAWERS ---
  const [selectedFixtureId, setSelectedFixtureId] = useState(null);
  const [lineupData, setLineupData] = useState(null);
  const [lineupLoading, setLineupLoading] = useState(false);

  const abortRef = useRef(null);
  const activeLeague = LEAGUES.find((l) => l.id === activeLeagueId) || LEAGUES[0];

  const fetchFixtures = useCallback(async (league) => {
    if (abortRef.current) abortRef.current.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    setRefreshing(true);
    setErrorMessage('');
    setSelectedFixtureId(null); // Reset active drawer when swapping leagues

    try {
      const response = await fetch(buildFixturesUrl(league), {
        signal: controller.signal,
      });

      if (!response.ok) throw new Error(`Request failed (${response.status})`);

      const payload   = await response.json();
      console.log('RAW FIXTURES PAYLOAD!!:', payload); // Debugging line
      const formatted = formatFixturesResponse(payload).sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      setFixtures(formatted);
      setStatus('success');
    } catch (error) {
      if (error.name !== 'AbortError') {
        setStatus('error');
        setErrorMessage(error.message || 'Failed to load fixtures');
      }
    } finally {
      if (abortRef.current === controller) setRefreshing(false);
    }
  }, []);

  // --- NEW ACTION: FETCH LINEUP DATA ON CARD CLICK ---
  const handleToggleLineups = async (fixtureId) => {
    if (selectedFixtureId === fixtureId) {
      setSelectedFixtureId(null);
      return;
    }

    setSelectedFixtureId(fixtureId);
    setLineupLoading(true);
    setLineupData(null);

    try {
      const res = await fetch(buildLineupsUrl(fixtureId));
      if (!res.ok) throw new Error();
      const rawPayload = await res.json();
      setLineupData(formatLineupsResponse(rawPayload));
    } catch (err) {
      setLineupData({ home: null, away: null });
    } finally {
      setLineupLoading(false);
    }
  };

  useEffect(() => {
    setStatus('loading');
    setFixtures([]);
    fetchFixtures(activeLeague);

    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [activeLeague, fetchFixtures]);

  const handleRefresh = () => fetchFixtures(activeLeague);

  return (
    <div className="min-h-screen w-full bg-[#0a0e17] px-4 pb-24 pt-5 text-white">
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
            <CalendarDays size={20} className="text-orange-400" />
            <h1 className="text-lg font-extrabold">Fixtures</h1>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-semibold text-orange-400 transition ${
              refreshing ? 'cursor-not-allowed opacity-50' : 'hover:text-white'
            }`}
          >
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* League tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
          {LEAGUES.map((league) => {
            const active = activeLeagueId === league.id;
            return (
              <button
                key={league.id}
                onClick={() => setActiveLeagueId(league.id)}
                className={`flex-none rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${
                  active
                    ? 'border-transparent bg-orange-500 text-[#0a0e17]'
                    : 'border-white/10 bg-white/5 text-white/60 hover:text-white'
                }`}
              >
                {league.label}
              </button>
            );
          })}
        </div>

        {/* Loading */}
        {status === 'loading' && (
          <div className="mt-5 flex flex-col gap-2.5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-[68px] rounded-2xl border border-white/10 bg-white/5"
                style={{
                  animation: 'pulse-soft 1.4s ease-in-out infinite',
                  animationDelay: `${item * 0.15}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div className="mt-16 flex flex-col items-center gap-3 text-center">
            <AlertCircle size={26} className="text-red-400" />
            <p className="font-bold">Couldn't load fixtures</p>
            <p className="max-w-[260px] text-sm text-white/40">{errorMessage}</p>
            <button
              onClick={handleRefresh}
              className="mt-1 rounded-full bg-orange-500 px-4 py-2 text-sm font-bold text-[#0a0e17]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Fixtures */}
        {status === 'success' && fixtures.length > 0 && (
          <ul className="mt-4 flex flex-col gap-2.5">
            {fixtures.map((fixture) => {
              const isDrawerOpen = selectedFixtureId === fixture.id;
              return (
                <li
                  key={fixture.id}
                  className={`rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isDrawerOpen ? 'border-orange-500/40 bg-white/[0.07]' : 'border-white/10 bg-white/5'
                  }`}
                  onClick={() => handleToggleLineups(fixture.id)}
                >
                  {/* Top Fixture Card */}
                  <div className="p-3.5 pb-2">
                    <div className="flex justify-between">
                      <span className="text-[11px] text-white/40">{fixture.league}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-orange-400">
                          {formatKickoff(fixture.date)}
                        </span>
                        <span className="rounded-full bg-orange-500/20 px-2 py-0.5 text-[10px] font-bold text-orange-400">
                          {fixture.status}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 flex justify-between">
                      <div className="flex items-center gap-2">
                        <TeamCrest name={fixture.home.name} logo={fixture.home.logo} />
                        <span className="text-sm font-semibold">{fixture.home.name}</span>
                      </div>
                      <span className="font-bold">{fixture.home.score ?? '–'}</span>
                    </div>

                    <div className="mt-1 flex justify-between">
                      <div className="flex items-center gap-2">
                        <TeamCrest name={fixture.away.name} logo={fixture.away.logo} />
                        <span className="text-sm font-semibold">{fixture.away.name}</span>
                      </div>
                      <span className="font-bold">{fixture.away.score ?? '–'}</span>
                    </div>
                    
                    {/* Tiny "View Lineup" CTA bar */}
                    <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-center gap-1 text-[10px] font-bold text-white/30 hover:text-orange-400/80 transition">
                      <Users size={11} />
                      {isDrawerOpen ? 'Hide Squads' : 'Tap to View Lineups'}
                    </div>
                  </div>

                  {/* --- NEW ACCORDION LINEUP DRAWER PANEL --- */}
                  {isDrawerOpen && (
                    <div 
                      className="border-t border-white/10 bg-black/10 p-3.5 pt-2.5 flex gap-4 transition-all"
                      onClick={(e) => e.stopPropagation()} // Stop clicking squad panel from closing itself
                    >
                      {lineupLoading ? (
                        <div className="w-full py-6 flex flex-col items-center justify-center gap-2 text-white/40 text-xs font-semibold">
                          <RefreshCw size={14} className="animate-spin text-orange-400" />
                          Loading Match Squads...
                        </div>
                      ) : (
                        <>
                          <SquadColumn teamData={lineupData?.home} title="Starting" />
                          <div className="w-[1px] bg-white/5 self-stretch" />
                          <SquadColumn teamData={lineupData?.away} title="Starting" />
                        </>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {/* Empty */}
        {status === 'success' && fixtures.length === 0 && (
          <div className="mt-16 text-center text-white/40">
            No fixtures found for {activeLeague.label}
          </div>
        )}
      </div>
    </div>
  );
}