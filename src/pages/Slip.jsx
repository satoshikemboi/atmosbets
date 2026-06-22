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
      { id: 'a2', match: 'Real Kashmir vs Shabab Al-Ordon',       pick: '1X2 · Draw', odds: 3.60 },
      { id: 'a3', match: 'Rewa FC vs Hienghène Sport',            pick: '1X2 · Draw', odds: 3.00 },
    ],
  },
  TEST123: {
    selections: [
      { id: 'b1', match: 'Arsenal vs Chelsea',   pick: '1X2 · Home', odds: 2.10 },
      { id: 'b2', match: 'Barcelona vs Real Madrid', pick: '1X2 · Draw', odds: 3.40 },
    ],
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => n.toFixed(2);
const fmtOdds = (n) => n.toFixed(2) + 'x';
const totalOdds = (sels) => sels.reduce((acc, s) => acc * s.odds, 1);

// ─── Sub-components ───────────────────────────────────────────────────────────

function SelectionCard({ s, onRemove }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-800 leading-snug">{s.match}</p>
          <p className="mt-0.5 text-xs text-slate-400">{s.pick}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-xl bg-blue-600 px-2.5 py-1 text-xs font-extrabold text-white tracking-wide">
            {fmt(s.odds)}
          </span>
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove(s.id)}
              className="text-slate-300 hover:text-red-400 transition"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Booking Code Panel ───────────────────────────────────────────────────────
function BookingCodePanel({ onAddSelections }) {
  const [expanded, setExpanded] = useState(false);
  const [code, setCode]         = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [result, setResult]     = useState(null); // { code, selections }
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

    // Simulate async lookup
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
        className="mt-8 flex w-full items-center justify-between rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-3.5 text-left transition hover:border-blue-400 hover:bg-blue-50/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
      >
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100">
            <QrCode size={17} className="text-slate-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Have a booking code?</p>
            <p className="text-xs text-slate-400">Tap to load selections instantly</p>
          </div>
        </div>
        <ChevronRight size={18} className="shrink-0 text-slate-300" />
      </button>
    );
  }

  // ── Expanded panel ──
  return (
    <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <QrCode size={15} className="text-blue-600" />
          <span className="text-xs font-extrabold tracking-widest text-slate-600 uppercase">
            Booking Code
          </span>
        </div>
        <button
          type="button"
          onClick={handleClose}
          className="text-slate-400 hover:text-slate-700 transition"
        >
          <X size={17} />
        </button>
      </div>

      {/* Result view */}
      {result ? (
        <div className="px-4 pb-4 pt-3">
          {/* Code badge + meta */}
          <div className="mb-1 flex items-center gap-2">
            <span className="text-base font-extrabold tracking-widest text-slate-900">
              {result.code}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-extrabold text-green-700 uppercase tracking-wide">
              <CheckCircle2 size={10} />
              Valid
            </span>
          </div>
          <p className="mb-3 text-xs text-slate-400">
            {result.selections.length} selections · Odds{' '}
            <span className="font-bold text-blue-600">{fmtOdds(combinedOdds)}</span>
          </p>

          {/* Selections list */}
          <div className="flex flex-col divide-y divide-slate-100">
            {result.selections.map((s) => (
              <div key={s.id} className="flex items-center justify-between py-2.5">
                <div>
                  <p className="text-xs font-semibold text-slate-700 leading-snug">{s.match}</p>
                  <p className="text-[11px] text-slate-400">{s.pick}</p>
                </div>
                <span className="text-sm font-extrabold text-blue-600">{fmt(s.odds)}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={() => { onAddSelections(result.selections); handleClose(); }}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 active:scale-[0.98]"
          >
            <CheckCircle2 size={16} />
            Add {result.selections.length} Selections to Slip
          </button>
        </div>
      ) : (
        /* Input view */
        <div className="flex gap-2 px-4 py-3">
          <input
            ref={inputRef}
            type="text"
            value={code}
            onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleLoad()}
            placeholder="E.G. ABC12345"
            maxLength={12}
            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-bold tracking-widest text-slate-800 placeholder:text-slate-300 placeholder:font-normal placeholder:tracking-normal focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          <button
            type="button"
            onClick={handleLoad}
            disabled={loading}
            className="shrink-0 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-60 active:scale-95"
          >
            {loading ? '…' : 'Load'}
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="px-4 pb-3 -mt-1 text-xs font-medium text-red-500">{error}</p>
      )}
    </div>
  );
}

// ─── Slip with selections ─────────────────────────────────────────────────────
const QUICK_ADDS = [3500, 6900, 17300, 34600]; // in KES

function SlipWithSelections({ selections, onRemove, onClear }) {
  const [stake, setStake] = useState('');

  const stakeNum     = parseFloat(stake) || 0;
  const combinedOdds = totalOdds(selections);
  const potReturn    = stakeNum * combinedOdds;
  const minStake     = 50;

  const handleQuickAdd = (amount) => {
    setStake((prev) => String((parseFloat(prev) || 0) + amount));
  };

  return (
    <div className="flex flex-col gap-3 pb-4">
      {/* Selection cards */}
      {selections.map((s) => (
        <SelectionCard key={s.id} s={s} onRemove={onRemove} />
      ))}

      {/* Divider */}
      <div className="mt-1 border-t border-slate-200" />

      {/* Stake header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 text-xs font-extrabold tracking-widest text-slate-500 uppercase">
          <Wallet size={13} className="text-blue-600" />
          Stake
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
          <span className="font-extrabold text-slate-700">KES 0.00</span>
          <span className="text-slate-300">·</span>
          <span>KES</span>
          <span className="text-slate-300">·</span>
          <span>GH¢</span>
        </div>
      </div>

      {/* Stake input */}
      <div className="relative rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3.5">
          <span className="text-sm font-bold text-slate-500">KSh</span>
          <input
            type="number"
            min={0}
            value={stake}
            onChange={(e) => setStake(e.target.value)}
            placeholder="0"
            className="flex-1 bg-transparent text-lg font-extrabold text-slate-800 placeholder:text-slate-300 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <span className="shrink-0 text-xs text-slate-400">
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
            className="flex-1 rounded-xl border border-slate-200 bg-white py-2 text-xs font-bold text-slate-600 shadow-sm transition hover:border-blue-400 hover:text-blue-600 active:scale-95"
          >
            +KSh{v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}
          </button>
        ))}
      </div>

      {/* Summary row */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs text-slate-400">
          {selections.length} selections{' '}
          <span className="text-slate-300">
            {selections.map((s) => fmt(s.odds)).join(' × ')}
          </span>
        </p>
        <p className="text-base font-extrabold text-blue-600">{fmtOdds(combinedOdds)}</p>
      </div>

      {/* Potential return */}
      <div className="rounded-2xl bg-green-50 border border-green-100 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-green-700">
            <TrendingUp size={15} />
            Potential return
          </div>
          <span className="text-sm font-extrabold text-green-700">
            {stakeNum > 0 ? `KES ${potReturn.toFixed(2)}` : '—'}
          </span>
        </div>
      </div>

      {/* Wallet balance */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Wallet size={12} />
          Wallet balance
        </div>
        <div className="text-right text-xs font-bold text-slate-500">
          <span>KES 0.00</span>
          <br />
          <span className="text-slate-400">GH¢0.00</span>
        </div>
      </div>

      {/* Place bet CTA */}
      <button
        type="button"
        disabled={stakeNum < minStake}
        className="mt-1 w-full rounded-2xl bg-blue-600 py-4 text-sm font-extrabold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:opacity-40 active:scale-[0.98]"
      >
        {stakeNum >= minStake
          ? `Place Bet · KSh ${stakeNum.toLocaleString()}`
          : 'Place Bet · enter stake'}
      </button>

      {/* Clear slip */}
      <button
        type="button"
        onClick={onClear}
        className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-red-500 transition"
      >
        Clear slip
      </button>
    </div>
  );
}

