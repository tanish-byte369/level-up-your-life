import { useEffect, useMemo, useState } from "react";
import heroImg from "@/assets/hero-cyberpunk.jpg";
import { useGame } from "@/hooks/useGame";
import { PILLARS, PillarKey, levelFromXp, rankFromLevel } from "@/lib/game";
import { PillarCard } from "@/components/PillarCard";
import { QuestRow } from "@/components/QuestRow";
import { AddQuestDialog } from "@/components/AddQuestDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Activity, Flame, RotateCcw, Trophy, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const Index = () => {
  const game = useGame();
  const { state, allQuests, completeQuest, addCustomQuest, removeCustomQuest, setOperatorName, resetGame } = game;
  const [filter, setFilter] = useState<PillarKey | "all">("all");
  const [editName, setEditName] = useState(false);
  const [nameInput, setNameInput] = useState(state.operatorName);
  const [floaters, setFloaters] = useState<{ id: number; xp: number; pillar: PillarKey }[]>([]);

  useEffect(() => {
    document.title = "NEXUS//LIFE — Cyberpunk Life Simulator";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Level up your real life like a cyberpunk RPG. Track physical, mental, financial, academic, social and spiritual growth as quests, XP and ranks.");
  }, []);

  const overall = useMemo(() => levelFromXp(state.totalXP), [state.totalXP]);
  const rank = rankFromLevel(overall.level);

  const visibleQuests = filter === "all" ? allQuests : allQuests.filter((q) => q.pillar === filter);

  const handleComplete = (questId: string) => {
    const q = allQuests.find((x) => x.id === questId);
    if (!q) return;
    completeQuest(q);
    const id = Date.now();
    setFloaters((f) => [...f, { id, xp: q.xp, pillar: q.pillar }]);
    setTimeout(() => setFloaters((f) => f.filter((x) => x.id !== id)), 1500);
  };

  return (
    <div className="relative min-h-screen pb-20">
      {/* Hero / HUD header */}
      <header className="relative overflow-hidden border-b border-primary/20">
        <div className="absolute inset-0 z-0">
          <img src={heroImg} alt="Neon cyberpunk skyline at night" width={1920} height={1088} className="h-full w-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/70 to-background" />
          <div className="absolute inset-0 grid-bg opacity-40" />
          <div className="absolute inset-0 scanlines pointer-events-none" />
        </div>

        <div className="container relative z-10 px-4 pb-10 pt-8 md:pt-14">
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-success shadow-[0_0_10px_hsl(var(--success))]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">SYS_ONLINE</span>
            </div>
            <div className="flex items-center gap-3">
              {state.streakDays > 0 && (
                <div className="flex items-center gap-1.5 rounded-sm border border-warning/40 bg-warning/10 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-warning">
                  <Flame className="h-3 w-3" /> {state.streakDays}D STREAK
                </div>
              )}
              <button
                onClick={resetGame}
                className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-destructive"
                title="Wipe save"
              >
                <RotateCcw className="inline h-3 w-3" /> WIPE
              </button>
            </div>
          </div>

          {/* Title block */}
          <h1 className="mt-6 font-display text-4xl font-black leading-none tracking-tight md:text-6xl lg:text-7xl">
            <span className="text-glow-cyan">NEXUS</span>
            <span className="text-secondary text-glow-magenta">//</span>
            <span className="bg-gradient-violet bg-clip-text text-transparent">LIFE</span>
          </h1>
          <p className="mt-2 max-w-xl font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground md:text-sm">
            &gt; A real-life simulator. Complete directives. Level the meatframe. Become legend.
          </p>

          {/* Operator panel */}
          <div className="mt-8 panel clip-corner relative grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center md:p-6">
            <div className="absolute left-0 top-0 h-1 w-full bg-gradient-cyber" />
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">::OPERATOR_PROFILE</div>
              <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                {editName ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      maxLength={20}
                      className="h-9 w-44 bg-input font-display text-lg uppercase"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      onClick={() => { setOperatorName(nameInput); setEditName(false); }}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setNameInput(state.operatorName); setEditName(true); }}
                    className="font-display text-2xl font-bold uppercase tracking-wider text-glow-cyan hover:text-primary-glow md:text-3xl"
                  >
                    {state.operatorName}
                  </button>
                )}
                <span className="rounded-sm border border-secondary/40 bg-secondary/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-secondary">
                  {rank}
                </span>
              </div>

              {/* Overall level + XP bar */}
              <div className="mt-4 flex items-center gap-4">
                <div className="text-center">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">LEVEL</div>
                  <div className="font-display text-4xl font-black text-glow-cyan md:text-5xl">{String(overall.level).padStart(2, "0")}</div>
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    <span>XP {overall.into} / {overall.needed}</span>
                    <span>TOTAL :: {state.totalXP}</span>
                  </div>
                  <div className="relative h-3 overflow-hidden rounded-sm border border-primary/30 bg-muted">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-cyber transition-all duration-700"
                      style={{ width: `${overall.pct}%`, boxShadow: "0 0 16px hsl(var(--primary) / 0.8)" }}
                    />
                    <div className="pointer-events-none absolute inset-0 scanlines" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-row gap-3 md:flex-col md:items-end">
              <div className="flex items-center gap-2 rounded-sm border border-primary/30 bg-background/60 px-3 py-2">
                <Trophy className="h-4 w-4 text-primary" />
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">QUESTS DONE</div>
                  <div className="font-display text-lg font-bold leading-none text-primary">{state.log.length}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-sm border border-secondary/30 bg-background/60 px-3 py-2">
                <Activity className="h-4 w-4 text-secondary" />
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">TODAY</div>
                  <div className="font-display text-lg font-bold leading-none text-secondary">{state.completedToday.length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container px-4 pt-10">
        {/* Pillars grid */}
        <section aria-label="Life pillars">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="font-display text-xl font-bold uppercase tracking-widest md:text-2xl">::DOMAINS</h2>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Six axes of self // tap to filter</p>
            </div>
            <button
              onClick={() => setFilter("all")}
              className={cn(
                "font-mono text-[10px] uppercase tracking-widest transition-colors",
                filter === "all" ? "text-primary text-glow-cyan" : "text-muted-foreground hover:text-primary"
              )}
            >
              [ ALL ]
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {PILLARS.map((p) => (
              <PillarCard
                key={p.key}
                pillar={p}
                xp={state.pillarXP[p.key]}
                active={filter === p.key}
                onClick={() => setFilter(filter === p.key ? "all" : p.key)}
              />
            ))}
          </div>
        </section>

        {/* Quest board */}
        <section className="mt-10" aria-label="Quest board">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold uppercase tracking-widest md:text-2xl">
                ::DIRECTIVES <span className="text-secondary text-glow-magenta">[{visibleQuests.length}]</span>
              </h2>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {filter === "all" ? "All active missions" : `Filter :: ${PILLARS.find((p) => p.key === filter)?.name}`}
              </p>
            </div>
            <AddQuestDialog onAdd={addCustomQuest} />
          </div>

          <div className="grid gap-2 md:grid-cols-2">
            {visibleQuests.map((q) => (
              <QuestRow
                key={q.id}
                quest={q}
                completed={state.completedToday.includes(q.id) && q.type === "daily"}
                onComplete={() => handleComplete(q.id)}
                onRemove={q.id.startsWith("c-") ? () => removeCustomQuest(q.id) : undefined}
              />
            ))}
            {visibleQuests.length === 0 && (
              <div className="panel clip-corner-sm col-span-full p-8 text-center">
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  &gt; No directives in this domain. Deploy one above.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Recent activity log */}
        {state.log.length > 0 && (
          <section className="mt-10" aria-label="Activity log">
            <h2 className="mb-4 font-display text-xl font-bold uppercase tracking-widest md:text-2xl">
              ::EVENT_LOG
            </h2>
            <div className="panel clip-corner-sm max-h-72 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-card/95 font-mono uppercase tracking-widest text-muted-foreground">
                  <tr className="border-b border-border">
                    <th className="px-3 py-2 text-[10px]">TIME</th>
                    <th className="px-3 py-2 text-[10px]">DOMAIN</th>
                    <th className="px-3 py-2 text-[10px]">DIRECTIVE</th>
                    <th className="px-3 py-2 text-right text-[10px]">XP</th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  {state.log.map((l, i) => {
                    const p = PILLARS.find((x) => x.key === l.pillar)!;
                    const colorVar = `--${p.color}`;
                    const t = new Date(l.at);
                    return (
                      <tr key={i} className="border-b border-border/50 last:border-0">
                        <td className="px-3 py-1.5 text-muted-foreground">
                          {t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </td>
                        <td className="px-3 py-1.5 font-bold uppercase" style={{ color: `hsl(var(${colorVar}))` }}>
                          {p.name}
                        </td>
                        <td className="px-3 py-1.5">{l.title}</td>
                        <td className="px-3 py-1.5 text-right font-bold text-success">+{l.xp}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <footer className="mt-16 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          <Zap className="inline h-3 w-3 text-primary" /> NEXUS//LIFE v1.0 :: SAVE STORED LOCALLY
        </footer>
      </main>

      {/* XP floaters */}
      <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center">
        {floaters.map((f) => {
          const p = PILLARS.find((x) => x.key === f.pillar)!;
          const colorVar = `--${p.color}`;
          return (
            <div
              key={f.id}
              className="animate-float-up font-display text-2xl font-black"
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

export default Index;
