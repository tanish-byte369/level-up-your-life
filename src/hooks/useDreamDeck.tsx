import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { DreamState, Goal, Milestone, Story, Partner, loadState, saveState, freshState, todayKey, CategoryKey } from "@/lib/dreamdeck";

interface Ctx {
  state: DreamState;
  addGoal: (g: Omit<Goal, "id" | "createdAt" | "milestones"> & { milestones?: Omit<Milestone,"id"|"done">[] }) => string;
  updateGoal: (id: string, patch: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  toggleMilestone: (goalId: string, msId: string) => Milestone | null;
  addMilestone: (goalId: string, title: string) => void;
  deleteMilestone: (goalId: string, msId: string) => void;
  celebrate: (goalId: string) => void;
  setUserName: (n: string) => void;
  setUserAvatar: (a: string) => void;
  matchPartner: (id: string) => void;
  unmatchPartner: (id: string) => void;
  addStory: (s: Omit<Story, "id" | "createdAt" | "likes" | "liked">) => void;
  likeStory: (id: string) => void;
  resetAll: () => void;
}

const DreamCtx = createContext<Ctx | null>(null);

export function DreamDeckProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DreamState>(() => loadState());

  useEffect(() => { saveState(state); }, [state]);

  const addGoal: Ctx["addGoal"] = useCallback((g) => {
    const id = `g-${Date.now()}`;
    const milestones: Milestone[] = (g.milestones || []).map((m, i) => ({ id: `m-${Date.now()}-${i}`, title: m.title, done: false }));
    setState(s => ({ ...s, goals: [{ ...g, id, createdAt: Date.now(), milestones }, ...s.goals] }));
    return id;
  }, []);

  const updateGoal: Ctx["updateGoal"] = useCallback((id, patch) => {
    setState(s => ({ ...s, goals: s.goals.map(g => g.id === id ? { ...g, ...patch } : g) }));
  }, []);

  const deleteGoal: Ctx["deleteGoal"] = useCallback((id) => {
    setState(s => ({ ...s, goals: s.goals.filter(g => g.id !== id) }));
  }, []);

  const toggleMilestone: Ctx["toggleMilestone"] = useCallback((goalId, msId) => {
    let toggled: Milestone | null = null;
    setState(s => ({
      ...s,
      lastActiveDay: todayKey(),
      goals: s.goals.map(g => {
        if (g.id !== goalId) return g;
        return {
          ...g,
          milestones: g.milestones.map(m => {
            if (m.id !== msId) return m;
            const next = { ...m, done: !m.done, doneAt: !m.done ? Date.now() : undefined };
            toggled = next;
            return next;
          }),
        };
      }),
    }));
    return toggled;
  }, []);

  const addMilestone: Ctx["addMilestone"] = useCallback((goalId, title) => {
    setState(s => ({ ...s, goals: s.goals.map(g => g.id === goalId
      ? { ...g, milestones: [...g.milestones, { id: `m-${Date.now()}`, title, done: false }] } : g) }));
  }, []);

  const deleteMilestone: Ctx["deleteMilestone"] = useCallback((goalId, msId) => {
    setState(s => ({ ...s, goals: s.goals.map(g => g.id === goalId
      ? { ...g, milestones: g.milestones.filter(m => m.id !== msId) } : g) }));
  }, []);

  const celebrate: Ctx["celebrate"] = useCallback((goalId) => {
    setState(s => {
      const g = s.goals.find(x => x.id === goalId);
      if (!g) return s;
      return {
        ...s,
        goals: s.goals.map(x => x.id === goalId ? { ...x, celebrated: true } : x),
        celebrations: [{ id: `c-${Date.now()}`, goalTitle: g.title, at: Date.now() }, ...s.celebrations].slice(0, 20),
      };
    });
  }, []);

  const setUserName: Ctx["setUserName"] = useCallback((n) => setState(s => ({ ...s, userName: n || "Dreamer" })), []);
  const setUserAvatar: Ctx["setUserAvatar"] = useCallback((a) => setState(s => ({ ...s, userAvatar: a })), []);

  const matchPartner: Ctx["matchPartner"] = useCallback((id) => setState(s => ({ ...s, partners: s.partners.map(p => p.id === id ? { ...p, matched: true } : p) })), []);
  const unmatchPartner: Ctx["unmatchPartner"] = useCallback((id) => setState(s => ({ ...s, partners: s.partners.map(p => p.id === id ? { ...p, matched: false } : p) })), []);

  const addStory: Ctx["addStory"] = useCallback((story) => {
    setState(s => ({ ...s, stories: [{ ...story, id: `s-${Date.now()}`, createdAt: Date.now(), likes: 0, liked: false }, ...s.stories] }));
  }, []);

  const likeStory: Ctx["likeStory"] = useCallback((id) => {
    setState(s => ({ ...s, stories: s.stories.map(x => x.id === id ? { ...x, liked: !x.liked, likes: x.likes + (x.liked ? -1 : 1) } : x) }));
  }, []);

  const resetAll = useCallback(() => {
    if (confirm("Reset all DreamDeck data? This cannot be undone.")) setState(freshState());
  }, []);

  const value: Ctx = useMemo(() => ({
    state, addGoal, updateGoal, deleteGoal, toggleMilestone, addMilestone, deleteMilestone,
    celebrate, setUserName, setUserAvatar, matchPartner, unmatchPartner, addStory, likeStory, resetAll,
  }), [state, addGoal, updateGoal, deleteGoal, toggleMilestone, addMilestone, deleteMilestone, celebrate, setUserName, setUserAvatar, matchPartner, unmatchPartner, addStory, likeStory, resetAll]);

  return <DreamCtx.Provider value={value}>{children}</DreamCtx.Provider>;
}

export function useDreamDeck() {
  const ctx = useContext(DreamCtx);
  if (!ctx) throw new Error("useDreamDeck must be used within DreamDeckProvider");
  return ctx;
}

export function useGoalsByCategory(category?: CategoryKey) {
  const { state } = useDreamDeck();
  return useMemo(() => category ? state.goals.filter(g => g.category === category) : state.goals, [state.goals, category]);
}
