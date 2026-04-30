import { useState } from "react";
import { useDreamDeck } from "@/hooks/useDreamDeck";
import { CATEGORIES, CategoryKey } from "@/lib/dreamdeck";
import { Check, Flame, MessageCircle, UserPlus, X } from "lucide-react";

export default function Partners() {
  const { state, matchPartner, unmatchPartner } = useDreamDeck();
  const [filter, setFilter] = useState<CategoryKey | "all">("all");
  const [chatWith, setChatWith] = useState<string | null>(null);

  const partners = filter === "all" ? state.partners : state.partners.filter(p => p.focus === filter);
  const partner = state.partners.find(p => p.id === chatWith);

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <header>
        <h1 className="font-display text-4xl md:text-5xl font-bold">Accountability Partners</h1>
        <p className="text-muted-foreground text-lg mt-1">Find your tribe. Progress together.</p>
      </header>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-full text-sm font-semibold ${filter === "all" ? "gradient-dream text-white" : "bg-muted"}`}>
          All
        </button>
        {CATEGORIES.map(c => (
          <button key={c.key} onClick={() => setFilter(c.key)}
            className={`px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center gap-1.5 ${filter === c.key ? "gradient-sunset text-white" : "bg-muted"}`}>
            {c.emoji} {c.name}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {partners.map(p => {
          const cat = CATEGORIES.find(c => c.key === p.focus)!;
          return (
            <div key={p.id} className="card-dream p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl gradient-aurora flex items-center justify-center text-3xl shadow-dream">{p.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-display text-lg font-bold">{p.name}</div>
                  <div className="text-xs font-semibold mt-0.5 inline-flex items-center gap-1" style={{ color: `hsl(var(--${cat.color}))` }}>
                    {cat.emoji} {cat.name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 inline-flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-secondary" /> {p.streak}-day streak
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-3">{p.bio}</p>
              <div className="flex gap-2 mt-4">
                {p.matched ? (
                  <>
                    <button onClick={() => setChatWith(p.id)}
                      className="flex-1 px-4 py-2 rounded-xl gradient-dream text-white font-semibold text-sm inline-flex items-center justify-center gap-1.5">
                      <MessageCircle className="w-4 h-4" /> Message
                    </button>
                    <button onClick={() => unmatchPartner(p.id)}
                      className="px-3 py-2 rounded-xl bg-muted hover:bg-destructive/10 hover:text-destructive text-sm">
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button onClick={() => matchPartner(p.id)}
                    className="flex-1 px-4 py-2 rounded-xl gradient-sunset text-white font-semibold text-sm inline-flex items-center justify-center gap-1.5">
                    <UserPlus className="w-4 h-4" /> Match
                  </button>
                )}
              </div>
              {p.matched && <div className="mt-3 text-xs text-accent font-semibold inline-flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Matched</div>}
            </div>
          );
        })}
      </div>

      {/* chat modal */}
      {partner && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setChatWith(null)}>
          <div className="card-dream w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="gradient-dream p-4 text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/25 flex items-center justify-center text-xl">{partner.avatar}</div>
              <div className="flex-1">
                <div className="font-bold">{partner.name}</div>
                <div className="text-xs opacity-90">Accountability buddy</div>
              </div>
              <button onClick={() => setChatWith(null)} className="p-1.5 rounded-lg hover:bg-white/20"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-5 space-y-3 min-h-[240px]">
              <div className="flex gap-2"><div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">{partner.avatar}</div>
                <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-2 text-sm">Hey! How's your goal going this week?</div>
              </div>
              <div className="flex gap-2 justify-end"><div className="gradient-dream text-white rounded-2xl rounded-tr-sm px-4 py-2 text-sm">Pretty good — knocked out 2 milestones 🎯</div></div>
              <div className="flex gap-2"><div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">{partner.avatar}</div>
                <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-2 text-sm">🔥 Let's go! Proud of you.</div>
              </div>
            </div>
            <form className="p-3 border-t border-border flex gap-2" onSubmit={e => { e.preventDefault(); alert("Message sent! (demo)"); }}>
              <input placeholder="Send encouragement..." className="flex-1 px-3 py-2 rounded-xl bg-muted/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
              <button type="submit" className="px-4 py-2 rounded-xl gradient-dream text-white font-semibold text-sm">Send</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
