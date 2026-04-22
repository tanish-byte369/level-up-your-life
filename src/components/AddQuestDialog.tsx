import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { PILLARS, PillarKey, Quest } from "@/lib/game";
import { cn } from "@/lib/utils";

interface Props {
  onAdd: (q: Omit<Quest, "id">) => void;
}

const DIFFICULTIES: { key: Quest["difficulty"]; label: string; xp: number }[] = [
  { key: "trivial", label: "TRIVIAL", xp: 15 },
  { key: "common", label: "COMMON", xp: 30 },
  { key: "rare", label: "RARE", xp: 55 },
  { key: "epic", label: "EPIC", xp: 90 },
  { key: "legendary", label: "LEGENDARY", xp: 150 },
];

export const AddQuestDialog = ({ onAdd }: Props) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pillar, setPillar] = useState<PillarKey>("physical");
  const [difficulty, setDifficulty] = useState<Quest["difficulty"]>("common");
  const [type, setType] = useState<Quest["type"]>("daily");

  const submit = () => {
    if (!title.trim()) return;
    const xp = DIFFICULTIES.find((d) => d.key === difficulty)!.xp;
    onAdd({ title: title.trim(), description: description.trim() || "Custom directive.", pillar, difficulty, type, xp });
    setTitle(""); setDescription(""); setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="clip-corner-sm border-primary/40 bg-primary/10 font-display text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary/20 hover:text-primary"
        >
          <Plus className="mr-1 h-4 w-4" /> New Directive
        </Button>
      </DialogTrigger>
      <DialogContent className="panel clip-corner max-w-md border-primary/30 bg-card">
        <DialogHeader>
          <DialogTitle className="font-display tracking-widest text-glow-cyan">::CREATE_DIRECTIVE</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div>
            <Label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Run 5K" className="mt-1 bg-input font-display" />
          </div>
          <div>
            <Label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What does completion look like?" className="mt-1 bg-input" rows={2} />
          </div>
          <div>
            <Label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Domain</Label>
            <div className="mt-1 grid grid-cols-3 gap-1.5">
              {PILLARS.map((p) => {
                const colorVar = `--${p.color}`;
                const active = pillar === p.key;
                return (
                  <button
                    key={p.key}
                    onClick={() => setPillar(p.key)}
                    className={cn("clip-corner-sm border p-2 font-mono text-[10px] font-bold uppercase tracking-wider transition-all")}
                    style={{
                      borderColor: active ? `hsl(var(${colorVar}))` : `hsl(var(${colorVar}) / 0.3)`,
                      color: `hsl(var(${colorVar}))`,
                      background: active ? `hsl(var(${colorVar}) / 0.2)` : `hsl(var(${colorVar}) / 0.05)`,
                    }}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <Label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Tier</Label>
            <div className="mt-1 grid grid-cols-5 gap-1">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.key}
                  onClick={() => setDifficulty(d.key)}
                  className={cn(
                    "clip-corner-sm border py-2 text-center font-mono text-[10px] font-bold transition-all",
                    difficulty === d.key
                      ? "border-primary bg-primary/20 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  )}
                >
                  <div>{d.label}</div>
                  <div className="text-[9px] opacity-70">+{d.xp}</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Cycle</Label>
            <div className="mt-1 grid grid-cols-3 gap-1">
              {(["daily", "weekly", "oneoff"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={cn(
                    "clip-corner-sm border py-2 font-mono text-[10px] font-bold uppercase transition-all",
                    type === t
                      ? "border-secondary bg-secondary/20 text-secondary"
                      : "border-border text-muted-foreground hover:border-secondary/40"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={submit} className="clip-corner-sm w-full bg-gradient-cyber font-display font-bold uppercase tracking-widest text-primary-foreground hover:opacity-90">
            Deploy Directive
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
