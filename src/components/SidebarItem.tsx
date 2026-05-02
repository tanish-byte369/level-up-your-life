import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export const SidebarItem = ({ icon: Icon, label, active, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-all",
        active
          ? "bg-primary/15 text-primary border border-primary/30 shadow-[inset_0_0_20px_hsl(var(--primary)/0.08)]"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      )}
    >
      <Icon className={cn("h-4 w-4", active && "text-primary")} />
      <span className="font-display text-sm font-medium tracking-wide">{label}</span>
    </button>
  );
};
