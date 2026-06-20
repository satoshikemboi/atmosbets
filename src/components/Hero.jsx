import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

// Swap `image` with real, licensed match/stadium photography from your API.
// Placeholders below are generic stock photos, not team photography.
// `flagCode` maps to flagcdn.com's ISO codes (subdivision codes like
// "gb-eng" are supported for England, Scotland, Wales, etc).
const slides = [
  {
    id: 1,
    flagCode: 'es',
    competition: 'SPAIN · LA LIGA',
    badge: 'LL',
    badgeColor: 'bg-orange-600',
    title: 'FC Barcelona',
    tag: '2025/26 Champions',
    image: 'https://picsum.photos/seed/fcbarcelona/900/600',
    gradient: 'from-[#1a0f2e] via-[#2b1a47] to-[#43173a]',
    glow: '#e8590c',
  },
  {
    id: 2,
    flagCode: 'gb-eng',
    competition: 'ENGLAND · PREMIER LEAGUE',
    badge: 'PL',
    badgeColor: 'bg-purple-600',
    title: 'Manchester City',
    tag: 'Top of the Table',
    image: 'https://picsum.photos/seed/mancity/900/600',
    gradient: 'from-[#0c1a2e] via-[#162a4a] to-[#1f3a63]',
    glow: '#7c3aed',
  },
  {
    id: 3,
    flagCode: 'it',
    competition: 'ITALY · SERIE A',
    badge: 'SA',
    badgeColor: 'bg-emerald-600',
    title: 'Inter Milan',
    tag: 'Unbeaten in 12',
    image: 'https://picsum.photos/seed/intermilan/900/600',
    gradient: 'from-[#13231b] via-[#163328] to-[#184536]',
    glow: '#10b981',
  },
];

export default function Hero({ autoPlayMs = 6000 }) {
  const [index, setIndex] = useState(0);
  const total = slides.length;

  const goTo = useCallback((i) => setIndex(((i % total) + total) % total), [total]);
  const next = useCallback(() => goTo(index + 1), [index, goTo]);
  const prev = useCallback(() => goTo(index - 1), [index, goTo]);

  useEffect(() => {
    if (!autoPlayMs) return;
    const t = setInterval(next, autoPlayMs);
    return () => clearInterval(t);
  }, [next, autoPlayMs]);

  const slide = slides[index];

  return (
    <div className="w-full max-w-md mx-auto">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@500;700;800;900&display=swap');
        @keyframes hero-fade-in { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      <div
        className="relative h-52 overflow-hidden shadow-xl shadow-black/30 select-none"
        style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
      >
        {/* Real background photo, swapped per slide */}
        <img
          key={slide.id}
          src={slide.image}
          alt={`${slide.title} — ${slide.competition}`}
          loading="eager"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ animation: 'hero-fade-in 0.5s ease' }}
        />

        {/* Brand-color tint over the photo, ties the card to the league/team colors */}
        <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} opacity-55 mix-blend-multiply transition-colors duration-700`} />

        {/* Soft accent glow */}
        <div
          className="absolute -right-12 -top-16 w-64 h-64 rounded-full blur-3xl opacity-30 transition-colors duration-700"
          style={{ backgroundColor: slide.glow }}
        />

        {/* Bottom-to-top fade so text always stays legible over the photo */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

        {/* Prev / next controls */}
        <button
          type="button"
          onClick={prev}
          aria-label="Previous slide"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/70 transition hover:bg-white/20 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
        >
          <ChevronLeft size={18} strokeWidth={2.5} />
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Next slide"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/70 transition hover:bg-white/20 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
        >
          <ChevronRight size={18} strokeWidth={2.5} />
        </button>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-5">
          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-full ${slide.badgeColor} flex items-center justify-center text-white text-[10px] font-extrabold tracking-tight`}
            >
              {slide.badge}
            </span>
            <img
              src={`https://flagcdn.com/w40/${slide.flagCode}.png`}
              srcSet={`https://flagcdn.com/w80/${slide.flagCode}.png 2x`}
              alt=""
              className="h-3.5 w-5 rounded-[2px] object-cover shadow-sm ring-1 ring-white/20"
            />
            <span className="text-white/90 text-xs font-bold tracking-wider uppercase">
              {slide.competition}
            </span>
          </div>

          <div className="px-0.5">
            <h1 className="text-white text-3xl font-extrabold tracking-tight leading-tight mb-2 [text-shadow:0_2px_8px_rgba(0,0,0,0.4)]">
              {slide.title}
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              {slide.tag}
            </span>
          </div>
        </div>

        {/* Dot indicators */}
        <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? 'w-5 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}