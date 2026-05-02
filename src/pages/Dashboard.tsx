import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import heroImg from "@/assets/hero-fantasy.jpg";
import { useGameCtx } from "@/context/GameContext";
import { PILLARS, levelFromXp, rankFromLevel, PillarKey } from "@/lib/game";
import { PillarCard } from "@/components/PillarCard";
import { SectionHeader, StatCrest } from "@/components/ui-bits";
import { Button } from "@/components/ui/button";
import {
  Shield, Flame, Sword, Trophy, Crown, Heart, Coins, Brain, BookOpen, Users, Sparkles,
  ChevronRight, Target, Star, ArrowRight, Compass, Quote,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS: Record<string, any> = { Heart, Coins, Brain, BookOpen, Users, Sparkles };

const QUOTES = [
  { q: "Discipline today, freedom tomorrow.", by: "Elder's Codex" },
  { q: "Small wins compound into legends.", by: "Sage Brightwood" },
  { q: "The only way out is through.", by: "Robert Frost" },
  { q: "You are the hero you've been waiting for.", by: "Ancient Scroll" },
  { q: "Action is the antidote to despair.", by: "Joan Baez" },
];

export default function Dashboard() {
  const { state, allQuests, completeQuest } = useGameCtx();
  const navigate = useNavigate();
  const [floaters, setFloaters] = useState<{ id: number; xp: number; pillar: PillarKey }[]>([]);

  useEffect(() => {
    document.title = "Dashboard — LIFE LEGEND";
  }, []);

  const overall = useMemo(() => levelFromXp(state.totalXP), [state.totalXP]);
  const rank = rankFromLevel(overall.level);
  const completedToday = state.completedToday.length;
  const dailyQuests = allQuests.filter((q) => q.type === "daily").slice(0, 5);

  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morrow" : hour < 18 ? "Well met" : "Good eve";
  const quote = QUOTES[new Date().getDate() % QUOTES.length];

  const topGoal = state.goals[0];
  const topStory = state.stories[0];
  const topPartner = state.partners.find((p) => !p.matched) ?? state.partners[0];

  const handleComplete = (qid: string) => {
    const q = allQuests.find((x) => x.id === qid);
    if (!q) return;
    completeQuest(q);
    const id = Date.now();
    setFloaters((f) => [...f, { id, xp: q.xp, pillar: q.pillar }]);
    setTimeout(() => setFloaters((f) => f.filter((x) => x.id !== id)), 1500);
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
      {/* LEFT */}
      <div className="space-y-5">
        {/* HERO */}
        <section className="panel-elevated ornate-frame relative overflow-hidden rounded-xl">
          <span className="ornate-tr" />
          <span className="ornate-bl" />
          <div className="relative aspect-[16/7] w-full sm:aspect-[16/6]">
            <img src={heroImg} alt="Hero overlooking a misty kingdom at sunset" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-card/90 via-card/20 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6">
              <div className="rune-divider mb-2 max-w-[200px]">✦ Chapter I ✦</div>
              <h1 className="font-display text-2xl font-bold leading-tight text-foreground sm:text-3xl md:text-4xl">
                {greet}, <span className="text-shimmer">{state.operatorName}</span>
              </h1>
              <p className="mt-1 max-w-md font-serif text-sm italic text-foreground/80 sm:text-base">
                Every choice today shapes your legend.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button onClick={() => navigate("/quests")} className="btn-gold h-9 text-xs">
                  Begin Today's Quests <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Button>
                <Button onClick={() => navigate("/character")} variant="outline" className="h-9 gold-border text-xs font-display">
                  View Hero
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* STAT CRESTS - clickable */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCrest icon={Shield} label="Level" value={overall.level} accent="primary" onClick={() => navigate("/character")} />
          <StatCrest icon={Flame} label="Streak" value={state.streakDays} accent="warning" suffix="d" onClick={() => navigate("/chronicle")} />
          <StatCrest icon={Sword} label="Quests" value={state.log.length} accent="accent" onClick={() => navigate("/quests")} />
          <StatCrest icon={Trophy} label="Today" value={completedToday} accent="success" onClick={() => navigate("/chronicle")} />
        </section>

        {/* ATTRIBUTES */}
        <section>
          <SectionHeader
            title="Life Attributes"
            subtitle="Six paths of mastery — click any to dive in"
            action={<Link to="/skills" className="font-display text-xs text-primary hover:text-primary-glow">All Skills →</Link>}
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map((p) => (
              <PillarCard key={p.key} pillar={p} xp={state.pillarXP[p.key]} onClick={() => navigate(`/skills/${p.key}`)} />
            ))}
          </div>
        </section>

        {/* VISION BOARD PREVIEW */}
        {topGoal && (
          <section className="panel-elevated ornate-corner relative overflow-hidden rounded-xl p-5">
            <div className="rune-divider mb-3">✦ Vision Board ✦</div>
            <div className="flex items-start gap-4">
              <div className="text-5xl">{topGoal.emoji}</div>
              <div className="min-w-0 flex-1">
                <Link to="/character" className="font-display text-lg font-semibold hover:text-primary">{topGoal.title}</Link>
                <p className="font-serif text-sm italic text-muted-foreground">{topGoal.description}</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-gradient-dream transition-all" style={{ width: `${topGoal.progress}%` }} />
                </div>
                <div className="mt-1 flex justify-between font-serif text-xs text-muted-foreground">
                  <span>{topGoal.milestones.filter((m) => m.done).length} / {topGoal.milestones.length} milestones</span>
                  <span className="text-primary">{topGoal.progress}%</span>
                </div>
              </div>
            </div>
            <Button onClick={() => navigate("/character")} variant="outline" className="mt-4 w-full gold-border font-display text-xs">
              Open Full Vision Board <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </section>
        )}

        {/* DAILY QUESTS PREVIEW */}
        <section>
          <SectionHeader
            title="Today's Quests"
            subtitle={`${dailyQuests.filter(q => state.completedToday.includes(q.id)).length} of ${dailyQuests.length} cleared`}
            action={<Link to="/quests" className="font-display text-xs text-primary hover:text-primary-glow">All Quests →</Link>}
          />
          <div className="grid gap-2 sm:grid-cols-2">
            {dailyQuests.map((q) => {
              const done = state.completedToday.includes(q.id);
              const p = PILLARS.find((x) => x.key === q.pillar)!;
              const Icon = ICONS[p.icon];
              const colorVar = `--${p.color}`;
              return (
                <div key={q.id} className={cn("panel group flex items-center gap-3 rounded-lg p-3 transition-all hover:border-primary/30", done && "opacity-60")}>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md"
                    style={{ background: `hsl(var(${colorVar}) / 0.12)`, color: `hsl(var(${colorVar}))` }}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className={cn("truncate font-serif text-sm font-semibold", done && "line-through")}>{q.title}</div>
                    <div className="font-serif text-xs text-muted-foreground">+{q.xp} XP · <span className="capitalize">{q.difficulty}</span></div>
                  </div>
                  <button
                    onClick={() => !done && handleComplete(q.id)}
                    disabled={done}
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded border transition-all",
                      done ? "border-success bg-success/20 text-success" : "border-border hover:border-primary hover:bg-primary/10"
                    )}
                  >
                    {done ? "✓" : "›"}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* RIGHT */}
      <aside className="space-y-4">
        {/* Main Quest */}
        <div className="panel-elevated ornate-corner relative rounded-xl p-5">
          <div className="rune-divider mb-3">✦ Main Quest ✦</div>
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-gradient-sunset text-primary-foreground shadow-[var(--shadow-gold)]">
              <Crown className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="font-display text-base font-semibold">Reach Level {overall.level + 1}</div>
              <div className="font-serif text-xs text-muted-foreground">Earn {overall.needed - overall.into} more XP today</div>
            </div>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-gradient-dream transition-all" style={{ width: `${overall.pct}%` }} />
          </div>
        </div>

        {/* Quote */}
        <div className="panel rounded-xl p-5 text-center">
          <Quote className="mx-auto mb-2 h-5 w-5 text-primary/60" />
          <p className="font-serif text-sm italic leading-snug text-foreground/90">"{quote.q}"</p>
          <p className="mt-2 font-serif text-xs text-muted-foreground">— {quote.by}</p>
        </div>

        {/* Streak */}
        <Link to="/chronicle" className="block panel ornate-corner relative rounded-xl p-5 transition-all hover:border-primary/40">
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
        </Link>

        {/* Featured Story */}
        {topStory && (
          <Link to="/chronicle" className="block panel rounded-xl p-5 transition-all hover:border-primary/40">
            <div className="mb-2 flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" />
              <h4 className="font-display text-sm font-semibold uppercase tracking-wider">Hero Story</h4>
            </div>
            <div className="font-display text-sm font-semibold text-foreground">{topStory.title}</div>
            <p className="mt-1 line-clamp-2 font-serif text-xs italic text-muted-foreground">"{topStory.body}"</p>
            <div className="mt-2 flex items-center justify-between font-serif text-xs">
              <span className="text-muted-foreground">— {topStory.author}</span>
              <span className="text-primary">🔥 {topStory.cheers}</span>
            </div>
          </Link>
        )}

        {/* Partner */}
        <Link to="/character" className="block panel rounded-xl p-5 transition-all hover:border-primary/40">
          <div className="mb-2 flex items-center gap-2">
            <Compass className="h-4 w-4 text-primary" />
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider">Find an Ally</h4>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-3xl">{topPartner.avatar}</div>
            <div className="min-w-0">
              <div className="truncate font-display text-sm font-semibold">{topPartner.name}</div>
              <div className="font-serif text-xs text-muted-foreground">Lv {topPartner.level} · {topPartner.streak}d streak</div>
            </div>
          </div>
        </Link>
      </aside>

      {/* XP floaters */}
      <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center">
        {floaters.map((f) => {
          const p = PILLARS.find((x) => x.key === f.pillar)!;
          const colorVar = `--${p.color}`;
          return (
            <div key={f.id} className="animate-float-up font-display text-2xl font-bold"
              style={{ color: `hsl(var(${colorVar}))`, textShadow: `0 0 20px hsl(var(${colorVar}))` }}>
              +{f.xp} XP
            </div>
          );
        })}
      </div>
    </div>
  );
}
