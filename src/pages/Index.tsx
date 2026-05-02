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
  Trophy, BookOpen as JournalIcon, Settings, Flame, Bell,
  Menu, Coins, Zap, ChevronRight, Pencil, RotateCcw, Sparkles, Shield, Crown, X,
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    document.title = "LIFE LEGEND — Become the Hero of Your Story";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "A fantasy RPG self-development tracker. Level up your real life across body, mind, finances, knowledge, relationships, and spirit.");
  }, []);

  const overall = useMemo(() => levelFromXp(state.totalXP), [state.totalXP]);
  const rank = rankFromLevel(overall.level);
  const completedToday = state.completedToday.length;

  const dailyQuests = allQuests.filter((q) => q.type === "daily").slice(0, 6);
  const dailyDone = dailyQuests.filter((q) => state.completedToday.includes(q.id)).length;

  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morrow" : hour < 18 ? "Well met" : "Good eve";

  const handleComplete = (questId: string) => {
    const q = allQuests.find((x) => x.id === questId);
    if (!q) return;
    completeQuest(q);
    const id = Date.now();
    setFloaters((f) => [...f, { id, xp: q.xp, pillar: q.pillar }]);
    setTimeout(() => setFloaters((f) => f.filter((x) => x.id !== id)), 1500);
  };

  const coins = Math.floor(state.totalXP / 10) + 1000;
  const energy = Math.max(0, 120 - completedToday * 5);

  const achievements = [
    { name: "Early Riser", desc: "Wake at dawn 7 times", xp: 100, icon: Sparkles },
    { name: "Unstoppable", desc: "10 quests in one day", xp: 200, icon: Zap },
    { name: "Scholar", desc: "Read 5 tomes", xp: 300, icon: JournalIcon },
    { name: "Iron Will", desc: "30 day training streak", xp: 500, icon: Flame },
  ];

  const SidebarNav = (
    <>
      <div className="px-6 py-6">
        <div className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-primary" />
          <h1 className="font-display text-xl font-bold leading-none text-shimmer">LIFE LEGEND</h1>
        </div>
        <p className="mt-2 font-serif text-xs italic text-muted-foreground">Forge the hero of your life.</p>
      </div>
      <div className="gold-divider mx-6" />

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV.map((item) => (
          <SidebarItem
            key={item.key}
            icon={item.icon}
            label={item.label}
            active={activeNav === item.key}
            onClick={() => { setActiveNav(item.key); setMobileNavOpen(false); }}
          />
        ))}
      </nav>

      <div className="space-y-3 p-4">
        <div className="panel ornate-corner relative rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <div className="font-display text-sm font-semibold text-primary">Daily Boon</div>
              <div className="font-serif text-xs text-muted-foreground">Clear all daily quests</div>
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
          <p className="mt-2 font-serif text-xs text-muted-foreground">— Elder's Codex</p>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        {SidebarNav}
      </aside>

      {/* MOBILE DRAWER */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileNavOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col border-r border-sidebar-border bg-sidebar shadow-2xl">
            <button
              onClick={() => setMobileNavOpen(false)}
              className="absolute right-3 top-3 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
            {SidebarNav}
          </aside>
        </div>
      )}

      {/* MAIN COLUMN */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* TOP HUD */}
        <header className="sticky top-0 z-30 border-b border-primary/15 bg-background/85 backdrop-blur-md">
          <div className="flex items-center gap-3 px-3 py-2.5 sm:gap-4 sm:px-4 lg:px-6">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="rounded-md p-1.5 text-foreground hover:bg-muted lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Avatar + name */}
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-full bg-gradient-gold opacity-50 blur-md" />
                <img
                  src={avatarImg}
                  alt="Hero avatar"
                  width={44}
                  height={44}
                  className="relative h-10 w-10 rounded-full border-2 border-primary/60 object-cover sm:h-11 sm:w-11"
                />
              </div>
              <div className="min-w-0">
                {editName ? (
                  <div className="flex items-center gap-1">
                    <Input
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      maxLength={20}
                      className="h-7 w-28 bg-input font-display text-sm"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      onClick={() => { setOperatorName(nameInput); setEditName(false); }}
                      className="h-7 bg-primary px-2 text-primary-foreground"
                    >OK</Button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setNameInput(state.operatorName); setEditName(true); }}
                    className="group flex items-center gap-1.5"
                  >
                    <span className="truncate font-display text-sm font-semibold text-foreground sm:text-base">{state.operatorName}</span>
                    <Pencil className="h-3 w-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </button>
                )}
                <div className="font-serif text-[11px] text-muted-foreground sm:text-xs">
                  Lv. {overall.level} · <span className="text-primary">{rank}</span>
                </div>
              </div>
            </div>

            {/* XP bar — hidden on smallest, visible md+ */}
            <div className="hidden min-w-0 flex-1 items-center gap-3 md:flex">
              <span className="shrink-0 font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">XP</span>
              <div className="relative h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-gold transition-all duration-700"
                  style={{ width: `${overall.pct}%`, boxShadow: "0 0 12px hsl(var(--primary) / 0.6)" }}
                />
              </div>
              <span className="shrink-0 font-serif text-xs text-foreground">
                {overall.into}<span className="text-muted-foreground"> / {overall.needed}</span>
              </span>
            </div>

            {/* Coins */}
            <div className="ml-auto flex items-center gap-1.5 md:ml-0">
              <Coins className="h-4 w-4 text-primary" />
              <span className="font-display text-xs font-semibold text-primary sm:text-sm">{coins.toLocaleString()}</span>
            </div>
            <div className="hidden items-center gap-1.5 sm:flex">
              <Zap className="h-4 w-4 text-success" />
              <span className="font-display text-xs font-semibold text-success sm:text-sm">{energy}</span>
            </div>

            <div className="flex shrink-0 items-center gap-0.5">
              <button className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <Bell className="h-4 w-4" />
              </button>
              <button
                onClick={resetGame}
                className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
                title="Wipe save"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Mobile XP bar */}
          <div className="flex items-center gap-2 border-t border-border/50 px-3 py-1.5 md:hidden">
            <span className="shrink-0 font-display text-[9px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">XP</span>
            <div className="relative h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-gold"
                style={{ width: `${overall.pct}%`, boxShadow: "0 0 8px hsl(var(--primary) / 0.6)" }}
              />
            </div>
            <span className="shrink-0 font-serif text-[11px] text-foreground">
              {overall.into}<span className="text-muted-foreground">/{overall.needed}</span>
            </span>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 px-3 py-5 sm:px-4 sm:py-6 lg:px-6">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
            {/* LEFT MAIN */}
            <div className="space-y-5">
              {/* HERO BANNER with greeting overlay */}
              <section className="panel-elevated ornate-frame relative overflow-hidden rounded-xl">
                <span className="ornate-tr" />
                <span className="ornate-bl" />
                <div className="relative aspect-[16/7] w-full sm:aspect-[16/6]">
                  <img
                    src={heroImg}
                    alt="Hero in golden cloak overlooking a misty fantasy kingdom at sunset"
                    width={1920}
                    height={960}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-card/90 via-card/20 to-transparent" />

                  <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6">
                    <div className="rune-divider mb-2 max-w-[200px]">✦ Chapter I ✦</div>
                    <h2 className="font-display text-2xl font-bold leading-tight text-foreground sm:text-3xl md:text-4xl">
                      {greet}, <span className="text-shimmer">{state.operatorName}</span>
                    </h2>
                    <p className="mt-1 max-w-md font-serif text-sm italic text-foreground/80 sm:text-base">
                      Every choice today shapes your legend.
                    </p>
                  </div>
                </div>
              </section>

              {/* STAT CREST ROW */}
              <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCrest icon={Shield} label="Level" value={overall.level} accent="primary" />
                <StatCrest icon={Flame} label="Streak" value={state.streakDays} accent="warning" suffix="d" />
                <StatCrest icon={Sword} label="Quests" value={state.log.length} accent="accent" />
                <StatCrest icon={Trophy} label="Today" value={completedToday} accent="success" />
              </section>

              {/* LIFE ATTRIBUTES */}
              <section>
                <SectionHeader title="Life Attributes" subtitle="Six paths of mastery" />
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

              {/* QUEST BOARD */}
              <section>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <SectionHeader title="Quest Board" subtitle="Choose your trials" inline />
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

              {/* ACHIEVEMENTS */}
              <section className="panel ornate-frame rounded-xl p-5 pt-6">
                <span className="ornate-tr" />
                <span className="ornate-bl" />
                <SectionHeader title="Hall of Glory" subtitle="Achievements earned" />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {achievements.map((a) => {
                    const Icon = a.icon;
                    return (
                      <div key={a.name} className="rounded-lg border border-primary/15 bg-card/60 p-3 transition-all hover:border-primary/40">
                        <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="font-display text-sm font-semibold">{a.name}</div>
                        <div className="font-serif text-xs text-muted-foreground">{a.desc}</div>
                        <div className="mt-2 font-display text-xs text-primary">🏆 {a.xp} XP</div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>

            {/* RIGHT COLUMN */}
            <aside className="space-y-4">
              {/* Main Quest */}
              <div className="panel-elevated ornate-corner relative rounded-xl p-5">
                <div className="rune-divider mb-3">✦ Main Quest ✦</div>
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-gradient-ember text-primary-foreground shadow-[var(--shadow-gold)]">
                    <Crown className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-display text-base font-semibold">Master Your Mind</div>
                    <div className="font-serif text-xs text-muted-foreground">Clear 3 mental quests today</div>
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
                  <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">Daily Quests</h4>
                  <span className="font-serif text-xs text-muted-foreground">until dusk</span>
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

              {/* Streak */}
              <div className="panel ornate-corner relative rounded-xl p-5">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-display text-sm font-semibold uppercase tracking-wider">Ember Streak</h4>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <div className="font-display text-4xl font-bold text-primary text-glow-gold">{state.streakDays}</div>
                    <div className="font-serif text-xs text-muted-foreground">Consecutive days</div>
                  </div>
                  <div className="ml-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-warning/40 bg-warning/10">
                    <Flame className="h-7 w-7 text-warning animate-flame" />
                  </div>
                </div>
              </div>

              {/* Event Log */}
              {state.log.length > 0 && (
                <div className="panel rounded-xl p-5">
                  <h4 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider">Chronicle</h4>
                  <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                    {state.log.slice(0, 8).map((l, i) => {
                      const p = PILLARS.find((x) => x.key === l.pillar)!;
                      const colorVar = `--${p.color}`;
                      const t = new Date(l.at);
                      return (
                        <div key={i} className="flex items-center gap-2 border-b border-border/50 pb-2 last:border-0">
                          <div className="h-2 w-2 shrink-0 rounded-full" style={{ background: `hsl(var(${colorVar}))`, boxShadow: `0 0 6px hsl(var(${colorVar}))` }} />
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

          <footer className="mt-10 flex items-center justify-center gap-3 font-serif text-xs italic text-muted-foreground">
            <span>✦</span>
            <span>Life Legend · your saga is kept safe in this realm's memory</span>
            <span>✦</span>
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

const SectionHeader = ({ title, subtitle, inline }: { title: string; subtitle?: string; inline?: boolean }) => (
  <div className={cn(!inline && "mb-3")}>
    <h3 className="flex items-baseline gap-2 font-display text-base font-semibold uppercase tracking-[0.15em] text-foreground sm:text-lg">
      <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
      {title}
      {subtitle && <span className="font-serif text-xs font-normal italic tracking-normal text-muted-foreground normal-case">— {subtitle}</span>}
    </h3>
  </div>
);

const StatCrest = ({
  icon: Icon, label, value, accent, suffix,
}: { icon: any; label: string; value: number | string; accent: "primary" | "warning" | "accent" | "success"; suffix?: string }) => {
  const accentMap: Record<string, string> = {
    primary: "hsl(var(--primary))",
    warning: "hsl(var(--warning))",
    accent: "hsl(var(--accent))",
    success: "hsl(var(--success))",
  };
  const c = accentMap[accent];
  return (
    <div className="panel ornate-corner relative rounded-lg p-3 text-center">
      <div
        className="mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-full"
        style={{ background: `${c.replace(")", " / 0.15)")}`, border: `1px solid ${c.replace(")", " / 0.4)")}`, color: c }}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="font-display text-xl font-bold" style={{ color: c }}>
        {value}{suffix && <span className="ml-0.5 text-sm opacity-70">{suffix}</span>}
      </div>
      <div className="font-serif text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
};

export default Index;
