import React, { useState, useEffect } from 'react';
import { Search, Menu, X, Radio, WalletIcon } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Sports', href: '#sports' },
  { label: 'Live', href: '#live', live: true },
  { label: 'Bet Slip', href: 'slip' },
  { label: 'Promotions', href: '#promotions' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu if the viewport grows back to desktop size
  useEffect(() => {
    const onResize = () => window.innerWidth >= 768 && setMobileOpen(false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-[#0a0e17]/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20'
          : 'bg-[#0a0e17] border-b border-transparent'
      }`}
      style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@500;700;800;900&display=swap');
        @keyframes atmos-orbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) {
          .atmos-ring { animation: none !important; }
        }
      `}</style>

      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4 pt-5 sm:px-6">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2.5 shrink-0 group">
          <span className="relative grid h-8 w-8 place-items-center">
            <span
              className="atmos-ring absolute inset-0 rounded-full border-2 border-dashed border-green-400"
              style={{ animation: 'atmos-orbit 7s linear infinite' }}
            />
            <span className="h-3 w-3 bg-green-400 rounded-full shadow-[0_0_10px_2px_rgba(168,85,247,0.55)]" />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-white">
            Atmos<span>Bets</span>
          </span>
        </a>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="relative px-3.5 py-2 text-sm font-semibold text-white/70 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400 rounded-lg group"
            >
              <span className="flex items-center gap-1.5">
                {link.label}
                {link.live && (
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>
                )}
              </span>
              <span className="absolute left-3.5 right-3.5 -bottom-px h-0.5 origin-left scale-x-0 rounded-full transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        {/* Right side actions (desktop) */}
        <div className="hidden md:flex items-center gap-2">
          <button
            type="button"
            aria-label="Search"
            className="grid h-9 w-9 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
          >
            <Search size={17} />
          </button>
          <a
            href="#signin"
            className="rounded-full px-4 py-2 text-sm font-semibold text-white/80 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
          >
            Sign In
          </a>
          <a
            href="#join"
            className="rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2 text-sm font-bold text-[#1a1206] shadow-md shadow-orange-500/20 transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            Join Now
          </a>
        </div>

        <div className='mx-2 md:hidden flex items-center gap-4'>
        <div className='md:flex items-center gap-2'>
            <WalletIcon size={24} className="text-white/70" />
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          className="md:hidden grid h-9 w-9 place-items-center rounded-full text-white/80 transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      </div>

      {/* Mobile menu panel */}
      <div
        className={`md:hidden grid overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="min-h-0 border-t border-white/10 bg-[#0a0e17] px-4 pb-5 pt-2">
          <nav className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between rounded-lg px-2 py-3 text-base font-semibold text-white/85 transition hover:bg-white/5 hover:text-white"
              >
                <span className="flex items-center gap-2">
                  {link.label}
                  {link.live && (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-400/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-400">
                      <Radio size={10} /> Live
                    </span>
                  )}
                </span>
              </a>
            ))}
          </nav>

          <div className="mt-3 flex items-center gap-2 border-t border-white/10 pt-4">
            <a
              href="#signin"
              onClick={() => setMobileOpen(false)}
              className="flex-1 rounded-full border border-white/15 px-4 py-2.5 text-center text-sm font-semibold text-white/85 transition hover:bg-white/5"
            >
              Sign In
            </a>
            <a
              href="#join"
              onClick={() => setMobileOpen(false)}
              className="flex-1 rounded-full bg-linear-to-r from-orange-400 to-orange-500 px-4 py-2.5 text-center text-sm font-bold text-[#1a1206]"
            >
              Join Now
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}