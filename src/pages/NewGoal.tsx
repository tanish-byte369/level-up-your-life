import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDreamDeck } from "@/hooks/useDreamDeck";
import { CATEGORIES, CategoryKey, GRADIENTS } from "@/lib/dreamdeck";
import { ArrowLeft, Plus, Trash2, Sparkles } from "lucide-react";

export default function NewGoal() {
  const nav = useNavigate();
  const { addGoal } = useDreamDeck();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<CategoryKey>("career");
  const [gradient, setGradient] = useState("gradient-dream");
  const [deadline, setDeadline] = useState("");
  const [milestones, setMilestones] = useState<string[]>([""]);

  const canSave = title.trim().length > 0;

  const save = () => {
    if (!canSave) return;
    const id = addGoal({
      title: title.trim(),
      description: description.trim(),
      category,
      gradient,
      deadline: deadline || undefined,
      milestones: milestones.filter(m => m.trim()).map(m => ({ title: m.trim() })) as any,
    });
    nav(`/goals/${id}`);
  };

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <button onClick={() => nav(-1)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="card-dream overflow-hidden">
        <div className={`${gradient} p-8 text-white`}>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/25 backdrop-blur-sm text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" /> New dream
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold">Plant a new goal</h1>
          <p className="opacity-90 mt-1">The smallest step begins the biggest journey.</p>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Goal title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Learn to speak Spanish"
              className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary" autoFocus />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Why does this matter?</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
              placeholder="What will be different in your life when you reach this?"
              className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Category</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {CATEGORIES.map(c => (
                <button key={c.key} type="button" onClick={() => setCategory(c.key)}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${category === c.key ? "border-primary bg-primary/5 shadow-dream" : "border-border hover:border-primary/30"}`}>
                  <div className="text-2xl">{c.emoji}</div>
                  <div className="text-xs font-semibold mt-1">{c.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Card color</label>
            <div className="flex gap-3 flex-wrap">
              {GRADIENTS.map(g => (
                <button key={g.key} type="button" onClick={() => setGradient(g.css)}
                  className={`${g.css} h-14 w-20 rounded-xl transition-all ${gradient === g.css ? "ring-4 ring-offset-2 ring-primary scale-110" : "hover:scale-105"}`}>
                  <span className="sr-only">{g.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Target date (optional)</label>
            <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)}
              className="px-4 py-3 rounded-xl bg-muted/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Milestones (break it down)</label>
            <div className="space-y-2">
              {milestones.map((m, i) => (
                <div key={i} className="flex gap-2">
                  <input value={m} onChange={e => {
                    const arr = [...milestones]; arr[i] = e.target.value; setMilestones(arr);
                  }} placeholder={`Step ${i + 1}`}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-muted/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary" />
                  {milestones.length > 1 && (
                    <button type="button" onClick={() => setMilestones(milestones.filter((_, x) => x !== i))}
                      className="p-2.5 rounded-xl hover:bg-destructive/10 text-destructive"><Trash2 className="w-4 h-4" /></button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => setMilestones([...milestones, ""])}
                className="inline-flex items-center gap-1.5 text-sm text-primary font-semibold hover:underline">
                <Plus className="w-4 h-4" /> Add milestone
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button onClick={() => nav(-1)} className="px-5 py-2.5 rounded-xl hover:bg-muted font-semibold">Cancel</button>
            <button onClick={save} disabled={!canSave}
              className="px-6 py-2.5 rounded-xl gradient-dream text-white font-semibold shadow-dream hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100">
              Create goal ✨
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
