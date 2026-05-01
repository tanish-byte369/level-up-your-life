import { useDream } from "@/hooks/useDream";
import { ACHIEVEMENTS, levelFromXp } from "@/lib/dream";
import { Lock } from "lucide-react";

export default function Achievements() {
  const { state } = useDream();
  const lvl = levelFromXp(state.totalXP);
  const unlocked = new Set(state.achievements);

  return (
    <div className="mx-auto max-w-5xl space-y-5 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-bold">Hall of Trophies 🏆</h1>
        <p className="text-sm text-muted-foreground">{unlocked.size} of {ACHIEVEMENTS.length} unlocked · Level {lvl.level}</p>
      </div>

      <div className="panel rounded-2xl p-4">
        <div className="mb-2 flex justify-between text-xs text-muted-foreground">
          <span>Collection</span>
          <span>{Math.round((unlocked.size / ACHIEVEMENTS.length) * 100)}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-gradient-sunset transition-all duration-700" style={{ width: `${(unlocked.size / ACHIEVEMENTS.length) * 100}%` }} />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ACHIEVEMENTS.map(a => {
          const got = unlocked.has(a.id);
          return (
            <div key={a.id} className={`panel rounded-2xl p-5 transition ${got ? "border-primary/40 shadow-[0_0_24px_hsl(var(--primary)/0.2)]" : "opacity-70"}`}>
              <div className="flex items-start gap-3">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-3xl ${got ? "bg-gradient-sunset" : "bg-muted"}`}>
                  {got ? a.emoji : <Lock className="h-5 w-5 text-muted-foreground" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-display font-bold">{a.name}</div>
                  <div className="text-sm text-muted-foreground">{a.desc}</div>
                  <div className={`mt-1 text-xs font-semibold ${got ? "text-primary" : "text-muted-foreground"}`}>+{a.xp} XP</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
