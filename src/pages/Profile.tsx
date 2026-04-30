import { useState } from "react";
import { useDreamDeck } from "@/hooks/useDreamDeck";
import { GOAL_EMOJIS } from "@/lib/dreamdeck";
import { Flame, Trash2 } from "lucide-react";

export default function Profile() {
  const { state, setUserName, setUserAvatar, resetAll } = useDreamDeck();
  const [name, setName] = useState(state.userName);

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto space-y-8">
      <header className="card-dream gradient-aurora p-8 text-white">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center text-4xl">{state.userAvatar}</div>
          <div>
            <div className="font-display text-3xl font-bold">{state.userName}</div>
            <div className="text-sm opacity-90 mt-1 inline-flex items-center gap-1.5"><Flame className="w-4 h-4" /> {state.streak}-day streak</div>
          </div>
        </div>
      </header>

      <section className="card-dream p-6">
        <h2 className="font-display text-xl font-bold mb-4">Your name</h2>
        <div className="flex gap-2">
          <input value={name} onChange={e => setName(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-muted/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary" />
          <button onClick={() => setUserName(name)} className="px-5 rounded-xl gradient-dream text-white font-semibold">Save</button>
        </div>
      </section>

      <section className="card-dream p-6">
        <h2 className="font-display text-xl font-bold mb-4">Pick your avatar</h2>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
          {GOAL_EMOJIS.map(e => (
            <button key={e} onClick={() => setUserAvatar(e)}
              className={`aspect-square rounded-xl text-2xl flex items-center justify-center transition-all ${state.userAvatar === e ? "gradient-dream shadow-dream scale-110" : "bg-muted hover:bg-muted/70"}`}>
              {e}
            </button>
          ))}
        </div>
      </section>

      <section className="card-dream p-6">
        <h2 className="font-display text-xl font-bold mb-2">Your stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <Stat label="Goals" value={state.goals.length} />
          <Stat label="Milestones" value={state.goals.reduce((a,g) => a + g.milestones.filter(m => m.done).length, 0)} />
          <Stat label="Partners" value={state.partners.filter(p => p.matched).length} />
          <Stat label="Wins" value={state.celebrations.length} />
        </div>
      </section>

      <section className="card-dream p-6 border border-destructive/30">
        <h2 className="font-display text-xl font-bold text-destructive mb-2">Danger zone</h2>
        <p className="text-sm text-muted-foreground mb-4">Wipe all goals, partners, and stories.</p>
        <button onClick={resetAll} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-destructive text-destructive-foreground font-semibold">
          <Trash2 className="w-4 h-4" /> Reset DreamDeck
        </button>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="p-4 rounded-xl bg-muted/50 text-center">
      <div className="font-display text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
}
