import { useState } from "react";
import { useDream } from "@/hooks/useDream";
import { levelFromXp, rankFromLevel, ACHIEVEMENTS } from "@/lib/dream";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Check } from "lucide-react";
import { Link } from "react-router-dom";

const AVATARS = ["🌟","🚀","🦄","🐉","🔥","🌈","⚡","🌸","🎨","🦋","🌙","☀️","🌊","🍀","💎","👑"];

export default function Profile() {
  const { state, setName, setEmoji, setTagline } = useDream();
  const [editName, setEditName] = useState(false);
  const [editTag, setEditTag] = useState(false);
  const [n, setN] = useState(state.user.name);
  const [t, setT] = useState(state.user.tagline);
  const lvl = levelFromXp(state.totalXP);
  const totalDone = state.goals.filter(g => g.completedAt).length;

  return (
    <div className="mx-auto max-w-3xl space-y-5 animate-fade-in">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-dream p-6 text-primary-foreground sm:p-8 animate-gradient">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/15 blur-3xl" />
        <div className="relative flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-background/20 text-6xl backdrop-blur shadow-[var(--shadow-pop)] animate-float">{state.user.emoji}</div>
          <div className="min-w-0 flex-1">
            {editName ? (
              <div className="flex items-center gap-2">
                <Input value={n} onChange={e => setN(e.target.value)} className="h-9 bg-background/20 text-foreground" />
                <Button size="sm" onClick={() => { setName(n); setEditName(false); }} className="bg-background/20 hover:bg-background/30"><Check className="h-4 w-4" /></Button>
              </div>
            ) : (
              <button onClick={() => { setN(state.user.name); setEditName(true); }} className="group inline-flex items-center gap-2">
                <h1 className="font-display text-3xl font-bold">{state.user.name}</h1>
                <Pencil className="h-4 w-4 opacity-50 group-hover:opacity-100" />
              </button>
            )}
            <div className="mt-1 text-sm opacity-90">Level {lvl.level} · {rankFromLevel(lvl.level)}</div>
            {editTag ? (
              <div className="mt-2 flex items-center gap-2">
                <Input value={t} onChange={e => setT(e.target.value)} className="h-8 bg-background/20" />
                <Button size="sm" onClick={() => { setTagline(t); setEditTag(false); }} className="bg-background/20"><Check className="h-4 w-4" /></Button>
              </div>
            ) : (
              <button onClick={() => { setT(state.user.tagline); setEditTag(true); }} className="group mt-2 block">
                <span className="font-hand text-xl">"{state.user.tagline}"</span>
                <Pencil className="ml-1 inline h-3 w-3 opacity-50 group-hover:opacity-100" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* AVATAR PICKER */}
      <div className="panel rounded-2xl p-5">
        <div className="mb-3 font-display font-bold">Choose your avatar</div>
        <div className="flex flex-wrap gap-2">
          {AVATARS.map(a => (
            <button key={a} onClick={() => setEmoji(a)} className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl transition ${state.user.emoji === a ? "bg-gradient-sunset shadow-[var(--shadow-pop)]" : "bg-muted hover:bg-muted/70"}`}>{a}</button>
          ))}
        </div>
      </div>

      {/* PROGRESS */}
      <div className="panel rounded-2xl p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="font-display font-bold">Level progress</div>
          <div className="text-sm text-muted-foreground">{lvl.into} / {lvl.needed} XP</div>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-gradient-sunset transition-all duration-700" style={{ width: `${lvl.pct}%` }} />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <Link to="/goals" className="rounded-xl bg-muted/50 p-3 transition hover:bg-muted">
            <div className="font-display text-2xl font-bold text-gradient-sunset">{state.goals.length}</div>
            <div className="text-xs text-muted-foreground">Goals</div>
          </Link>
          <Link to="/achievements" className="rounded-xl bg-muted/50 p-3 transition hover:bg-muted">
            <div className="font-display text-2xl font-bold text-gradient-sunset">{state.achievements.length}/{ACHIEVEMENTS.length}</div>
            <div className="text-xs text-muted-foreground">Trophies</div>
          </Link>
          <Link to="/analytics" className="rounded-xl bg-muted/50 p-3 transition hover:bg-muted">
            <div className="font-display text-2xl font-bold text-gradient-sunset">{totalDone}</div>
            <div className="text-xs text-muted-foreground">Dreams won</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
