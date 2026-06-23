import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CheckCircle2, RefreshCw, AlertCircle, ChevronRight } from 'lucide-react';
import { LEAGUES, MATCHES_ENDPOINT } from '../data/constants.js';

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
        className="h-8 w-8 shrink-0"
      />
    );
  }
  return (
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/[0.07] text-[10px] font-bold text-white/50 border border-white/10">
      {name?.slice(0, 2).toUpperCase()}
    </span>
  );
}

// ─── MATCH CARD ───────────────────────────────────────────────────────────────
function MatchCard({ m, formatKickoff }) {
  const isLive     = m.status === 'IN_PLAY' || m.status === 'PAUSED';
  const isFinished = m.status === 'FINISHED';

  const statusBadge = isLive ? (
    <span className="flex items-center gap-1 text-[10px] font-extrabold text-green-400 uppercase tracking-wider animate-pulse">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
      Live
    </span>
  ) : isFinished ? (
    <span className="text-[11px] font-bold text-white/30 tracking-wide">FT</span>
  ) : (
    <span className="text-[11px] font-semibold text-orange-400">{formatKickoff(m.date)}</span>
  );

  const homeScore = m.home.score ?? (isFinished ? '0' : '–');
  const awayScore = m.away.score ?? (isFinished ? '0' : '–');

  return (
    <div
      className={`rounded-lg overflow-hidden ${
        isLive
          ? 'bg-white/[0.06] ring-1 ring-emerald-500/30 shadow-lg shadow-emerald-500/5'
          : 'bg-white/[0.04] border border-white/[0.07]'
      }`}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── Header strip ── */}
      <div className="flex items-center justify-between px-4 py-2 bg-white/[0.03] border-b border-white/[0.05]">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/30">{m.league}</span>
        {statusBadge}
      </div>

      {/* ── Teams ── */}
      <div className="px-4 pt-3 pb-1">
        {/* Home */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <TeamCrest name={m.home.name} logo={m.home.logo} />
            <span className="text-[13.5px] font-semibold text-white truncate">{m.home.name}</span>
          </div>
          <span className="text-[15px] font-extrabold text-white tabular-nums ml-3">{homeScore}</span>
        </div>

        {/* Divider */}
        <div className="my-2.5 border-t border-white/[0.06] ml-[42px]" />

        {/* Away */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <TeamCrest name={m.away.name} logo={m.away.logo} />
            <span className="text-[13.5px] font-semibold text-white truncate">{m.away.name}</span>
          </div>
          <span className="text-[15px] font-extrabold text-white tabular-nums ml-3">{awayScore}</span>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between px-4 py-2.5 mt-1 border-t border-white/[0.05]">
        <span className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-white/25 w-16">
          {isLive ? 'Live' : isFinished ? 'Full Time' : 'Kickoff'}
        </span>
        <span className="text-base font-black tabular-nums text-white/80">
          {isFinished || isLive
            ? `${homeScore} – ${awayScore}`
            : formatKickoff(m.date)}
        </span>
        <button className="flex items-center gap-0.5 text-[11px] font-semibold text-orange-400 w-16 justify-end hover:text-orange-300 transition">
          Details <ChevronRight size={11} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

// ─── LEAGUE GROUP ─────────────────────────────────────────────────────────────
function LeagueGroup({ leagueName, matches, formatKickoff }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2.5 px-0.5">
        <span className="text-[11px] font-black uppercase tracking-[0.12em] text-white/60">{leagueName}</span>
        <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-white/10 px-1 text-[9px] font-extrabold text-white/50">
          {matches.length}
        </span>
      </div>
      <div className="space-y-2">
        {matches.map((m) => (
          <MatchCard key={m.id} m={m} formatKickoff={formatKickoff} />
        ))}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Matches() {
  const [activeLeagueId, setActiveLeagueId] = useState('all');
  const [matches, setMatches]               = useState([]);
  const [status, setStatus]                 = useState('loading');
  const [errorMessage, setErrorMessage]     = useState('');
  const [refreshing, setRefreshing]         = useState(false);
  const [resultsVisible, setResultsVisible] = useState(true);

  const abortRef     = useRef(null);
  const activeLeague = LEAGUES.find((l) => l.id === activeLeagueId) || LEAGUES[0];

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

  const fetchMatchTimeline = useCallback(async (league) => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setRefreshing(true);
    setErrorMessage('');

    try {
      const url = league.apiId
        ? `${MATCHES_ENDPOINT}?competition=${league.apiId}`
        : MATCHES_ENDPOINT;

      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) throw new Error(`Server error (${response.status})`);

      const payload = await response.json();

      if (!payload?.matches) { setMatches([]); setStatus('success'); return; }

      const formatted = payload.matches.map((m) => ({
        id:       m.id,
        league:   m.competition?.name ?? 'League',
        date:     m.utcDate,
        status:   m.status,
        matchday: m.matchday,
        home: {
          name:  m.homeTeam?.shortName || m.homeTeam?.name || 'Unknown',
          logo:  m.homeTeam?.crest || '',
          score: m.score?.fullTime?.home,
        },
        away: {
          name:  m.awayTeam?.shortName || m.awayTeam?.name || 'Unknown',
          logo:  m.awayTeam?.crest || '',
          score: m.score?.fullTime?.away,
        },
      }));

      setMatches(formatted);
      setStatus('success');
    } catch (error) {
      if (error.name !== 'AbortError') {
        setStatus('error');
        setErrorMessage(error.message || 'Could not load matches.');
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

  const finished = matches.filter(m => m.status === 'FINISHED');
  const live     = matches.filter(m => m.status === 'IN_PLAY' || m.status === 'PAUSED');
  const upcoming = matches.filter(m => !['FINISHED', 'IN_PLAY', 'PAUSED'].includes(m.status));

  const groupByLeague = (arr) =>
    arr.reduce((acc, m) => {
      (acc[m.league] = acc[m.league] || []).push(m);
      return acc;
    }, {});

  return (
    <div
      className="min-h-screen w-full bg-gray-900 px-4 pb-28 pt-5 text-white"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="mx-auto max-w-md space-y-5">

        {/* ── League filter tabs ── */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
          {LEAGUES.map((l) => (
            <button
              key={l.id}
              onClick={() => setActiveLeagueId(l.id)}
              className={`flex-none rounded-full px-3.5 py-2 text-xs font-semibold transition-all ${
                activeLeagueId === l.id
                  ? 'bg-linear-to-r from bg-orange-500 to bg-orange-500  text-gray-100 shadow-lg shadow-orange-500/25'
                  : 'bg-gray-800 text-gray-200 hover:bg-white/10 hover:text-white/80'
              }`}
            >
              {l.label}
            </button>
          ))}

          <button
            onClick={() => fetchMatchTimeline(activeLeague)}
            disabled={refreshing}
            className="flex-none ml-auto flex items-center gap-1.5 rounded-xl bg-white/[0.06] px-3 py-2 text-xs font-bold text-white/50 hover:bg-white/10 hover:text-white/80 transition"
          >
            <RefreshCw size={12} className={refreshing ? 'animate-spin text-orange-400' : ''} />
            Sync
          </button>
        </div>

        {/* ── Loading skeleton ── */}
        {status === 'loading' && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-36 rounded-2xl bg-white/[0.04] animate-pulse border border-white/[0.06]" />
            ))}
          </div>
        )}

        {/* ── Error ── */}
        {status === 'error' && (
          <div className="mt-16 flex flex-col items-center gap-2 text-center">
            <AlertCircle size={22} className="text-red-400" />
            <p className="text-sm font-semibold text-white/40">{errorMessage}</p>
            <button
              onClick={() => fetchMatchTimeline(activeLeague)}
              className="mt-2 rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-orange-500/25 hover:bg-orange-400 transition"
            >
              Try again
            </button>
          </div>
        )}

        {/* ── Content ── */}
        {status === 'success' && matches.length > 0 && (
          <>
            {/* LIVE */}
            {live.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2.5 px-0.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm font-black text-white">Live ({live.length})</span>
                </div>
                <div className="space-y-4">
                  {Object.entries(groupByLeague(live)).map(([league, ms]) => (
                    <LeagueGroup key={league} leagueName={league} matches={ms} formatKickoff={formatKickoff} />
                  ))}
                </div>
              </div>
            )}

            {/* RESULTS */}
            {finished.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2.5 px-0.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-white/30" strokeWidth={2.5} />
                    <span className="text-sm font-black text-white">Results ({finished.length})</span>
                  </div>
                  <button
                    onClick={() => setResultsVisible((v) => !v)}
                    className="text-[12px] font-semibold text-orange-400 hover:text-orange-300 transition"
                  >
                    {resultsVisible ? 'Hide' : 'Show'}
                  </button>
                </div>

                {resultsVisible && (
                  <div className="space-y-5">
                    {Object.entries(groupByLeague(finished)).map(([league, ms]) => (
                      <LeagueGroup key={league} leagueName={league} matches={ms} formatKickoff={formatKickoff} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* UPCOMING */}
            {upcoming.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2.5 px-0.5">
                  <span className="text-sm font-black text-white">Upcoming ({upcoming.length})</span>
                </div>
                <div className="space-y-5">
                  {Object.entries(groupByLeague(upcoming)).map(([league, ms]) => (
                    <LeagueGroup key={league} leagueName={league} matches={ms} formatKickoff={formatKickoff} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ── Empty state ── */}
        {status === 'success' && matches.length === 0 && (
          <div className="mt-20 text-center text-sm font-medium text-white/30">
            No matches found for {activeLeague.label}
          </div>
        )}
      </div>
    </div>
  );
}