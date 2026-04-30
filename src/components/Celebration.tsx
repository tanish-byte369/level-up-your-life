import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface Props {
  show: boolean;
  title: string;
  message?: string;
  onClose: () => void;
}

const EMOJIS = ["🎉","✨","🌟","🎊","💫","⭐","🏆","🎈"];

export function Celebration({ show, title, message, onClose }: Props) {
  const [pieces, setPieces] = useState<{id:number;left:number;delay:number;emoji:string}[]>([]);

  useEffect(() => {
    if (!show) return;
    setPieces(Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.8,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    })));
    const t = setTimeout(onClose, 3600);
    return () => clearTimeout(t);
  }, [show, onClose]);

  if (!show) return null;
  return createPortal(
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {pieces.map(p => (
        <div key={p.id} className="absolute text-2xl animate-confetti"
          style={{ left: `${p.left}%`, top: "-5%", animationDelay: `${p.delay}s` }}>
          {p.emoji}
        </div>
      ))}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-auto" onClick={onClose}>
        <div className="card-dream p-8 md:p-12 text-center animate-bounce-in max-w-md mx-4 shadow-dream border-2 border-primary/20">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="font-display text-3xl md:text-4xl mb-2 text-gradient-sunset">{title}</h2>
          {message && <p className="text-muted-foreground">{message}</p>}
          <button className="mt-6 px-6 py-3 rounded-xl gradient-dream text-white font-semibold shadow-dream hover:scale-105 transition-transform">
            Keep dreaming ✨
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
