import React, { useState } from 'react';
import {
  Smartphone,
  Landmark,
  Bitcoin,
  ChevronDown,
  CheckCircle2,
  Copy,
  Check,
  AlertTriangle,
  ClipboardCheck,
  Clock,
} from 'lucide-react';

const METHODS = [
  { id: 'momo', label: 'MoMo Ghana', icon: Smartphone },
  { id: 'bank', label: 'Bank Transfer', icon: Landmark },
  { id: 'crypto', label: 'Binance Crypto', icon: Bitcoin },
];

const DETECTED_COUNTRY = 'KE';
const COUNTRIES = [
  { code: 'KE', name: 'Kenya', currency: 'KES', flagCode: 'ke' },
  { code: 'GH', name: 'Ghana', currency: 'GHS', flagCode: 'gh' },
  { code: 'NG', name: 'Nigeria', currency: 'NGN', flagCode: 'ng' },
  { code: 'ZA', name: 'South Africa', currency: 'ZAR', flagCode: 'za' },
];

// Placeholder deposit addresses — replace with real ones from your custodian/processor
const COINS = [
  { code: 'USDT', network: 'TRC20 · TRON', min: 200, address: 'TPlaceholder1WalletAddressXXXXXXXXXX' },
  { code: 'BTC', network: 'Bitcoin', min: 500, address: 'bc1qPlaceholder2WalletAddressXXXXXXX' },
  { code: 'ETH', network: 'ERC20 · Ethereum', min: 400, address: '0xPlaceholder3WalletAddressXXXXXXXXXX' },
  { code: 'BNB', network: 'BEP20 · BSC', min: 250, address: 'bnb1Placeholder4WalletAddressXXXXXXX' },
  { code: 'USDC', network: 'ERC20 · Ethereum', min: 200, address: '0xPlaceholder5WalletAddressXXXXXXXXXX' },
];

