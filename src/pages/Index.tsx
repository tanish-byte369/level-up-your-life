import { useEffect, useMemo, useState } from "react";
import heroImg from "@/assets/hero-fantasy.jpg";
import avatarImg from "@/assets/avatar-hero.jpg";
import { useGame } from "@/hooks/useGame";
import { PILLARS, PillarKey, levelFromXp, rankFromLevel } from "@/lib/game";
import { PillarCard } from "@/components/PillarCard";
import { QuestRow } from "@/components/QuestRow";
import { AddQuestDialog } from "@/components/AddQuestDialog";
import { SidebarItem } from "@/components/SidebarItem";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, User, Sword, ScrollText, Target, Backpack, Globe,
  Trophy, BookOpen as JournalIcon, Settings, Flame, Bell, Mail,
  Menu, Coins, Zap, ChevronRight, Pencil, RotateCcw, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "character", label: "Character", icon: User },
  { key: "skills", label: "Skills", icon: Sword },
  { key: "quests", label: "Quests", icon: ScrollText },
  { key: "habits", label: "Habits", icon: Target },
  { key: "inventory", label: "Inventory", icon: Backpack },
  { key: "world", label: "World", icon: Globe },
  { key: "leaderboard", label: "Leaderboard", icon: Trophy },
  { key: "journal", label: "Journal", icon: JournalIcon },
  { key: "settings", label: "Settings", icon: Settings },
];

