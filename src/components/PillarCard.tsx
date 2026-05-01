import { Pillar, levelFromXp } from "@/lib/game";
import { Heart, Coins, Brain, BookOpen, Users, Sparkles, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = { Heart, Coins, Brain, BookOpen, Users, Sparkles };

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
        "group panel relative flex items-center gap-3 rounded-lg p-4 text-left transition-all hover:border-primary/40",
        active && "border-primary/60"
      )}
    >
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md"
        style={{
          background: `hsl(var(${colorVar}) / 0.12)`,
          border: `1px solid hsl(var(${colorVar}) / 0.3)`,
          color: `hsl(var(${colorVar}))`,
        }}
      >
        {Icon && <Icon className="h-5 w-5" />}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-baseline justify-between gap-2">
          <span className="font-display text-sm font-semibold text-foreground">{pillar.name}</span>
          <span className="font-serif text-xs text-muted-foreground">
            Lv. <span className="font-semibold text-foreground">{level}</span>
          </span>
        </div>
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(90deg, hsl(var(${colorVar}) / 0.7), hsl(var(${colorVar})))`,
              boxShadow: `0 0 10px hsl(var(${colorVar}) / 0.6)`,
            }}
          />
        </div>
        <div className="mt-1 text-right font-serif text-[11px] text-muted-foreground">
          {into} / {needed}
        </div>
      </div>
    </button>
  );
};
