import { Pillar, levelFromXp } from "@/lib/game";
import { Dumbbell, Coins, Brain, BookOpen, Users, Sparkles, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = { Dumbbell, Coins, Brain, BookOpen, Users, Sparkles };

interface Props {
  pillar: Pillar;
  xp: number;
  active?: boolean;
  onClick?: () => void;
}

export const PillarCard = ({ pillar, xp, active, onClick }: Props) => {
  const Icon = ICONS[pillar.icon];
  const { level, into, needed, pct } = levelFromXp(xp);
  const colorVar = `--${pillar.color}`;

  return (
    <button
      onClick={onClick}
      className={cn(
        "group panel clip-corner relative overflow-hidden p-4 text-left transition-all hover:scale-[1.02]",
        active && "ring-2 ring-offset-2 ring-offset-background"
      )}
      style={{
        // @ts-expect-error css var
        "--ring-color": `hsl(var(${colorVar}))`,
        ...(active ? { boxShadow: `0 0 24px hsl(var(${colorVar}) / 0.5), inset 0 0 0 1px hsl(var(${colorVar}) / 0.6)` } : {}),
      }}
    >
      {/* corner cut accent */}
      <div className="absolute right-0 top-0 h-3 w-3" style={{ background: `hsl(var(${colorVar}))` }} />

      <div className="flex items-start justify-between gap-2">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-sm"
          style={{
            background: `hsl(var(${colorVar}) / 0.15)`,
            border: `1px solid hsl(var(${colorVar}) / 0.4)`,
            color: `hsl(var(${colorVar}))`,
          }}
        >
          {Icon && <Icon className="h-5 w-5" />}
        </div>
        <div className="text-right">
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">LV</div>
          <div
            className="font-display text-2xl font-bold leading-none"
            style={{ color: `hsl(var(${colorVar}))`, textShadow: `0 0 12px hsl(var(${colorVar}) / 0.7)` }}
          >
            {String(level).padStart(2, "0")}
          </div>
        </div>
      </div>

      <div className="mt-3">
        <div className="font-display text-base font-bold tracking-wider" style={{ color: `hsl(var(${colorVar}))` }}>
          {pillar.name}
        </div>
        <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {pillar.tagline}
        </div>
      </div>

      <div className="mt-3">
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="absolute inset-y-0 left-0 transition-all duration-700"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(90deg, hsl(var(${colorVar}) / 0.6), hsl(var(${colorVar})))`,
              boxShadow: `0 0 8px hsl(var(${colorVar}) / 0.8)`,
            }}
          />
        </div>
        <div className="mt-1 flex justify-between font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
          <span>{into} / {needed} XP</span>
          <span>{xp} TOTAL</span>
        </div>
      </div>
    </button>
  );
};
