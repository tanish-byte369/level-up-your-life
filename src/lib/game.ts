export type PillarKey = "physical" | "financial" | "mental" | "academic" | "social" | "spiritual";

export interface Pillar {
  key: PillarKey;
  name: string;
  tagline: string;
  color: string; // tailwind class color, e.g. "pillar-physical"
  glow: string; // utility class for glow effect
  icon: string; // lucide icon name
}

export interface Quest {
  id: string;
  pillar: PillarKey;
  title: string;
  description: string;
  xp: number;
  difficulty: "trivial" | "common" | "rare" | "epic" | "legendary";
  type: "daily" | "weekly" | "oneoff";
}

export interface CompletedLog {
  questId: string;
  pillar: PillarKey;
  xp: number;
  at: number; // timestamp
  title: string;
}

export interface SaveState {
  version: 1;
  operatorName: string;
  createdAt: number;
  totalXP: number;
  pillarXP: Record<PillarKey, number>;
  log: CompletedLog[];
  customQuests: Quest[];
  completedToday: string[]; // quest ids completed today (resets daily)
  lastResetDay: string; // YYYY-MM-DD
  streakDays: number;
  lastActiveDay: string;
}

export const PILLARS: Pillar[] = [
  { key: "physical", name: "Physical", tagline: "Strength of body", color: "attr-physical", glow: "", icon: "Heart" },
  { key: "financial", name: "Financial", tagline: "Mastery of coin", color: "attr-financial", glow: "", icon: "Coins" },
  { key: "mental", name: "Mental", tagline: "Clarity of mind", color: "attr-mental", glow: "", icon: "Brain" },
  { key: "academic", name: "Academic", tagline: "Pursuit of wisdom", color: "attr-academic", glow: "", icon: "BookOpen" },
  { key: "social", name: "Social", tagline: "Bonds of fellowship", color: "attr-social", glow: "", icon: "Users" },
  { key: "spiritual", name: "Spiritual", tagline: "Light within", color: "attr-spiritual", glow: "", icon: "Sparkles" },
];

export const DIFFICULTY_MULTIPLIER: Record<Quest["difficulty"], number> = {
  trivial: 1,
  common: 1,
  rare: 1,
  epic: 1,
  legendary: 1,
};

// XP needed to reach the *next* level — exponential curve so it never gets boring
export function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.35, level - 1));
}

// Total XP threshold to BE at this level
export function totalXpForLevel(level: number): number {
  let total = 0;
  for (let i = 1; i < level; i++) total += xpForLevel(i);
  return total;
}

export function levelFromXp(xp: number): { level: number; into: number; needed: number; pct: number } {
  let level = 1;
  let remaining = xp;
  while (remaining >= xpForLevel(level)) {
    remaining -= xpForLevel(level);
    level++;
  }
  const needed = xpForLevel(level);
  return { level, into: remaining, needed, pct: Math.min(100, (remaining / needed) * 100) };
}

export function rankFromLevel(level: number): string {
  if (level >= 50) return "Mythic";
  if (level >= 35) return "Legend";
  if (level >= 25) return "Champion";
  if (level >= 18) return "Knight";
  if (level >= 12) return "Adept";
  if (level >= 7) return "Squire";
  if (level >= 4) return "Apprentice";
  return "Novice";
}

export function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export const STARTER_QUESTS: Quest[] = [
  // Physical
  { id: "p-water", pillar: "physical", title: "Drink 2L of water", description: "Honor the vessel. Stay hydrated.", xp: 15, difficulty: "trivial", type: "daily" },
  { id: "p-walk", pillar: "physical", title: "30-minute cardio", description: "Walk, run, or cycle beneath the open sky.", xp: 35, difficulty: "common", type: "daily" },
  { id: "p-lift", pillar: "physical", title: "Strength training", description: "45 min of lifts or bodyweight discipline.", xp: 60, difficulty: "rare", type: "daily" },
  { id: "p-sleep", pillar: "physical", title: "7+ hours of true rest", description: "No screens. Restore your strength.", xp: 40, difficulty: "common", type: "daily" },
  // Financial
  { id: "f-track", pillar: "financial", title: "Log today's expenses", description: "Know where your gold flows.", xp: 20, difficulty: "trivial", type: "daily" },
  { id: "f-save", pillar: "financial", title: "Save 10% of income", description: "Fill the vault. Build the future.", xp: 80, difficulty: "epic", type: "weekly" },
  { id: "f-learn", pillar: "financial", title: "Study an investment topic", description: "Compound interest, indexes, side income — choose one.", xp: 35, difficulty: "common", type: "daily" },
  // Mental
  { id: "m-meditate", pillar: "mental", title: "10-minute meditation", description: "Quiet the inner noise.", xp: 25, difficulty: "common", type: "daily" },
  { id: "m-journal", pillar: "mental", title: "Journal: 3 wins, 1 lesson", description: "Capture today's wisdom in ink.", xp: 30, difficulty: "common", type: "daily" },
  { id: "m-noscreen", pillar: "mental", title: "1 hour without screens", description: "Return to the real world for a while.", xp: 45, difficulty: "rare", type: "daily" },
  // Academic
  { id: "a-read", pillar: "academic", title: "Read 20 pages", description: "Feed the mind with new knowledge.", xp: 30, difficulty: "common", type: "daily" },
  { id: "a-skill", pillar: "academic", title: "Practice a hard skill", description: "60 min of focused study — coding, language, craft.", xp: 70, difficulty: "epic", type: "daily" },
  { id: "a-course", pillar: "academic", title: "Complete a lesson", description: "Advance your curriculum by one step.", xp: 50, difficulty: "rare", type: "daily" },
  // Social
  { id: "s-call", pillar: "social", title: "Reach out to someone", description: "Call or message a friend. Strengthen the bond.", xp: 25, difficulty: "common", type: "daily" },
  { id: "s-deep", pillar: "social", title: "Have a real conversation", description: "30+ minutes, undistracted, fully present.", xp: 50, difficulty: "rare", type: "daily" },
  // Spiritual
  { id: "sp-gratitude", pillar: "spiritual", title: "Name 3 gratitudes", description: "Find the light in the ordinary.", xp: 15, difficulty: "trivial", type: "daily" },
  { id: "sp-nature", pillar: "spiritual", title: "20 minutes in nature", description: "Sun, trees, water — restore the soul.", xp: 35, difficulty: "common", type: "daily" },
  { id: "sp-purpose", pillar: "spiritual", title: "Reflect on your purpose", description: "Why do you walk this path? Re-anchor.", xp: 40, difficulty: "rare", type: "weekly" },
];
