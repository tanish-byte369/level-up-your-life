import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDreamDeck } from "@/hooks/useDreamDeck";
import { CATEGORIES, goalProgress } from "@/lib/dreamdeck";
import { Celebration } from "@/components/Celebration";
import { ArrowLeft, Calendar, Check, Plus, Trash2, Users, Target, PartyPopper, Edit3 } from "lucide-react";

export default function GoalDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { state, toggleMilestone, addMilestone, deleteMilestone, deleteGoal, celebrate, updateGoal, matchPartner } = useDreamDeck();
  const goal = state.goals.find(g => g.id === id);
  const [newMs, setNewMs] = useState("");
  const [celebMsg, setCelebMsg] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(goal?.title || "");

  if (!goal) {
    return (
      <div className="p-10 text-center">
        <h1 className="font-display text-3xl mb-2">Goal not found</h1>
        <Link to="/goals" className="text-primary font-semibold">← Back to goals</Link>
      </div>
    );
  }

  const cat = CATEGORIES.find(c => c.key === goal.category)!;
  const progress = goalProgress(goal);
  const done = goal.milestones.filter(m => m.done).length;
  const partner = state.partners.find(p => p.id === goal.partnerId);

  const handleToggle = (msId: string) => {
    const result = toggleMilestone(goal.id, msId);
    if (result?.done) {
      setCelebMsg(`Milestone conquered: ${result.title}`);
      // Check if goal now complete
      const allDone = goal.milestones.every(m => m.id === msId ? true : m.done);
      if (allDone && !goal.celebrated) {
        setTimeout(() => {
          celebrate(goal.id);
          setCelebMsg(`🏆 GOAL COMPLETE: ${goal.title}`);
        }, 500);
      }
    }
  };

  const handleAddMs = () => {
    if (!newMs.trim()) return;
    addMilestone(goal.id, newMs.trim());
    setNewMs("");
  };

  const handleDelete = () => {
    if (confirm(`Delete "${goal.title}"? This cannot be undone.`)) {
      deleteGoal(goal.id);
      nav("/goals");
    }
  };

  const saveTitle = () => {
    if (titleDraft.trim()) updateGoal(goal.id, { title: titleDraft.trim() });
    setEditingTitle(false);
  };

  return (
    <>
      <Celebration show={!!celebMsg} title={celebMsg || ""} message="Every step brings you closer." onClose={() => setCelebMsg(null)} />

      <div className="max-w-4xl mx-auto p-6 md:p-10">
        <button onClick={() => nav(-1)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="card-dream overflow-hidden">
          <div className={`${goal.gradient} p-8 md:p-12 text-white relative`}>
            <div className="absolute top-6 right-6 text-6xl drop-shadow-2xl">{cat.emoji}</div>
            <Link to={`/goals?category=${cat.key}`} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/25 backdrop-blur-sm text-xs font-semibold mb-3 hover:bg-white/40">
              {cat.name}
            </Link>
            {editingTitle ? (
              <div className="flex gap-2 max-w-2xl">
                <input value={titleDraft} onChange={e => setTitleDraft(e.target.value)} autoFocus
                  className="flex-1 px-4 py-2 rounded-lg bg-white/90 text-foreground font-display text-2xl" />
                <button onClick={saveTitle} className="px-4 py-2 rounded-lg bg-white text-primary font-semibold">Save</button>
              </div>
            ) : (
              <h1 className="font-display text-3xl md:text-5xl font-bold leading-tight flex items-start gap-3">
                {goal.title}
                <button onClick={() => { setEditingTitle(true); setTitleDraft(goal.title); }}
                  className="opacity-70 hover:opacity-100 mt-2"><Edit3 className="w-5 h-5" /></button>
              </h1>
            )}
            {goal.description && <p className="text-lg opacity-95 mt-3 max-w-2xl">{goal.description}</p>}

            <div className="mt-6 max-w-md">
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span>{done}/{goal.milestones.length} milestones</span>
                <span>{progress}%</span>
              </div>
              <div className="h-3 bg-white/25 rounded-full overflow-hidden">
                <div className="h-full bg-white transition-all duration-700" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            {/* Quick actions */}
            <div className="flex flex-wrap gap-2">
              {goal.deadline && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-sm">
                  <Calendar className="w-4 h-4" /> Target: {goal.deadline}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-sm">
                <Target className="w-4 h-4" /> {cat.tagline}
              </span>
              {progress === 100 && !goal.celebrated && (
                <button onClick={() => { celebrate(goal.id); setCelebMsg(`🏆 Celebrating: ${goal.title}`); }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full gradient-gold text-white font-semibold text-sm">
                  <PartyPopper className="w-4 h-4" /> Celebrate!
                </button>
              )}
            </div>

            {/* Partner */}
            <div className="card-dream p-4 border border-border">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl gradient-teal flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Accountability Partner</div>
                    {partner ? (
                      <div className="text-sm text-muted-foreground">{partner.avatar} {partner.name} — cheering you on</div>
                    ) : (
                      <div className="text-sm text-muted-foreground">Share this goal with a buddy</div>
                    )}
                  </div>
                </div>
                {partner ? (
                  <button onClick={() => updateGoal(goal.id, { partnerId: undefined })} className="text-xs text-destructive hover:underline">Remove</button>
                ) : (
                  <Link to="/partners" className="px-4 py-2 rounded-lg gradient-dream text-white text-sm font-semibold">Find one</Link>
                )}
              </div>
            </div>

            {/* Milestones */}
            <div>
              <h2 className="font-display text-2xl font-bold mb-3">Milestones</h2>
              <div className="space-y-2">
                {goal.milestones.map(m => (
                  <div key={m.id} className={`card-dream p-4 flex items-center gap-3 group ${m.done ? "opacity-80" : ""}`}>
                    <button onClick={() => handleToggle(m.id)}
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                        m.done ? "gradient-dream border-transparent" : "border-border hover:border-primary"
                      }`}>
                      {m.done && <Check className="w-4 h-4 text-white" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium ${m.done ? "line-through text-muted-foreground" : ""}`}>{m.title}</div>
                      {m.done && m.doneAt && <div className="text-xs text-muted-foreground">Done {new Date(m.doneAt).toLocaleDateString()}</div>}
                    </div>
                    <button onClick={() => deleteMilestone(goal.id, m.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input value={newMs} onChange={e => setNewMs(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleAddMs()}
                    placeholder="Add a new milestone..."
                    className="flex-1 px-4 py-3 rounded-xl bg-muted/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary" />
                  <button onClick={handleAddMs} className="px-5 rounded-xl gradient-dream text-white font-semibold inline-flex items-center gap-1">
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-border">
              <button onClick={handleDelete} className="text-sm text-destructive hover:underline inline-flex items-center gap-1">
                <Trash2 className="w-4 h-4" /> Delete goal
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