export default function Deposit() {
  const [method, setMethod] = useState('crypto');
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [countryOpen, setCountryOpen] = useState(false);
  const [activeCoin, setActiveCoin] = useState(COINS[0].code);
  const [copied, setCopied] = useState(false);

  const coin = COINS.find((c) => c.code === activeCoin);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(coin.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — fail silently
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-[#0a0e17] px-4 pb-24 pt-6 text-white"
      style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700;800&display=swap');
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="mx-auto max-w-md">
        {/* Header — plain text, no card */}
        <h1 className="text-2xl font-extrabold leading-tight tracking-tight">Fund your account</h1>
        <p className="mt-1.5 text-sm text-white/40">
          Min: <span className="font-semibold text-white/70">GH₵{coin.min}</span>
          <span className="mx-1">≈</span>
          <span className="font-semibold text-white/70">{country.currency} {(coin.min * 11.5).toFixed(0)}</span>
        </p>

        {/* Payment method pills — replaces 3 separate partner cards */}
        <p className="mb-2 mt-6 text-xs font-bold uppercase tracking-wide text-white/30">
          Trusted Payment Partners
        </p>
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
          {METHODS.map((m) => {
            const active = method === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setMethod(m.id)}
                className={`flex-none flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400 ${
                  active
                    ? 'bg-gradient-to-r from-cyan-400 to-violet-500 text-[#0a0e17] shadow-md shadow-violet-500/20'
                    : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                <m.icon size={15} />
                {m.label}
              </button>
            );
          })}
        </div>

        {/* One consolidated card: country select + deposit details */}
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03]">
          {/* Step 1 — country */}
          <div className="relative p-4">
            <div className="flex items-center gap-1.5">
              <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-cyan-400 text-[10px] font-extrabold text-[#0a0e17]">
                1
              </span>
              <span className="text-xs font-bold text-white/60">Select your country</span>
              {country.code === DETECTED_COUNTRY && (
                <span className="ml-auto flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                  <CheckCircle2 size={12} />
                  Auto-detected
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setCountryOpen((v) => !v)}
              className="mt-2.5 flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 transition hover:border-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
            >
              <span className="flex items-center gap-2.5">
                <img
                  src={`https://flagcdn.com/w40/${country.flagCode}.png`}
                  alt=""
                  className="h-4 w-6 rounded-[2px] object-cover ring-1 ring-white/10"
                />
                <span className="text-sm font-bold">{country.name}</span>
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-white/40">
                {country.currency}
                <ChevronDown size={14} className={`transition-transform ${countryOpen ? 'rotate-180' : ''}`} />
              </span>
            </button>

            {countryOpen && (
              <div className="absolute left-4 right-4 z-20 mt-1.5 overflow-hidden rounded-xl border border-white/10 bg-[#11161f] shadow-xl shadow-black/40">
                {COUNTRIES.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      setCountry(c);
                      setCountryOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition hover:bg-white/5"
                  >
                    <img
                      src={`https://flagcdn.com/w40/${c.flagCode}.png`}
                      alt=""
                      className="h-4 w-6 rounded-[2px] object-cover ring-1 ring-white/10"
                    />
                    <span className="text-sm font-semibold">{c.name}</span>
                    <span className="ml-auto text-xs text-white/40">{c.currency}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="h-px bg-white/10" />

          {method === 'crypto' ? (
            <div className="p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-white/30">Crypto Deposit</p>

              <div className="mt-3 flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyan-400/15 to-violet-500/15">
                  <Bitcoin size={18} className="text-amber-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold">Send {coin.code} to this address</p>
                  <p className="text-xs text-white/40">
                    Network: <span className="font-semibold text-cyan-400">{coin.network}</span>
                  </p>
                </div>
              </div>

              {/* Address — kept boxed since it's a functional element, not decoration */}
              <div className="mt-3 rounded-xl border border-white/10 bg-black/30 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-white/30">Wallet Address</p>
                <p className="mt-1 break-all font-mono text-[13px] text-white/90">{coin.address}</p>
                <button
                  type="button"
                  onClick={copyAddress}
                  className="mt-2.5 flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1.5 text-xs font-bold text-cyan-400 transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              {/* Network / coin / min — one row, not three boxes */}
              <div className="mt-3 grid grid-cols-3 divide-x divide-white/10 rounded-xl border border-white/10">
                <div className="px-2 py-2.5 text-center">
                  <p className="text-[10px] uppercase tracking-wide text-white/30">Network</p>
                  <p className="mt-0.5 text-xs font-bold">{coin.network.split(' ')[0]}</p>
                </div>
                <div className="px-2 py-2.5 text-center">
                  <p className="text-[10px] uppercase tracking-wide text-white/30">Coin</p>
                  <p className="mt-0.5 text-xs font-bold">{coin.code}</p>
                </div>
                <div className="px-2 py-2.5 text-center">
                  <p className="text-[10px] uppercase tracking-wide text-white/30">Min.</p>
                  <p className="mt-0.5 text-xs font-bold">≈GH₵{coin.min}</p>
                </div>
              </div>

              {/* Warning */}
              <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-500/15 bg-red-500/5 p-3">
                <AlertTriangle size={15} className="mt-0.5 shrink-0 text-red-400" />
                <p className="text-xs leading-relaxed text-red-300/90">
                  Only send <span className="font-bold">{coin.code}</span> via{' '}
                  <span className="font-bold">{coin.network.split(' ')[0]}</span>. Wrong network = permanent loss
                  of funds.
                </p>
              </div>

              {/* Also accepted — pills, not cards */}
              <p className="mb-1.5 mt-3 text-[11px] font-bold uppercase tracking-wide text-white/30">
                Also Accepted
              </p>
              <div className="flex flex-wrap gap-1.5">
                {COINS.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setActiveCoin(c.code)}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                      c.code === activeCoin
                        ? 'border border-amber-400/30 bg-amber-400/15 text-amber-300'
                        : 'border border-white/10 bg-white/5 text-white/50 hover:text-white'
                    }`}
                  >
                    {c.code}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 text-sm leading-relaxed text-white/50">
              {method === 'momo'
                ? 'Dial the prompt sent to your phone after submitting, then confirm with your MoMo PIN to complete the deposit.'
                : 'Transfer to the account details provided after submitting, using your phone number as the payment reference.'}
            </div>
          )}
        </div>

        {/* Submit — no card, just the CTA */}
        <button
          type="button"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 py-3.5 text-sm font-extrabold text-[#1a1206] shadow-md shadow-orange-500/20 transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
        >
          <ClipboardCheck size={17} />
          I've Sent — Submit Proof
        </button>

        <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-white/30">
          <Clock size={12} />
          Reviewed &amp; credited within 1–5 mins
        </p>
      </div>
    </div>
  );
}