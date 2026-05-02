import { useEffect, useMemo, useState } from "react";
import avatarImg from "@/assets/avatar-hero.jpg";
import { useGameCtx } from "@/context/GameContext";
import { PILLARS, PillarKey, levelFromXp, rankFromLevel } from "@/lib/game";
import { SectionHeader, StatCrest } from "@/components/ui-bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  User, Crown, Shield, Flame, Trophy, Sparkles, Plus, Trash2, Check, Heart, Coins, Brain,
  BookOpen, Users as UsersIcon, Target, UserPlus, UserCheck, Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS: Record<string, any> = { Heart, Coins, Brain, BookOpen, Users: UsersIcon, Sparkles };
const EMOJIS = ["🎯", "🏃", "💰", "📚", "🧘", "💪", "🎨", "✈️", "🏠", "❤️", "🌟", "🔥", "🚀", "💎", "🎓", "🌱"];

const ACHIEVEMENTS = [
  { id: "a1", name: "First Step", desc: "Complete your first quest", icon: Sparkles, threshold: (s: any) => s.log.length >= 1 },
  { id: "a2", name: "Dedicated", desc: "Maintain a 7-day streak", icon: Flame, threshold: (s: any) => s.streakDays >= 7 },
  { id: "a3", name: "Iron Will", desc: "30-day streak", icon: Crown, threshold: (s: any) => s.streakDays >= 30 },
  { id: "a4", name: "Quest Hunter", desc: "Complete 25 quests", icon: Target, threshold: (s: any) => s.log.length >= 25 },
  { id: "a5", name: "Centurion", desc: "Complete 100 quests", icon: Trophy, threshold: (s: any) => s.log.length >= 100 },
  { id: "a6", name: "Visionary", desc: "Create 3 goals", icon: Sparkles, threshold: (s: any) => s.goals.length >= 3 },
  { id: "a7", name: "Polymath", desc: "Reach Lv 5 in any 3 paths", icon: BookOpen, threshold: (s: any) => Object.values(s.pillarXP).filter((x: any) => levelFromXp(x as number).level >= 5).length >= 3 },
  { id: "a8", name: "Ascendant", desc: "Reach total Lv 20", icon: Crown, threshold: (s: any) => levelFromXp(s.totalXP).level >= 20 },
];

