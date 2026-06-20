import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Receipt, User } from "lucide-react";

const NAV_ITEMS = [
  { path: "/", label: "Home", icon: Home },
  { path: "/sports", label: "Sports", emoji: "⚽" },
  { path: "/betslip", label: "Slip", icon: Receipt },
  { path: "/profile", label: "Account", icon: User },
];

export default function BottomNav({ betSlipCount = 2 }) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#0a0e17]/95 backdrop-blur-xl"
      style={{
        fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="mx-auto flex h-16 max-w-md items-center justify-between px-2">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `relative flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-2`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`relative grid h-7 w-7 place-items-center transition-colors ${
                    isActive ? "text-cyan-400" : "text-white/45"
                  }`}
                >
                  {item.icon ? (
                    <item.icon
                      size={22}
                      strokeWidth={isActive ? 2.4 : 2}
                    />
                  ) : (
                    <span
                      className={`text-[19px] leading-none ${
                        isActive ? "" : "opacity-60 grayscale"
                      }`}
                    >
                      {item.emoji}
                    </span>
                  )}

                  {item.path === "/betslip" &&
                    betSlipCount > 0 && (
                      <span className="absolute -right-2 -top-1.5 grid h-4 min-w-[16px] place-items-center rounded-full bg-gradient-to-r from-orange-400 to-orange-500 px-1 text-[9px] font-bold text-[#1a1206]">
                        {betSlipCount}
                      </span>
                    )}
                </span>

                <span
                  className={`text-[11px] leading-none transition-colors ${
                    isActive
                      ? "font-bold text-cyan-400"
                      : "font-semibold text-white/45"
                  }`}
                >
                  {item.label}
                </span>

                {isActive && (
                  <span className="absolute top-0 h-0.5 w-8 rounded-full bg-gradient-to-r from-cyan-300 to-violet-400" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}