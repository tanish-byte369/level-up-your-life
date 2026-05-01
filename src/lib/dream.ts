export type CategoryKey = "health" | "career" | "mind" | "money" | "love" | "creative";

export interface Category {
  key: CategoryKey;
  name: string;
  emoji: string;
  color: string; // tailwind class suffix, e.g. "cat-health"
  hue: string;   // hex-ish for charts
  tagline: string;
}

export const CATEGORIES: Category[] = [
  { key: "health",   name: "Health & Body",      emoji: "💪", color: "cat-health",   hue: "hsl(155 75% 55%)", tagline: "Strong body, strong life" },
  { key: "career",   name: "Career & Growth",    emoji: "🚀", color: "cat-career",   hue: "hsl(18 95% 60%)",  tagline: "Build your empire" },
  { key: "mind",     name: "Mind & Learning",    emoji: "🧠", color: "cat-mind",     hue: "hsl(270 70% 65%)", tagline: "Feed your curiosity" },
  { key: "money",    name: "Wealth & Freedom",   emoji: "💰", color: "cat-money",    hue: "hsl(45 100% 60%)", tagline: "Stack the gold" },
  { key: "love",     name: "Love & Connection",  emoji: "💖", color: "cat-love",     hue: "hsl(340 85% 65%)", tagline: "Hearts together" },
  { key: "creative", name: "Creative & Soul",    emoji: "🎨", color: "cat-creative", hue: "hsl(175 80% 55%)", tagline: "Make magic" },
];

export interface Milestone {
  id: string;
  title: string;
  done: boolean;
}

export interface Goal {
  id: string;
  category: CategoryKey;
  title: string;
  description: string;
  targetDate?: string;
  emoji: string;
  color: string; // hue
  milestones: Milestone[];
  createdAt: number;
  completedAt?: number;
  xp: number; // total xp value when fully complete
}

export interface VisionItem {
  id: string;
  text: string;
  emoji: string;
  category: CategoryKey;
  x: number; // 0..100 percent
  y: number;
  rotation: number;
  color: string; // sticky note color name
}

export interface Story {
  id: string;
  author: string;
  title: string;
  body: string;
  category: CategoryKey;
  likes: number;
  liked: boolean;
  createdAt: number;
}

export interface Partner {
  id: string;
  name: string;
  emoji: string;
  bio: string;
  goals: string[];
  matched: boolean;
  vibe: number; // 0..100
}

export interface DailyEntry {
  date: string; // YYYY-MM-DD
  xp: number;
  completed: number;
}

export interface AppState {
  version: 1;
  user: { name: string; emoji: string; tagline: string };
  totalXP: number;
  streak: number;
  lastActiveDay: string;
  goals: Goal[];
  vision: VisionItem[];
  stories: Story[];
  partners: Partner[];
  daily: DailyEntry[];
  achievements: string[]; // ids unlocked
}

export const ACHIEVEMENTS = [
  { id: "first-step",   name: "First Step",        desc: "Create your first goal",        emoji: "🌱", xp: 50 },
  { id: "dreamer",      name: "Big Dreamer",       desc: "Add 5 vision items",            emoji: "✨", xp: 100 },
  { id: "milestone-5",  name: "Momentum",          desc: "Hit 5 milestones",              emoji: "⚡", xp: 150 },
  { id: "milestone-25", name: "Unstoppable",       desc: "Hit 25 milestones",             emoji: "🔥", xp: 400 },
  { id: "goal-done",    name: "Dream Achieved",    desc: "Complete a full goal",          emoji: "🏆", xp: 300 },
  { id: "streak-7",     name: "Week Warrior",      desc: "7-day streak",                  emoji: "📅", xp: 200 },
  { id: "streak-30",    name: "Month Master",      desc: "30-day streak",                 emoji: "👑", xp: 800 },
  { id: "social",       name: "Inspirer",          desc: "Share your first story",        emoji: "💬", xp: 120 },
  { id: "buddy",        name: "Better Together",   desc: "Match with an accountability partner", emoji: "🤝", xp: 150 },
  { id: "level-10",     name: "Rising Star",       desc: "Reach level 10",                emoji: "⭐", xp: 250 },
];

