import { Quest, PILLARS } from "@/lib/game";
import { Check, Trash2, Heart, Coins, Brain, BookOpen, Users, Sparkles, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = { Heart, Coins, Brain, BookOpen, Users, Sparkles };

interface Props {
  quest: Quest;
  completed: boolean;
  onComplete: () => void;
  onRemove?: () => void;
}

export const QuestRow = ({ quest, completed, onComplete, onRemove }: Props) => {
  const pillar = PILLARS.find((p) => p.key === quest.pillar)!;
  const colorVar = `--${pillar.color}`;
  const Icon = ICONS[pillar.icon];

  return (
    <div
      className={cn(
        "panel group relative flex items-center gap-3 rounded-lg p-3 transition-all hover:border-primary/30",
        completed && "opacity-60"
      )}
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md"
        style={{
          background: `hsl(var(${colorVar}) / 0.12)`,
          color: `hsl(var(${colorVar}))`,
        }}
      >
        {Icon && <Icon className="h-4 w-4" />}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className={cn("font-serif text-base font-semibold leading-tight text-foreground", completed && "line-through")}>
          {quest.title}
        </h3>
        <p className="font-serif text-xs text-muted-foreground">
          XP <span className="text-primary">{quest.xp}</span>
          <span className="mx-1.5 text-border">·</span>
          <span className="capitalize">{quest.difficulty}</span>
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {onRemove && (
          <button
            onClick={onRemove}
            className="text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
            aria-label="Delete custom quest"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={onComplete}
          disabled={completed}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded border transition-all",
            completed
              ? "border-success bg-success/20 text-success"
              : "border-border hover:border-primary hover:bg-primary/10 hover:text-primary"
          )}
          aria-label={completed ? "Completed" : "Complete quest"}
        >
          {completed && <Check className="h-4 w-4" strokeWidth={3} />}
        </button>
      </div>
    </div>
  );
};
