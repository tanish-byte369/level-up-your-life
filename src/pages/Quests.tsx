import { useEffect, useMemo, useState } from "react";
import { useGameCtx } from "@/context/GameContext";
import { PILLARS, PillarKey, Quest } from "@/lib/game";
import { QuestRow } from "@/components/QuestRow";
import { AddQuestDialog } from "@/components/AddQuestDialog";
import { SectionHeader, StatCrest } from "@/components/ui-bits";
import { Input } from "@/components/ui/input";
import { Sword, Search, ScrollText, Trophy, Flame, Heart, Coins, Brain, BookOpen, Users, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS: Record<string, any> = { Heart, Coins, Brain, BookOpen, Users, Sparkles };

export default function Quests() {
  const { state, allQuests, completeQuest, addCustomQuest, removeCustomQuest } = useGameCtx();
  const [tab, setTab] = useState<Quest["type"] | "all">("all");
  const [pillar, setPillar] = useState<PillarKey | "all">("all");
  const [query, setQuery] = useState("");
  const [floaters, setFloaters] = useState<{ id: number; xp: number; pillar: PillarKey }[]>([]);

  useEffect(() => { document.title = "Quests — LIFE LEGEND"; }, []);

  const filtered = useMemo(() => {
    return allQuests.filter((q) => {
      if (tab !== "all" && q.type !== tab) return false;
      if (pillar !== "all" && q.pillar !== pillar) return false;
      if (query && !q.title.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [allQuests, tab, pillar, query]);

  const handleComplete = (qid: string) => {
    const q = allQuests.find((x) => x.id === qid);
    if (!q) return;
    completeQuest(q);
    const id = Date.now();
    setFloaters((f) => [...f, { id, xp: q.xp, pillar: q.pillar }]);
    setTimeout(() => setFloaters((f) => f.filter((x) => x.id !== id)), 1500);
  };

  const totalDaily = allQuests.filter((q) => q.type === "daily").length;
  const dailyDone = allQuests.filter((q) => q.type === "daily" && state.completedToday.includes(q.id)).length;
  const totalXpAvailable = filtered.filter((q) => !(state.completedToday.includes(q.id) && q.type === "daily")).reduce((sum, q) => sum + q.xp, 0);

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <section>
        <SectionHeader
          title="Quest Board"
          subtitle="Choose your trials. Each completion strengthens your legend."
          action={<AddQuestDialog onAdd={addCustomQuest} />}
        />
      </section>

      {/* QUICK STATS */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCrest icon={ScrollText} label="Available" value={filtered.length} accent="primary" />
        <StatCrest icon={Trophy} label="Daily Done" value={`${dailyDone}/${totalDaily}`} accent="success" />
        <StatCrest icon={Flame} label="Streak" value={state.streakDays} accent="warning" suffix="d" />
        <StatCrest icon={Sword} label="XP On Table" value={totalXpAvailable} accent="accent" />
      </section>

      {/* FILTERS */}
      <section className="panel rounded-xl p-4 space-y-3">
        {/* search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search quests..."
            className="pl-9 bg-input font-serif"
          />
        </div>

        {/* type tabs */}
        <div className="flex flex-wrap gap-1.5">
          {([
            { k: "all", l: "All" },
            { k: "daily", l: "Daily" },
            { k: "weekly", l: "Weekly" },
            { k: "oneoff", l: "Epic" },
          ] as const).map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              className={cn(
                "rounded-md border px-3 py-1.5 font-display text-xs font-semibold uppercase tracking-wider transition-all",
                tab === t.k
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
            >
              {t.l}
            </button>
          ))}
        </div>

        {/* pillar chips */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setPillar("all")}
            className={cn(
              "rounded-md border px-3 py-1.5 font-display text-xs font-semibold uppercase tracking-wider transition-all",
              pillar === "all" ? "border-primary bg-primary/20 text-primary" : "border-border text-muted-foreground hover:border-primary/40"
            )}
          >
            All Paths
          </button>
          {PILLARS.map((p) => {
            const colorVar = `--${p.color}`;
            const Icon = ICONS[p.icon];
            const active = pillar === p.key;
            return (
              <button
                key={p.key}
                onClick={() => setPillar(p.key)}
                className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-display text-xs font-semibold uppercase tracking-wider transition-all"
                style={{
                  borderColor: active ? `hsl(var(${colorVar}))` : `hsl(var(${colorVar}) / 0.25)`,
                  background: active ? `hsl(var(${colorVar}) / 0.18)` : "transparent",
                  color: `hsl(var(${colorVar}))`,
                }}
              >
                <Icon className="h-3.5 w-3.5" />
                {p.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* QUEST LIST */}
      <section>
        {filtered.length === 0 ? (
          <div className="panel rounded-xl p-10 text-center">
            <ScrollText className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="font-serif italic text-muted-foreground">No quests match your filters.</p>
          </div>
        ) : (
          <div className="grid gap-2 md:grid-cols-2">
            {filtered.map((q) => (
              <div key={q.id} className="animate-fade-in">
                <QuestRow
                  quest={q}
                  completed={state.completedToday.includes(q.id) && q.type === "daily"}
                  onComplete={() => handleComplete(q.id)}
                  onRemove={q.id.startsWith("c-") ? () => removeCustomQuest(q.id) : undefined}
                />
              </div>
            ))}
          </div>
        )}
      </section>

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
