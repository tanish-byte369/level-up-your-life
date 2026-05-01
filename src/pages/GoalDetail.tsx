import { useNavigate, useParams, Link } from "react-router-dom";
import { useState } from "react";
import { useDream } from "@/hooks/useDream";
import { CATEGORIES, progressOfGoal } from "@/lib/dream";
import { ArrowLeft, Plus, Trash2, Calendar, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function GoalDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { state, toggleMilestone, addMilestone, deleteGoal, updateGoal } = useDream();
  const goal = state.goals.find(g => g.id === id);
  const [newStep, setNewStep] = useState("");
  const [editingDesc, setEditingDesc] = useState(false);
  const [desc, setDesc] = useState(goal?.description || "");

  if (!goal) return (
    <div className="mx-auto max-w-2xl py-20 text-center">
      <div className="text-5xl">🤔</div>
      <h2 className="mt-3 font-display text-xl font-bold">Goal not found</h2>
      <Link to="/goals" className="mt-4 inline-block text-primary hover:underline">← Back to goals</Link>
    </div>
  );

  const cat = CATEGORIES.find(c => c.key === goal.category)!;
  const prog = progressOfGoal(goal);
  const done = goal.milestones.filter(m => m.done).length;

  return (
    <div className="mx-auto max-w-3xl space-y-5 animate-fade-in">
      <button onClick={() => nav(-1)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      {/* HERO */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8" style={{ background: `linear-gradient(135deg, ${cat.hue}, hsl(265 50% 10%))` }}>
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="relative">
          <Link to={`/category/${cat.key}`} className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-primary-foreground backdrop-blur transition hover:bg-white/25">
            {cat.emoji} {cat.name}
          </Link>
          <div className="mt-3 flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-background/20 text-4xl backdrop-blur">{goal.emoji}</div>
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-2xl font-bold leading-tight text-primary-foreground sm:text-3xl">{goal.title}</h1>
              {goal.targetDate && (
                <div className="mt-1 inline-flex items-center gap-1 text-xs text-primary-foreground/80">
                  <Calendar className="h-3 w-3" /> Target: {goal.targetDate}
                </div>
              )}
            </div>
          </div>
          <div className="mt-5">
            <div className="mb-1 flex items-center justify-between text-xs text-primary-foreground/90">
              <span>{done} of {goal.milestones.length} milestones</span>
              <span className="font-display text-base font-bold">{prog}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-background/25">
              <div className="h-full rounded-full bg-primary-foreground transition-all duration-700" style={{ width: `${prog}%` }} />
            </div>
          </div>
          {goal.completedAt && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-success px-4 py-1.5 text-sm font-bold text-success-foreground">
              🏆 Completed!
            </div>
          )}
        </div>
      </div>

      {/* WHY */}
      <div className="panel rounded-2xl p-5">
        <div className="mb-2 font-display font-bold">Why this matters</div>
        {editingDesc ? (
          <div className="space-y-2">
            <Input value={desc} onChange={e => setDesc(e.target.value)} />
            <div className="flex gap-2">
              <Button size="sm" className="btn-pop" onClick={() => { updateGoal(goal.id, { description: desc }); setEditingDesc(false); }}>Save</Button>
              <Button size="sm" variant="ghost" onClick={() => { setDesc(goal.description); setEditingDesc(false); }}>Cancel</Button>
            </div>
          </div>
        ) : (
          <button onClick={() => setEditingDesc(true)} className="text-left text-sm text-muted-foreground hover:text-foreground">
            {goal.description || <span className="italic">Tap to add your why…</span>}
          </button>
        )}
      </div>

      {/* MILESTONES */}
      <div className="panel rounded-2xl p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="font-display font-bold">Milestones ⚡</div>
          <div className="text-xs text-muted-foreground">tap to crush</div>
        </div>
        <div className="space-y-2">
          {goal.milestones.length === 0 && <div className="text-sm italic text-muted-foreground">No milestones yet — add some below.</div>}
          {goal.milestones.map(m => (
            <button key={m.id} onClick={() => toggleMilestone(goal.id, m.id)} className={`group flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${m.done ? "border-success/40 bg-success/10" : "border-border bg-card hover:border-primary/40"}`}>
              {m.done ? <CheckCircle2 className="h-5 w-5 shrink-0 text-success" /> : <Circle className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-primary" />}
              <span className={`flex-1 text-sm ${m.done ? "text-muted-foreground line-through" : "font-medium"}`}>{m.title}</span>
            </button>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <Input value={newStep} onChange={e => setNewStep(e.target.value)} placeholder="Add a milestone…" onKeyDown={e => { if (e.key === "Enter" && newStep.trim()) { addMilestone(goal.id, newStep.trim()); setNewStep(""); } }} />
          <Button onClick={() => { if (newStep.trim()) { addMilestone(goal.id, newStep.trim()); setNewStep(""); } }} className="btn-pop"><Plus className="h-4 w-4" /></Button>
        </div>
      </div>

      <button onClick={() => { if (confirm("Delete this goal?")) { deleteGoal(goal.id); nav("/goals"); } }} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive">
        <Trash2 className="h-3.5 w-3.5" /> Delete goal
      </button>
    </div>
  );
}
