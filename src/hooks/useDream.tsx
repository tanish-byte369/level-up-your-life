import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { AppState, CategoryKey, Goal, Milestone, VisionItem, Story, freshState, todayKey, ACHIEVEMENTS, levelFromXp } from "@/lib/dream";
import { toast } from "sonner";

const KEY = "dreamdeck-save-v1";

function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return freshState();
    const parsed = JSON.parse(raw) as AppState;
    if (!parsed.version) return freshState();
    return parsed;
  } catch { return freshState(); }
}

interface Ctx {
  state: AppState;
  setName: (name: string) => void;
  setEmoji: (emoji: string) => void;
  setTagline: (t: string) => void;
  addGoal: (g: Omit<Goal, "id" | "createdAt">) => string;
  updateGoal: (id: string, patch: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  addMilestone: (goalId: string, title: string) => void;
  addVisionItem: (v: Omit<VisionItem, "id">) => void;
  removeVisionItem: (id: string) => void;
  moveVisionItem: (id: string, x: number, y: number) => void;
  applyTemplate: (items: { text: string; emoji: string; category: CategoryKey }[]) => void;
  toggleLikeStory: (id: string) => void;
  addStory: (s: Omit<Story, "id" | "createdAt" | "likes" | "liked">) => void;
  togglePartner: (id: string) => void;
  reset: () => void;
  triggerCelebration: (msg: string, emoji?: string) => void;
  celebration: { msg: string; emoji: string; key: number } | null;
  clearCelebration: () => void;
}

const DreamCtx = createContext<Ctx | null>(null);

export function DreamProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => load());
  const [celebration, setCelebration] = useState<Ctx["celebration"]>(null);

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(state)); }, [state]);

  const triggerCelebration = useCallback((msg: string, emoji = "🎉") => {
    setCelebration({ msg, emoji, key: Date.now() });
  }, []);
  const clearCelebration = useCallback(() => setCelebration(null), []);

  const checkAchievements = useCallback((s: AppState): AppState => {
    const unlocked = new Set(s.achievements);
    const totalDoneMilestones = s.goals.reduce((acc, g) => acc + g.milestones.filter(m => m.done).length, 0);
    const completedGoals = s.goals.filter(g => g.completedAt).length;
    const lvl = levelFromXp(s.totalXP).level;

    const conditions: Record<string, boolean> = {
      "first-step": s.goals.length >= 1,
      "dreamer": s.vision.length >= 5,
      "milestone-5": totalDoneMilestones >= 5,
      "milestone-25": totalDoneMilestones >= 25,
      "goal-done": completedGoals >= 1,
      "streak-7": s.streak >= 7,
      "streak-30": s.streak >= 30,
      "social": s.stories.some(st => !["s1","s2","s3","s4","s5","s6"].includes(st.id)),
      "buddy": s.partners.some(p => p.matched),
      "level-10": lvl >= 10,
    };

    let bonusXp = 0;
    let newlyUnlocked: typeof ACHIEVEMENTS = [];
    for (const a of ACHIEVEMENTS) {
      if (!unlocked.has(a.id) && conditions[a.id]) {
        unlocked.add(a.id);
        bonusXp += a.xp;
        newlyUnlocked.push(a);
      }
    }
    if (newlyUnlocked.length > 0) {
      const a = newlyUnlocked[0];
      setTimeout(() => triggerCelebration(`Achievement unlocked: ${a.name} • +${a.xp} XP`, a.emoji), 200);
    }
    return { ...s, achievements: Array.from(unlocked), totalXP: s.totalXP + bonusXp };
  }, [triggerCelebration]);

  const bumpStreakAndDaily = useCallback((s: AppState, gainedXP: number): AppState => {
    const today = todayKey();
    const isNewDay = s.lastActiveDay !== today;
    const yesterday = (() => {
      const d = new Date(); d.setDate(d.getDate() - 1);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    })();
    const newStreak = isNewDay
      ? (s.lastActiveDay === yesterday || s.lastActiveDay === "" ? s.streak + 1 : 1)
      : s.streak;

    const daily = [...s.daily];
    const idx = daily.findIndex(d => d.date === today);
    if (idx === -1) daily.push({ date: today, xp: gainedXP, completed: 1 });
    else daily[idx] = { ...daily[idx], xp: daily[idx].xp + gainedXP, completed: daily[idx].completed + 1 };

    return { ...s, lastActiveDay: today, streak: newStreak, daily: daily.slice(-60) };
  }, []);

  const setName = (name: string) => setState(s => ({ ...s, user: { ...s.user, name: name.trim() || "Dreamer" } }));
  const setEmoji = (emoji: string) => setState(s => ({ ...s, user: { ...s.user, emoji } }));
  const setTagline = (t: string) => setState(s => ({ ...s, user: { ...s.user, tagline: t } }));

  const addGoal: Ctx["addGoal"] = (g) => {
    const id = `g-${Date.now()}`;
    setState(s => checkAchievements({ ...s, goals: [{ ...g, id, createdAt: Date.now() }, ...s.goals] }));
    toast.success(`Goal created: ${g.title}`, { description: "Time to make it real ✨" });
    return id;
  };
  const updateGoal: Ctx["updateGoal"] = (id, patch) =>
    setState(s => ({ ...s, goals: s.goals.map(g => g.id === id ? { ...g, ...patch } : g) }));
  const deleteGoal = (id: string) =>
    setState(s => ({ ...s, goals: s.goals.filter(g => g.id !== id) }));

  const toggleMilestone: Ctx["toggleMilestone"] = (goalId, milestoneId) => {
    setState(s => {
      const goal = s.goals.find(g => g.id === goalId);
      if (!goal) return s;
      const milestone = goal.milestones.find(m => m.id === milestoneId);
      if (!milestone) return s;
      const becomingDone = !milestone.done;
      const newMilestones = goal.milestones.map(m => m.id === milestoneId ? { ...m, done: !m.done } : m);
      const allDone = newMilestones.every(m => m.done) && newMilestones.length > 0;
      const wasComplete = !!goal.completedAt;
      const xpPerMilestone = Math.max(20, Math.round(goal.xp / Math.max(1, goal.milestones.length)));
      const xpDelta = becomingDone ? xpPerMilestone : -xpPerMilestone;
      let newGoals = s.goals.map(g => g.id === goalId
        ? { ...g, milestones: newMilestones, completedAt: allDone ? Date.now() : undefined }
        : g);
      let newTotal = Math.max(0, s.totalXP + xpDelta);
      if (becomingDone) {
        setTimeout(() => triggerCelebration(`+${xpPerMilestone} XP • milestone crushed`, "⚡"), 50);
      }
      if (allDone && !wasComplete) {
        const bonus = Math.round(goal.xp * 0.5);
        newTotal += bonus;
        setTimeout(() => triggerCelebration(`DREAM ACHIEVED: ${goal.title} • +${bonus} XP bonus`, "🏆"), 300);
      }
      let next = bumpStreakAndDaily({ ...s, goals: newGoals, totalXP: newTotal }, becomingDone ? xpPerMilestone : 0);
      next = checkAchievements(next);
      return next;
    });
  };

  const addMilestone: Ctx["addMilestone"] = (goalId, title) => {
    setState(s => ({
      ...s,
      goals: s.goals.map(g => g.id === goalId
        ? { ...g, milestones: [...g.milestones, { id: `m-${Date.now()}`, title, done: false }] }
        : g),
    }));
  };

  const addVisionItem: Ctx["addVisionItem"] = (v) => {
    setState(s => checkAchievements({ ...s, vision: [...s.vision, { ...v, id: `v-${Date.now()}-${Math.random().toString(36).slice(2,5)}` }] }));
    toast.success("Pinned to your vision board ✨");
  };
  const removeVisionItem = (id: string) =>
    setState(s => ({ ...s, vision: s.vision.filter(v => v.id !== id) }));
  const moveVisionItem: Ctx["moveVisionItem"] = (id, x, y) =>
    setState(s => ({ ...s, vision: s.vision.map(v => v.id === id ? { ...v, x, y } : v) }));

  const applyTemplate: Ctx["applyTemplate"] = (items) => {
    const colors = ["yellow","teal","purple","orange","pink"];
    setState(s => checkAchievements({
      ...s,
      vision: [...s.vision, ...items.map((it, i) => ({
        id: `v-${Date.now()}-${i}`,
        text: it.text, emoji: it.emoji, category: it.category,
        x: 10 + (i % 4) * 22 + Math.random()*8,
        y: 15 + Math.floor(i / 4) * 30 + Math.random()*8,
        rotation: -6 + Math.random()*12,
        color: colors[i % colors.length],
      }))],
    }));
    toast.success("Template added to your vision board 🌈");
  };

  const toggleLikeStory: Ctx["toggleLikeStory"] = (id) =>
    setState(s => ({
      ...s,
      stories: s.stories.map(st => st.id === id ? { ...st, liked: !st.liked, likes: st.likes + (st.liked ? -1 : 1) } : st),
    }));

  const addStory: Ctx["addStory"] = (st) => {
    setState(s => checkAchievements({
      ...s,
      stories: [{ ...st, id: `st-${Date.now()}`, createdAt: Date.now(), likes: 1, liked: true }, ...s.stories],
    }));
    triggerCelebration("Your story is live — you'll inspire someone today", "💬");
  };

  const togglePartner: Ctx["togglePartner"] = (id) => {
    setState(s => {
      const next = { ...s, partners: s.partners.map(p => p.id === id ? { ...p, matched: !p.matched } : p) };
      const partner = next.partners.find(p => p.id === id);
      if (partner?.matched) setTimeout(() => triggerCelebration(`Matched with ${partner.name} ${partner.emoji}`, "🤝"), 50);
      return checkAchievements(next);
    });
  };

  const reset = () => {
    if (confirm("Reset DreamDeck? All progress will be wiped.")) setState(freshState());
  };

  const value = useMemo<Ctx>(() => ({
    state, setName, setEmoji, setTagline,
    addGoal, updateGoal, deleteGoal, toggleMilestone, addMilestone,
    addVisionItem, removeVisionItem, moveVisionItem, applyTemplate,
    toggleLikeStory, addStory, togglePartner, reset,
    triggerCelebration, celebration, clearCelebration,
  }), [state, celebration]);

  return <DreamCtx.Provider value={value}>{children}</DreamCtx.Provider>;
}

export function useDream() {
  const ctx = useContext(DreamCtx);
  if (!ctx) throw new Error("useDream must be used inside DreamProvider");
  return ctx;
}
