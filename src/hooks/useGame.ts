import { useCallback, useEffect, useState } from "react";
import { SaveState, PillarKey, Quest, STARTER_QUESTS, todayKey } from "@/lib/game";
import { Goal, Story, Partner, STARTER_GOALS, STARTER_STORIES, STARTER_PARTNERS } from "@/lib/dreamtypes";

const STORAGE_KEY = "life-legend-save-v2";

interface ExtraState {
  goals: Goal[];
  stories: Story[];
  partners: Partner[];
}

type FullState = SaveState & ExtraState;

function freshState(name = "HERO"): FullState {
  return {
    version: 1,
    operatorName: name,
    createdAt: Date.now(),
    totalXP: 0,
    pillarXP: { physical: 0, financial: 0, mental: 0, academic: 0, social: 0, spiritual: 0 },
    log: [],
    customQuests: [],
    completedToday: [],
    lastResetDay: todayKey(),
    streakDays: 0,
    lastActiveDay: "",
    goals: STARTER_GOALS,
    stories: STARTER_STORIES,
    partners: STARTER_PARTNERS,
  };
}

function loadState(): FullState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return freshState();
    const parsed = JSON.parse(raw) as Partial<FullState>;
    const base = freshState();
    const merged: FullState = {
      ...base,
      ...parsed,
      pillarXP: { ...base.pillarXP, ...(parsed.pillarXP || {}) },
      goals: parsed.goals ?? base.goals,
      stories: parsed.stories ?? base.stories,
      partners: parsed.partners ?? base.partners,
    };
    const today = todayKey();
    if (merged.lastResetDay !== today) {
      merged.completedToday = [];
      merged.lastResetDay = today;
    }
    return merged;
  } catch {
    return freshState();
  }
}

export function useGame() {
  const [state, setState] = useState<FullState>(() => loadState());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const allQuests: Quest[] = [...STARTER_QUESTS, ...state.customQuests];

  const completeQuest = useCallback((quest: Quest) => {
    setState((s) => {
      if (s.completedToday.includes(quest.id) && quest.type === "daily") return s;
      const today = todayKey();
      const isNewDay = s.lastActiveDay !== today;
      const yesterday = (() => {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      })();
      const newStreak = isNewDay
        ? s.lastActiveDay === yesterday || s.lastActiveDay === ""
          ? s.streakDays + 1
          : 1
        : s.streakDays;
      return {
        ...s,
        totalXP: s.totalXP + quest.xp,
        pillarXP: { ...s.pillarXP, [quest.pillar]: s.pillarXP[quest.pillar] + quest.xp },
        completedToday: [...s.completedToday, quest.id],
        log: [{ questId: quest.id, pillar: quest.pillar, xp: quest.xp, at: Date.now(), title: quest.title }, ...s.log].slice(0, 200),
        lastActiveDay: today,
        streakDays: newStreak,
      };
    });
  }, []);

  const addCustomQuest = useCallback((q: Omit<Quest, "id">) => {
    setState((s) => ({ ...s, customQuests: [...s.customQuests, { ...q, id: `c-${Date.now()}` }] }));
  }, []);

  const removeCustomQuest = useCallback((id: string) => {
    setState((s) => ({ ...s, customQuests: s.customQuests.filter((q) => q.id !== id) }));
  }, []);

  const setOperatorName = useCallback((name: string) => {
    setState((s) => ({ ...s, operatorName: name.trim() || "HERO" }));
  }, []);

  const resetGame = useCallback(() => {
    if (confirm("Reset your saga? All progress will be erased.")) {
      setState(freshState(state.operatorName));
    }
  }, [state.operatorName]);

  // ---- Goals ----
  const addGoal = useCallback((g: Omit<Goal, "id" | "createdAt" | "progress" | "milestones"> & { milestones?: string[] }) => {
    setState((s) => ({
      ...s,
      goals: [
        {
          id: `g-${Date.now()}`,
          createdAt: Date.now(),
          progress: 0,
          milestones: (g.milestones ?? ["Get started", "Halfway", "Almost there", "Complete"]).map((label, i) => ({
            id: `m${i}`, label, done: false,
          })),
          ...g,
        },
        ...s.goals,
      ],
    }));
  }, []);

  const removeGoal = useCallback((id: string) => {
    setState((s) => ({ ...s, goals: s.goals.filter((g) => g.id !== id) }));
  }, []);

  const toggleMilestone = useCallback((goalId: string, mid: string) => {
    setState((s) => {
      const goals = s.goals.map((g) => {
        if (g.id !== goalId) return g;
        const milestones = g.milestones.map((m) => (m.id === mid ? { ...m, done: !m.done } : m));
        const progress = Math.round((milestones.filter((m) => m.done).length / milestones.length) * 100);
        return { ...g, milestones, progress };
      });
      const goal = goals.find((g) => g.id === goalId);
      const wasDone = s.goals.find((g) => g.id === goalId)?.milestones.find((m) => m.id === mid)?.done;
      // award XP for new milestone completion
      let bonus = 0;
      if (goal && !wasDone) bonus = 50;
      return {
        ...s,
        goals,
        totalXP: s.totalXP + bonus,
        pillarXP: goal && bonus
          ? { ...s.pillarXP, [goal.pillar]: s.pillarXP[goal.pillar] + bonus }
          : s.pillarXP,
      };
    });
  }, []);

  // ---- Stories ----
  const cheerStory = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      stories: s.stories.map((st) =>
        st.id === id ? { ...st, cheered: !st.cheered, cheers: st.cheers + (st.cheered ? -1 : 1) } : st
      ),
    }));
  }, []);

  const addStory = useCallback((title: string, body: string, pillar: PillarKey) => {
    setState((s) => ({
      ...s,
      stories: [
        { id: `s-${Date.now()}`, author: s.operatorName, title, body, pillar, cheers: 1, cheered: true, at: Date.now() },
        ...s.stories,
      ],
    }));
  }, []);

  // ---- Partners ----
  const togglePartner = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      partners: s.partners.map((p) => (p.id === id ? { ...p, matched: !p.matched } : p)),
    }));
  }, []);

  return {
    state,
    allQuests,
    completeQuest,
    addCustomQuest,
    removeCustomQuest,
    setOperatorName,
    resetGame,
    addGoal,
    removeGoal,
    toggleMilestone,
    cheerStory,
    addStory,
    togglePartner,
  };
}
