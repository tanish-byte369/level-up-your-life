import { PillarKey } from "./game";

export interface Goal {
  id: string;
  title: string;
  description: string;
  pillar: PillarKey;
  emoji: string;
  targetDate?: string;
  progress: number; // 0-100
  milestones: { id: string; label: string; done: boolean }[];
  createdAt: number;
}

export interface Story {
  id: string;
  author: string;
  title: string;
  body: string;
  pillar: PillarKey;
  cheers: number;
  cheered: boolean;
  at: number;
}

export interface Partner {
  id: string;
  name: string;
  avatar: string; // emoji
  level: number;
  focus: PillarKey;
  streak: number;
  matched: boolean;
  bio: string;
}

export const STARTER_GOALS: Goal[] = [
  {
    id: "g-marathon",
    title: "Run a Half Marathon",
    description: "Train consistently for 12 weeks. Cross the finish line.",
    pillar: "physical",
    emoji: "🏃",
    targetDate: "2026-08-15",
    progress: 35,
    milestones: [
      { id: "m1", label: "Run 5K nonstop", done: true },
      { id: "m2", label: "Run 10K nonstop", done: true },
      { id: "m3", label: "Run 15K nonstop", done: false },
      { id: "m4", label: "Race day", done: false },
    ],
    createdAt: Date.now() - 86400000 * 30,
  },
  {
    id: "g-savings",
    title: "Build $10K Emergency Fund",
    description: "Save 20% of every paycheck. No exceptions.",
    pillar: "financial",
    emoji: "💰",
    targetDate: "2026-12-31",
    progress: 62,
    milestones: [
      { id: "m1", label: "Open high-yield savings", done: true },
      { id: "m2", label: "Reach $2,500", done: true },
      { id: "m3", label: "Reach $5,000", done: true },
      { id: "m4", label: "Reach $10,000", done: false },
    ],
    createdAt: Date.now() - 86400000 * 90,
  },
  {
    id: "g-book",
    title: "Read 24 Books This Year",
    description: "Two books a month. Fiction & non-fiction balance.",
    pillar: "academic",
    emoji: "📚",
    targetDate: "2026-12-31",
    progress: 45,
    milestones: [
      { id: "m1", label: "First 6 books", done: true },
      { id: "m2", label: "12 books (halfway)", done: false },
      { id: "m3", label: "18 books", done: false },
      { id: "m4", label: "24 books complete", done: false },
    ],
    createdAt: Date.now() - 86400000 * 60,
  },
  {
    id: "g-meditate",
    title: "Meditate 100 Days Straight",
    description: "Build the habit that quiets the mind.",
    pillar: "spiritual",
    emoji: "🧘",
    progress: 18,
    milestones: [
      { id: "m1", label: "Day 7", done: true },
      { id: "m2", label: "Day 30", done: false },
      { id: "m3", label: "Day 60", done: false },
      { id: "m4", label: "Day 100", done: false },
    ],
    createdAt: Date.now() - 86400000 * 18,
  },
];

export const STARTER_STORIES: Story[] = [
  { id: "s1", author: "Aria the Bold", title: "Lost 30 lbs in 6 months", body: "Started with 10 pushups a day. Now I'm running 5Ks. Small, consistent wins compound.", pillar: "physical", cheers: 142, cheered: false, at: Date.now() - 3600_000 * 5 },
  { id: "s2", author: "Kael Stormrider", title: "Paid off $40K in debt", body: "Tracked every coin. Cut subscriptions. Side hustled weekends. Freedom is loud.", pillar: "financial", cheers: 287, cheered: false, at: Date.now() - 3600_000 * 26 },
  { id: "s3", author: "Lyra Moon", title: "Finished my first novel", body: "300 words a day, no matter what. 11 months later — 87,000 words. Just begin.", pillar: "academic", cheers: 198, cheered: false, at: Date.now() - 3600_000 * 50 },
  { id: "s4", author: "Ronan Vale", title: "Beat social anxiety", body: "Said hi to one stranger every day for 90 days. Now I host meetups. Discomfort is the door.", pillar: "social", cheers: 156, cheered: false, at: Date.now() - 3600_000 * 100 },
];

export const STARTER_PARTNERS: Partner[] = [
  { id: "p1", name: "Mira Dawnsong", avatar: "🌅", level: 14, focus: "physical", streak: 28, matched: false, bio: "Morning runner. Looking for someone to share weekly mileage with." },
  { id: "p2", name: "Theo Ironheart", avatar: "⚔️", level: 22, focus: "mental", streak: 67, matched: false, bio: "Daily meditator. Building unshakeable focus through deep work." },
  { id: "p3", name: "Sage Brightwood", avatar: "🌿", level: 9, focus: "spiritual", streak: 12, matched: false, bio: "Journaling, gratitude, slow living. Want a kind accountability buddy." },
  { id: "p4", name: "Vex Goldhand", avatar: "💎", level: 31, focus: "financial", streak: 104, matched: false, bio: "FIRE journey at year 4. Open to swapping monthly money reviews." },
  { id: "p5", name: "Nova Starlit", avatar: "✨", level: 17, focus: "academic", streak: 41, matched: false, bio: "Learning Japanese + ML. Will trade study sprints over voice chat." },
  { id: "p6", name: "Rune Wildwind", avatar: "🦊", level: 6, focus: "social", streak: 9, matched: false, bio: "Reaching out to one friend daily. Need someone to keep me honest." },
];
