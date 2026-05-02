import { useEffect, useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useGameCtx } from "@/context/GameContext";
import { PILLARS, PillarKey, levelFromXp, rankFromLevel } from "@/lib/game";
import { PillarCard } from "@/components/PillarCard";
import { SectionHeader } from "@/components/ui-bits";
import { Heart, Coins, Brain, BookOpen, Users, Sparkles, ArrowLeft, ChevronRight, Lock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS: Record<string, any> = { Heart, Coins, Brain, BookOpen, Users, Sparkles };

export default function Skills() {
  const navigate = useNavigate();
  const { pillar: pillarKey } = useParams<{ pillar: string }>();
  const { state, allQuests, completeQuest } = useGameCtx();

  useEffect(() => { document.title = pillarKey ? `${pillarKey} Path — LIFE LEGEND` : "Skills — LIFE LEGEND"; }, [pillarKey]);

  // ---- Index view (no pillar) ----
  if (!pillarKey) {
    const totalXP = state.totalXP;
    const ranked = [...PILLARS].sort((a, b) => state.pillarXP[b.key] - state.pillarXP[a.key]);
    return (
      <div className="space-y-5">
        <SectionHeader title="Skill Paths" subtitle="Six attributes. Endless mastery. Tap any to explore." />

        {/* Mastery bar across all */}
        <section className="panel-elevated ornate-corner relative rounded-xl p-5">
          <div className="rune-divider mb-4">✦ Total Mastery ✦</div>
          <div className="space-y-3">
            {ranked.map((p) => {
              const xp = state.pillarXP[p.key];
              const pct = totalXP === 0 ? 0 : (xp / totalXP) * 100;
              const lvl = levelFromXp(xp).level;
              const colorVar = `--${p.color}`;
              const Icon = ICONS[p.icon];
              return (
                <Link
                  key={p.key}
                  to={`/skills/${p.key}`}
                  className="group flex items-center gap-3 rounded-lg border border-transparent p-2 transition-all hover:border-primary/30 hover:bg-card/40"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md"
                    style={{ background: `hsl(var(${colorVar}) / 0.15)`, color: `hsl(var(${colorVar}))` }}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-baseline justify-between">
                      <span className="font-display text-sm font-semibold">{p.name}</span>
                      <span className="font-serif text-xs text-muted-foreground">Lv {lvl} · {xp} XP</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div className="h-full transition-all duration-700"
                        style={{ width: `${Math.max(2, pct)}%`, background: `linear-gradient(90deg, hsl(var(${colorVar}) / 0.6), hsl(var(${colorVar})))`, boxShadow: `0 0 8px hsl(var(${colorVar}) / 0.6)` }}
                      />
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              );
            })}
          </div>
        </section>

        {/* Grid of cards */}
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((p) => (
            <PillarCard key={p.key} pillar={p} xp={state.pillarXP[p.key]} onClick={() => navigate(`/skills/${p.key}`)} />
          ))}
        </section>
      </div>
    );
  }

  // ---- Single pillar view ----
  const pillar = PILLARS.find((p) => p.key === pillarKey);
  if (!pillar) {
    return (
      <div className="panel rounded-xl p-10 text-center">
        <p className="font-serif italic text-muted-foreground">Unknown path.</p>
        <Link to="/skills" className="mt-3 inline-block font-display text-primary">← Back to Skills</Link>
      </div>
    );
  }

  const xp = state.pillarXP[pillar.key];
  const { level, into, needed, pct } = levelFromXp(xp);
  const rank = rankFromLevel(level);
  const colorVar = `--${pillar.color}`;
  const Icon = ICONS[pillar.icon];
  const pillarQuests = allQuests.filter((q) => q.pillar === pillar.key);

  // Skill tree — synthetic perks unlocked at level milestones
  const perks = [
    { lvl: 1, name: "Initiate", desc: `Begin your ${pillar.name.toLowerCase()} journey.` },
    { lvl: 3, name: "Apprentice's Focus", desc: "+5% XP from this path." },
    { lvl: 5, name: "Sworn Path", desc: "Unlocks rare quests." },
    { lvl: 8, name: "Adept's Resolve", desc: "Streaks count double here." },
    { lvl: 12, name: "Master's Insight", desc: "Epic quests unlocked." },
    { lvl: 18, name: "Grandmaster", desc: "Legendary path achievements." },
  ];

  return (
    <div className="space-y-5">
      <button onClick={() => navigate("/skills")} className="flex items-center gap-1 font-display text-xs uppercase tracking-wider text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-3.5 w-3.5" /> All Paths
      </button>

      {/* Hero header */}
      <section className="panel-elevated ornate-frame relative overflow-hidden rounded-xl p-6">
        <span className="ornate-tr" />
        <span className="ornate-bl" />
        <div className="absolute inset-0 opacity-25" style={{ background: `radial-gradient(circle at 20% 30%, hsl(var(${colorVar}) / 0.5), transparent 60%)` }} />
        <div className="relative flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl"
            style={{ background: `hsl(var(${colorVar}) / 0.2)`, border: `1.5px solid hsl(var(${colorVar}) / 0.5)`, color: `hsl(var(${colorVar}))`, boxShadow: `0 0 24px hsl(var(${colorVar}) / 0.4)` }}>
            <Icon className="h-8 w-8" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-display text-2xl font-bold sm:text-3xl" style={{ color: `hsl(var(${colorVar}))` }}>
              {pillar.name} Path
            </div>
            <p className="font-serif text-sm italic text-muted-foreground">{pillar.tagline}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <div className="font-display text-sm">
                Lv. <span className="text-2xl font-bold" style={{ color: `hsl(var(${colorVar}))` }}>{level}</span>
              </div>
              <div className="font-serif text-sm text-muted-foreground">{rank}</div>
              <div className="font-serif text-sm text-muted-foreground">· {xp} total XP</div>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full transition-all duration-700"
                style={{ width: `${pct}%`, background: `linear-gradient(90deg, hsl(var(${colorVar}) / 0.6), hsl(var(${colorVar})))`, boxShadow: `0 0 12px hsl(var(${colorVar}) / 0.6)` }} />
            </div>
            <div className="mt-1 text-right font-serif text-xs text-muted-foreground">{into} / {needed} to next level</div>
          </div>
        </div>
      </section>

      {/* SKILL TREE */}
      <section>
        <SectionHeader title="Skill Tree" subtitle={`Perks unlocked along the ${pillar.name.toLowerCase()} path`} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {perks.map((perk) => {
            const unlocked = level >= perk.lvl;
            return (
              <div key={perk.lvl}
                className={cn(
                  "panel relative rounded-lg p-4 transition-all",
                  unlocked ? "border-primary/30" : "opacity-60"
                )}
                style={unlocked ? { borderColor: `hsl(var(${colorVar}) / 0.4)`, boxShadow: `0 0 16px hsl(var(${colorVar}) / 0.15)` } : undefined}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Lv {perk.lvl}</span>
                  {unlocked ? (
                    <CheckCircle2 className="h-4 w-4" style={{ color: `hsl(var(${colorVar}))` }} />
                  ) : (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="font-display text-base font-semibold">{perk.name}</div>
                <p className="font-serif text-xs text-muted-foreground">{perk.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* PATH QUESTS */}
      <section>
        <SectionHeader
          title={`${pillar.name} Quests`}
          subtitle={`${pillarQuests.length} trials on this path`}
          action={<Link to="/quests" className="font-display text-xs text-primary hover:text-primary-glow">All Quests →</Link>}
        />
        <div className="grid gap-2 md:grid-cols-2">
          {pillarQuests.map((q) => {
            const done = state.completedToday.includes(q.id) && q.type === "daily";
            return (
              <div key={q.id} className={cn("panel flex items-center gap-3 rounded-lg p-3 transition-all hover:border-primary/30", done && "opacity-60")}>
                <div className="min-w-0 flex-1">
                  <div className={cn("font-serif text-sm font-semibold", done && "line-through")}>{q.title}</div>
                  <p className="font-serif text-xs text-muted-foreground">{q.description}</p>
                  <div className="mt-1 font-serif text-xs">
                    <span className="text-primary">+{q.xp} XP</span>
                    <span className="mx-1.5 text-border">·</span>
                    <span className="capitalize text-muted-foreground">{q.difficulty}</span>
                    <span className="mx-1.5 text-border">·</span>
                    <span className="capitalize text-muted-foreground">{q.type}</span>
                  </div>
                </div>
                <button
                  onClick={() => !done && completeQuest(q)}
                  disabled={done}
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded border transition-all",
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
  );
}
