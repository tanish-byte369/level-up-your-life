import { useDream } from "@/hooks/useDream";
import { CATEGORIES, levelFromXp, progressOfGoal, todayKey } from "@/lib/dream";
import { Flame, TrendingUp, Target, Trophy } from "lucide-react";

export default function Analytics() {
  const { state } = useDream();
  const lvl = levelFromXp(state.totalXP);
  const last14 = (() => {
    const arr: { date: string; xp: number; label: string }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const found = state.daily.find(x => x.date === k);
      arr.push({ date: k, xp: found?.xp || 0, label: d.toLocaleDateString(undefined, { weekday: "short" })[0] });
    }
    return arr;
  })();
  const maxXp = Math.max(10, ...last14.map(d => d.xp));

  // category breakdown
  const catData = CATEGORIES.map(c => {
    const goals = state.goals.filter(g => g.category === c.key);
    const totalMs = goals.reduce((a, g) => a + g.milestones.length, 0);
    const doneMs = goals.reduce((a, g) => a + g.milestones.filter(m => m.done).length, 0);
    return { ...c, goals: goals.length, completed: goals.filter(g => g.completedAt).length, pct: totalMs ? Math.round((doneMs / totalMs) * 100) : 0 };
  });
  const maxGoals = Math.max(1, ...catData.map(c => c.goals));

  const totalDone = state.goals.filter(g => g.completedAt).length;
  const totalMs = state.goals.reduce((a, g) => a + g.milestones.length, 0);
  const doneMs = state.goals.reduce((a, g) => a + g.milestones.filter(m => m.done).length, 0);
  const overallPct = totalMs ? Math.round((doneMs / totalMs) * 100) : 0;

  return (
    <div className="mx-auto max-w-6xl space-y-5 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-bold">Your Analytics 📈</h1>
        <p className="text-sm text-muted-foreground">Watch your patterns. See your power.</p>
      </div>

      {/* TOP STATS */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <BigStat icon={<Flame className="h-5 w-5" />} label="Streak" value={`${state.streak}d`} grad="from-primary to-accent" />
        <BigStat icon={<TrendingUp className="h-5 w-5" />} label="Total XP" value={state.totalXP.toLocaleString()} grad="from-tertiary to-secondary" />
        <BigStat icon={<Target className="h-5 w-5" />} label="Milestones" value={`${doneMs}/${totalMs}`} grad="from-secondary to-primary" />
        <BigStat icon={<Trophy className="h-5 w-5" />} label="Dreams Won" value={totalDone} grad="from-accent to-tertiary" />
      </section>

      {/* XP BAR CHART */}
      <section className="panel rounded-2xl p-5">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <div className="font-display text-lg font-bold">Last 14 days</div>
            <div className="text-xs text-muted-foreground">XP earned per day</div>
          </div>
          <div className="font-display text-2xl font-bold text-gradient-sunset">{last14.reduce((a, d) => a + d.xp, 0)} XP</div>
        </div>
        <div className="flex h-44 items-end gap-1.5">
          {last14.map((d, i) => (
            <div key={i} className="group flex flex-1 flex-col items-center gap-1">
              <div className="relative w-full flex-1 overflow-hidden rounded-t-lg bg-muted/60">
                <div
                  className="absolute inset-x-0 bottom-0 rounded-t-lg bg-gradient-to-t from-primary to-accent transition-all duration-700"
                  style={{ height: `${(d.xp / maxXp) * 100}%` }}
                />
                {d.xp > 0 && (
                  <div className="absolute inset-x-0 -top-5 text-center text-[10px] font-bold opacity-0 transition group-hover:opacity-100">{d.xp}</div>
                )}
              </div>
              <div className={`text-[10px] ${d.date === todayKey() ? "font-bold text-primary" : "text-muted-foreground"}`}>{d.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORY BREAKDOWN */}
      <section className="panel rounded-2xl p-5">
        <div className="mb-4">
          <div className="font-display text-lg font-bold">By category</div>
          <div className="text-xs text-muted-foreground">Where your energy flows</div>
        </div>
        <div className="space-y-3">
          {catData.map(c => (
            <div key={c.key}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium"><span className="mr-1.5">{c.emoji}</span>{c.name}</span>
                <span className="text-xs text-muted-foreground">{c.goals} goals · {c.pct}%</span>
              </div>
              <div className="flex gap-1.5">
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(c.goals / maxGoals) * 100}%`, background: c.hue }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* OVERALL DONUT */}
      <section className="panel rounded-2xl p-5">
        <div className="mb-4 font-display text-lg font-bold">Overall progress</div>
        <div className="flex items-center justify-center gap-6">
          <div className="relative h-40 w-40">
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="url(#g1)" strokeWidth="10" strokeLinecap="round"
                strokeDasharray={`${(overallPct / 100) * 264} 264`} />
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="hsl(18 95% 60%)" />
                  <stop offset="50%" stopColor="hsl(45 100% 60%)" />
                  <stop offset="100%" stopColor="hsl(175 80% 55%)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="font-display text-3xl font-bold text-gradient-sunset">{overallPct}%</div>
              <div className="text-xs text-muted-foreground">complete</div>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div>🎯 <b>{state.goals.length}</b> goals</div>
            <div>⚡ <b>{doneMs}</b> milestones hit</div>
            <div>🏆 <b>{totalDone}</b> dreams achieved</div>
            <div>⭐ Level <b>{lvl.level}</b></div>
          </div>
        </div>
      </section>
    </div>
  );
}

function BigStat({ icon, label, value, grad }: any) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${grad} p-4 text-primary-foreground shadow-[var(--shadow-card)]`}>
      <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/15 blur-2xl" />
      <div>{icon}</div>
      <div className="mt-2 font-display text-2xl font-bold">{value}</div>
      <div className="text-xs opacity-90">{label}</div>
    </div>
  );
}
