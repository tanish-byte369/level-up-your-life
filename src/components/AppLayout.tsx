import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Home, Target, Image as ImageIcon, BarChart3, Users, BookHeart, Trophy, User, Settings, Sparkles, Menu, X, Flame, Zap } from "lucide-react";
import { useState } from "react";
import { useDream } from "@/hooks/useDream";
import { levelFromXp, rankFromLevel } from "@/lib/dream";
import { Celebration } from "@/components/Celebration";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/",            label: "Dashboard",     icon: Home },
  { to: "/goals",       label: "Goals",         icon: Target },
  { to: "/vision",      label: "Vision Board",  icon: ImageIcon },
  { to: "/analytics",   label: "Analytics",     icon: BarChart3 },
  { to: "/partners",    label: "Partners",      icon: Users },
  { to: "/stories",     label: "Stories",       icon: BookHeart },
  { to: "/achievements",label: "Achievements",  icon: Trophy },
  { to: "/profile",     label: "Profile",       icon: User },
  { to: "/settings",    label: "Settings",      icon: Settings },
];

export default function AppLayout() {
  const { state } = useDream();
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const lvl = levelFromXp(state.totalXP);
  const rank = rankFromLevel(lvl.level);

  const SidebarBody = (
    <>
      <div className="px-6 py-6">
        <NavLink to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-sunset shadow-[var(--shadow-pop)] animate-pulse-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <div className="font-display text-lg font-bold leading-none text-gradient-sunset">DreamDeck</div>
            <div className="font-hand text-sm leading-none text-muted-foreground">your dreams, gamified</div>
          </div>
        </NavLink>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {NAV.map(({ to, label, icon: Icon }) => {
          const active = to === "/" ? loc.pathname === "/" : loc.pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-gradient-sunset text-primary-foreground shadow-[var(--shadow-pop)]"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground",
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", active && "drop-shadow")} />
              <span>{label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="m-4 rounded-2xl bg-gradient-aurora p-4 text-center text-secondary-foreground">
        <div className="font-hand text-2xl leading-none">stay</div>
        <div className="font-display text-lg font-bold leading-tight">unstoppable</div>
        <div className="mt-1 text-xs opacity-80">streak {state.streak}d 🔥</div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        {SidebarBody}
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col border-r border-sidebar-border bg-sidebar shadow-2xl animate-fade-in">
            <button onClick={() => setOpen(false)} className="absolute right-3 top-3 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
            {SidebarBody}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-md">
          <div className="flex items-center gap-3 px-3 py-3 sm:px-4 lg:px-6">
            <button onClick={() => setOpen(true)} className="rounded-lg p-1.5 text-foreground hover:bg-muted lg:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>

            <NavLink to="/profile" className="flex min-w-0 items-center gap-2.5">
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-full bg-gradient-sunset opacity-60 blur-md" />
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary/60 bg-card text-xl">
                  {state.user.emoji}
                </div>
              </div>
              <div className="min-w-0">
                <div className="truncate font-display text-sm font-semibold sm:text-base">{state.user.name}</div>
                <div className="text-[11px] text-muted-foreground">Lv. {lvl.level} · <span className="text-primary">{rank}</span></div>
              </div>
            </NavLink>

            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <NavLink to="/analytics" className="hidden items-center gap-1.5 rounded-full bg-muted/50 px-3 py-1.5 transition hover:bg-muted sm:flex">
                <Flame className="h-4 w-4 text-primary" />
                <span className="font-display text-sm font-semibold">{state.streak}</span>
                <span className="text-xs text-muted-foreground">day{state.streak === 1 ? "" : "s"}</span>
              </NavLink>
              <div className="hidden items-center gap-1.5 rounded-full bg-muted/50 px-3 py-1.5 sm:flex">
                <Zap className="h-4 w-4 text-accent" />
                <span className="font-display text-sm font-semibold">{state.totalXP.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground">XP</span>
              </div>
            </div>
          </div>

          <div className="px-3 pb-2 sm:px-4 lg:px-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Lv.{lvl.level}</span>
              <div className="relative h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
                <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-sunset transition-all duration-700" style={{ width: `${lvl.pct}%` }} />
              </div>
              <span className="text-[11px] text-muted-foreground">{lvl.into}/{lvl.needed}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 px-3 py-5 sm:px-4 sm:py-6 lg:px-6">
          <Outlet />
        </main>
      </div>

      <Celebration />
    </div>
  );
}
