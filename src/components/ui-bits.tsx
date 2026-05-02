import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export const SectionHeader = ({ title, subtitle, inline, action }: { title: string; subtitle?: string; inline?: boolean; action?: React.ReactNode }) => (
  <div className={cn("flex items-end justify-between gap-3 flex-wrap", !inline && "mb-4")}>
    <div>
      <h2 className="flex items-baseline gap-2 font-display text-lg font-semibold uppercase tracking-[0.15em] text-foreground sm:text-xl">
        <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
        {title}
      </h2>
      {subtitle && <p className="mt-1 font-serif text-sm italic text-muted-foreground">{subtitle}</p>}
    </div>
    {action}
  </div>
);

export const StatCrest = ({
  icon: Icon, label, value, accent, suffix, onClick,
}: { icon: LucideIcon; label: string; value: number | string; accent: "primary" | "warning" | "accent" | "success" | "dream"; suffix?: string; onClick?: () => void }) => {
  const accentMap: Record<string, string> = {
    primary: "hsl(var(--primary))",
    warning: "hsl(var(--warning))",
    accent: "hsl(var(--accent))",
    success: "hsl(var(--success))",
    dream: "hsl(var(--insp-violet))",
  };
  const c = accentMap[accent];
  const Cmp = onClick ? "button" : "div";
  return (
    <Cmp
      onClick={onClick}
      className={cn(
        "panel ornate-corner relative rounded-lg p-3 text-center transition-all w-full",
        onClick && "hover:border-primary/40 hover:-translate-y-0.5"
      )}
    >
      <div
        className="mx-auto mb-1.5 flex h-9 w-9 items-center justify-center rounded-full"
        style={{ background: c.replace(")", " / 0.15)"), border: `1px solid ${c.replace(")", " / 0.4)")}`, color: c }}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="font-display text-xl font-bold" style={{ color: c }}>
        {value}{suffix && <span className="ml-0.5 text-sm opacity-70">{suffix}</span>}
      </div>
      <div className="font-serif text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </Cmp>
  );
};
