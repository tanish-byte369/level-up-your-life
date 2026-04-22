import { Quest, PILLARS } from "@/lib/game";
import { Check, Trash2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  quest: Quest;
  completed: boolean;
  onComplete: () => void;
  onRemove?: () => void;
}

const DIFF_LABEL: Record<Quest["difficulty"], string> = {
  trivial: "T1",
  common: "T2",
  rare: "T3",
  epic: "T4",
  legendary: "T5",
};

export const QuestRow = ({ quest, completed, onComplete, onRemove }: Props) => {
  const pillar = PILLARS.find((p) => p.key === quest.pillar)!;
  const colorVar = `--${pillar.color}`;

  return (
    <div
      className={cn(
        "panel clip-corner-sm group relative flex items-center gap-3 p-3 transition-all",
        completed && "opacity-50"
      )}
      style={{ borderLeft: `3px solid hsl(var(${colorVar}))` }}
    >
      <button
        onClick={onComplete}
        disabled={completed}
        className={cn(
          "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border-2 transition-all",
          completed ? "border-success bg-success/20" : "border-border hover:scale-110"
        )}
        style={
          !completed
            ? {
                borderColor: `hsl(var(${colorVar}) / 0.5)`,
                background: `hsl(var(${colorVar}) / 0.08)`,
              }
            : undefined
        }
        aria-label={completed ? "Completed" : "Complete quest"}
      >
        {completed ? (
          <Check className="h-5 w-5 text-success" />
        ) : (
          <Zap className="h-4 w-4 transition-transform group-hover:scale-125" style={{ color: `hsl(var(${colorVar}))` }} />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className={cn("font-display text-sm font-bold leading-tight tracking-wide", completed && "line-through")}>
            {quest.title}
          </h3>
          <span
            className="font-mono text-[9px] font-bold uppercase tracking-widest"
            style={{ color: `hsl(var(${colorVar}))` }}
          >
            {DIFF_LABEL[quest.difficulty]}
          </span>
        </div>
        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{quest.description}</p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <div
          className="rounded-sm px-2 py-1 font-mono text-xs font-bold"
          style={{
            background: `hsl(var(${colorVar}) / 0.15)`,
            color: `hsl(var(${colorVar}))`,
            border: `1px solid hsl(var(${colorVar}) / 0.3)`,
          }}
        >
          +{quest.xp}
        </div>
        {onRemove && (
          <button
            onClick={onRemove}
            className="text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
            aria-label="Delete custom quest"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};
