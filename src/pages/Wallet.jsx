import React, { useState } from 'react';
import { Wallet, RefreshCw, Eye, EyeOff, PiggyBank, DollarSign, Users, Landmark, HeartHandshake, Receipt, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';

export default function WalletPage() {
  const [showBalance, setShowBalance] = useState(true);
  const [showEarnings, setShowEarnings] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 700);
  };

  return (
    <div className="min-h-screen w-full bg-[#100E0B] flex justify-center px-4 py-10">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');`}</style>

      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#1C1812] border border-[#332B1C] flex items-center justify-center">
              <Wallet className="w-4 h-4 text-[#C9A227]" strokeWidth={2} />
            </div>
            <div>
              <h1 className="font-['Manrope'] text-[17px] font-extrabold text-white/95 leading-none">Wallet</h1>
              <p className="font-['Manrope'] text-[12px] text-white/35 mt-1 leading-none">Malone Liam</p>
            </div>
          </div>
          <button onClick={handleRefresh} className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors">
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} strokeWidth={2} />
          </button>
        </div>

        {/* Main balance card */}
        <div className="relative rounded-2xl bg-linear-to-br from-[#221C12] via-[#181410] to-[#100E0B] border border-[#33291A] p-5 mb-4 overflow-hidden">
          <div className="absolute top-0 left-5 right-5 h-px bg-linear-to-r from-transparent via-[#C9A227]/60 to-transparent"></div>

          <div className="flex items-center justify-between mb-4">
            <span className="font-['Manrope'] text-[11px] font-bold uppercase tracking-[0.14em] text-[#C9A227]/70">Main Balance · KES</span>
            <button onClick={() => setShowBalance(!showBalance)} className="text-white/35 hover:text-white/70 transition-colors">
              {showBalance ? <Eye className="w-4 h-4" strokeWidth={2} /> : <EyeOff className="w-4 h-4" strokeWidth={2} />}
            </button>
          </div>

          <div className="flex items-baseline gap-1.5 mb-5">
            <span className="font-['IBM_Plex_Mono'] text-lg font-medium text-white/50">KES</span>
            <span className="font-['IBM_Plex_Mono'] text-[34px] font-semibold text-white tabular-nums leading-none">
              {showBalance ? '0.00' : '••••••'}
            </span>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#C9A227] hover:bg-[#D9B23A] text-[#16130C] font-['Manrope'] font-bold text-[14px] py-3 transition-colors">
              <ArrowDownToLine className="w-4 h-4" strokeWidth={2.5} />
              Deposit
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-white/85 font-['Manrope'] font-bold text-[14px] py-3 transition-colors">
              <ArrowUpFromLine className="w-4 h-4" strokeWidth={2.5} />
              Withdraw
            </button>
          </div>
        </div>

        {/* Affiliate earnings card */}
        <div className="rounded-2xl bg-[#15130F] border border-[#262119] p-5 mb-4">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#16271F] flex items-center justify-center">
                <PiggyBank className="w-4 h-4 text-[#3FAE73]" strokeWidth={2} />
              </div>
              <h2 className="font-['Manrope'] text-[14px] font-bold text-white/90 leading-tight">Affiliate Earnings</h2>
            </div>
            <button onClick={() => setShowEarnings(!showEarnings)} className="text-white/35 hover:text-white/70 transition-colors">
              {showEarnings ? <Eye className="w-4 h-4" strokeWidth={2} /> : <EyeOff className="w-4 h-4" strokeWidth={2} />}
            </button>
          </div>
          <p className="font-['Manrope'] text-[12px] text-white/35 mb-4 ml-[42px]">Withdraw to your bank account</p>

          <div className="font-['IBM_Plex_Mono'] text-[28px] font-semibold text-white tabular-nums mb-4">
            {showEarnings ? 'KES 0.00' : 'KES ••••••'}
          </div>

          <div className="grid grid-cols-3 gap-2.5 mb-4">
            <div className="rounded-xl bg-[#1B1813] border border-[#2A2419] py-3 px-2 flex flex-col items-center text-center">
              <div className="w-6 h-6 rounded-full bg-[#16271F] flex items-center justify-center mb-1.5">
                <DollarSign className="w-3.5 h-3.5 text-[#3FAE73]" strokeWidth={2.5} />
              </div>
              <span className="font-['Manrope'] text-[10px] text-white/35 mb-0.5">Total Earned</span>
              <span className="font-['IBM_Plex_Mono'] text-[12px] font-bold text-[#3FAE73] tabular-nums">KES 0.00</span>
            </div>

            <div className="rounded-xl bg-[#1B1813] border border-[#2A2419] py-3 px-2 flex flex-col items-center text-center">
              <div className="w-6 h-6 rounded-full bg-[#1A1A26] flex items-center justify-center mb-1.5">
                <Users className="w-3.5 h-3.5 text-[#8B92E8]" strokeWidth={2.5} />
              </div>
              <span className="font-['Manrope'] text-[10px] text-white/35 mb-0.5">Referrals</span>
              <span className="font-['IBM_Plex_Mono'] text-[12px] font-bold text-white/85 tabular-nums">0</span>
            </div>

            <div className="rounded-xl bg-[#1B1813] border border-[#2A2419] py-3 px-2 flex flex-col items-center text-center">
              <div className="w-6 h-6 rounded-full bg-[#221C12] flex items-center justify-center mb-1.5">
                <Landmark className="w-3.5 h-3.5 text-[#C9A227]" strokeWidth={2.5} />
              </div>
              <span className="font-['Manrope'] text-[10px] text-white/35 mb-0.5">Available</span>
              <span className="font-['IBM_Plex_Mono'] text-[12px] font-bold text-white/85 tabular-nums">KES 0.00</span>
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#16271F] hover:bg-[#1B2F26] border border-[#22392E] text-[#3FAE73] font-['Manrope'] font-bold text-[13px] py-3 transition-colors">
            <HeartHandshake className="w-4 h-4" strokeWidth={2.2} />
            Withdraw Affiliate Earnings
          </button>
        </div>

        {/* Recent transactions */}
        <div className="rounded-2xl bg-[#15130F] border border-[#262119] p-5">
          <span className="font-['Manrope'] text-[11px] font-bold uppercase tracking-[0.14em] text-white/35">Recent Transactions</span>

          <div className="flex flex-col items-center justify-center py-10">
            <div className="relative w-12 h-12 mb-3 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-dashed border-white/15"></div>
              <Receipt className="w-5 h-5 text-white/25" strokeWidth={1.8} />
            </div>
            <p className="font-['Manrope'] text-[13px] font-semibold text-white/50">No transactions yet</p>
            <p className="font-['Manrope'] text-[11px] text-white/25 mt-1">Your activity will show up here</p>
          </div>
        </div>

      </div>
    </div>
  );
}