import { ReactNode, useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, User, Sword, ScrollText, BookOpen as JournalIcon,
  Crown, Menu, X, Coins, Zap, Bell, Pencil, RotateCcw, Flame,
} from "lucide-react";
import avatarImg from "@/assets/avatar-hero.jpg";
import { useGameCtx } from "@/context/GameContext";
import { levelFromXp, rankFromLevel } from "@/lib/game";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/character", label: "Character", icon: User },
  { to: "/skills", label: "Skills", icon: Sword },
  { to: "/quests", label: "Quests", icon: ScrollText },
  { to: "/chronicle", label: "Chronicle", icon: JournalIcon },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const { state, setOperatorName, resetGame } = useGameCtx();
  const [editName, setEditName] = useState(false);
  const [nameInput, setNameInput] = useState(state.operatorName);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();

  useEffect(() => { setMobileNavOpen(false); }, [location.pathname]);

  const overall = levelFromXp(state.totalXP);
  const rank = rankFromLevel(overall.level);
  const coins = Math.floor(state.totalXP / 10) + 1000;
  const energy = Math.max(0, 120 - state.completedToday.length * 5);
  const dailyDone = state.completedToday.length;

  const SidebarNav = (
    <>
      <div className="px-6 py-6">
        <NavLink to="/" className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-primary" />
          <h1 className="font-display text-xl font-bold leading-none text-shimmer">LIFE LEGEND</h1>
        </NavLink>
        <p className="mt-2 font-serif text-xs italic text-muted-foreground">Forge the hero of your life.</p>
      </div>
      <div className="gold-divider mx-6" />

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-all",
                  isActive
                    ? "bg-primary/15 text-primary border border-primary/30 shadow-[inset_0_0_20px_hsl(var(--primary)/0.08)]"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground border border-transparent"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn("h-4 w-4", isActive && "text-primary")} />
                  <span className="font-display text-sm font-medium tracking-wide">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="space-y-3 p-4">
        <div className="panel ornate-corner relative rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <div className="font-display text-sm font-semibold text-primary">Daily Boon</div>
              <div className="font-serif text-xs text-muted-foreground">Active quests today</div>
              <div className="mt-1 font-display text-sm text-primary">{dailyDone} cleared</div>
            </div>
            <div className="text-2xl">🗝️</div>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-gradient-dream transition-all" style={{ width: `${Math.min(100, dailyDone * 12)}%` }} />
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen w-full">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        {SidebarNav}
      </aside>

      {/* MOBILE DRAWER */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileNavOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col border-r border-sidebar-border bg-sidebar shadow-2xl">
            <button
              onClick={() => setMobileNavOpen(false)}
              className="absolute right-3 top-3 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
            {SidebarNav}
          </aside>
        </div>
      )}

      {/* MAIN COLUMN */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-primary/15 bg-background/85 backdrop-blur-md">
          <div className="flex items-center gap-3 px-3 py-2.5 sm:gap-4 sm:px-4 lg:px-6">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="rounded-md p-1.5 text-foreground hover:bg-muted lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <NavLink to="/character" className="flex min-w-0 items-center gap-2.5 hover:opacity-90">
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-full bg-gradient-dream opacity-50 blur-md" />
                <img
                  src={avatarImg}
                  alt="Hero avatar"
                  className="relative h-10 w-10 rounded-full border-2 border-primary/60 object-cover sm:h-11 sm:w-11"
                />
              </div>
            </NavLink>

            <div className="min-w-0">
              {editName ? (
                <div className="flex items-center gap-1">
                  <Input
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    maxLength={20}
                    className="h-7 w-28 bg-input font-display text-sm"
                    autoFocus
                  />
                  <Button size="sm" onClick={() => { setOperatorName(nameInput); setEditName(false); }} className="h-7 bg-primary px-2 text-primary-foreground">OK</Button>
                </div>
              ) : (
                <button
                  onClick={() => { setNameInput(state.operatorName); setEditName(true); }}
                  className="group flex items-center gap-1.5"
                >
                  <span className="truncate font-display text-sm font-semibold text-foreground sm:text-base">{state.operatorName}</span>
                  <Pencil className="h-3 w-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              )}
              <div className="font-serif text-[11px] text-muted-foreground sm:text-xs">
                Lv. {overall.level} · <span className="text-primary">{rank}</span>
              </div>
            </div>

            <div className="hidden min-w-0 flex-1 items-center gap-3 md:flex">
              <span className="shrink-0 font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">XP</span>
              <div className="relative h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-dream transition-all duration-700"
                  style={{ width: `${overall.pct}%`, boxShadow: "0 0 12px hsl(var(--primary) / 0.6)" }}
                />
              </div>
              <span className="shrink-0 font-serif text-xs text-foreground">
                {overall.into}<span className="text-muted-foreground"> / {overall.needed}</span>
              </span>
            </div>

            <div className="ml-auto flex items-center gap-1.5 md:ml-0">
              <Coins className="h-4 w-4 text-primary" />
              <span className="font-display text-xs font-semibold text-primary sm:text-sm">{coins.toLocaleString()}</span>
            </div>
            <div className="hidden items-center gap-1.5 sm:flex">
              <Zap className="h-4 w-4 text-success" />
              <span className="font-display text-xs font-semibold text-success sm:text-sm">{energy}</span>
            </div>
            <div className="hidden items-center gap-1.5 sm:flex">
              <Flame className="h-4 w-4 text-warning" />
              <span className="font-display text-xs font-semibold text-warning sm:text-sm">{state.streakDays}</span>
            </div>

            <div className="flex shrink-0 items-center gap-0.5">
              <button className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" aria-label="Notifications">
                <Bell className="h-4 w-4" />
              </button>
              <button onClick={resetGame} className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive" title="Reset save">
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 border-t border-border/50 px-3 py-1.5 md:hidden">
            <span className="shrink-0 font-display text-[9px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">XP</span>
            <div className="relative h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
              <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-dream" style={{ width: `${overall.pct}%` }} />
            </div>
            <span className="shrink-0 font-serif text-[11px] text-foreground">
              {overall.into}<span className="text-muted-foreground">/{overall.needed}</span>
            </span>
          </div>
        </header>

        <main className="flex-1 px-3 py-5 sm:px-4 sm:py-6 lg:px-8 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
