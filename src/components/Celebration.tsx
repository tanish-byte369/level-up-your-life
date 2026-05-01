import { useEffect, useState } from "react";
import { useDream } from "@/hooks/useDream";

const COLORS = [
  "hsl(18 95% 60%)",
  "hsl(45 100% 60%)",
  "hsl(175 80% 55%)",
  "hsl(270 70% 60%)",
  "hsl(340 85% 65%)",
  "hsl(155 75% 55%)",
];

export function Celebration() {
  const { celebration, clearCelebration } = useDream();
  const [pieces, setPieces] = useState<{ id: number; left: number; delay: number; color: string; rotate: number }[]>([]);

  useEffect(() => {
    if (!celebration) return;
    const next = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      color: COLORS[i % COLORS.length],
      rotate: Math.random() * 360,
    }));
    setPieces(next);
    const t = setTimeout(() => clearCelebration(), 2400);
    return () => clearTimeout(t);
  }, [celebration, clearCelebration]);

  if (!celebration) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 block h-3 w-2 animate-confetti rounded-sm"
          style={{
            left: `${p.left}%`,
            background: p.color,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
      <div className="absolute inset-x-4 top-20 mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-primary/40 bg-card/95 p-4 shadow-[var(--shadow-pop)] backdrop-blur-md animate-pop-in">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-sunset text-2xl">
          {celebration.emoji}
        </div>
        <div className="min-w-0">
          <div className="font-display text-sm font-bold">Yes! 🎉</div>
          <div className="truncate text-sm text-muted-foreground">{celebration.msg}</div>
        </div>
      </div>
    </div>
  );
}
