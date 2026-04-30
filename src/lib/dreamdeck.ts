export type CategoryKey =
  | "health" | "career" | "finance" | "learning"
  | "relationships" | "adventure" | "creative" | "wellness";

export interface Category {
  key: CategoryKey;
  name: string;
  emoji: string;
  color: string;
  tagline: string;
}

export const CATEGORIES: Category[] = [
  { key: "health", name: "Health & Fitness", emoji: "💪", color: "cat-health", tagline: "Body strong, mind bright" },
  { key: "career", name: "Career", emoji: "🚀", color: "cat-career", tagline: "Build your empire" },
  { key: "finance", name: "Finance", emoji: "💰", color: "cat-finance", tagline: "Wealth on your terms" },
  { key: "learning", name: "Learning", emoji: "📚", color: "cat-learning", tagline: "Feed your curiosity" },
  { key: "relationships", name: "Relationships", emoji: "💖", color: "cat-relationships", tagline: "Love and connection" },
  { key: "adventure", name: "Adventure", emoji: "🌄", color: "cat-adventure", tagline: "Chase the horizon" },
  { key: "creative", name: "Creative", emoji: "🎨", color: "cat-creative", tagline: "Make something beautiful" },
  { key: "wellness", name: "Wellness", emoji: "🧘", color: "cat-wellness", tagline: "Peace within" },
];

export interface Milestone {
  id: string;
  title: string;
  done: boolean;
  doneAt?: number;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: CategoryKey;
  image?: string; // emoji or color gradient
  gradient: string; // gradient key
  deadline?: string; // YYYY-MM-DD
  createdAt: number;
  milestones: Milestone[];
  celebrated?: boolean;
  partnerId?: string;
}

export interface Partner {
  id: string;
  name: string;
  avatar: string; // emoji
  focus: CategoryKey;
  bio: string;
  streak: number;
  matched: boolean;
}

export interface Story {
  id: string;
  author: string;
  avatar: string;
  category: CategoryKey;
  title: string;
  body: string;
  likes: number;
  liked: boolean;
  createdAt: number;
}

export interface DreamState {
  version: 1;
  userName: string;
  userAvatar: string;
  goals: Goal[];
  partners: Partner[];
  stories: Story[];
  streak: number;
  lastActiveDay: string;
  celebrations: { id: string; goalTitle: string; at: number }[];
}

export const GRADIENTS = [
  { key: "sunset", label: "Sunset", css: "gradient-sunset" },
  { key: "dream", label: "Dream", css: "gradient-dream" },
  { key: "gold", label: "Gold", css: "gradient-gold" },
  { key: "teal", label: "Teal", css: "gradient-teal" },
  { key: "aurora", label: "Aurora", css: "gradient-aurora" },
];

export const GOAL_EMOJIS = ["🎯","⭐","🔥","🏆","💎","🚀","🌟","💪","📚","🎨","✈️","🏔️","💰","❤️","🧘","🎵","🌱","🦋","🎓","💡"];

export const VISION_TEMPLATES = [
  { id: "tpl-dream-year", name: "Dream Year", emoji: "✨", desc: "12 big goals, one per month", items: 12 },
  { id: "tpl-summer", name: "Summer of Change", emoji: "🌅", desc: "6 life-defining goals for one season", items: 6 },
  { id: "tpl-five", name: "5 Pillars", emoji: "🏛️", desc: "One goal for each life pillar", items: 5 },
  { id: "tpl-bucket", name: "Bucket List", emoji: "🎒", desc: "Adventures & experiences to live for", items: 8 },
  { id: "tpl-career", name: "Career Rocket", emoji: "🚀", desc: "Focused career & skills board", items: 6 },
  { id: "tpl-wellness", name: "Wellness Reset", emoji: "🧘", desc: "Body · Mind · Spirit", items: 6 },
];

const KEY = "dreamdeck-save-v1";

export function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

export function goalProgress(g: Goal): number {
  if (g.milestones.length === 0) return 0;
  return Math.round((g.milestones.filter(m => m.done).length / g.milestones.length) * 100);
}

