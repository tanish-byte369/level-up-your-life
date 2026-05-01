import { Link } from "react-router-dom";
import { useState } from "react";
import { useDream } from "@/hooks/useDream";
import { CATEGORIES, CategoryKey, progressOfGoal } from "@/lib/dream";
import { Plus, Filter, Trash2, ArrowRight, Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const EMOJIS = ["🎯","🚀","💪","🧠","💰","💖","🎨","📚","🏃","✈️","🌱","🔥","⭐","🏆","🌈","💡"];

export default function Goals() {
  const { state, addGoal, deleteGoal } = useDream();
  const [filter, setFilter] = useState<CategoryKey | "all">("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", category: "career" as CategoryKey, emoji: "🎯",
    targetDate: "", milestones: ["", "", ""],
  });

  const list = filter === "all" ? state.goals : state.goals.filter(g => g.category === filter);

  function submit() {
    if (!form.title.trim()) return;
    const cat = CATEGORIES.find(c => c.key === form.category)!;
    addGoal({
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      emoji: form.emoji,
      color: cat.hue,
      targetDate: form.targetDate || undefined,
      milestones: form.milestones.filter(m => m.trim()).map((m, i) => ({ id: `m-${Date.now()}-${i}`, title: m.trim(), done: false })),
      xp: 300,
    });
    setOpen(false);
    setForm({ title: "", description: "", category: "career", emoji: "🎯", targetDate: "", milestones: ["", "", ""] });
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5 animate-fade-in">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Your Goals</h1>
          <p className="text-sm text-muted-foreground">Big or small, track them all.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="btn-pop gap-2"><Plus className="h-4 w-4" /> New Goal</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle className="font-display">Create a goal ✨</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Title</label>
                <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Run a half marathon" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Why this matters</label>
                <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What does this goal mean to you?" rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as CategoryKey })} className="mt-1 w-full rounded-md border border-input bg-input px-3 py-2 text-sm">
                    {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.emoji} {c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Target date</label>
                  <Input type="date" value={form.targetDate} onChange={e => setForm({ ...form, targetDate: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Pick an icon</label>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {EMOJIS.map(e => (
                    <button key={e} onClick={() => setForm({ ...form, emoji: e })} className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg transition ${form.emoji===e ? "bg-gradient-sunset shadow-[var(--shadow-pop)]" : "bg-muted hover:bg-muted/70"}`}>{e}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Milestones (steps to get there)</label>
                {form.milestones.map((m, i) => (
                  <Input key={i} value={m} onChange={e => {
                    const nm = [...form.milestones]; nm[i] = e.target.value; setForm({ ...form, milestones: nm });
                  }} placeholder={`Step ${i + 1}`} className="mt-1.5" />
                ))}
                <button onClick={() => setForm({ ...form, milestones: [...form.milestones, ""] })} className="mt-2 text-xs font-semibold text-primary hover:underline">+ Add step</button>
              </div>
              <Button onClick={submit} className="btn-pop w-full">Create dream ✨</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* CATEGORY FILTER */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <Pill active={filter === "all"} onClick={() => setFilter("all")}>All</Pill>
        {CATEGORIES.map(c => (
          <Pill key={c.key} active={filter === c.key} onClick={() => setFilter(c.key)} hue={c.hue}>{c.emoji} {c.name}</Pill>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-primary/40 p-12 text-center">
          <Sparkles className="mx-auto h-10 w-10 text-primary" />
          <div className="mt-3 font-display text-lg font-bold">No goals yet</div>
          <div className="text-sm text-muted-foreground">Tap "New Goal" to start.</div>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map(g => {
            const cat = CATEGORIES.find(c => c.key === g.category)!;
            const prog = progressOfGoal(g);
            return (
              <Link key={g.id} to={`/goals/${g.id}`} className="panel glow-hover relative rounded-2xl p-5">
                <button onClick={(e) => { e.preventDefault(); if (confirm(`Delete "${g.title}"?`)) deleteGoal(g.id); }} className="absolute right-3 top-3 rounded-full p-1.5 text-muted-foreground opacity-0 transition hover:bg-destructive/20 hover:text-destructive group-hover:opacity-100">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl" style={{ background: `${cat.hue}22`, border: `1px solid ${cat.hue}55` }}>{g.emoji}</div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-display font-bold">{g.title}</div>
                    <div className="text-xs text-muted-foreground">{cat.name}</div>
                  </div>
                </div>
                {g.description && <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{g.description}</p>}
                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{g.milestones.filter(m=>m.done).length}/{g.milestones.length} steps</span>
                    <span className="font-display font-bold" style={{ color: cat.hue }}>{prog}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full transition-all" style={{ width: `${prog}%`, background: cat.hue }} />
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  {g.targetDate ? (<span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {g.targetDate}</span>) : <span />}
                  <span className="inline-flex items-center gap-1 font-semibold text-primary">Open <ArrowRight className="h-3 w-3" /></span>
                </div>
                {g.completedAt && <div className="absolute right-3 top-3 rounded-full bg-success/20 px-2 py-0.5 text-[10px] font-bold text-success">✓ DONE</div>}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Pill({ children, active, onClick, hue }: { children: React.ReactNode; active: boolean; onClick: () => void; hue?: string }) {
  return (
    <button onClick={onClick} className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold transition ${active ? "border-transparent bg-gradient-sunset text-primary-foreground shadow-[var(--shadow-pop)]" : "border-border bg-card text-muted-foreground hover:text-foreground"}`} style={active && hue ? { background: hue, color: "hsl(265 50% 10%)" } : undefined}>
      {children}
    </button>
  );
}
