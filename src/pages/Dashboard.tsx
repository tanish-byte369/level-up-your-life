import { Link } from "react-router-dom";
import { useDreamDeck } from "@/hooks/useDreamDeck";
import { CATEGORIES, goalProgress } from "@/lib/dreamdeck";
import { GoalCard } from "@/components/GoalCard";
import { Flame, Target, Trophy, TrendingUp, Plus, Sparkles, Users, BookHeart, Image, BarChart3 } from "lucide-react";

export default function Dashboard() {
  const { state } = useDreamDeck();
  const totalGoals = state.goals.length;
  const completedMilestones = state.goals.reduce((acc, g) => acc + g.milestones.filter(m => m.done).length, 0);
  const totalMilestones = state.goals.reduce((acc, g) => acc + g.milestones.length, 0);
  const avgProgress = totalGoals ? Math.round(state.goals.reduce((a, g) => a + goalProgress(g), 0) / totalGoals) : 0;
  const matched = state.partners.filter(p => p.matched).length;

  const stats = [
    { label: "Active goals", value: totalGoals, icon: Target, grad: "gradient-dream", to: "/goals" },
    { label: "Streak", value: `${state.streak} days`, icon: Flame, grad: "gradient-sunset", to: "/analytics" },
    { label: "Milestones hit", value: `${completedMilestones}/${totalMilestones}`, icon: Trophy, grad: "gradient-gold", to: "/milestones" },
    { label: "Avg progress", value: `${avgProgress}%`, icon: TrendingUp, grad: "gradient-teal", to: "/analytics" },
  ];

  const quickLinks = [
    { to: "/vision-board", label: "Vision Board", icon: Image, desc: "Visualize your dreams", grad: "gradient-sunset" },
    { to: "/partners", label: "Find a Partner", icon: Users, desc: `${matched} matched · 6 available`, grad: "gradient-dream" },
    { to: "/stories", label: "Success Stories", icon: BookHeart, desc: "Real people · real wins", grad: "gradient-teal" },
    { to: "/analytics", label: "Analytics", icon: BarChart3, desc: "See your progress charts", grad: "gradient-gold" },
  ];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl gradient-aurora p-8 md:p-12 text-white shadow-dream">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="relative">
          <div className="text-sm uppercase tracking-[0.2em] font-semibold opacity-90 mb-3">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-4">
            Welcome back,<br />
            <span className="italic">{state.userName}</span> ✨
          </h1>
          <p className="text-lg md:text-xl opacity-95 max-w-xl mb-6">
            You're {avgProgress}% of the way toward your dreams. One milestone at a time.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/goals/new" className="px-6 py-3 rounded-xl bg-white text-primary font-semibold hover:scale-105 transition-transform inline-flex items-center gap-2 shadow-lg">
              <Plus className="w-4 h-4" /> New goal
            </Link>
            <Link to="/vision-board" className="px-6 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold hover:bg-white/30 transition-colors inline-flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Vision board
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <Link key={s.label} to={s.to} className="card-dream p-5 group">
            <div className={`w-10 h-10 rounded-xl ${s.grad} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <div className="font-display text-3xl font-bold">{s.value}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{s.label}</div>
          </Link>
        ))}
      </section>

      {/* Categories */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="font-display text-2xl font-bold">Explore by category</h2>
            <p className="text-sm text-muted-foreground">Every dimension of your life.</p>
          </div>
          <Link to="/goals" className="text-sm font-semibold text-primary hover:underline">See all →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CATEGORIES.map(c => {
            const count = state.goals.filter(g => g.category === c.key).length;
            return (
              <Link key={c.key} to={`/goals?category=${c.key}`}
                className="card-dream p-4 text-center group hover:scale-105">
                <div className="text-3xl mb-2 group-hover:scale-125 transition-transform">{c.emoji}</div>
                <div className="font-semibold text-sm">{c.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{count} goal{count !== 1 ? "s" : ""}</div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Active goals */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="font-display text-2xl font-bold">Your active dreams</h2>
            <p className="text-sm text-muted-foreground">Click any goal to dive in.</p>
          </div>
          <Link to="/goals" className="text-sm font-semibold text-primary hover:underline">Manage all →</Link>
        </div>
        {state.goals.length === 0 ? (
          <div className="card-dream p-10 text-center">
            <div className="text-5xl mb-3">🌱</div>
            <h3 className="font-display text-xl font-bold mb-2">Plant your first dream</h3>
            <p className="text-muted-foreground mb-4">Every great life starts with a single goal.</p>
            <Link to="/goals/new" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-dream text-white font-semibold">
              <Plus className="w-4 h-4" /> Create a goal
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {state.goals.slice(0, 6).map(g => <GoalCard key={g.id} goal={g} />)}
          </div>
        )}
      </section>

      {/* Quick links */}
      <section>
        <h2 className="font-display text-2xl font-bold mb-4">Dive deeper</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map(q => (
            <Link key={q.to} to={q.to} className="card-dream p-5 group">
              <div className={`w-12 h-12 rounded-xl ${q.grad} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <q.icon className="w-6 h-6 text-white" />
              </div>
              <div className="font-display font-bold text-lg">{q.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{q.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent celebrations */}
      {state.celebrations.length > 0 && (
        <section>
          <h2 className="font-display text-2xl font-bold mb-4">Recent wins 🎉</h2>
          <div className="space-y-2">
            {state.celebrations.slice(0, 5).map(c => (
              <div key={c.id} className="card-dream p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center">🏆</div>
                <div className="flex-1">
                  <div className="font-semibold">{c.goalTitle}</div>
                  <div className="text-xs text-muted-foreground">Completed · {new Date(c.at).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
