import { Link, useNavigate, useParams } from "react-router-dom";
import { useDream } from "@/hooks/useDream";
import { CATEGORIES, CategoryKey, progressOfGoal } from "@/lib/dream";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";

export default function CategoryPage() {
  const { key } = useParams();
  const nav = useNavigate();
  const { state } = useDream();
  const cat = CATEGORIES.find(c => c.key === key as CategoryKey);

  if (!cat) return (
    <div className="py-20 text-center">
      <div className="text-5xl">🤔</div>
      <Link to="/" className="mt-4 inline-block text-primary hover:underline">← Home</Link>
    </div>
  );

  const goals = state.goals.filter(g => g.category === cat.key);
  const stories = state.stories.filter(s => s.category === cat.key);
  const vision = state.vision.filter(v => v.category === cat.key);
  const totalMs = goals.reduce((a, g) => a + g.milestones.length, 0);
  const doneMs = goals.reduce((a, g) => a + g.milestones.filter(m => m.done).length, 0);
  const pct = totalMs ? Math.round((doneMs / totalMs) * 100) : 0;

  return (
    <div className="mx-auto max-w-5xl space-y-5 animate-fade-in">
      <button onClick={() => nav(-1)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="relative overflow-hidden rounded-3xl p-8" style={{ background: `linear-gradient(135deg, ${cat.hue}, hsl(265 50% 10%))` }}>
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/15 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="text-6xl">{cat.emoji}</div>
          <div>
            <h1 className="font-display text-3xl font-bold text-primary-foreground">{cat.name}</h1>
            <p className="font-hand text-xl text-primary-foreground/90">{cat.tagline}</p>
          </div>
        </div>
        <div className="relative mt-6 grid grid-cols-3 gap-3">
          <Stat label="Goals" value={goals.length} />
          <Stat label="Done" value={`${doneMs}/${totalMs}`} />
          <Stat label="Progress" value={`${pct}%`} />
        </div>
      </div>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Goals in this category</h2>
          <Link to="/goals" className="text-sm font-semibold text-primary hover:underline">All goals →</Link>
        </div>
        {goals.length === 0 ? (
          <Link to="/goals" className="block rounded-2xl border-2 border-dashed border-primary/40 p-8 text-center transition hover:border-primary hover:bg-primary/5">
            <Plus className="mx-auto h-6 w-6 text-primary" />
            <div className="mt-2 text-sm">Add a {cat.name} goal</div>
          </Link>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {goals.map(g => {
              const p = progressOfGoal(g);
              return (
                <Link key={g.id} to={`/goals/${g.id}`} className="panel glow-hover rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl text-xl" style={{ background: `${cat.hue}20`, border: `1px solid ${cat.hue}55` }}>{g.emoji}</div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-display font-bold">{g.title}</div>
                      <div className="text-xs text-muted-foreground">{g.milestones.filter(m=>m.done).length}/{g.milestones.length} steps · {p}%</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full transition-all" style={{ width: `${p}%`, background: cat.hue }} />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {stories.length > 0 && (
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Inspiration in this category</h2>
            <Link to="/stories" className="text-sm font-semibold text-primary hover:underline">All stories →</Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {stories.slice(0, 4).map(s => (
              <Link key={s.id} to={`/stories/${s.id}`} className="panel glow-hover rounded-2xl p-4">
                <div className="font-display font-bold">{s.title}</div>
                <div className="text-xs text-muted-foreground">by {s.author} · ❤️ {s.likes}</div>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{s.body}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {vision.length > 0 && (
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Pinned to your vision</h2>
            <Link to="/vision" className="text-sm font-semibold text-primary hover:underline">Open board →</Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {vision.map(v => (
              <div key={v.id} className="rounded-xl px-4 py-2 text-sm font-bold" style={{ background: cat.hue + "33", color: cat.hue }}>
                {v.emoji} {v.text}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl bg-background/20 p-3 text-center text-primary-foreground backdrop-blur">
      <div className="font-display text-xl font-bold">{value}</div>
      <div className="text-xs opacity-80">{label}</div>
    </div>
  );
}
