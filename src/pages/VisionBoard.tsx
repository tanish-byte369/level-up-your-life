import { useState } from "react";
import { useDream } from "@/hooks/useDream";
import { CATEGORIES, CategoryKey, VISION_TEMPLATES } from "@/lib/dream";
import { Plus, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const NOTE_COLORS: Record<string, string> = {
  yellow: "linear-gradient(135deg, hsl(45 100% 70%), hsl(45 100% 55%))",
  teal:   "linear-gradient(135deg, hsl(175 80% 65%), hsl(175 80% 50%))",
  purple: "linear-gradient(135deg, hsl(270 70% 70%), hsl(270 70% 55%))",
  orange: "linear-gradient(135deg, hsl(28 100% 70%), hsl(18 95% 60%))",
  pink:   "linear-gradient(135deg, hsl(340 90% 75%), hsl(340 85% 60%))",
};
const NOTE_NAMES = Object.keys(NOTE_COLORS);
const EMOJIS = ["✨","🌟","💫","🌈","🌍","🏖️","🏔️","🎨","📚","💪","🚀","💖","🌻","☀️","🍜","✈️","🏡","💰","🎯","🔥"];

export default function VisionBoard() {
  const { state, addVisionItem, removeVisionItem, moveVisionItem, applyTemplate } = useDream();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [emoji, setEmoji] = useState("✨");
  const [category, setCategory] = useState<CategoryKey>("creative");
  const [color, setColor] = useState("yellow");
  const [dragId, setDragId] = useState<string | null>(null);

  function add() {
    if (!text.trim()) return;
    addVisionItem({
      text: text.trim(), emoji, category, color,
      x: 20 + Math.random() * 60, y: 20 + Math.random() * 60,
      rotation: -6 + Math.random() * 12,
    });
    setText(""); setOpen(false);
  }

  function onDragStart(e: React.PointerEvent, id: string) {
    setDragId(id);
    (e.target as Element).setPointerCapture(e.pointerId);
  }
  function onDragMove(e: React.PointerEvent) {
    if (!dragId) return;
    const board = document.getElementById("vision-board");
    if (!board) return;
    const rect = board.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    moveVisionItem(dragId, Math.max(2, Math.min(92, x)), Math.max(2, Math.min(90, y)));
  }
  function onDragEnd() { setDragId(null); }

  return (
    <div className="mx-auto max-w-6xl space-y-5 animate-fade-in">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Vision Board ✨</h1>
          <p className="text-sm text-muted-foreground">Drag to rearrange. Tap × to remove.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="btn-pop gap-2"><Plus className="h-4 w-4" /> Add Dream</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-display">Pin a dream 📌</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input value={text} onChange={e => setText(e.target.value)} placeholder="What do you dream of?" autoFocus />
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Emoji</label>
                <div className="mt-1 flex flex-wrap gap-1">
                  {EMOJIS.map(e => (
                    <button key={e} onClick={() => setEmoji(e)} className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg transition ${emoji===e ? "bg-gradient-sunset shadow-[var(--shadow-pop)]" : "bg-muted hover:bg-muted/70"}`}>{e}</button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value as CategoryKey)} className="mt-1 w-full rounded-md border border-input bg-input px-3 py-2 text-sm">
                    {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.emoji} {c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Sticky color</label>
                  <div className="mt-1 flex gap-1.5">
                    {NOTE_NAMES.map(n => (
                      <button key={n} onClick={() => setColor(n)} className={`h-9 w-9 rounded-lg transition ${color===n ? "ring-2 ring-foreground ring-offset-2 ring-offset-background" : ""}`} style={{ background: NOTE_COLORS[n] }} />
                    ))}
                  </div>
                </div>
              </div>
              <Button onClick={add} className="btn-pop w-full">Pin it ✨</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Templates */}
      <div className="panel rounded-2xl p-4">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-display text-sm font-bold">Quick-start templates</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {VISION_TEMPLATES.map(t => (
            <button key={t.id} onClick={() => applyTemplate(t.items)} className="shrink-0 rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold transition hover:border-primary hover:text-primary">
              <span className="mr-1.5">{t.emoji}</span>{t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Board */}
      <div
        id="vision-board"
        onPointerMove={onDragMove}
        onPointerUp={onDragEnd}
        className="relative h-[70vh] min-h-[500px] overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-tertiary/20 via-card to-primary/10"
        style={{
          backgroundImage: "radial-gradient(circle at 20% 20%, hsl(var(--tertiary)/0.18), transparent 40%), radial-gradient(circle at 80% 80%, hsl(var(--primary)/0.18), transparent 40%), radial-gradient(circle at 50% 50%, hsl(var(--secondary)/0.1), transparent 50%)",
        }}
      >
        {state.vision.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className="text-5xl">📌</div>
            <div className="mt-2 font-display text-lg font-bold">Your board is empty</div>
            <div className="text-sm text-muted-foreground">Tap "Add Dream" or pick a template above.</div>
          </div>
        )}
        {state.vision.map(v => (
          <div
            key={v.id}
            onPointerDown={(e) => onDragStart(e, v.id)}
            className="group absolute w-36 cursor-grab select-none rounded-xl p-3 shadow-lg transition active:cursor-grabbing sm:w-40"
            style={{
              left: `${v.x}%`, top: `${v.y}%`,
              transform: `translate(-50%, -50%) rotate(${v.rotation}deg)`,
              background: NOTE_COLORS[v.color] || NOTE_COLORS.yellow,
              color: "hsl(265 50% 10%)",
              touchAction: "none",
            }}
          >
            <button onClick={(e) => { e.stopPropagation(); removeVisionItem(v.id); }} className="absolute -right-2 -top-2 hidden h-6 w-6 items-center justify-center rounded-full bg-card text-foreground shadow group-hover:flex">
              <X className="h-3 w-3" />
            </button>
            <div className="text-2xl">{v.emoji}</div>
            <div className="mt-1 font-hand text-xl font-bold leading-tight">{v.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
