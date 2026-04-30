import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDreamDeck } from "@/hooks/useDreamDeck";
import { CATEGORIES, CategoryKey, goalProgress } from "@/lib/dreamdeck";
import { GoalCard } from "@/components/GoalCard";
import { Plus, Search } from "lucide-react";

export default function Goals() {
  const { state } = useDreamDeck();
  const [params, setParams] = useSearchParams();
  const activeCat = params.get("category") as CategoryKey | null;
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"newest" | "progress" | "alpha">("newest");

  const goals = useMemo(() => {
    let arr = [...state.goals];
    if (activeCat) arr = arr.filter(g => g.category === activeCat);
    if (q.trim()) {
      const s = q.toLowerCase();
      arr = arr.filter(g => g.title.toLowerCase().includes(s) || g.description.toLowerCase().includes(s));
    }
    if (sort === "progress") arr.sort((a,b) => goalProgress(b) - goalProgress(a));
    else if (sort === "alpha") arr.sort((a,b) => a.title.localeCompare(b.title));
    else arr.sort((a,b) => b.createdAt - a.createdAt);
    return arr;
  }, [state.goals, activeCat, q, sort]);

  const setCat = (c: CategoryKey | null) => {
    if (!c) setParams({});
    else setParams({ category: c });
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold">Your Goals</h1>
          <p className="text-muted-foreground">{goals.length} of {state.goals.length} showing</p>
        </div>
        <Link to="/goals/new" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-dream text-white font-semibold shadow-dream hover:scale-105 transition-transform">
          <Plus className="w-4 h-4" /> New goal
        </Link>
      </header>

      <div className="card-dream p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search goals..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-muted/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
        </div>
        <select value={sort} onChange={e => setSort(e.target.value as any)}
          className="px-3 py-2 rounded-lg bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary">
          <option value="newest">Newest</option>
          <option value="progress">Most progress</option>
          <option value="alpha">A–Z</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setCat(null)}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${!activeCat ? "gradient-dream text-white shadow-dream" : "bg-muted hover:bg-muted/70"}`}>
          All
        </button>
        {CATEGORIES.map(c => (
          <button key={c.key} onClick={() => setCat(c.key)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all inline-flex items-center gap-1.5 ${activeCat === c.key ? "gradient-sunset text-white shadow-dream" : "bg-muted hover:bg-muted/70"}`}>
            <span>{c.emoji}</span> {c.name}
          </button>
        ))}
      </div>

      {goals.length === 0 ? (
        <div className="card-dream p-12 text-center">
          <div className="text-5xl mb-3">🔍</div>
          <h3 className="font-display text-xl font-bold mb-2">No goals here yet</h3>
          <p className="text-muted-foreground mb-4">Start a new one to begin.</p>
          <Link to="/goals/new" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-dream text-white font-semibold">
            <Plus className="w-4 h-4" /> Create a goal
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {goals.map(g => <GoalCard key={g.id} goal={g} />)}
        </div>
      )}
    </div>
  );
}
