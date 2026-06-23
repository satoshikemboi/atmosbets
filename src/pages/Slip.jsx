import React, { useState, useRef } from 'react';
import {
  Receipt,
  History,
  QrCode,
  ChevronRight,
  X,
  CheckCircle2,
  Trash2,
  TrendingUp,
  Wallet,
} from 'lucide-react';

// ─── Mock booking-code database ──────────────────────────────────────────────
const BOOKING_CODE_DB = {
  HXET9EK2: {
    selections: [
      { id: 'a1', match: 'Ifira Black Bird vs Solomon Warriors', pick: '1X2 · Draw', odds: 3.20 },
      { id: 'a2', match: 'Real Kashmir vs Shabab Al-Ordon',      pick: '1X2 · Draw', odds: 3.60 },
      { id: 'a3', match: 'Rewa FC vs Hienghène Sport',           pick: '1X2 · Draw', odds: 3.00 },
    ],
  },
  TEST123: {
    selections: [
      { id: 'b1', match: 'Arsenal vs Chelsea',        pick: '1X2 · Home', odds: 2.10 },
      { id: 'b2', match: 'Barcelona vs Real Madrid',  pick: '1X2 · Draw', odds: 3.40 },
    ],
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt      = (n) => n.toFixed(2);
const fmtOdds  = (n) => n.toFixed(2) + 'x';
const totalOdds = (sels) => sels.reduce((acc, s) => acc * s.odds, 1);

// ─── SelectionCard ────────────────────────────────────────────────────────────
function SelectionCard({ s, onRemove }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.05] px-4 py-3.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-bold text-white leading-snug">{s.match}</p>
          <p className="mt-0.5 text-xs text-white/40">{s.pick}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-xl bg-orange-500 px-2.5 py-1 text-xs font-extrabold text-[#0a0e17] tracking-wide">
            {fmt(s.odds)}
          </span>
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove(s.id)}
              className="text-white/20 hover:text-red-400 transition"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── BookingCodePanel ─────────────────────────────────────────────────────────
function BookingCodePanel({ onAddSelections }) {
  const [expanded, setExpanded] = useState(false);
  const [code, setCode]         = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [result, setResult]     = useState(null);
  const inputRef = useRef(null);

  const handleOpen = () => {
    setExpanded(true);
    setError('');
    setResult(null);
    setTimeout(() => inputRef.current?.focus(), 80);
  };

  const handleClose = () => {
    setExpanded(false);
    setCode('');
    setError('');
    setResult(null);
  };

  const handleLoad = () => {
    const key = code.trim().toUpperCase();
    if (!key) { setError('Please enter a booking code.'); return; }
    setLoading(true);
    setError('');
    setResult(null);
    setTimeout(() => {
      const found = BOOKING_CODE_DB[key];
      if (found) {
        setResult({ code: key, selections: found.selections });
      } else {
        setError('Booking code not found. Please check and try again.');
      }
      setLoading(false);
    }, 700);
  };

  const combinedOdds = result ? totalOdds(result.selections) : 1;

  // ── Collapsed trigger ──
  if (!expanded) {
    return (
      <button
        type="button"
        onClick={handleOpen}
        className="mt-8 flex w-full items-center justify-between rounded-xl border border-dashed border-gray-400 bg-gray-900 px-4 py-3.5 text-left transition hover:border-white/25 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2"
      >
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[0.07]">
            <QrCode size={17} className="text-white/50" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-100">Have a booking code?</p>
            <p className="text-xs text-white/40">Tap to load selections instantly</p>
          </div>
        </div>
        <ChevronRight size={20} className="shrink-0 text-orange-400" />
      </button>
    );
  }

  // ── Expanded panel ──
  return (
    <div className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.04] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <QrCode size={15} className="text-orange-400" />
          <span className="text-xs font-extrabold tracking-widest text-white/50 uppercase">
            Booking Code
          </span>
        </div>
        <button
          type="button"
          onClick={handleClose}
          className="text-white/30 hover:text-white/70 transition"
        >
          <X size={17} />
        </button>
      </div>

      {/* Result view */}
      {result ? (
        <div className="px-4 pb-4 pt-3">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-base font-extrabold tracking-widest text-white">
              {result.code}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-extrabold text-emerald-400 uppercase tracking-wide">
              <CheckCircle2 size={10} />
              Valid
            </span>
          </div>
          <p className="mb-3 text-xs text-white/40">
            {result.selections.length} selections · Odds{' '}
            <span className="font-bold text-orange-400">{fmtOdds(combinedOdds)}</span>
          </p>

          <div className="flex flex-col divide-y divide-white/[0.06]">
            {result.selections.map((s) => (
              <div key={s.id} className="flex items-center justify-between py-2.5">
                <div>
                  <p className="text-xs font-semibold text-white/80 leading-snug">{s.match}</p>
                  <p className="text-[11px] text-white/35">{s.pick}</p>
                </div>
                <span className="text-sm font-extrabold text-orange-400">{fmt(s.odds)}</span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => { onAddSelections(result.selections); handleClose(); }}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-bold text-[#0a0e17] active:scale-[0.98]"
          >
            <CheckCircle2 size={16} />
            Add {result.selections.length} Selections to Slip
          </button>
        </div>
      ) : (
        <div className="flex gap-2 px-4 py-3">
          <input
            ref={inputRef}
            type="text"
            value={code}
            onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleLoad()}
            placeholder="E.G. ABC12345"
            maxLength={12}
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.06] px-3.5 py-2.5 text-sm font-bold tracking-widest text-white placeholder:text-white/20 placeholder:font-normal placeholder:tracking-normal focus:border-orange-500/60 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          />
          <button
            type="button"
            onClick={handleLoad}
            disabled={loading}
            className="shrink-0 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-[#0a0e17] transition hover:bg-orange-400 disabled:opacity-50 active:scale-95"
          >
            {loading ? '…' : 'Load'}
          </button>
        </div>
      )}

      {error && (
        <p className="px-4 pb-3 -mt-1 text-xs font-medium text-red-400">{error}</p>
      )}
    </div>
  );
}

// ─── SlipWithSelections ───────────────────────────────────────────────────────
const QUICK_ADDS = [3500, 6900, 17300, 34600];

function SlipWithSelections({ selections, onRemove, onClear }) {
  const [stake, setStake] = useState('');

  const stakeNum      = parseFloat(stake) || 0;
  const combinedOdds  = totalOdds(selections);
  const potReturn     = stakeNum * combinedOdds;
  const minStake      = 50;

  const handleQuickAdd = (amount) => {
    setStake((prev) => String((parseFloat(prev) || 0) + amount));
  };

  return (
    <div className="flex flex-col gap-3 pb-4">
      {selections.map((s) => (
        <SelectionCard key={s.id} s={s} onRemove={onRemove} />
      ))}

      <div className="mt-1 border-t border-white/[0.07]" />

      {/* Stake header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 text-xs font-extrabold tracking-widest text-white/40 uppercase">
          <Wallet size={13} className="text-orange-400" />
          Stake
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-white/30">
          <span className="font-extrabold text-white/60">KES 0.00</span>
          <span className="text-white/15">·</span>
          <span>KES</span>
          <span className="text-white/15">·</span>
          <span>GH¢</span>
        </div>
      </div>

      {/* Stake input */}
      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.05]">
        <div className="flex items-center gap-3 px-4 py-3.5">
          <span className="text-sm font-bold text-white/40">KSh</span>
          <input
            type="number"
            min={0}
            value={stake}
            onChange={(e) => setStake(e.target.value)}
            placeholder="0"
            className="flex-1 bg-transparent text-lg font-extrabold text-white placeholder:text-white/20 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <span className="shrink-0 text-xs text-white/25">
            min KSh{minStake.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Quick-add chips */}
      <div className="flex gap-2">
        {QUICK_ADDS.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => handleQuickAdd(v)}
            className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.04] py-2 text-xs font-bold text-white/50 transition hover:bg-cyan-500/10 active:scale-95"
          >
            +KSh{v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}
          </button>
        ))}
      </div>

      {/* Summary row */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs text-white/30">
          {selections.length} selections{' '}
          <span className="text-white/20">
            {selections.map((s) => fmt(s.odds)).join(' × ')}
          </span>
        </p>
        <p className="text-base font-extrabold text-orange-400">{fmtOdds(combinedOdds)}</p>
      </div>

      {/* Potential return */}
      <div className="rounded-LG bg-emerald-500/10 border border-emerald-500/20 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-green-400">
            <TrendingUp size={15} />
            Potential return
          </div>
          <span className="text-sm font-extrabold text-orange-400">
            {stakeNum > 0 ? `KES ${potReturn.toFixed(2)}` : '—'}
          </span>
        </div>
      </div>

      {/* Wallet balance */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 text-xs text-white/30">
          <Wallet size={12} />
          Wallet balance
        </div>
        <div className="text-right text-xs font-bold text-white/40">
          <span>KES 0.00</span>
          <br />
          <span className="text-white/25">GH¢0.00</span>
        </div>
      </div>

      {/* Place bet CTA */}
      <button
        type="button"
        disabled={stakeNum < minStake}
        className="mt-1 w-full rounded-2xl bg-orange-500 py-4 text-sm font-extrabold text-[#0a0e17]"
      >
        {stakeNum >= minStake
          ? `Place Bet · KSh ${stakeNum.toLocaleString()}`
          : 'Place Bet · enter stake'}
      </button>

      {/* Clear slip */}
      <button
        type="button"
        onClick={onClear}
        className="w-full py-2 text-xs font-semibold text-white/25 hover:text-red-400 transition"
      >
        Clear slip
      </button>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Slip({ onBrowseMatches }) {
  const [activeTab,  setActiveTab]  = useState('slip');
  const [selections, setSelections] = useState([]);

  const BET_HISTORY = [];

  const addSelections = (incoming) => {
    setSelections((prev) => {
      const existingIds = new Set(prev.map((s) => s.id));
      const fresh = incoming.filter((s) => !existingIds.has(s.id));
      return [...prev, ...fresh];
    });
  };

  const removeSelection = (id) => setSelections((prev) => prev.filter((s) => s.id !== id));
  const clearSlip       = ()   => setSelections([]);

  return (
    <div
      className="min-h-screen w-full bg-gray-900 text-white"
      style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');`}</style>

      {/* Tabs */}
      <div className="sticky top-0 z-10 flex border-b border-white/[0.07] bg-[#0a0e17]/95 backdrop-blur-xl">
        {[
          { id: 'slip',    label: 'Bet Slip', icon: Receipt },
          { id: 'history', label: 'My Bets',  icon: History },
        ].map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-1 items-center justify-center gap-1.5 py-4 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
            >
              <tab.icon
                size={16}
                className={active ? 'text-orange-400' : 'text-white/30'}
              />
              <span className={active ? 'text-orange-500' : 'text-white/30'}>
                {tab.label}
              </span>
              {active && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 bg-linear-to-r from-orange-400 to-orange-500" />
              )}
              {tab.id === 'slip' && selections.length > 0 && (
                <span className="ml-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-gray-100 px-1 text-[10px] font-black text-[#0a0e17]">
                  {selections.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="mx-auto max-w-md px-4 pb-24 pt-6">
        {activeTab === 'slip' ? (
          selections.length > 0 ? (
            <SlipWithSelections
              selections={selections}
              onRemove={removeSelection}
              onClear={clearSlip}
            />
          ) : (
            <>
              <div className="flex flex-col items-center pt-10 text-center">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/[0.05]">
                  <Receipt size={26} className="text-white/30" strokeWidth={1.8} />
                </div>
                <h2 className="mt-4 text-lg font-extrabold tracking-tight text-white">
                  Your slip is empty
                </h2>
                <p className="mt-1.5 max-w-[260px] text-sm text-white/40">
                  Tap any odds on the matches page to add selections
                </p>
                <button
                  type="button"
                  onClick={onBrowseMatches}
                  className="mt-6 flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-bold text-[#0a0e17]"
                >
                  <span className="text-base leading-none">⚽</span>
                  Browse Matches
                </button>
              </div>

              <BookingCodePanel onAddSelections={addSelections} />
            </>
          )
        ) : BET_HISTORY.length > 0 ? (
          <ul className="flex flex-col gap-2.5">
            {BET_HISTORY.map((b) => (
              <li
                key={b.id}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.04] px-4 py-3 text-sm text-white"
              >
                {b.summary}
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center pt-10 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/[0.05]">
              <History size={26} className="text-white/30" strokeWidth={1.8} />
            </div>
            <h2 className="mt-4 text-lg font-extrabold tracking-tight text-white">
              No bets placed yet
            </h2>
            <p className="mt-1.5 max-w-[260px] text-sm text-white/40">
              Your settled and pending bets will show up here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}