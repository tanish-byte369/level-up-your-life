import { useCallback, useEffect, useState } from "react";
import { SaveState, PillarKey, Quest, STARTER_QUESTS, todayKey } from "@/lib/game";

const STORAGE_KEY = "nexus-life-save-v1";

function freshState(name = "OPERATOR"): SaveState {
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
  };
}

function loadState(): SaveState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return freshState();
    const parsed = JSON.parse(raw) as SaveState;
    // Daily reset
    const today = todayKey();
    if (parsed.lastResetDay !== today) {
      parsed.completedToday = [];
      parsed.lastResetDay = today;
    }
    return parsed;
  } catch {
    return freshState();
  }
}

export function useGame() {
  const [state, setState] = useState<SaveState>(() => loadState());

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
        log: [{ questId: quest.id, pillar: quest.pillar, xp: quest.xp, at: Date.now(), title: quest.title }, ...s.log].slice(0, 100),
        lastActiveDay: today,
        streakDays: newStreak,
      };
    });
  }, []);

  const addCustomQuest = useCallback((q: Omit<Quest, "id">) => {
    setState((s) => ({
      ...s,
      customQuests: [...s.customQuests, { ...q, id: `c-${Date.now()}` }],
    }));
  }, []);

  const removeCustomQuest = useCallback((id: string) => {
    setState((s) => ({ ...s, customQuests: s.customQuests.filter((q) => q.id !== id) }));
  }, []);

  const setOperatorName = useCallback((name: string) => {
    setState((s) => ({ ...s, operatorName: name.trim() || "OPERATOR" }));
  }, []);

  const resetGame = useCallback(() => {
    if (confirm("WIPE SAVE? All progress will be erased. This cannot be undone.")) {
      setState(freshState(state.operatorName));
    }
  }, [state.operatorName]);

  const adjustPillarXP = useCallback((pillar: PillarKey, delta: number) => {
    setState((s) => ({
      ...s,
      totalXP: Math.max(0, s.totalXP + delta),
      pillarXP: { ...s.pillarXP, [pillar]: Math.max(0, s.pillarXP[pillar] + delta) },
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
    adjustPillarXP,
  };
}
