import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CalendarDays, RefreshCw, AlertCircle } from 'lucide-react';
import {
  LEAGUES,
  buildFixturesUrl,
  formatFixturesResponse,
  formatKickoff,
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

export default function Fixtures() {
  const [activeLeagueId, setActiveLeagueId] = useState('worldcup');
  const [fixtures, setFixtures] = useState([]);
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const abortRef = useRef(null);

  const activeLeague = LEAGUES.find((l) => l.id === activeLeagueId) || LEAGUES[0];

  const fetchFixtures = useCallback(async (league) => {
    if (abortRef.current) abortRef.current.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    setRefreshing(true);
    setErrorMessage('');

    try {
      const response = await fetch(buildFixturesUrl(league), {
        signal: controller.signal,
      });

      if (!response.ok) throw new Error(`Request failed (${response.status})`);

      const payload   = await response.json();
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
            {fixtures.map((fixture) => (
              <li
                key={fixture.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-3.5"
              >
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
              </li>
            ))}
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