const Index = () => {
  const game = useGame();
  const { state, allQuests, completeQuest, addCustomQuest, removeCustomQuest, setOperatorName, resetGame } = game;
  const [activeNav, setActiveNav] = useState("dashboard");
  const [editName, setEditName] = useState(false);
  const [nameInput, setNameInput] = useState(state.operatorName);
  const [floaters, setFloaters] = useState<{ id: number; xp: number; pillar: PillarKey }[]>([]);

  useEffect(() => {
    document.title = "LIFE LEGEND — Become the Hero of Your Story";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "A fantasy RPG self-development tracker. Level up your real life across body, mind, finances, knowledge, relationships, and spirit.");
  }, []);

  const overall = useMemo(() => levelFromXp(state.totalXP), [state.totalXP]);
  const rank = rankFromLevel(overall.level);
  const completedToday = state.completedToday.length;

  // Daily quests for sidebar
  const dailyQuests = allQuests.filter((q) => q.type === "daily").slice(0, 6);
  const dailyDone = dailyQuests.filter((q) => state.completedToday.includes(q.id)).length;

  // Greeting
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const handleComplete = (questId: string) => {
    const q = allQuests.find((x) => x.id === questId);
    if (!q) return;
    completeQuest(q);
    const id = Date.now();
    setFloaters((f) => [...f, { id, xp: q.xp, pillar: q.pillar }]);
    setTimeout(() => setFloaters((f) => f.filter((x) => x.id !== id)), 1500);
  };

  // Coins = totalXP / 10 (visual flair)
  const coins = Math.floor(state.totalXP / 10) + 1000;
  const energy = Math.max(0, 120 - completedToday * 5);

  const habits = allQuests.filter((q) => q.type === "daily").slice(0, 4);
  const achievements = [
    { name: "Early Riser", desc: "Wake up at 5 AM 7 times", xp: 100, icon: Sparkles },
    { name: "Unstoppable", desc: "Complete 10 quests in a day", xp: 200, icon: Zap },
    { name: "Bookworm", desc: "Read 5 books", xp: 300, icon: JournalIcon },
    { name: "Iron Will", desc: "30 day workout streak", xp: 500, icon: Flame },
  ];

  return (
    <div className="flex min-h-screen">
      {/* SIDEBAR */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <div className="px-6 py-6">
          <h1 className="font-display text-2xl font-bold leading-none text-shimmer">LIFE LEGEND</h1>
          <p className="mt-1 font-serif text-xs italic text-muted-foreground">Become the hero of your life.</p>
        </div>
        <div className="gold-divider mx-6" />

        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV.map((item) => (
            <SidebarItem
              key={item.key}
              icon={item.icon}
              label={item.label}
              active={activeNav === item.key}
              onClick={() => setActiveNav(item.key)}
            />
          ))}
        </nav>

        <div className="space-y-3 p-4">
          <div className="panel ornate-corner relative rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-display text-sm font-semibold text-primary">Daily Boost</div>
                <div className="font-serif text-xs text-muted-foreground">Complete all daily quests</div>
                <div className="mt-1 font-display text-sm text-primary">+ 500 XP</div>
              </div>
              <div className="text-2xl">🗝️</div>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-gradient-gold transition-all"
                style={{ width: `${(dailyDone / Math.max(1, dailyQuests.length)) * 100}%` }}
              />
            </div>
            <div className="mt-1 text-right font-serif text-xs text-muted-foreground">
              {dailyDone} / {dailyQuests.length}
            </div>
          </div>

          <div className="panel rounded-lg p-4 text-center">
            <p className="font-serif text-sm italic leading-snug text-foreground/90">
              "Discipline today, freedom tomorrow."
            </p>
            <p className="mt-2 font-serif text-xs text-muted-foreground">— Unknown</p>
          </div>
        </div>
      </aside>

      {/* MAIN COLUMN */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* TOP STAT BAR */}
        <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
          <div className="flex items-center gap-4 px-4 py-3 lg:px-8">
            {/* Avatar + name */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-gold opacity-60 blur-md" />
                <img
                  src={avatarImg}
                  alt="Hero avatar"
                  width={48}
                  height={48}
                  className="relative h-12 w-12 rounded-full border-2 border-primary/60 object-cover"
                />
              </div>
              <div className="min-w-0">
                {editName ? (
                  <div className="flex items-center gap-1">
                    <Input
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      maxLength={20}
                      className="h-7 w-32 bg-input font-display text-sm"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      onClick={() => { setOperatorName(nameInput); setEditName(false); }}
                      className="h-7 bg-primary px-2 text-primary-foreground"
                    >
                      OK
                    </Button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setNameInput(state.operatorName); setEditName(true); }}
                    className="group flex items-center gap-1.5"
                  >
                    <span className="font-display text-base font-semibold text-foreground">{state.operatorName}</span>
                    <Pencil className="h-3 w-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </button>
                )}
                <div className="font-serif text-xs text-muted-foreground">
                  Level {overall.level} · <span className="text-primary">{rank}</span>
                </div>
              </div>
            </div>

            {/* XP bar */}
            <div className="hidden min-w-0 flex-1 items-center gap-3 md:flex">
              <span className="shrink-0 font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground">XP</span>
              <div className="relative h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-gold transition-all duration-700"
                  style={{ width: `${overall.pct}%`, boxShadow: "0 0 12px hsl(var(--primary) / 0.6)" }}
                />
              </div>
              <span className="shrink-0 font-serif text-sm text-foreground">
                {state.totalXP.toLocaleString()} <span className="text-muted-foreground">/ {(state.totalXP + (overall.needed - overall.into)).toLocaleString()}</span>
              </span>
            </div>

            {/* Coins */}
            <div className="hidden items-center gap-2 md:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Coins className="h-4 w-4" />
              </div>
              <div>
                <div className="font-serif text-[11px] uppercase tracking-wide text-muted-foreground">Life Coins</div>
                <div className="font-display text-sm font-semibold text-primary">{coins.toLocaleString()}</div>
              </div>
            </div>

            {/* Energy */}
            <div className="hidden items-center gap-2 lg:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-success/15 text-success">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <div className="font-serif text-[11px] uppercase tracking-wide text-muted-foreground">Energy</div>
                <div className="font-display text-sm font-semibold text-success">{energy} / 120</div>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-1">
              <button className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <Bell className="h-4 w-4" />
              </button>
              <button className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <Mail className="h-4 w-4" />
              </button>
              <button
                onClick={resetGame}
                className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
                title="Wipe save"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button className="rounded-full bg-muted p-2 text-foreground lg:hidden">
                <Menu className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        {/* CONTENT GRID */}
        <main className="flex-1 px-4 py-6 lg:px-8">
          <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
            {/* LEFT MAIN COLUMN */}
            <div className="space-y-6">
              {/* Greeting */}
              <div>
                <h2 className="font-display text-3xl font-bold text-foreground">
                  {greet}, <span className="text-shimmer">{state.operatorName}</span>!
                </h2>
                <p className="mt-1 font-serif text-base italic text-muted-foreground">
                  Every choice today shapes your legend.
                </p>
              </div>

              {/* HERO CARD with parchment + image */}
              <section className="panel-elevated relative overflow-hidden rounded-xl">
                <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_1.4fr]">
                  {/* Stats side */}
                  <div className="relative z-10 p-6">
                    <div className="font-display text-xl font-semibold text-primary">Level {overall.level}</div>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="absolute inset-y-0 left-0 rounded-full bg-gradient-gold"
                          style={{ width: `${overall.pct}%`, boxShadow: "0 0 10px hsl(var(--primary) / 0.6)" }}
                        />
                      </div>
                      <span className="shrink-0 font-serif text-xs text-muted-foreground">
                        {overall.into} / {overall.needed} XP
                      </span>
                    </div>

                    <div className="gold-divider my-4" />

                    <div className="grid grid-cols-3 gap-3">
                      <Stat icon={ScrollText} label="Quests" value={`${state.log.length}`} sub="completed" />
                      <Stat icon={Sword} label="Streak" value={`${state.streakDays}`} sub="days" />
                      <Stat icon={Trophy} label="Today" value={`${completedToday}`} sub="quests" />
                    </div>

                    <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-4 py-2.5 font-display text-sm font-semibold text-primary transition-all hover:bg-primary/20">
                      View Progression <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Image side */}
                  <div className="relative min-h-[220px]">
                    <img
                      src={heroImg}
                      alt="Hero standing on a cliff at sunset overlooking misty mountains"
                      width={1536}
                      height={832}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-card via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
                  </div>
                </div>
              </section>

              {/* LIFE ATTRIBUTES */}
              <section>
                <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-foreground">
                  Life Attributes
                  <span className="font-serif text-xs italic text-muted-foreground">— six paths of mastery</span>
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {PILLARS.map((p) => (
                    <PillarCard
                      key={p.key}
                      pillar={p}
                      xp={state.pillarXP[p.key]}
                    />
                  ))}
                </div>
              </section>

              {/* ACTIVE HABITS */}
              <section>
                <h3 className="mb-3 font-display text-lg font-semibold text-foreground">Active Habits</h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {habits.map((h) => {
                    const p = PILLARS.find((x) => x.key === h.pillar)!;
                    const colorVar = `--${p.color}`;
                    const done = state.completedToday.includes(h.id);
                    return (
                      <button
                        key={h.id}
                        onClick={() => !done && handleComplete(h.id)}
                        disabled={done}
                        className="panel rounded-lg p-3 text-left transition-all hover:border-primary/40 disabled:opacity-60"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="h-7 w-7 shrink-0 rounded-md"
                            style={{ background: `hsl(var(${colorVar}) / 0.2)`, border: `1px solid hsl(var(${colorVar}) / 0.4)` }}
                          />
                          <div className="min-w-0">
                            <div className="truncate font-display text-sm font-semibold">{h.title.split(":")[0].split(",")[0]}</div>
                            <div className="font-serif text-xs text-muted-foreground">Every day</div>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-1 font-serif text-xs">
                          <Flame className={cn("h-3.5 w-3.5", done ? "text-warning animate-flame" : "text-muted-foreground")} />
                          <span className="text-muted-foreground">{state.streakDays}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* RECENT ACHIEVEMENTS */}
              <section className="panel rounded-xl p-5">
                <h3 className="mb-3 font-display text-lg font-semibold text-primary">Recent Achievements</h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {achievements.map((a) => {
                    const Icon = a.icon;
                    return (
                      <div key={a.name} className="rounded-lg border border-border bg-card/60 p-3">
                        <Icon className="mb-2 h-5 w-5 text-primary" />
                        <div className="font-display text-sm font-semibold">{a.name}</div>
                        <div className="font-serif text-xs text-muted-foreground">{a.desc}</div>
                        <div className="mt-2 font-display text-xs text-primary">🏆 {a.xp} XP</div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* ALL QUESTS BOARD */}
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold text-foreground">All Quests</h3>
                  <AddQuestDialog onAdd={addCustomQuest} />
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  {allQuests.map((q) => (
                    <QuestRow
                      key={q.id}
                      quest={q}
                      completed={state.completedToday.includes(q.id) && q.type === "daily"}
                      onComplete={() => handleComplete(q.id)}
                      onRemove={q.id.startsWith("c-") ? () => removeCustomQuest(q.id) : undefined}
                    />
                  ))}
                </div>
              </section>
            </div>

            {/* RIGHT QUEST SIDEBAR */}
            <aside className="space-y-4">
              {/* Current Quest */}
              <div className="panel-elevated rounded-xl p-5">
                <div className="mb-2 flex items-center gap-2 font-display text-sm font-semibold text-primary">
                  <Sword className="h-4 w-4" /> Current Quest
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-display text-base font-semibold">Master Your Mind</div>
                    <div className="font-serif text-xs text-muted-foreground">Complete 3 mental quests today</div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-gradient-gold transition-all"
                      style={{ width: `${Math.min(100, (completedToday / 3) * 100)}%` }}
                    />
                  </div>
                  <div className="mt-1 text-right font-serif text-xs text-muted-foreground">{Math.min(3, completedToday)} / 3</div>
                </div>
                <div className="mt-3 font-serif text-xs text-muted-foreground">
                  Rewards: <span className="text-primary">350 XP</span> · <span className="text-primary">🪙 150</span>
                </div>
              </div>

              {/* Daily Quests */}
              <div className="panel rounded-xl p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="font-display text-sm font-semibold text-foreground">Daily Quests</h4>
                  <span className="font-serif text-xs text-muted-foreground">14h 32m left</span>
                </div>
                <div className="space-y-2">
                  {dailyQuests.map((q) => {
                    const done = state.completedToday.includes(q.id);
                    const p = PILLARS.find((x) => x.key === q.pillar)!;
                    const colorVar = `--${p.color}`;
                    return (
                      <div key={q.id} className="flex items-center gap-3">
                        <div
                          className="h-7 w-7 shrink-0 rounded-md"
                          style={{ background: `hsl(var(${colorVar}) / 0.2)`, border: `1px solid hsl(var(${colorVar}) / 0.4)` }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className={cn("truncate font-serif text-sm font-medium", done && "line-through text-muted-foreground")}>
                            {q.title}
                          </div>
                          <div className="font-serif text-xs text-muted-foreground">XP {q.xp}</div>
                        </div>
                        <button
                          onClick={() => !done && handleComplete(q.id)}
                          disabled={done}
                          className={cn(
                            "flex h-6 w-6 shrink-0 items-center justify-center rounded border transition-all",
                            done
                              ? "border-success bg-success/20 text-success"
                              : "border-border hover:border-primary"
                          )}
                        >
                          {done && <span className="text-xs">✓</span>}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Streaks */}
              <div className="panel rounded-xl p-5">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-display text-sm font-semibold text-foreground">Streaks</h4>
                  <button className="font-serif text-xs text-primary hover:underline">View all</button>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <div className="font-display text-4xl font-bold text-primary">{state.streakDays}</div>
                    <div className="font-serif text-xs text-muted-foreground">Days</div>
                  </div>
                  <div className="ml-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-warning/40 bg-warning/10">
                    <Flame className="h-7 w-7 text-warning animate-flame" />
                  </div>
                </div>
                <div className="mt-2 font-serif text-xs text-muted-foreground">
                  Longest: {state.streakDays} days
                </div>
              </div>

              {/* Recent Event Log */}
              {state.log.length > 0 && (
                <div className="panel rounded-xl p-5">
                  <h4 className="mb-3 font-display text-sm font-semibold text-foreground">Recent Activity</h4>
                  <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                    {state.log.slice(0, 8).map((l, i) => {
                      const p = PILLARS.find((x) => x.key === l.pillar)!;
                      const colorVar = `--${p.color}`;
                      const t = new Date(l.at);
                      return (
                        <div key={i} className="flex items-center gap-2 border-b border-border/50 pb-2 last:border-0">
                          <div className="h-2 w-2 shrink-0 rounded-full" style={{ background: `hsl(var(${colorVar}))` }} />
                          <div className="min-w-0 flex-1 font-serif text-xs">
                            <div className="truncate text-foreground">{l.title}</div>
                            <div className="text-muted-foreground">
                              {t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </div>
                          </div>
                          <span className="shrink-0 font-display text-xs text-success">+{l.xp}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </aside>
          </div>

          <footer className="mt-12 text-center font-serif text-xs italic text-muted-foreground">
            ✦ Life Legend · saved locally in your browser ✦
          </footer>
        </main>
      </div>

      {/* XP floaters */}
      <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center">
        {floaters.map((f) => {
          const p = PILLARS.find((x) => x.key === f.pillar)!;
          const colorVar = `--${p.color}`;
          return (
            <div
              key={f.id}
              className="animate-float-up font-display text-2xl font-bold"
              style={{
                color: `hsl(var(${colorVar}))`,
                textShadow: `0 0 20px hsl(var(${colorVar}))`,
              }}
            >
              +{f.xp} XP
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Stat = ({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string; sub: string }) => (
  <div className="rounded-md border border-border/60 bg-card/50 p-2.5">
    <div className="flex items-center gap-1.5 font-serif text-[11px] uppercase tracking-wider text-muted-foreground">
      <Icon className="h-3 w-3 text-primary" /> {label}
    </div>
    <div className="font-display text-lg font-bold text-foreground">{value}</div>
    <div className="font-serif text-[11px] text-muted-foreground">{sub}</div>
  </div>
);

export default Index;
