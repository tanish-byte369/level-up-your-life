import { useMemo } from "react";
import { useDreamDeck } from "@/hooks/useDreamDeck";
import { CATEGORIES, goalProgress } from "@/lib/dreamdeck";
import { TrendingUp, Target, Trophy, Flame, Calendar } from "lucide-react";

export default function Analytics() {
  const { state } = useDreamDeck();

  const data = useMemo(() => {
    const byCat = CATEGORIES.map(c => {
      const goals = state.goals.filter(g => g.category === c.key);
      const mCount = goals.reduce((a, g) => a + g.milestones.length, 0);
      const mDone = goals.reduce((a, g) => a + g.milestones.filter(m => m.done).length, 0);
      return { cat: c, goalCount: goals.length, mDone, mCount, pct: mCount ? Math.round((mDone / mCount) * 100) : 0 };
    });

    // last 14 days activity
    const days: { date: string; label: string; count: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
      let count = 0;
      state.goals.forEach(g => g.milestones.forEach(m => {
        if (m.done && m.doneAt) {
          const md = new Date(m.doneAt);
          const mkey = `${md.getFullYear()}-${String(md.getMonth()+1).padStart(2,"0")}-${String(md.getDate()).padStart(2,"0")}`;
          if (mkey === key) count++;
        }
      }));
      days.push({ date: key, label: d.toLocaleDateString("en", { weekday: "short" })[0], count });
    }
    const maxDay = Math.max(1, ...days.map(d => d.count));

    const allMs = state.goals.reduce((a, g) => a + g.milestones.length, 0);
    const doneMs = state.goals.reduce((a, g) => a + g.milestones.filter(m => m.done).length, 0);
    const overall = allMs ? Math.round((doneMs / allMs) * 100) : 0;

    return { byCat, days, maxDay, overall, doneMs, allMs };
  }, [state.goals]);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
      <header>
        <h1 className="font-display text-4xl md:text-5xl font-bold">Analytics</h1>
        <p className="text-muted-foreground text-lg mt-1">Your momentum, visualized.</p>
      </header>

      {/* Top stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Overall progress", value: `${data.overall}%`, icon: TrendingUp, grad: "gradient-dream" },
          { label: "Active goals", value: state.goals.length, icon: Target, grad: "gradient-sunset" },
          { label: "Milestones hit", value: data.doneMs, icon: Trophy, grad: "gradient-gold" },
          { label: "Current streak", value: `${state.streak}d`, icon: Flame, grad: "gradient-teal" },
        ].map(s => (
          <div key={s.label} className="card-dream p-5">
            <div className={`${s.grad} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <div className="font-display text-3xl font-bold">{s.value}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{s.label}</div>
          </div>
        ))}
      </section>

      {/* Category bars */}
      <section className="card-dream p-6 md:p-8">
        <h2 className="font-display text-2xl font-bold mb-5">Progress by category</h2>
        <div className="space-y-4">
          {data.byCat.filter(c => c.goalCount > 0).map(c => (
            <div key={c.cat.key}>
              <div className="flex justify-between text-sm font-semibold mb-1.5">
                <span className="inline-flex items-center gap-2">{c.cat.emoji} {c.cat.name}</span>
                <span className="text-muted-foreground">{c.mDone}/{c.mCount} · {c.pct}%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{
                  width: `${c.pct}%`,
                  background: `hsl(var(--${c.cat.color}))`,
                }} />
              </div>
            </div>
          ))}
          {data.byCat.every(c => c.goalCount === 0) && (
            <p className="text-sm text-muted-foreground text-center py-6">No goals yet — create one to see your charts come alive.</p>
          )}
        </div>
      </section>

      {/* Activity heatmap-lite */}
      <section className="card-dream p-6 md:p-8">
        <div className="flex items-center gap-2 mb-5">
          <Calendar className="w-5 h-5 text-primary" />
          <h2 className="font-display text-2xl font-bold">Last 14 days</h2>
        </div>
        <div className="flex items-end gap-2 h-40">
          {data.days.map((d, i) => {
            const h = (d.count / data.maxDay) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="flex-1 w-full flex items-end">
                  <div className={`w-full rounded-t-lg transition-all ${d.count > 0 ? "gradient-aurora" : "bg-muted"}`}
                    style={{ height: `${Math.max(4, h)}%` }}
                    title={`${d.date}: ${d.count} milestone${d.count !== 1 ? "s" : ""}`} />
                </div>
                <div className="text-[10px] text-muted-foreground font-semibold">{d.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Donut progress per goal */}
      <section className="card-dream p-6 md:p-8">
        <h2 className="font-display text-2xl font-bold mb-5">Goal completion</h2>
        {state.goals.length === 0 ? (
          <p className="text-sm text-muted-foreground">No goals yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {state.goals.map(g => {
              const p = goalProgress(g);
              const cat = CATEGORIES.find(c => c.key === g.category)!;
              const circ = 2 * Math.PI * 34;
              return (
                <div key={g.id} className="text-center">
                  <div className="relative inline-block">
                    <svg width="90" height="90" viewBox="0 0 80 80" className="-rotate-90">
                      <circle cx="40" cy="40" r="34" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                      <circle cx="40" cy="40" r="34" fill="none" stroke={`hsl(var(--${cat.color}))`} strokeWidth="8"
                        strokeDasharray={circ} strokeDashoffset={circ - (circ * p / 100)} strokeLinecap="round"
                        style={{ transition: "stroke-dashoffset 0.8s ease" }} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center font-display font-bold">{p}%</div>
                  </div>
                  <div className="font-semibold text-sm mt-2 truncate">{g.title}</div>
                  <div className="text-xs text-muted-foreground">{cat.emoji} {cat.name}</div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
