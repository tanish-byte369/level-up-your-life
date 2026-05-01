import { Link } from "react-router-dom";
import { useState } from "react";
import { useDream } from "@/hooks/useDream";
import { CATEGORIES, CategoryKey } from "@/lib/dream";
import { Heart, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Stories() {
  const { state, toggleLikeStory, addStory } = useDream();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", category: "career" as CategoryKey });

  const sorted = [...state.stories].sort((a, b) => b.likes - a.likes);

  function submit() {
    if (!form.title.trim() || !form.body.trim()) return;
    addStory({
      author: `${state.user.name} ${state.user.emoji}`,
      title: form.title.trim(),
      body: form.body.trim(),
      category: form.category,
    });
    setForm({ title: "", body: "", category: "career" });
    setOpen(false);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5 animate-fade-in">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Success Stories 💬</h1>
          <p className="text-sm text-muted-foreground">Real wins from real dreamers.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="btn-pop gap-2"><Plus className="h-4 w-4" /> Share Yours</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-display">Inspire someone today ✨</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Title — e.g. I finally ran my first 5k" />
              <Textarea value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} placeholder="Tell your story — what changed, what helped, how you feel now…" rows={5} />
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as CategoryKey })} className="w-full rounded-md border border-input bg-input px-3 py-2 text-sm">
                {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.emoji} {c.name}</option>)}
              </select>
              <Button onClick={submit} className="btn-pop w-full">Post story 💬</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3">
        {sorted.map(s => {
          const cat = CATEGORIES.find(c => c.key === s.category)!;
          return (
            <div key={s.id} className="panel glow-hover rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl" style={{ background: `${cat.hue}25`, border: `1px solid ${cat.hue}55` }}>{cat.emoji}</div>
                <div className="min-w-0 flex-1">
                  <Link to={`/stories/${s.id}`} className="block">
                    <div className="font-display text-lg font-bold hover:text-primary">{s.title}</div>
                    <div className="text-xs text-muted-foreground">by {s.author} · {cat.name}</div>
                  </Link>
                </div>
              </div>
              <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{s.body}</p>
              <div className="mt-4 flex items-center justify-between">
                <button onClick={() => toggleLikeStory(s.id)} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition ${s.liked ? "bg-destructive/15 text-destructive" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                  <Heart className={`h-4 w-4 ${s.liked ? "fill-current" : ""}`} /> {s.likes}
                </button>
                <Link to={`/stories/${s.id}`} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">Read <ArrowRight className="h-3 w-3" /></Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
