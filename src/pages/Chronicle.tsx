import { useEffect, useMemo, useState } from "react";
import { useGameCtx } from "@/context/GameContext";
import { PILLARS, PillarKey, levelFromXp } from "@/lib/game";
import { SectionHeader, StatCrest } from "@/components/ui-bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  ScrollText, Flame, Trophy, Sword, BookOpen as JournalIcon, Plus, Heart,
  TrendingUp, Heart as HeartIcon, Coins, Brain, BookOpen, Users, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS: Record<string, any> = { Heart: HeartIcon, Coins, Brain, BookOpen, Users, Sparkles };

export default function Chronicle() {
  const { state, cheerStory, addStory } = useGameCtx();
  const [open, setOpen] = useState(false);
  const [sTitle, setSTitle] = useState("");
  const [sBody, setSBody] = useState("");
  const [sPillar, setSPillar] = useState<PillarKey>("physical");

  useEffect(() => { document.title = "Chronicle — LIFE LEGEND"; }, []);

  // Activity over last 14 days
  const days = useMemo(() => {
    const arr: { day: string; label: string; xp: number; count: number }[] = [];
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      arr.push({ day: key, label: d.toLocaleDateString(undefined, { weekday: "short", day: "numeric" }), xp: 0, count: 0 });
    }
    state.log.forEach((l) => {
      const d = new Date(l.at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const idx = arr.findIndex((x) => x.day === key);
      if (idx >= 0) { arr[idx].xp += l.xp; arr[idx].count += 1; }
    });
    return arr;
  }, [state.log]);

  const maxDay = Math.max(1, ...days.map((d) => d.xp));
  const totalXp = state.totalXP;

  // Pillar share
  const pillarShare = PILLARS.map((p) => ({
    pillar: p,
    xp: state.pillarXP[p.key],
    pct: totalXp === 0 ? 0 : (state.pillarXP[p.key] / totalXp) * 100,
  }));

  const submitStory = () => {
    if (!sTitle.trim() || !sBody.trim()) return;
    addStory(sTitle.trim(), sBody.trim(), sPillar);
    setSTitle(""); setSBody(""); setOpen(false);
  };

  return (
    <div className="space-y-6">
      <section>
        <SectionHeader title="Chronicle" subtitle="Your saga, in numbers and stories" />
      </section>

      {/* HEADLINE STATS */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCrest icon={Sword} label="Total Quests" value={state.log.length} accent="primary" />
        <StatCrest icon={Trophy} label="Total XP" value={totalXp} accent="success" />
        <StatCrest icon={Flame} label="Best Streak" value={state.streakDays} accent="warning" suffix="d" />
        <StatCrest icon={TrendingUp} label="Avg / Day" value={Math.round(totalXp / Math.max(1, days.filter(d => d.xp > 0).length || 1))} accent="dream" />
      </section>

      {/* ACTIVITY CHART */}
      <section className="panel-elevated ornate-corner relative rounded-xl p-5">
        <SectionHeader title="14-Day Momentum" subtitle="XP earned per day" />
        <div className="flex h-44 items-end gap-1.5">
          {days.map((d, i) => {
            const h = (d.xp / maxDay) * 100;
            return (
              <div key={d.day} className="group relative flex h-full min-w-0 flex-1 flex-col items-center justify-end">
                {d.xp > 0 && (
                  <div className="pointer-events-none absolute -top-7 z-10 hidden whitespace-nowrap rounded-md border border-primary/30 bg-card px-2 py-0.5 font-display text-[10px] text-primary group-hover:block">
                    +{d.xp} XP
                  </div>
                )}
                <div
                  className="w-full rounded-t-md transition-all duration-700"
                  style={{
                    height: `${Math.max(2, h)}%`,
                    background: d.xp > 0 ? "var(--gradient-dream)" : "hsl(var(--muted))",
                    boxShadow: d.xp > 0 ? "0 0 12px hsl(var(--primary) / 0.3)" : "none",
                  }}
                />
              </div>
            );
          })}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1.5 sm:grid-cols-14">
          {days.map((d, i) => (
            <div key={d.day} className={cn("text-center font-serif text-[9px] text-muted-foreground", i % 2 === 1 && "sm:block hidden")}>
              {d.label.split(" ")[1]}
            </div>
          ))}
        </div>
      </section>

      {/* PILLAR DISTRIBUTION */}
      <section className="panel-elevated ornate-corner relative rounded-xl p-5">
        <SectionHeader title="Path Distribution" subtitle="Where you've poured your effort" />
        {/* stacked horizontal bar */}
        <div className="mb-4 flex h-3 w-full overflow-hidden rounded-full bg-muted">
          {pillarShare.map((s) => {
            const colorVar = `--${s.pillar.color}`;
            return (
              <div key={s.pillar.key} className="h-full transition-all duration-700"
                style={{ width: `${s.pct}%`, background: `hsl(var(${colorVar}))` }}
                title={`${s.pillar.name}: ${Math.round(s.pct)}%`} />
            );
          })}
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {pillarShare.map((s) => {
            const colorVar = `--${s.pillar.color}`;
            const Icon = ICONS[s.pillar.icon];
            const lvl = levelFromXp(s.xp).level;
            return (
              <div key={s.pillar.key} className="flex items-center gap-3 rounded-md border border-border p-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
                  style={{ background: `hsl(var(${colorVar}) / 0.15)`, color: `hsl(var(${colorVar}))` }}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between font-display text-sm">
                    <span>{s.pillar.name}</span>
                    <span className="font-serif text-xs text-muted-foreground">Lv {lvl}</span>
                  </div>
                  <div className="font-serif text-xs text-muted-foreground">{s.xp} XP · {Math.round(s.pct)}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SUCCESS STORIES */}
      <section>
        <SectionHeader
          title="Hero Stories"
          subtitle="Triumphs from the realm — share your own"
          action={
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="btn-gold h-9 text-xs"><Plus className="mr-1 h-3.5 w-3.5" /> Share Story</Button>
              </DialogTrigger>
              <DialogContent className="panel-elevated max-w-md">
                <DialogHeader><DialogTitle className="font-display text-glow-gold">Share Your Triumph</DialogTitle></DialogHeader>
                <div className="space-y-3 pt-2">
                  <div>
                    <Label className="font-serif text-sm text-muted-foreground">Title</Label>
                    <Input value={sTitle} onChange={(e) => setSTitle(e.target.value)} placeholder="e.g. Ran my first 5K" className="mt-1 bg-input" />
                  </div>
                  <div>
                    <Label className="font-serif text-sm text-muted-foreground">Your story</Label>
                    <Textarea value={sBody} onChange={(e) => setSBody(e.target.value)} rows={4} placeholder="What you did, what you learned..." className="mt-1 bg-input" />
                  </div>
                  <div>
                    <Label className="font-serif text-sm text-muted-foreground">Path</Label>
                    <div className="mt-1 grid grid-cols-3 gap-1.5">
                      {PILLARS.map((p) => {
                        const colorVar = `--${p.color}`;
                        const active = sPillar === p.key;
                        return (
                          <button key={p.key} onClick={() => setSPillar(p.key)}
                            className="rounded-md border px-2 py-1.5 font-display text-xs font-semibold transition-all"
                            style={{
                              borderColor: active ? `hsl(var(${colorVar}))` : `hsl(var(${colorVar}) / 0.25)`,
                              color: `hsl(var(${colorVar}))`,
                              background: active ? `hsl(var(${colorVar}) / 0.18)` : `hsl(var(${colorVar}) / 0.05)`,
                            }}>
                            {p.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <Button onClick={submitStory} className="btn-gold w-full">Share with the Realm</Button>
                </div>
              </DialogContent>
            </Dialog>
          }
        />
        <div className="grid gap-3 md:grid-cols-2">
          {state.stories.map((st) => {
            const p = PILLARS.find((x) => x.key === st.pillar)!;
            const colorVar = `--${p.color}`;
            return (
              <article key={st.id} className="panel rounded-xl p-4 transition-all hover:border-primary/30 animate-fade-in">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-display text-[10px] font-bold uppercase tracking-[0.2em]"
                    style={{ color: `hsl(var(${colorVar}))` }}>{p.name}</span>
                  <span className="font-serif text-xs text-muted-foreground">{new Date(st.at).toLocaleDateString()}</span>
                </div>
                <h3 className="font-display text-base font-semibold">{st.title}</h3>
                <p className="mt-1 font-serif text-sm italic text-foreground/85">"{st.body}"</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-serif text-xs text-muted-foreground">— {st.author}</span>
                  <button
                    onClick={() => cheerStory(st.id)}
                    className={cn(
                      "flex items-center gap-1 rounded-full border px-3 py-1 font-display text-xs transition-all",
                      st.cheered ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    )}
                  >
                    <Heart className={cn("h-3.5 w-3.5", st.cheered && "fill-primary")} /> {st.cheers}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* EVENT LOG */}
      <section>
        <SectionHeader title="Event Log" subtitle={`${state.log.length} entries`} />
        {state.log.length === 0 ? (
          <div className="panel rounded-xl p-10 text-center">
            <ScrollText className="mx-auto mb-2 h-10 w-10 text-muted-foreground/40" />
            <p className="font-serif italic text-muted-foreground">No deeds recorded yet. Complete a quest to begin your chronicle.</p>
          </div>
        ) : (
          <div className="panel rounded-xl p-4">
            <div className="max-h-[500px] space-y-2 overflow-y-auto pr-2">
              {state.log.map((l, i) => {
                const p = PILLARS.find((x) => x.key === l.pillar)!;
                const colorVar = `--${p.color}`;
                const t = new Date(l.at);
                return (
                  <div key={i} className="flex items-center gap-3 border-b border-border/50 pb-2 last:border-0">
                    <div className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: `hsl(var(${colorVar}))`, boxShadow: `0 0 6px hsl(var(${colorVar}))` }} />
                    <div className="min-w-0 flex-1 font-serif text-sm">
                      <div className="truncate text-foreground">{l.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {t.toLocaleDateString()} · {t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · <span className="capitalize" style={{ color: `hsl(var(${colorVar}))` }}>{p.name}</span>
                      </div>
                    </div>
                    <span className="shrink-0 font-display text-sm text-success">+{l.xp}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
