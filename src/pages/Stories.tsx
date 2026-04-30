import { useState } from "react";
import { useDreamDeck } from "@/hooks/useDreamDeck";
import { CATEGORIES, CategoryKey } from "@/lib/dreamdeck";
import { Heart, Plus, X } from "lucide-react";

export default function Stories() {
  const { state, likeStory, addStory } = useDreamDeck();
  const [filter, setFilter] = useState<CategoryKey | "all">("all");
  const [compose, setCompose] = useState(false);
  const [draft, setDraft] = useState({ title: "", body: "", category: "career" as CategoryKey });

  const stories = filter === "all" ? state.stories : state.stories.filter(s => s.category === filter);

  const submit = () => {
    if (!draft.title.trim() || !draft.body.trim()) return;
    addStory({ author: state.userName, avatar: state.userAvatar, title: draft.title.trim(), body: draft.body.trim(), category: draft.category });
    setDraft({ title: "", body: "", category: "career" });
    setCompose(false);
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl md:text-5xl font-bold">Success Stories</h1>
          <p className="text-muted-foreground text-lg mt-1">Real people. Real wins. Real proof.</p>
        </div>
        <button onClick={() => setCompose(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-sunset text-white font-semibold shadow-dream hover:scale-105 transition-transform">
          <Plus className="w-4 h-4" /> Share yours
        </button>
      </header>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-full text-sm font-semibold ${filter === "all" ? "gradient-dream text-white" : "bg-muted"}`}>All</button>
        {CATEGORIES.map(c => (
          <button key={c.key} onClick={() => setFilter(c.key)}
            className={`px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center gap-1.5 ${filter === c.key ? "gradient-sunset text-white" : "bg-muted"}`}>
            {c.emoji} {c.name}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {stories.map(s => {
          const cat = CATEGORIES.find(c => c.key === s.category)!;
          return (
            <article key={s.id} className="card-dream p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full gradient-teal flex items-center justify-center text-lg">{s.avatar}</div>
                <div>
                  <div className="font-semibold text-sm">{s.author}</div>
                  <div className="text-xs text-muted-foreground">{cat.emoji} {cat.name}</div>
                </div>
              </div>
              <h3 className="font-display text-xl font-bold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
              <div className="mt-4 flex items-center justify-between pt-3 border-t border-border">
                <button onClick={() => likeStory(s.id)}
                  className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-colors ${s.liked ? "text-secondary" : "text-muted-foreground hover:text-secondary"}`}>
                  <Heart className={`w-4 h-4 ${s.liked ? "fill-current" : ""}`} /> {s.likes}
                </button>
                <div className="text-xs text-muted-foreground">{new Date(s.createdAt).toLocaleDateString()}</div>
              </div>
            </article>
          );
        })}
      </div>

      {compose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setCompose(false)}>
          <div className="card-dream w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="gradient-sunset p-4 text-white flex items-center justify-between">
              <div className="font-display text-xl font-bold">Share your story</div>
              <button onClick={() => setCompose(false)} className="p-1.5 rounded-lg hover:bg-white/20"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-5 space-y-4">
              <select value={draft.category} onChange={e => setDraft({ ...draft, category: e.target.value as CategoryKey })}
                className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm">
                {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.emoji} {c.name}</option>)}
              </select>
              <input value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })}
                placeholder="Your win, in one line..."
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              <textarea value={draft.body} onChange={e => setDraft({ ...draft, body: e.target.value })} rows={5}
                placeholder="Tell your story. What changed? What helped?"
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
              <button onClick={submit} disabled={!draft.title.trim() || !draft.body.trim()}
                className="w-full px-5 py-3 rounded-xl gradient-dream text-white font-semibold disabled:opacity-50">
                Share story ✨
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
