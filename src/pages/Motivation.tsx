import { useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";

const QUOTES = [
  { t: "You are never too old to set another goal or to dream a new dream.", a: "C.S. Lewis" },
  { t: "The future belongs to those who believe in the beauty of their dreams.", a: "Eleanor Roosevelt" },
  { t: "A goal without a plan is just a wish.", a: "Antoine de Saint-Exupéry" },
  { t: "Don't watch the clock; do what it does. Keep going.", a: "Sam Levenson" },
  { t: "It always seems impossible until it's done.", a: "Nelson Mandela" },
  { t: "You don't have to be great to start, but you have to start to be great.", a: "Zig Ziglar" },
  { t: "Small daily improvements are the key to staggering long-term results.", a: "Robin Sharma" },
  { t: "What you seek is seeking you.", a: "Rumi" },
  { t: "Discipline is choosing between what you want now and what you want most.", a: "Abraham Lincoln" },
  { t: "The only way to do great work is to love what you do.", a: "Steve Jobs" },
];

const AFFIRMATIONS = [
  "I am capable of extraordinary things.",
  "Every day I grow stronger and wiser.",
  "My dreams are valid and worth pursuing.",
  "I celebrate small wins — they build big ones.",
  "I am exactly where I need to be.",
  "I choose progress over perfection.",
  "My future is bright and beautiful.",
  "I turn setbacks into comebacks.",
];

const PROMPTS = [
  "What would you do today if you knew you couldn't fail?",
  "Name one thing you're grateful for right now.",
  "What is one tiny step you can take today toward your biggest dream?",
  "Who do you want to become in 5 years? What is that person doing today?",
  "What's one fear you can gently walk toward this week?",
  "If you had unlimited energy for one hour, what would you use it on?",
];

export default function Motivation() {
  const [qi, setQi] = useState(0);
  const [ai, setAi] = useState(0);
  const [pi, setPi] = useState(0);

  const q = QUOTES[qi % QUOTES.length];
  const a = AFFIRMATIONS[ai % AFFIRMATIONS.length];
  const p = PROMPTS[pi % PROMPTS.length];

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="font-display text-4xl md:text-5xl font-bold">Motivation</h1>
        <p className="text-muted-foreground text-lg mt-1">Fuel for the journey.</p>
      </header>

      <div className="card-dream gradient-aurora p-8 md:p-12 text-white relative overflow-hidden">
        <div className="text-6xl opacity-30 font-display leading-none">"</div>
        <blockquote className="font-display text-2xl md:text-4xl font-bold leading-tight -mt-4">{q.t}</blockquote>
        <div className="mt-4 text-sm font-semibold opacity-90">— {q.a}</div>
        <button onClick={() => setQi(qi + 1)} className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-sm font-semibold hover:bg-white/30">
          <RefreshCw className="w-4 h-4" /> New quote
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="card-dream gradient-sunset p-6 text-white">
          <div className="text-xs uppercase tracking-widest font-bold opacity-90 mb-2">Today's affirmation</div>
          <div className="font-display text-2xl font-bold leading-tight">{a}</div>
          <button onClick={() => setAi(ai + 1)} className="mt-4 text-xs font-semibold inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30">
            <RefreshCw className="w-3.5 h-3.5" /> Next
          </button>
        </div>
        <div className="card-dream gradient-teal p-6 text-white">
          <div className="text-xs uppercase tracking-widest font-bold opacity-90 mb-2">Journal prompt</div>
          <div className="font-display text-2xl font-bold leading-tight">{p}</div>
          <button onClick={() => setPi(pi + 1)} className="mt-4 text-xs font-semibold inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30">
            <RefreshCw className="w-3.5 h-3.5" /> Next prompt
          </button>
        </div>
      </div>

      <div className="card-dream p-6 md:p-8">
        <h2 className="font-display text-2xl font-bold mb-4">60-second reset</h2>
        <BreathingBox />
      </div>
    </div>
  );
}

function BreathingBox() {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<"inhale"|"hold"|"exhale"|"rest">("inhale");

  useMemo(() => {
    if (!running) return;
    const order: typeof phase[] = ["inhale","hold","exhale","rest"];
    let i = 0;
    setPhase(order[0]);
    const iv = setInterval(() => {
      i = (i + 1) % 4;
      setPhase(order[i]);
    }, 4000);
    return () => clearInterval(iv);
  }, [running]);

  const size = phase === "inhale" ? "scale-110" : phase === "exhale" ? "scale-75" : "scale-95";
  const label = { inhale: "Breathe in", hold: "Hold", exhale: "Breathe out", rest: "Rest" }[phase];

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <div className={`w-48 h-48 rounded-full gradient-dream flex items-center justify-center text-white font-display text-2xl font-bold transition-transform duration-[4000ms] ease-in-out ${running ? size : ""}`}>
        {running ? label : "Ready?"}
      </div>
      <button onClick={() => setRunning(r => !r)}
        className="px-6 py-2.5 rounded-xl gradient-sunset text-white font-semibold">
        {running ? "Stop" : "Start breathing"}
      </button>
    </div>
  );
}
