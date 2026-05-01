import { Link, useNavigate, useParams } from "react-router-dom";
import { useDream } from "@/hooks/useDream";
import { CATEGORIES } from "@/lib/dream";
import { ArrowLeft, Heart } from "lucide-react";

export default function StoryDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { state, toggleLikeStory } = useDream();
  const story = state.stories.find(s => s.id === id);

  if (!story) return (
    <div className="mx-auto max-w-2xl py-20 text-center">
      <div className="text-5xl">🔍</div>
      <h2 className="mt-3 font-display text-xl font-bold">Story not found</h2>
      <Link to="/stories" className="mt-4 inline-block text-primary hover:underline">← Back</Link>
    </div>
  );

  const cat = CATEGORIES.find(c => c.key === story.category)!;

  return (
    <div className="mx-auto max-w-2xl space-y-5 animate-fade-in">
      <button onClick={() => nav(-1)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="relative overflow-hidden rounded-3xl p-8" style={{ background: `linear-gradient(135deg, ${cat.hue}, hsl(265 50% 10%))` }}>
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="relative">
          <Link to={`/category/${cat.key}`} className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-primary-foreground backdrop-blur hover:bg-white/25">{cat.emoji} {cat.name}</Link>
          <h1 className="mt-3 font-display text-3xl font-bold text-primary-foreground">{story.title}</h1>
          <div className="mt-2 text-sm text-primary-foreground/80">by {story.author}</div>
        </div>
      </div>

      <article className="panel rounded-2xl p-6 text-base leading-relaxed">
        {story.body.split("\n").map((p, i) => <p key={i} className="mb-3">{p}</p>)}
      </article>

      <div className="flex items-center justify-between">
        <button onClick={() => toggleLikeStory(story.id)} className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold transition ${story.liked ? "bg-destructive/15 text-destructive" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
          <Heart className={`h-5 w-5 ${story.liked ? "fill-current" : ""}`} />
          {story.likes} {story.liked ? "you ♥ this" : "give love"}
        </button>
        <Link to="/stories" className="text-sm text-primary hover:underline">More stories →</Link>
      </div>
    </div>
  );
}
