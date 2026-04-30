import { Link } from "react-router-dom";
import { useDreamDeck } from "@/hooks/useDreamDeck";
import { CATEGORIES, VISION_TEMPLATES, goalProgress } from "@/lib/dreamdeck";
import { Plus, Sparkles } from "lucide-react";

export default function VisionBoard() {
  const { state, addGoal } = useDreamDeck();

  const applyTemplate = (tplId: string) => {
    const tpl = VISION_TEMPLATES.find(t => t.id === tplId);
    if (!tpl) return;
    if (!confirm(`Add ${tpl.items} starter goals from "${tpl.name}"?`)) return;
    const seeds: { title: string; category: any; gradient: string }[] = {
      "tpl-dream-year": Array.from({ length: 12 }, (_, i) => ({
        title: `${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i]} milestone`,
        category: ["career","health","learning","finance","creative","relationships","wellness","adventure"][i % 8],
        gradient: ["gradient-sunset","gradient-dream","gradient-teal","gradient-gold","gradient-aurora"][i % 5],
      })),
      "tpl-summer": ["Travel somewhere new","Read 6 books","Learn a new skill","Get in best shape","Start a creative project","Deepen a friendship"]
        .map((t,i) => ({ title: t, category: ["adventure","learning","career","health","creative","relationships"][i], gradient: "gradient-sunset" })),
      "tpl-five": ["Body pillar","Mind pillar","Heart pillar","Craft pillar","Wealth pillar"]
        .map((t,i) => ({ title: t, category: ["health","learning","relationships","creative","finance"][i], gradient: "gradient-dream" })),
      "tpl-bucket": ["See the Northern Lights","Write a book","Learn to surf","Visit 5 new countries","Run a race","Take a solo trip","Master a recipe","Attend a dream concert"]
        .map((t,i) => ({ title: t, category: ["adventure","creative","adventure","adventure","health","adventure","creative","adventure"][i], gradient: "gradient-aurora" })),
      "tpl-career": ["Level up skill","Build portfolio","Network with 20 people","Land interview","Grow income","Start side project"]
        .map((t,i) => ({ title: t, category: "career" as const, gradient: "gradient-dream" })),
      "tpl-wellness": ["Daily meditation","Better sleep routine","Joyful movement","Digital detox","Gratitude practice","Nature time"]
        .map((t,i) => ({ title: t, category: "wellness" as const, gradient: "gradient-teal" })),
    }[tplId] || [];
    seeds.forEach(s => addGoal({ title: s.title, description: "", category: s.category, gradient: s.gradient }));
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
      <header>
        <h1 className="font-display text-4xl md:text-5xl font-bold">Vision Board</h1>
        <p className="text-muted-foreground text-lg mt-1">Your dreams, laid out in color.</p>
      </header>

      {/* Templates */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="font-display text-2xl font-bold">Start from a template</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {VISION_TEMPLATES.map(t => (
            <button key={t.id} onClick={() => applyTemplate(t.id)}
              className="card-dream p-6 text-left hover:scale-[1.02]">
              <div className="text-4xl mb-3">{t.emoji}</div>
              <div className="font-display text-xl font-bold">{t.name}</div>
              <div className="text-sm text-muted-foreground mt-1">{t.desc}</div>
              <div className="mt-4 text-xs font-semibold text-primary">{t.items} goals →</div>
            </button>
          ))}
        </div>
      </section>

      {/* Mosaic */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <h2 className="font-display text-2xl font-bold">Your mosaic</h2>
          <Link to="/goals/new" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
            <Plus className="w-4 h-4" /> Add tile
          </Link>
        </div>
        {state.goals.length === 0 ? (
          <div className="card-dream p-12 text-center">
            <div className="text-5xl mb-3">🖼️</div>
            <h3 className="font-display text-xl font-bold mb-2">Your board is empty</h3>
            <p className="text-muted-foreground mb-4">Start with a template above, or add your own tile.</p>
            <Link to="/goals/new" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-dream text-white font-semibold">
              <Plus className="w-4 h-4" /> Create tile
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-[160px]">
            {state.goals.map((g, i) => {
              const cat = CATEGORIES.find(c => c.key === g.category)!;
              const progress = goalProgress(g);
              const big = i % 7 === 0;
              return (
                <Link key={g.id} to={`/goals/${g.id}`}
                  className={`${g.gradient} rounded-2xl p-4 text-white relative overflow-hidden group ${big ? "md:col-span-2 md:row-span-2" : ""}`}>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                  <div className="absolute top-3 right-3 text-2xl drop-shadow">{cat.emoji}</div>
                  <div className="relative h-full flex flex-col justify-end">
                    <div className="text-[10px] uppercase tracking-widest opacity-80">{cat.name}</div>
                    <div className={`font-display font-bold leading-tight ${big ? "text-2xl md:text-3xl" : "text-base"}`}>{g.title}</div>
                    <div className="mt-2 h-1.5 bg-white/25 rounded-full overflow-hidden">
                      <div className="h-full bg-white" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="text-xs font-semibold mt-1">{progress}%</div>
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