export function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function levelFromXp(xp: number) {
  // Smooth curve
  let level = 1;
  let remaining = xp;
  const need = (l: number) => Math.floor(120 * Math.pow(1.25, l - 1));
  while (remaining >= need(level)) {
    remaining -= need(level);
    level++;
  }
  const needed = need(level);
  return { level, into: remaining, needed, pct: Math.min(100, (remaining / needed) * 100) };
}

export function rankFromLevel(level: number) {
  if (level >= 50) return "Visionary";
  if (level >= 35) return "Trailblazer";
  if (level >= 25) return "Achiever";
  if (level >= 18) return "Climber";
  if (level >= 12) return "Builder";
  if (level >= 7)  return "Explorer";
  if (level >= 4)  return "Dreamer";
  return "Sparker";
}

export function progressOfGoal(g: Goal) {
  if (g.milestones.length === 0) return g.completedAt ? 100 : 0;
  const done = g.milestones.filter((m) => m.done).length;
  return Math.round((done / g.milestones.length) * 100);
}

export const STARTER_STORIES: Story[] = [
  { id: "s1", author: "Maya 🌸", title: "I ran my first half-marathon",  body: "Six months ago I couldn't run for 5 minutes. DreamDeck broke it into tiny milestones and the daily nudges kept me honest. Today I crossed the finish line in tears.", category: "health", likes: 248, liked: false, createdAt: Date.now() - 86400000 * 2 },
  { id: "s2", author: "Diego 🔥", title: "Quit my job, launched my studio", body: "Vision board became reality. Started saving runway, learned design at night, and on month 9 I sent the resignation email. Best decision of my life.", category: "career", likes: 412, liked: false, createdAt: Date.now() - 86400000 * 5 },
  { id: "s3", author: "Aiko ✨", title: "Read 52 books in a year",       body: "One chapter a day. The streak counter kept me coming back. Books changed how I think about everything.", category: "mind", likes: 189, liked: false, createdAt: Date.now() - 86400000 * 1 },
  { id: "s4", author: "Sam 💛", title: "Paid off $40k in debt",          body: "I tracked every dollar. Watching that progress bar fill up became addicting. Free at last.", category: "money", likes: 521, liked: false, createdAt: Date.now() - 86400000 * 7 },
  { id: "s5", author: "Lina 💖", title: "Found my person",               body: "I made 'be brave' my main goal. Showed up to events, said yes more. We met at a pottery class.", category: "love", likes: 167, liked: false, createdAt: Date.now() - 86400000 * 3 },
  { id: "s6", author: "Theo 🎸", title: "Released my first album",       body: "12 songs. 18 months. The milestones feature broke a terrifying dream into doable steps.", category: "creative", likes: 298, liked: false, createdAt: Date.now() - 86400000 * 10 },
];

export const STARTER_PARTNERS: Partner[] = [
  { id: "p1", name: "Jordan", emoji: "🌊", bio: "Marathon training + mindfulness. Morning person.", goals: ["Run 10k", "Meditate daily"], matched: false, vibe: 92 },
  { id: "p2", name: "Priya",  emoji: "📚", bio: "Studying for med school + side hustle. Night owl.",  goals: ["Pass MCAT", "Build app"], matched: false, vibe: 87 },
  { id: "p3", name: "Marcus", emoji: "🏋️", bio: "Lifting + reading. Looking for a gym buddy.",       goals: ["Bench 225", "Read 30 books"], matched: false, vibe: 78 },
  { id: "p4", name: "Sophie", emoji: "🎨", bio: "Art + freelance growth. Loves accountability calls.",goals: ["Daily sketch", "5 clients"], matched: false, vibe: 95 },
  { id: "p5", name: "Kenji",  emoji: "🍃", bio: "Quit smoking + better sleep. Quiet & steady.",       goals: ["100 days clean", "Sleep 8h"], matched: false, vibe: 81 },
  { id: "p6", name: "Ana",    emoji: "💸", bio: "Saving for first home. Budget nerd.",                goals: ["Save $20k", "Side income"], matched: false, vibe: 88 },
];

