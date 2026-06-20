import React, { useState } from 'react';
import { Receipt, History, QrCode, ChevronRight } from 'lucide-react';

// Wire these to real state — empty by default to match the "nothing added
// yet" state. Each selection: { id, match, pick, odds }
const SELECTIONS = [];
const BET_HISTORY = [];

export default function Slip({ onBrowseMatches }) {
  const [activeTab, setActiveTab] = useState('slip');

  return (
    <div
      className="min-h-screen w-full bg-[#0a0e17] text-white"
      style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700;800&display=swap');`}</style>

      {/* Tabs */}
      <div className="sticky top-0 z-10 flex border-b border-white/10 bg-[#0a0e17]/95 backdrop-blur-xl">
        {[
          { id: 'slip', label: 'Bet Slip', icon: Receipt },
          { id: 'history', label: 'My Bets', icon: History },
        ].map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-1 items-center justify-center gap-1.5 py-4 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
            >
              <tab.icon size={16} className={active ? 'text-cyan-400' : 'text-white/40'} />
              <span className={active ? 'text-cyan-400' : 'text-white/40'}>{tab.label}</span>
              {active && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 bg-gradient-to-r from-cyan-300 to-violet-400" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mx-auto max-w-md px-4 pb-24 pt-6">
        {activeTab === 'slip' ? (
          SELECTIONS.length > 0 ? (
            <ul className="flex flex-col gap-2.5">
              {SELECTIONS.map((s) => (
                <li
                  key={s.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3"
                >
                  <p className="text-sm font-semibold text-white">{s.match}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-xs text-white/40">{s.pick}</span>
                    <span className="text-sm font-bold text-cyan-400">{s.odds}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <>
              {/* Empty state */}
              <div className="flex flex-col items-center pt-10 text-center">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/5">
                  <Receipt size={26} className="text-white/50" strokeWidth={1.8} />
                </div>
                <h2 className="mt-4 text-lg font-extrabold tracking-tight">Your slip is empty</h2>
                <p className="mt-1.5 max-w-[260px] text-sm text-white/40">
                  Tap any odds on the matches page to add selections
                </p>

                <button
                  type="button"
                  onClick={onBrowseMatches}
                  className="mt-6 flex items-center gap-2 rounded-full bg-linear-to-r from-orange-400 to-orange-500 px-6 py-3 text-sm font-bold text-[#0a0e17] shadow-violet-500/20 transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                >
                  <span className="text-base leading-none">⚽</span>
                  Browse Matches
                </button>
              </div>

              {/* Booking code */}
              <button
                type="button"
                className="mt-8 flex w-full items-center justify-between rounded-2xl border border-dashed border-white/15 bg-white/[0.03] px-4 py-3.5 text-left transition hover:border-white/25 hover:bg-white/[0.05] focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/5">
                    <QrCode size={17} className="text-white/60" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Have a booking code?</p>
                    <p className="text-xs text-white/40">Tap to load selections instantly</p>
                  </div>
                </div>
                <ChevronRight size={18} className="shrink-0 text-white/30" />
              </button>
            </>
          )
        ) : BET_HISTORY.length > 0 ? (
          <ul className="flex flex-col gap-2.5">
            {BET_HISTORY.map((b) => (
              <li
                key={b.id}
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white"
              >
                {b.summary}
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center pt-10 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/5">
              <History size={26} className="text-white/50" strokeWidth={1.8} />
            </div>
            <h2 className="mt-4 text-lg font-extrabold tracking-tight">No bets placed yet</h2>
            <p className="mt-1.5 max-w-[260px] text-sm text-white/40">
              Your settled and pending bets will show up here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}