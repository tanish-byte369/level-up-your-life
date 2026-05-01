import { useDream } from "@/hooks/useDream";
import { Heart, MessageCircle, Sparkles } from "lucide-react";

export default function Partners() {
  const { state, togglePartner } = useDream();
  const matched = state.partners.filter(p => p.matched);
  const others = state.partners.filter(p => !p.matched);

  return (
    <div className="mx-auto max-w-5xl space-y-5 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-bold">Accountability Partners 🤝</h1>
        <p className="text-sm text-muted-foreground">You don't have to do it alone.</p>
      </div>

      {matched.length > 0 && (
        <section>
          <h2 className="mb-2 font-display text-lg font-bold">Your buddies</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {matched.map(p => (
              <div key={p.id} className="panel-glow rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-aurora text-3xl">{p.emoji}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-display text-lg font-bold">{p.name}</div>
                      <span className="rounded-full bg-success/20 px-2 py-0.5 text-[10px] font-bold text-success">MATCHED</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{p.bio}</div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.goals.map(g => <span key={g} className="rounded-full bg-muted px-2 py-0.5 text-xs">{g}</span>)}
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="flex-1 rounded-full bg-gradient-sunset py-2 text-sm font-semibold text-primary-foreground transition hover:shadow-[var(--shadow-pop)]"><MessageCircle className="mr-1 inline h-4 w-4" /> Message</button>
                  <button onClick={() => togglePartner(p.id)} className="rounded-full bg-muted px-4 py-2 text-sm font-semibold transition hover:bg-muted/70">Unmatch</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-2 font-display text-lg font-bold">Find your match ✨</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {others.map(p => (
            <div key={p.id} className="panel glow-hover rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-aurora text-3xl">{p.emoji}</div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Vibe match</div>
                  <div className="font-display text-2xl font-bold text-gradient-sunset">{p.vibe}%</div>
                </div>
              </div>
              <div className="mt-3 font-display text-lg font-bold">{p.name}</div>
              <div className="text-sm text-muted-foreground">{p.bio}</div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.goals.map(g => <span key={g} className="rounded-full bg-muted px-2 py-0.5 text-xs">{g}</span>)}
              </div>
              <button onClick={() => togglePartner(p.id)} className="btn-pop mt-4 w-full py-2 text-sm">
                <Heart className="mr-1 inline h-4 w-4" /> Match
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