export const VISION_TEMPLATES = [
  { id: "t1", name: "Travel the World",   emoji: "🌍", items: [
    { text: "See northern lights", emoji: "🌌", category: "creative" as CategoryKey },
    { text: "Hike Patagonia",      emoji: "🏔️", category: "health" as CategoryKey },
    { text: "Eat in Tokyo",        emoji: "🍜", category: "creative" as CategoryKey },
    { text: "Sail Greek isles",    emoji: "⛵", category: "creative" as CategoryKey },
  ]},
  { id: "t2", name: "Dream Home",          emoji: "🏡", items: [
    { text: "Save down payment",   emoji: "💰", category: "money" as CategoryKey },
    { text: "Cozy reading nook",   emoji: "📖", category: "mind" as CategoryKey },
    { text: "Backyard garden",     emoji: "🌻", category: "creative" as CategoryKey },
    { text: "Home gym",            emoji: "🏋️", category: "health" as CategoryKey },
  ]},
  { id: "t3", name: "Financial Freedom",  emoji: "💎", items: [
    { text: "Pay off debt",        emoji: "✂️", category: "money" as CategoryKey },
    { text: "6mo emergency fund",  emoji: "🛡️", category: "money" as CategoryKey },
    { text: "Invest monthly",      emoji: "📈", category: "money" as CategoryKey },
    { text: "Side business",       emoji: "🚀", category: "career" as CategoryKey },
  ]},
  { id: "t4", name: "Best Self",          emoji: "🌟", items: [
    { text: "Daily movement",      emoji: "🏃", category: "health" as CategoryKey },
    { text: "Read 30 books",       emoji: "📚", category: "mind" as CategoryKey },
    { text: "Deeper friendships",  emoji: "💖", category: "love" as CategoryKey },
    { text: "Creative practice",   emoji: "🎨", category: "creative" as CategoryKey },
  ]},
];

export function freshState(): AppState {
  const today = todayKey();
  return {
    version: 1,
    user: { name: "Dreamer", emoji: "🌟", tagline: "Building the life I want" },
    totalXP: 0,
    streak: 0,
    lastActiveDay: "",
    goals: [
      {
        id: "g-welcome",
        category: "health",
        title: "Move my body daily",
        description: "Build a movement habit — walking, yoga, or strength.",
        emoji: "🏃",
        color: "hsl(155 75% 55%)",
        targetDate: new Date(Date.now() + 86400000 * 30).toISOString().slice(0, 10),
        milestones: [
          { id: "m1", title: "Walk 3 days this week", done: false },
          { id: "m2", title: "Try a yoga class",      done: false },
          { id: "m3", title: "Hit 10k steps × 5 days",done: false },
          { id: "m4", title: "Sustain for 30 days",   done: false },
        ],
        createdAt: Date.now(),
        xp: 400,
      },
    ],
    vision: [
      { id: "v1", text: "Wake up excited",  emoji: "☀️", category: "mind",     x: 15, y: 18, rotation: -4, color: "yellow" },
      { id: "v2", text: "Strong & healthy", emoji: "💪", category: "health",   x: 60, y: 12, rotation: 3,  color: "teal" },
      { id: "v3", text: "Travel often",     emoji: "🌍", category: "creative", x: 30, y: 55, rotation: -2, color: "purple" },
      { id: "v4", text: "Financial peace",  emoji: "💰", category: "money",    x: 70, y: 58, rotation: 5,  color: "orange" },
    ],
    stories: STARTER_STORIES,
    partners: STARTER_PARTNERS,
    daily: [],
    achievements: [],
  };
}
