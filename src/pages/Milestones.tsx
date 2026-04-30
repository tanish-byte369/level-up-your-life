import { Link } from "react-router-dom";
import { useDreamDeck } from "@/hooks/useDreamDeck";
import { CATEGORIES } from "@/lib/dreamdeck";
import { Trophy, PartyPopper } from "lucide-react";

export default function Milestones() {
  const { state, celebrate } = useDreamDeck();

  const completed = state.goals.flatMap(g =>
    g.milestones.filter(m => m.done).map(m => ({ m, g }))
  ).sort((a,b) => (b.m.doneAt || 0) - (a.m.doneAt || 0));

  const upcoming = state.goals.flatMap(g =>
    g.milestones.filter(m => !m.done).map(m => ({ m, g }))
  );

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-10">
      <header className="relative overflow-hidden rounded-3xl gradient-gold p-8 md:p-12 text-white shadow-dream">
        <div className="absolute top-4 right-6 text-7xl">🏆</div>
        <h1 className="font-display text-4xl md:text-5xl font-bold">Milestones</h1>
        <p className="opacity-95 text-lg mt-1">{completed.length} conquered · {upcoming.length} ahead</p>
      </header>

      {/* Celebrated goals */}
      {state.celebrations.length > 0 && (
        <section>
          <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-2">
            <PartyPopper className="w-6 h-6 text-secondary" /> Hall of dreams
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {state.celebrations.map(c => (
              <div key={c.id} className="card-dream p-5 flex items-center gap-4 gradient-aurora text-white">
                <div className="text-3xl">🏆</div>
                <div className="flex-1">
                  <div className="font-display font-bold">{c.goalTitle}</div>
                  <div className="text-xs opacity-90">Completed · {new Date(c.at).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Completed milestones timeline */}
      <section>
        <h2 className="font-display text-2xl font-bold mb-4">Recent wins</h2>
        {completed.length === 0 ? (
          <div className="card-dream p-10 text-center">
            <div className="text-5xl mb-3">🌱</div>
            <p className="text-muted-foreground">Your first milestone is waiting — go check one off!</p>
            <Link to="/goals" className="inline-block mt-4 px-5 py-2 rounded-xl gradient-dream text-white font-semibold">Go to goals →</Link>
          </div>
        ) : (
          <div className="space-y-2">
            {completed.map(({ m, g }) => {
              const cat = CATEGORIES.find(c => c.key === g.category)!;
              return (
                <Link key={m.id} to={`/goals/${g.id}`} className="card-dream p-4 flex items-center gap-3 hover:scale-[1.01]">
                  <div className={`${g.gradient} w-10 h-10 rounded-xl flex items-center justify-center shrink-0`}>
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{m.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{cat.emoji} {g.title}</div>
                  </div>
                  <div className="text-xs text-muted-foreground shrink-0">
                    {m.doneAt && new Date(m.doneAt).toLocaleDateString()}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Upcoming */}
      <section>
        <h2 className="font-display text-2xl font-bold mb-4">Next up</h2>
        {upcoming.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing pending. Add milestones to your goals.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-2">
            {upcoming.slice(0, 12).map(({ m, g }) => {
              const cat = CATEGORIES.find(c => c.key === g.category)!;
              return (
                <Link key={m.id} to={`/goals/${g.id}`} className="card-dream p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-border shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{m.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{cat.emoji} {g.title}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