// ─── Main Slip component ──────────────────────────────────────────────────────
export default function Slip({ onBrowseMatches }) {
  const [activeTab,  setActiveTab]  = useState('slip');
  const [selections, setSelections] = useState([]);

  const BET_HISTORY = []; // wire to real store

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
      className="min-h-screen w-full bg-slate-50 text-slate-900"
      style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');`}</style>

      {/* ── Tabs ── */}
      <div className="sticky top-0 z-10 flex border-b border-slate-200 bg-white/95 backdrop-blur-xl shadow-sm">
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
              className="relative flex flex-1 items-center justify-center gap-1.5 py-4 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
            >
              <tab.icon
                size={16}
                className={active ? 'text-blue-600' : 'text-slate-400'}
              />
              <span className={active ? 'text-blue-600' : 'text-slate-400'}>
                {tab.label}
              </span>
              {active && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-blue-600" />
              )}
              {tab.id === 'slip' && selections.length > 0 && (
                <span className="ml-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-blue-600 px-1 text-[10px] font-black text-white">
                  {selections.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Content ── */}
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
              {/* Empty state */}
              <div className="flex flex-col items-center pt-10 text-center">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-slate-100">
                  <Receipt size={26} className="text-slate-400" strokeWidth={1.8} />
                </div>
                <h2 className="mt-4 text-lg font-extrabold tracking-tight text-slate-800">
                  Your slip is empty
                </h2>
                <p className="mt-1.5 max-w-[260px] text-sm text-slate-400">
                  Tap any odds on the matches page to add selections
                </p>

                <button
                  type="button"
                  onClick={onBrowseMatches}
                  className="mt-6 flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700"
                >
                  <span className="text-base leading-none">⚽</span>
                  Browse Matches
                </button>
              </div>

              {/* Booking code */}
              <BookingCodePanel onAddSelections={addSelections} />
            </>
          )
        ) : BET_HISTORY.length > 0 ? (
          <ul className="flex flex-col gap-2.5">
            {BET_HISTORY.map((b) => (
              <li
                key={b.id}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm"
              >
                {b.summary}
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center pt-10 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-slate-100">
              <History size={26} className="text-slate-400" strokeWidth={1.8} />
            </div>
            <h2 className="mt-4 text-lg font-extrabold tracking-tight text-slate-800">
              No bets placed yet
            </h2>
            <p className="mt-1.5 max-w-[260px] text-sm text-slate-400">
              Your settled and pending bets will show up here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}