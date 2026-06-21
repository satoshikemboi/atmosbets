import React from 'react';
import { Link } from "react-router-dom";
import {
  Pencil,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  CreditCard,
  History,
  Bell,
  ShieldCheck,
  HelpCircle,
  FileText,
  LogOut,
  ChevronRight,
  BadgeCheck,
} from 'lucide-react';

// Swap with the authenticated user's real data
const USER = {
  name: 'Alex Morgan',
  phone: '+1 •••-•••-4821',
  initials: 'AM',
  tier: 'Gold Member',
  balance: 2450.75,
  betsPlaced: 128,
  winRate: '54%',
  memberSince: '2023',
};

const ACCOUNT_ITEMS = [
  { id: 'personal', label: 'Personal Info', icon: BadgeCheck },
  { id: 'payments', label: 'Payment Methods', icon: CreditCard },
  { id: 'history', label: 'Transaction History', icon: History },
  { id: 'notifications', label: 'Notifications', icon: Bell, badge: 3 },
  { id: 'security', label: 'Security', icon: ShieldCheck },
];

const SUPPORT_ITEMS = [
  { id: 'help', label: 'Help & Support', icon: HelpCircle },
  { id: 'terms', label: 'Terms & Privacy', icon: FileText },
];

function MenuRow({ icon: Icon, label, badge, onClick }) {
  return (
    <Link to ="/deposit"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left transition hover:bg-white/[0.05] focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
    >
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/5">
          <Icon size={16} className="text-white/60" />
        </div>
        <span className="text-sm font-semibold text-white">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {badge ? (
          <span className="grid h-5 min-w-[20px] place-items-center rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-1.5 text-[10px] font-bold text-[#1a1206]">
            {badge}
          </span>
        ) : null}
        <ChevronRight size={16} className="text-white/25" />
      </div>
    </Link>
  );
}

export default function Profile({ onLogout }) {
  return (
    <div
      className="min-h-screen w-full bg-[#0a0e17] px-4 pb-24 pt-6 text-white"
      style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700;800&display=swap');`}</style>

      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="relative grid h-16 w-16 shrink-0 place-items-center rounded-full bg-linear-to-br from-orange-400 to-orange-500 p-[2px]">
            <div className="grid h-full w-full place-items-center rounded-full bg-[#0a0e17]">
              <span className="text-lg font-extrabold tracking-tight">{USER.initials}</span>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-extrabold tracking-tight">{USER.name}</h1>
            <p className="truncate text-sm text-white/40">{USER.phone}</p>
            <span className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
              <BadgeCheck size={13} />
              {USER.tier}
            </span>
          </div>

          <button
            type="button"
            aria-label="Edit profile"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
          >
            <Pencil size={15} />
          </button>
        </div>

        {/* Balance */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-white/40">
            <Wallet size={13} />
            Available Balance
          </div>
          <p className="mt-1.5 text-3xl font-extrabold tracking-tight">
            ${USER.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>

          <div className="mt-4 flex gap-2.5">
            <Link
                to="/deposit"
              type="button"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 py-2.5 text-sm font-bold text-[#1a1206] shadow-md shadow-orange-500/20 transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              <ArrowDownCircle size={15} />
              Deposit
            </Link>
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-white/15 py-2.5 text-sm font-bold text-white/80 transition hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
            >
              <ArrowUpCircle size={15} />
              Withdraw
            </button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="mt-4 grid grid-cols-3 gap-2.5">
          {[
            { label: 'Bets Placed', value: USER.betsPlaced },
            { label: 'Win Rate', value: USER.winRate },
            { label: 'Member Since', value: USER.memberSince },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/[0.04] py-3 text-center"
            >
              <p className="text-base font-extrabold tracking-tight">{stat.value}</p>
              <p className="mt-0.5 text-[11px] text-white/40">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Account menu */}
        <p className="mb-1 mt-7 px-1 text-xs font-bold uppercase tracking-wide text-white/30">
          Account
        </p>
        <div className="rounded-2xl border border-white/10 bg-white/[0.02]">
          {ACCOUNT_ITEMS.map((item, i) => (
            <React.Fragment key={item.id}>
              <MenuRow icon={item.icon} label={item.label} badge={item.badge} />
              {i < ACCOUNT_ITEMS.length - 1 && <div className="mx-3 h-px bg-white/5" />}
            </React.Fragment>
          ))}
        </div>

        {/* Support menu */}
        <p className="mb-1 mt-5 px-1 text-xs font-bold uppercase tracking-wide text-white/30">
          Support
        </p>
        <div className="rounded-2xl border border-white/10 bg-white/[0.02]">
          {SUPPORT_ITEMS.map((item, i) => (
            <React.Fragment key={item.id}>
              <MenuRow icon={item.icon} label={item.label} />
              {i < SUPPORT_ITEMS.length - 1 && <div className="mx-3 h-px bg-white/5" />}
            </React.Fragment>
          ))}
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={onLogout}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/5 py-3 text-sm font-bold text-red-400 transition hover:bg-red-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400"
        >
          <LogOut size={15} />
          Log Out
        </button>

        <p className="mt-5 text-center text-xs text-white/20">AtmosBets · v1.0.0</p>
      </div>
    </div>
  );
}