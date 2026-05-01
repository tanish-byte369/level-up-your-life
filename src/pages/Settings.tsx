import { useDream } from "@/hooks/useDream";
import { Button } from "@/components/ui/button";
import { Trash2, Download, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const { state, reset } = useDream();

  function exportData() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "dreamdeck-backup.json"; a.click();
    URL.revokeObjectURL(url);
    toast.success("Backup downloaded ✨");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5 animate-fade-in">
      <h1 className="font-display text-3xl font-bold">Settings ⚙️</h1>

      <div className="panel rounded-2xl p-5">
        <div className="mb-1 font-display font-bold">Your data</div>
        <p className="text-sm text-muted-foreground">DreamDeck stores your progress locally — nothing leaves your device.</p>
        <Button onClick={exportData} className="btn-pop mt-3 gap-2"><Download className="h-4 w-4" /> Export backup</Button>
      </div>

      <div className="panel rounded-2xl border-destructive/40 p-5">
        <div className="mb-1 font-display font-bold text-destructive">Danger zone</div>
        <p className="text-sm text-muted-foreground">This wipes all goals, vision items, and progress.</p>
        <Button onClick={reset} variant="destructive" className="mt-3 gap-2"><Trash2 className="h-4 w-4" /> Reset everything</Button>
      </div>

      <div className="rounded-2xl bg-gradient-aurora p-5 text-secondary-foreground">
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6" />
          <div>
            <div className="font-display font-bold">DreamDeck v1.0</div>
            <div className="text-xs opacity-80">Built with love for dreamers like you.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
