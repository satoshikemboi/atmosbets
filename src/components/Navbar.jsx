import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

  useEffect(() => {
    const onResize = () => window.innerWidth >= 768 && setMobileOpen(false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-gray-900 backdrop-blur-xl border-b border-white/8 shadow-lg shadow-black/30'
          : 'bg-[#0a0e17] border-b border-gray-600 shadow-md'
      }`}
      style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Syne:wght@700;800&display=swap');
      `}</style>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">

        {/* ── Wordmark Logo ── */}
        <a href="./" className="shrink-0 flex items-center gap-0.5" style={{ textDecoration: 'none' }}>
  <img src="/logoa.png" alt="AtmosBets Logo" className="h-8 w-auto" />
</a>

        {/* ── Desktop nav links ── */}
        <nav className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="relative px-3.5 py-2 text-sm font-semibold text-white/60 transition-colors duration-200 hover:text-white rounded-lg group"
              style={{ textDecoration: 'none' }}
            >
              <span className="flex items-center gap-1.5">
                {link.label}
                {link.live && (
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-orange-400" />
                  </span>
                )}
              </span>
              {/* Underline accent */}
              <span className="absolute left-3.5 right-3.5 -bottom-px h-[1.5px] origin-left scale-x-0 rounded-full bg-orange-400 transition-transform duration-250 group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        {/* ── Desktop right actions ── */}
        <div className="hidden md:flex items-center gap-1">
          <button
            type="button"
            aria-label="Search"
            className="grid h-9 w-9 place-items-center rounded-full text-white/50 transition hover:bg-white/8 hover:text-white"
          >
            <Search size={16} />
          </button>

          <a
            href="#signin"
            className="px-4 py-2 text-sm font-semibold text-white/70 transition hover:text-white rounded-full hover:bg-white/6"
            style={{ textDecoration: 'none' }}
          >
            Sign In
          </a>

          <a
            href="#join"
            className="rounded-full px-4 py-2 text-sm font-bold text-white transition hover:brightness-110"
            style={{
              background: '#f97316',
              textDecoration: 'none',
              boxShadow: '0 0 18px rgba(249,115,22,0.28)',
            }}
          >
            Join Now
          </a>
        </div>

        {/* ── Mobile right ── */}
        <div className="md:hidden flex items-center gap-5">
          <Link to="/wallet" className="flex items-center">
            <WalletIcon size={23} className="text-white/60" />
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            className="grid h-9 w-9 place-items-center text-white/70 transition hover:bg-white/8 hover:text-white"
          >
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu panel ── */}
      <div
        className={`md:hidden grid overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="min-h-0 border-t border-white/8 bg-[#0a0e17] px-4 pt-2">
          <nav className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between rounded-xl px-2 py-3 text-[15px] font-semibold text-white/75 transition hover:bg-white/5 hover:text-white"
                style={{ textDecoration: 'none' }}
              >
                <span className="flex items-center gap-2.5">
                  {link.label}
                  {link.live && (
                    <span className="flex items-center gap-1 rounded-full bg-orange-500/12 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-orange-400">
                      <Radio size={9} /> Live
                    </span>
                  )}
                </span>
              </a>
            ))}
          </nav>

          <div className="mt-3 flex items-center gap-2 border-t border-white/8 pt-4">
            <a
              href="#signin"
              onClick={() => setMobileOpen(false)}
              className="flex-1 rounded-full border border-white/12 px-4 py-2.5 text-center text-sm font-semibold text-white/75 transition hover:bg-white/5"
              style={{ textDecoration: 'none' }}
            >
              Sign In
            </a>
            <a
              href="#join"
              onClick={() => setMobileOpen(false)}
              className="flex-1 rounded-full px-4 py-2.5 text-center text-sm font-bold text-white"
              style={{
                background: '#f97316',
                textDecoration: 'none',
                boxShadow: '0 0 14px rgba(249,115,22,0.25)',
              }}
            >
              Join Now
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}