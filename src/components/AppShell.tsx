import { ReactNode, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useDreamDeck } from "@/hooks/useDreamDeck";
import {
  LayoutDashboard, Target, Image, BarChart3, Users, Sparkles, Trophy,
  BookHeart, User, Menu, X, Plus, Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/goals", label: "Goals", icon: Target },
  { to: "/vision-board", label: "Vision Board", icon: Image },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/milestones", label: "Milestones", icon: Trophy },
  { to: "/partners", label: "Partners", icon: Users },
  { to: "/stories", label: "Stories", icon: BookHeart },
  { to: "/motivation", label: "Motivation", icon: Sparkles },
  { to: "/profile", label: "Profile", icon: User },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { state } = useDreamDeck();
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  return (
    <div className="min-h-screen flex w-full">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-sidebar sticky top-0 h-screen">
        <Link to="/" className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl gradient-aurora flex items-center justify-center text-xl shadow-glow">✨</div>
            <div>
              <div className="font-display text-xl font-bold leading-none">DreamDeck</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Build your life</div>
            </div>
          </div>
        </Link>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV.map(n => (
            <NavLink key={n.to} to={n.to} end={n.to === "/"}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "gradient-dream text-white shadow-dream"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              )}>
              <n.icon className="w-4 h-4" />
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <Link to="/profile" className="flex items-center gap-3 p-2 rounded-xl hover:bg-sidebar-accent transition-colors">
            <div className="w-10 h-10 rounded-full gradient-sunset flex items-center justify-center text-xl">{state.userAvatar}</div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate">{state.userName}</div>
              <div className="text-xs text-muted-foreground">🔥 {state.streak}-day streak</div>
            </div>
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="flex items-center justify-between px-4 h-14">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-aurora flex items-center justify-center text-sm">✨</div>
              <span className="font-display text-lg font-bold">DreamDeck</span>
            </Link>
            <button onClick={() => setOpen(true)} className="p-2 rounded-lg hover:bg-muted">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Mobile drawer */}
        {open && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-72 bg-sidebar border-l border-sidebar-border p-4 animate-bounce-in">
              <div className="flex justify-between items-center mb-6">
                <span className="font-display text-xl font-bold">Menu</span>
                <button onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-muted"><X className="w-5 h-5" /></button>
              </div>
              <nav className="space-y-1">
                {NAV.map(n => (
                  <NavLink key={n.to} to={n.to} end={n.to === "/"} onClick={() => setOpen(false)}
                    className={({ isActive }) => cn(
                      "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all",
                      isActive ? "gradient-dream text-white" : "hover:bg-sidebar-accent"
                    )}>
                    <n.icon className="w-4 h-4" /> {n.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        )}

        <main className="flex-1">{children}</main>
      </div>

      {/* Floating new-goal button */}
      <Link to="/goals/new" className={cn(
        "fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full gradient-sunset text-white shadow-dream flex items-center justify-center hover:scale-110 transition-transform animate-pulse-glow",
        loc.pathname === "/goals/new" && "hidden"
      )} aria-label="New goal">
        <Plus className="w-6 h-6" />
      </Link>
    </div>
  );
}
