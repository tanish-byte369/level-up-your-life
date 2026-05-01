import { Link, useNavigate } from "react-router-dom";
import { useDream } from "@/hooks/useDream";
import { CATEGORIES, levelFromXp, progressOfGoal, rankFromLevel, ACHIEVEMENTS } from "@/lib/dream";
import { ArrowRight, Target, Image as ImageIcon, Users, BookHeart, Trophy, Plus, Sparkles, Flame, Zap } from "lucide-react";
import { useEffect } from "react";

export default function Dashboard() {
  const { state } = useDream();
  const nav = useNavigate();
  const lvl = levelFromXp(state.totalXP);
  const rank = rankFromLevel(lvl.level);
  const activeGoals = state.goals.filter(g => !g.completedAt);
  const completedGoals = state.goals.filter(g => g.completedAt);
  const totalMs = state.goals.reduce((a, g) => a + g.milestones.length, 0);
  const doneMs = state.goals.reduce((a, g) => a + g.milestones.filter(m => m.done).length, 0);

  useEffect(() => {
    document.title = "DreamDeck — Visualize. Track. Achieve.";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Turn your biggest dreams into daily wins with DreamDeck. Vision boards, goal tracking, milestones, and accountability — all in one beautifully addictive app.");
  }, []);

  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-in">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-dream p-6 text-primary-foreground sm:p-10 animate-gradient">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-secondary/30 blur-3xl" />
        <div className="relative">
          <div className="font-hand text-2xl">{greet},</div>
          <h1 className="font-display text-3xl font-bold leading-tight sm:text-5xl">
            Hey {state.user.name} {state.user.emoji}
          </h1>
          <p className="mt-2 max-w-xl text-sm opacity-90 sm:text-base">{state.user.tagline}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button onClick={() => nav("/goals")} className="btn-pop px-5 py-2.5 text-sm">
              <span className="inline-flex items-center gap-2"><Plus className="h-4 w-4" /> New Goal</span>
            </button>
            <button onClick={() => nav("/vision")} className="rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold backdrop-blur transition hover:bg-white/20">
              ✨ Open Vision Board
            </button>
          </div>
        </div>
      </section>

      {/* STAT TILES */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat to="/profile"     icon="⭐"  label="Level"      value={lvl.level} sub={rank} />
        <Stat to="/analytics"   icon="🔥"  label="Streak"     value={state.streak} sub={`day${state.streak===1?"":"s"}`} />
        <Stat to="/goals"       icon="🎯"  label="Active"     value={activeGoals.length} sub="goals" />
        <Stat to="/achievements"icon="🏆"  label="Trophies"   value={state.achievements.length} sub={`/${ACHIEVEMENTS.length}`} />
      </section>

      {/* QUICK NAV */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <QuickCard to="/goals"    icon={Target}     title="Goals"        sub="Track & crush"      gradient="from-primary to-accent" />
        <QuickCard to="/vision"   icon={ImageIcon}  title="Vision Board" sub="Pin your dreams"    gradient="from-tertiary to-secondary" />
        <QuickCard to="/partners" icon={Users}      title="Partners"     sub="Find your buddy"    gradient="from-secondary to-primary" />
        <QuickCard to="/stories"  icon={BookHeart}  title="Stories"      sub="Get inspired"       gradient="from-accent to-tertiary" />
      </section>

      {/* CATEGORIES */}
      <section>
        <Header title="Life Categories" sub="Every dream has a home" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map(c => {
            const goals = state.goals.filter(g => g.category === c.key);
            const totalProg = goals.length ? Math.round(goals.reduce((a, g) => a + progressOfGoal(g), 0) / goals.length) : 0;
            return (
              <Link key={c.key} to={`/category/${c.key}`} className="panel glow-hover rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl" style={{ background: `${c.hue}25`, border: `1px solid ${c.hue}55` }}>
                    {c.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-display font-semibold">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.tagline}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{goals.length} goal{goals.length===1?"":"s"}</span>
                    <span>{totalProg}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full transition-all" style={{ width: `${totalProg}%`, background: c.hue }} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ACTIVE GOALS PREVIEW */}
      <section>
        <Header title="Your Active Goals" sub="Tap to dive in" action={<Link to="/goals" className="text-sm font-semibold text-primary hover:underline">View all →</Link>} />
        {activeGoals.length === 0 ? (
          <Link to="/goals" className="block rounded-2xl border-2 border-dashed border-primary/40 p-10 text-center transition hover:border-primary hover:bg-primary/5">
            <Sparkles className="mx-auto h-8 w-8 text-primary" />
            <div className="mt-2 font-display font-semibold">Plant your first dream</div>
            <div className="text-sm text-muted-foreground">Tap to create a goal</div>
          </Link>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {activeGoals.slice(0, 6).map(g => {
              const cat = CATEGORIES.find(c => c.key === g.category)!;
              const prog = progressOfGoal(g);
              return (
                <Link key={g.id} to={`/goals/${g.id}`} className="panel glow-hover rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl" style={{ background: `${cat.hue}20`, border: `1px solid ${cat.hue}55` }}>
                      {g.emoji}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-display font-semibold">{g.title}</div>
                      <div className="text-xs text-muted-foreground">{g.milestones.filter(m=>m.done).length}/{g.milestones.length} milestones</div>
                    </div>
                    <div className="font-display text-lg font-bold" style={{ color: cat.hue }}>{prog}%</div>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full transition-all" style={{ width: `${prog}%`, background: cat.hue }} />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* STORIES TEASE */}
      <section className="rounded-2xl bg-gradient-aurora p-6 text-secondary-foreground">
        <div className="flex items-center gap-4">
          <div className="text-4xl">💬</div>
          <div className="flex-1">
            <div className="font-display text-lg font-bold">Real people. Real wins.</div>
            <div className="text-sm opacity-90">Stories from dreamers like you — get inspired, share your own.</div>
          </div>
          <Link to="/stories" className="rounded-full bg-background/20 px-4 py-2 text-sm font-semibold backdrop-blur transition hover:bg-background/30">Read →</Link>
        </div>
      </section>
    </div>
  );
}

function Stat({ to, icon, label, value, sub }: { to: string; icon: string; label: string; value: number | string; sub: string }) {
  return (
    <Link to={to} className="panel glow-hover rounded-2xl p-4">
      <div className="text-2xl">{icon}</div>
      <div className="mt-1 font-display text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">{label}</span> · {sub}</div>
    </Link>
  );
}

function QuickCard({ to, icon: Icon, title, sub, gradient }: { to: string; icon: any; title: string; sub: string; gradient: string }) {
  return (
    <Link to={to} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-5 text-primary-foreground transition-transform hover:-translate-y-1 hover:shadow-[var(--shadow-pop)]`}>
      <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/15 blur-2xl" />
      <Icon className="h-6 w-6" />
      <div className="mt-3 font-display text-lg font-bold">{title}</div>
      <div className="text-xs opacity-90">{sub}</div>
    </Link>
  );
}

function Header({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div>
        <h2 className="font-display text-xl font-bold">{title}</h2>
        {sub && <p className="text-sm text-muted-foreground">{sub}</p>}
      </div>
      {action}
    </div>
  );
}