export default function Character() {
  const { state, addGoal, removeGoal, toggleMilestone, togglePartner } = useGameCtx();
  const overall = useMemo(() => levelFromXp(state.totalXP), [state.totalXP]);
  const rank = rankFromLevel(overall.level);

  // add-goal form
  const [open, setOpen] = useState(false);
  const [gTitle, setGTitle] = useState("");
  const [gDesc, setGDesc] = useState("");
  const [gPillar, setGPillar] = useState<PillarKey>("physical");
  const [gEmoji, setGEmoji] = useState("🎯");
  const [gDate, setGDate] = useState("");
  const [gMilestones, setGMilestones] = useState("Get started\nHalfway\nAlmost there\nComplete");

  useEffect(() => { document.title = "Character — LIFE LEGEND"; }, []);

  const submitGoal = () => {
    if (!gTitle.trim()) return;
    addGoal({
      title: gTitle.trim(),
      description: gDesc.trim() || "A goal worth pursuing.",
      pillar: gPillar,
      emoji: gEmoji,
      targetDate: gDate || undefined,
      milestones: gMilestones.split("\n").map(s => s.trim()).filter(Boolean),
    });
    setGTitle(""); setGDesc(""); setGDate(""); setOpen(false);
  };

  const matchedCount = state.partners.filter((p) => p.matched).length;
  const earned = ACHIEVEMENTS.filter((a) => a.threshold(state));

  return (
    <div className="space-y-6">
      {/* HERO CHARACTER */}
      <section className="panel-elevated ornate-frame relative overflow-hidden rounded-xl p-6">
        <span className="ornate-tr" />
        <span className="ornate-bl" />
        <div className="absolute inset-0 bg-gradient-dream opacity-10" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-full bg-gradient-dream opacity-60 blur-xl" />
            <img src={avatarImg} alt="Hero portrait" className="relative h-24 w-24 rounded-full border-2 border-primary/60 object-cover sm:h-32 sm:w-32" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="rune-divider mb-2 max-w-[200px]">✦ Hero ✦</div>
            <h1 className="font-display text-3xl font-bold text-shimmer sm:text-4xl">{state.operatorName}</h1>
            <p className="font-serif text-sm italic text-muted-foreground">
              Level {overall.level} {rank} · {state.totalXP.toLocaleString()} total XP
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-gradient-dream transition-all" style={{ width: `${overall.pct}%` }} />
            </div>
            <div className="mt-1 text-right font-serif text-xs text-muted-foreground">
              {overall.into} / {overall.needed} to Lv {overall.level + 1}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCrest icon={Shield} label="Level" value={overall.level} accent="primary" />
        <StatCrest icon={Flame} label="Streak" value={state.streakDays} accent="warning" suffix="d" />
        <StatCrest icon={Target} label="Goals" value={state.goals.length} accent="dream" />
        <StatCrest icon={Trophy} label="Achievements" value={earned.length} accent="success" />
      </section>

      {/* ATTRIBUTE RADIAL CHART (CSS bars) */}
      <section className="panel-elevated ornate-corner relative rounded-xl p-5">
        <SectionHeader title="Attribute Spread" subtitle="Your balance across the six paths" />
        <div className="space-y-3">
          {PILLARS.map((p) => {
            const xp = state.pillarXP[p.key];
            const lvl = levelFromXp(xp).level;
            const max = Math.max(...PILLARS.map(pp => state.pillarXP[pp.key]), 100);
            const pct = (xp / max) * 100;
            const colorVar = `--${p.color}`;
            const Icon = ICONS[p.icon];
            return (
              <div key={p.key} className="flex items-center gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
                  style={{ background: `hsl(var(${colorVar}) / 0.15)`, color: `hsl(var(${colorVar}))` }}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="w-20 shrink-0 font-display text-xs font-semibold">{p.name}</div>
                <div className="relative h-3 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
                  <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                    style={{ width: `${Math.max(2, pct)}%`, background: `linear-gradient(90deg, hsl(var(${colorVar}) / 0.6), hsl(var(${colorVar})))`, boxShadow: `0 0 8px hsl(var(${colorVar}) / 0.5)` }} />
                </div>
                <div className="w-16 shrink-0 text-right font-serif text-xs text-muted-foreground">Lv {lvl} · {xp}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* VISION BOARD */}
      <section>
        <SectionHeader
          title="Vision Board"
          subtitle="The dreams you are building, milestone by milestone"
          action={
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="btn-gold h-9 text-xs"><Plus className="mr-1 h-3.5 w-3.5" /> Add Goal</Button>
              </DialogTrigger>
              <DialogContent className="panel-elevated max-w-md">
                <DialogHeader><DialogTitle className="font-display text-glow-gold">Forge a New Dream</DialogTitle></DialogHeader>
                <div className="space-y-3 pt-2">
                  <div>
                    <Label className="font-serif text-sm text-muted-foreground">Title</Label>
                    <Input value={gTitle} onChange={(e) => setGTitle(e.target.value)} placeholder="e.g. Launch my business" className="mt-1 bg-input" />
                  </div>
                  <div>
                    <Label className="font-serif text-sm text-muted-foreground">Why it matters</Label>
                    <Textarea value={gDesc} onChange={(e) => setGDesc(e.target.value)} rows={2} className="mt-1 bg-input" />
                  </div>
                  <div>
                    <Label className="font-serif text-sm text-muted-foreground">Path</Label>
                    <div className="mt-1 grid grid-cols-3 gap-1.5">
                      {PILLARS.map((p) => {
                        const colorVar = `--${p.color}`;
                        const active = gPillar === p.key;
                        return (
                          <button key={p.key} onClick={() => setGPillar(p.key)}
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
                  <div>
                    <Label className="font-serif text-sm text-muted-foreground">Emblem</Label>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {EMOJIS.map((e) => (
                        <button key={e} onClick={() => setGEmoji(e)}
                          className={cn("h-9 w-9 rounded-md border text-lg transition-all",
                            gEmoji === e ? "border-primary bg-primary/20" : "border-border hover:border-primary/40")}>
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="font-serif text-sm text-muted-foreground">Target date (optional)</Label>
                    <Input type="date" value={gDate} onChange={(e) => setGDate(e.target.value)} className="mt-1 bg-input" />
                  </div>
                  <div>
                    <Label className="font-serif text-sm text-muted-foreground">Milestones (one per line)</Label>
                    <Textarea value={gMilestones} onChange={(e) => setGMilestones(e.target.value)} rows={4} className="mt-1 bg-input font-serif" />
                  </div>
                  <Button onClick={submitGoal} className="btn-gold w-full">Forge Dream</Button>
                </div>
              </DialogContent>
            </Dialog>
          }
        />

        <div className="grid gap-3 md:grid-cols-2">
          {state.goals.length === 0 && (
            <div className="panel rounded-xl p-8 text-center sm:col-span-2">
              <Target className="mx-auto mb-2 h-10 w-10 text-muted-foreground/40" />
              <p className="font-serif italic text-muted-foreground">No dreams yet. Forge your first one above.</p>
            </div>
          )}
          {state.goals.map((g) => {
            const p = PILLARS.find((x) => x.key === g.pillar)!;
            const colorVar = `--${p.color}`;
            return (
              <div key={g.id} className="panel-elevated ornate-corner group relative rounded-xl p-4 animate-fade-in">
                <div className="flex items-start gap-3">
                  <div className="text-4xl">{g.emoji}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-base font-semibold">{g.title}</h3>
                      <button onClick={() => removeGoal(g.id)} className="text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100" aria-label="Delete goal">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="font-serif text-xs italic text-muted-foreground">{g.description}</p>
                    <div className="mt-1 flex items-center gap-2 font-serif text-xs">
                      <span className="font-display uppercase tracking-wider" style={{ color: `hsl(var(${colorVar}))` }}>{p.name}</span>
                      {g.targetDate && (
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-3 w-3" /> {new Date(g.targetDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full transition-all duration-700"
                      style={{ width: `${g.progress}%`, background: `linear-gradient(90deg, hsl(var(${colorVar}) / 0.6), hsl(var(${colorVar})))` }} />
                  </div>
                  <div className="mt-1 text-right font-serif text-xs" style={{ color: `hsl(var(${colorVar}))` }}>{g.progress}%</div>
                </div>
                <div className="mt-3 space-y-1.5">
                  {g.milestones.map((m) => (
                    <button key={m.id} onClick={() => toggleMilestone(g.id, m.id)}
                      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-all hover:bg-card/50">
                      <div className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all",
                        m.done ? "border-success bg-success/20 text-success" : "border-border"
                      )}>
                        {m.done && <Check className="h-3 w-3" strokeWidth={3} />}
                      </div>
                      <span className={cn("font-serif text-sm", m.done && "line-through text-muted-foreground")}>{m.label}</span>
                      {!m.done && <span className="ml-auto font-display text-[10px] text-muted-foreground">+50 XP</span>}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ACCOUNTABILITY PARTNERS */}
      <section>
        <SectionHeader
          title="Guild of Allies"
          subtitle={`${matchedCount} of ${state.partners.length} matched · find heroes who walk your path`}
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {state.partners.map((p) => {
            const focus = PILLARS.find((x) => x.key === p.focus)!;
            const colorVar = `--${focus.color}`;
            return (
              <div key={p.id} className={cn("panel rounded-xl p-4 transition-all", p.matched && "border-success/40")}>
                <div className="flex items-start gap-3">
                  <div className="text-4xl">{p.avatar}</div>
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-base font-semibold">{p.name}</div>
                    <div className="font-serif text-xs">
                      <span className="text-primary">Lv {p.level}</span>
                      <span className="mx-1.5 text-border">·</span>
                      <span style={{ color: `hsl(var(${colorVar}))` }}>{focus.name}</span>
                      <span className="mx-1.5 text-border">·</span>
                      <span className="text-warning">🔥 {p.streak}d</span>
                    </div>
                  </div>
                </div>
                <p className="mt-2 font-serif text-xs italic text-muted-foreground">"{p.bio}"</p>
                <Button
                  onClick={() => togglePartner(p.id)}
                  variant={p.matched ? "outline" : "default"}
                  className={cn("mt-3 h-8 w-full font-display text-xs",
                    p.matched ? "border-success text-success hover:bg-success/10" : "btn-gold")}
                >
                  {p.matched ? <><UserCheck className="mr-1 h-3.5 w-3.5" /> Matched</> : <><UserPlus className="mr-1 h-3.5 w-3.5" /> Match</>}
                </Button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section>
        <SectionHeader title="Hall of Glory" subtitle={`${earned.length} of ${ACHIEVEMENTS.length} unlocked`} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ACHIEVEMENTS.map((a) => {
            const unlocked = a.threshold(state);
            const Icon = a.icon;
            return (
              <div key={a.id} className={cn(
                "panel ornate-corner relative rounded-lg p-4 transition-all",
                unlocked ? "border-primary/40" : "opacity-50"
              )}>
                <div className={cn(
                  "mb-2 flex h-10 w-10 items-center justify-center rounded-md",
                  unlocked ? "bg-gradient-sunset text-primary-foreground shadow-[var(--shadow-gold)]" : "bg-muted text-muted-foreground"
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="font-display text-sm font-semibold">{a.name}</div>
                <div className="font-serif text-xs text-muted-foreground">{a.desc}</div>
                {unlocked && <div className="mt-2 font-display text-xs text-primary">🏆 Earned</div>}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
