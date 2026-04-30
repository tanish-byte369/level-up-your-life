import { Link } from "react-router-dom";
import { CATEGORIES, Goal, goalProgress } from "@/lib/dreamdeck";
import { Calendar, Target, Users } from "lucide-react";

export function GoalCard({ goal }: { goal: Goal }) {
  const cat = CATEGORIES.find(c => c.key === goal.category)!;
  const progress = goalProgress(goal);
  const done = goal.milestones.filter(m => m.done).length;

  return (
    <Link to={`/goals/${goal.id}`} className="block group">
      <div className="card-dream overflow-hidden h-full">
        <div className={`${goal.gradient} h-32 p-5 flex items-end relative`}>
          <div className="absolute top-4 right-4 text-4xl drop-shadow-lg">{cat.emoji}</div>
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/25 backdrop-blur-sm text-white text-xs font-semibold">
              {cat.name}
            </div>
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-display text-xl font-semibold leading-tight mb-2 group-hover:text-primary transition-colors">
            {goal.title}
          </h3>
          {goal.description && <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{goal.description}</p>}

          <div className="mb-3">
            <div className="flex justify-between text-xs font-medium mb-1.5">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-foreground">{progress}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className={`h-full ${goal.gradient} transition-all duration-700`} style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Target className="w-3.5 h-3.5" />{done}/{goal.milestones.length}</span>
            {goal.deadline && <span className="inline-flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{goal.deadline}</span>}
            {goal.partnerId && <span className="inline-flex items-center gap-1 text-accent"><Users className="w-3.5 h-3.5" />Partner</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}
