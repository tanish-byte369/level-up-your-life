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
  { key: "trivial", label: "Trivial", xp: 15 },
  { key: "common", label: "Common", xp: 30 },
  { key: "rare", label: "Rare", xp: 55 },
  { key: "epic", label: "Epic", xp: 90 },
  { key: "legendary", label: "Legendary", xp: 150 },
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
    onAdd({ title: title.trim(), description: description.trim() || "Custom quest.", pillar, difficulty, type, xp });
    setTitle(""); setDescription(""); setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gold-border bg-primary/10 font-display text-xs font-semibold text-primary hover:bg-primary/20 hover:text-primary"
        >
          <Plus className="mr-1 h-4 w-4" /> New Quest
        </Button>
      </DialogTrigger>
      <DialogContent className="panel-elevated max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-glow-gold">Forge a New Quest</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div>
            <Label className="font-serif text-sm text-muted-foreground">Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Run 5K" className="mt-1 bg-input font-serif" />
          </div>
          <div>
            <Label className="font-serif text-sm text-muted-foreground">Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What does completion look like?" className="mt-1 bg-input font-serif" rows={2} />
          </div>
          <div>
            <Label className="font-serif text-sm text-muted-foreground">Attribute</Label>
            <div className="mt-1 grid grid-cols-3 gap-1.5">
              {PILLARS.map((p) => {
                const colorVar = `--${p.color}`;
                const active = pillar === p.key;
                return (
                  <button
                    key={p.key}
                    onClick={() => setPillar(p.key)}
                    className={cn("rounded-md border px-2 py-1.5 font-display text-xs font-semibold transition-all")}
                    style={{
                      borderColor: active ? `hsl(var(${colorVar}))` : `hsl(var(${colorVar}) / 0.25)`,
                      color: `hsl(var(${colorVar}))`,
                      background: active ? `hsl(var(${colorVar}) / 0.18)` : `hsl(var(${colorVar}) / 0.05)`,
                    }}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <Label className="font-serif text-sm text-muted-foreground">Difficulty</Label>
            <div className="mt-1 grid grid-cols-5 gap-1">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.key}
                  onClick={() => setDifficulty(d.key)}
                  className={cn(
                    "rounded-md border py-2 text-center font-display text-[10px] font-semibold transition-all",
                    difficulty === d.key
                      ? "border-primary bg-primary/20 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  )}
                >
                  <div>{d.label}</div>
                  <div className="font-serif text-[10px] opacity-70">+{d.xp}</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label className="font-serif text-sm text-muted-foreground">Cycle</Label>
            <div className="mt-1 grid grid-cols-3 gap-1">
              {(["daily", "weekly", "oneoff"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={cn(
                    "rounded-md border py-2 font-display text-xs font-semibold capitalize transition-all",
                    type === t
                      ? "border-primary bg-primary/20 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={submit} className="w-full bg-gradient-ember font-display font-semibold tracking-wide text-primary-foreground hover:opacity-90">
            Forge Quest
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
