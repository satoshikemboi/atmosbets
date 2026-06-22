import React, { useState, useEffect, useCallback } from 'react';
import {
  PlaySquare,
  RefreshCw,
  Search,
  AlertCircle
} from 'lucide-react';

import {
  SPORTS,
  AUTO_REFRESH_MS,
  MATCHES_ENDPOINT
} from '../data/constants.js';

import { formatLiveResponse } from '../data/formatters.js';

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

export default function Sports() {
  const [activeSport, setActiveSport] = useState('football');
  const [query, setQuery] = useState('');
  const [matches, setMatches] = useState([]);
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const sport =
    SPORTS.find((s) => s.id === activeSport) ||
    SPORTS[0];

  const refresh = useCallback(async () => {
    setRefreshing(true);

    try {
      const response = await fetch(MATCHES_ENDPOINT);

      if (!response.ok) {
        throw new Error(
          `Request failed (${response.status})`
        );
      }

      const payload = await response.json();

      setMatches(formatLiveResponse(payload));

      setStatus('success');

      setLastUpdated(Date.now());
    } catch (err) {
      setStatus('error');

      setErrorMessage(
        err.message || 'Unable to fetch matches'
      );
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    refresh();

    const interval = setInterval(
      refresh,
      AUTO_REFRESH_MS
    );

    return () => clearInterval(interval);
  }, [refresh]);

  const filteredMatches = matches.filter(
    (m) =>
      m.sport === activeSport &&
      `${m.home.name} ${m.away.name}`
        .toLowerCase()
        .includes(query.toLowerCase())
  );

  return (
    <div
      className="min-h-screen bg-[#0a0e17] px-4 pt-5 pb-24 text-white"
      style={{
        fontFamily:
          "'Inter', ui-sans-serif, system-ui"
      }}
    >
      <div className="mx-auto max-w-md">

        {/* Header */}

        <div className="mb-4 flex items-center justify-between">

          <div className="flex items-center gap-2">

            <PlaySquare
              size={20}
              className="text-emerald-400"
            />

            <h1 className="text-lg font-extrabold">
              Live Now
            </h1>

          </div>

          <button
            onClick={refresh}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm text-cyan-400"
          >
            <RefreshCw
              size={15}
              className={
                refreshing
                  ? 'animate-spin'
                  : ''
              }
            />

            Refresh
          </button>

        </div>

        {/* Sports */}

        <div className="flex gap-2 overflow-x-auto">

          {SPORTS.map((s) => (

            <button
              key={s.id}
              onClick={() =>
                setActiveSport(s.id)
              }
              className={`rounded-full px-4 py-2 text-sm font-bold transition
              ${
                activeSport === s.id
                  ? 'bg-cyan-400 text-black'
                  : 'bg-white/5 text-white/60'
              }`}
            >
              {s.emoji} {s.label}
            </button>

          ))}

        </div>

        {/* Search */}

        <div className="relative mt-4">

          <Search
            size={15}
            className="absolute left-3 top-3 text-white/30"
          />

          <input
            value={query}
            onChange={(e) =>
              setQuery(e.target.value)
            }
            placeholder={`Search ${sport.label}`}
            className="w-full rounded-xl bg-white/5 pl-10 pr-3 py-2.5 outline-none"
          />

        </div>

        {lastUpdated && (
          <p className="mt-2 text-right text-[11px] text-white/30">
            Updated{' '}
            {new Date(
              lastUpdated
            ).toLocaleTimeString()}
          </p>
        )}

        {/* Loading */}

        {status === 'loading' && (
          <div className="mt-4 space-y-3">

            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 rounded-2xl bg-white/5 animate-pulse"
              />
            ))}

          </div>
        )}

        {/* Error */}

        {status === 'error' && (
          <div className="mt-16 text-center">

            <AlertCircle
              size={26}
              className="mx-auto text-red-400"
            />

            <p className="mt-3">
              {errorMessage}
            </p>

          </div>
        )}

        {/* Matches */}

        {status === 'success' &&
          filteredMatches.length > 0 && (

          <ul className="mt-4 space-y-3">

            {filteredMatches.map((m) => (

              <li
                key={m.id}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
              >

                <div className="flex justify-between text-[11px] text-white/35">

                  <span>
                    {m.league}
                  </span>

                  <span className="text-emerald-400">
                    {m.status}
                  </span>

                </div>

                <div className="mt-3 flex justify-between">

                  <div className="flex items-center gap-2">

                    <TeamCrest
                      name={m.home.name}
                      logo={m.home.logo}
                    />

                    <span>
                      {m.home.name}
                    </span>

                  </div>

                  <strong>
                    {m.home.score ?? 0}
                  </strong>

                </div>

                <div className="mt-2 flex justify-between">

                  <div className="flex items-center gap-2">

                    <TeamCrest
                      name={m.away.name}
                      logo={m.away.logo}
                    />

                    <span>
                      {m.away.name}
                    </span>

                  </div>

                  <strong>
                    {m.away.score ?? 0}
                  </strong>

                </div>

              </li>

            ))}

          </ul>
        )}

        {status === 'success' &&
          filteredMatches.length === 0 && (

          <div className="mt-16 text-center text-white/40">

            No live matches available

          </div>
        )}

      </div>
    </div>
  );
}