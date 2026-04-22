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
  { key: "physical", name: "BODY", tagline: "Flesh & steel", color: "pillar-physical", glow: "glow-magenta", icon: "Dumbbell" },
  { key: "financial", name: "CREDITS", tagline: "Capital flow", color: "pillar-financial", glow: "glow-lime", icon: "Coins" },
  { key: "mental", name: "PSYCHE", tagline: "Mind firewall", color: "pillar-mental", glow: "glow-violet", icon: "Brain" },
  { key: "academic", name: "INTEL", tagline: "Knowledge core", color: "pillar-academic", glow: "glow-cyan", icon: "BookOpen" },
  { key: "social", name: "NETWORK", tagline: "Human protocols", color: "pillar-social", glow: "glow-magenta", icon: "Users" },
  { key: "spiritual", name: "SOUL", tagline: "Inner signal", color: "pillar-spiritual", glow: "glow-cyan", icon: "Sparkles" },
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
  if (level >= 50) return "ASCENDED";
  if (level >= 35) return "ARCHITECT";
  if (level >= 25) return "OVERLORD";
  if (level >= 18) return "SHADOWRUNNER";
  if (level >= 12) return "OPERATIVE";
  if (level >= 7) return "RUNNER";
  if (level >= 4) return "INITIATE";
  return "GHOST";
}

export function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export const STARTER_QUESTS: Quest[] = [
  // Physical
  { id: "p-water", pillar: "physical", title: "Hydrate :: 2L water", description: "Flush the system. Refill the meatframe.", xp: 15, difficulty: "trivial", type: "daily" },
  { id: "p-walk", pillar: "physical", title: "30-min cardio loop", description: "Walk, run, cycle — anywhere with sky.", xp: 35, difficulty: "common", type: "daily" },
  { id: "p-lift", pillar: "physical", title: "Strength session", description: "45 min compound lifts or bodyweight grind.", xp: 60, difficulty: "rare", type: "daily" },
  { id: "p-sleep", pillar: "physical", title: "7+ hours offline", description: "Real sleep. No screen blue-bleed.", xp: 40, difficulty: "common", type: "daily" },
  // Financial
  { id: "f-track", pillar: "financial", title: "Log every expense", description: "Audit today's outflow. No leaks.", xp: 20, difficulty: "trivial", type: "daily" },
  { id: "f-save", pillar: "financial", title: "Move 10% to savings", description: "Skim from incoming. Stack the vault.", xp: 80, difficulty: "epic", type: "weekly" },
  { id: "f-learn", pillar: "financial", title: "Study one investment topic", description: "ETFs, compound interest, side income — pick one.", xp: 35, difficulty: "common", type: "daily" },
  // Mental
  { id: "m-meditate", pillar: "mental", title: "10-min meditation", description: "Defrag the headspace.", xp: 25, difficulty: "common", type: "daily" },
  { id: "m-journal", pillar: "mental", title: "Journal :: 3 wins, 1 lesson", description: "Compile today's data into wisdom.", xp: 30, difficulty: "common", type: "daily" },
  { id: "m-noscreen", pillar: "mental", title: "1 hour screen blackout", description: "No phone. No feed. Just analog reality.", xp: 45, difficulty: "rare", type: "daily" },
  // Academic
  { id: "a-read", pillar: "academic", title: "Read 20 pages", description: "Book, paper, longform — feed the cortex.", xp: 30, difficulty: "common", type: "daily" },
  { id: "a-skill", pillar: "academic", title: "Practice a hard skill", description: "60 min focused on coding, language, music, craft.", xp: 70, difficulty: "epic", type: "daily" },
  { id: "a-course", pillar: "academic", title: "Complete a lesson / module", description: "Push the curriculum forward by one block.", xp: 50, difficulty: "rare", type: "daily" },
  // Social
  { id: "s-call", pillar: "social", title: "Reach out to someone", description: "Call, message, plan a meet. Strengthen the mesh.", xp: 25, difficulty: "common", type: "daily" },
  { id: "s-deep", pillar: "social", title: "Have a real conversation", description: "30+ min, no phones, full presence.", xp: 50, difficulty: "rare", type: "daily" },
  // Spiritual
  { id: "sp-gratitude", pillar: "spiritual", title: "Name 3 gratitudes", description: "Tune in to the signal under the noise.", xp: 15, difficulty: "trivial", type: "daily" },
  { id: "sp-nature", pillar: "spiritual", title: "20 min in nature", description: "Sun, trees, water — reset the soul firmware.", xp: 35, difficulty: "common", type: "daily" },
  { id: "sp-purpose", pillar: "spiritual", title: "Reflect on your North Star", description: "Why am I doing this? Re-anchor the mission.", xp: 40, difficulty: "rare", type: "weekly" },
];