export function seedPartners(): Partner[] {
  return [
    { id: "p1", name: "Aria Chen", avatar: "🌸", focus: "creative", bio: "Daily painter · building a portfolio", streak: 47, matched: false },
    { id: "p2", name: "Marcus Reed", avatar: "🏔️", focus: "health", bio: "Training for a marathon · accountability buddy", streak: 62, matched: false },
    { id: "p3", name: "Lina Kobe", avatar: "💼", focus: "career", bio: "Switching to UX design · 3 mo sprint", streak: 23, matched: false },
    { id: "p4", name: "Sam Ortega", avatar: "📖", focus: "learning", bio: "Learning Japanese + piano · morning person", streak: 88, matched: false },
    { id: "p5", name: "Priya Raman", avatar: "🧘", focus: "wellness", bio: "Meditation 100 days · calm & consistent", streak: 104, matched: false },
    { id: "p6", name: "Noah Keller", avatar: "💰", focus: "finance", bio: "FIRE journey · saves 50% income", streak: 38, matched: false },
  ];
}

export function seedStories(): Story[] {
  const now = Date.now();
  return [
    { id: "s1", author: "Jade M.", avatar: "🌺", category: "health", title: "Lost 40 lbs in one year", body: "Started with a 10-min walk. One year later I'm a different person. The secret? Showing up on the bad days.", likes: 234, liked: false, createdAt: now - 86400000 },
    { id: "s2", author: "Daniel K.", avatar: "🎸", category: "creative", title: "Wrote my first album", body: "DreamDeck held me accountable every single week. 12 songs later, it's released on Spotify.", likes: 189, liked: false, createdAt: now - 172800000 },
    { id: "s3", author: "Ruth O.", avatar: "📊", category: "finance", title: "Paid off $62k in debt", body: "Budgeting goal → side hustle goal → investment goal. Small wins stack.", likes: 412, liked: false, createdAt: now - 259200000 },
    { id: "s4", author: "Kai Ng", avatar: "🎓", category: "learning", title: "Self-taught my way into tech", body: "Set a 6-month goal to build 6 projects. Got hired as a junior dev on month 8.", likes: 301, liked: false, createdAt: now - 345600000 },
  ];
}

export function seedGoals(): Goal[] {
  const now = Date.now();
  return [
    {
      id: "g1", title: "Run a half marathon", description: "Train 4x a week, build up to 21km by autumn.",
      category: "health", gradient: "gradient-sunset", createdAt: now,
      milestones: [
        { id: "m1", title: "Run 5km without stopping", done: true, doneAt: now - 604800000 },
        { id: "m2", title: "Run 10km", done: true, doneAt: now - 86400000 },
        { id: "m3", title: "Run 15km", done: false },
        { id: "m4", title: "Complete a 21km race", done: false },
      ],
    },
    {
      id: "g2", title: "Launch my side project", description: "Build and ship a real product by end of quarter.",
      category: "career", gradient: "gradient-dream", createdAt: now,
      milestones: [
        { id: "m1", title: "Validate the idea", done: true, doneAt: now - 1209600000 },
        { id: "m2", title: "Build MVP", done: true, doneAt: now - 259200000 },
        { id: "m3", title: "Launch publicly", done: false },
        { id: "m4", title: "First 100 users", done: false },
        { id: "m5", title: "First paying customer", done: false },
      ],
    },
    {
      id: "g3", title: "Read 24 books this year", description: "Two books a month. Mix fiction + non-fiction.",
      category: "learning", gradient: "gradient-teal", createdAt: now,
      milestones: Array.from({ length: 6 }, (_, i) => ({
        id: `m${i}`, title: `Book ${i+1} finished`, done: i < 3, doneAt: i < 3 ? now - i*86400000 : undefined,
      })),
    },
  ];
}

export function freshState(name = "Dreamer"): DreamState {
  return {
    version: 1,
    userName: name,
    userAvatar: "🌟",
    goals: seedGoals(),
    partners: seedPartners(),
    stories: seedStories(),
    streak: 3,
    lastActiveDay: todayKey(),
    celebrations: [],
  };
}

export function loadState(): DreamState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return freshState();
    return JSON.parse(raw);
  } catch { return freshState(); }
}

export function saveState(s: DreamState) {
  localStorage.setItem(KEY, JSON.stringify(s));
}
