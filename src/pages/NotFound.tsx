import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md py-20 text-center animate-fade-in">
      <div className="text-7xl animate-float">🌠</div>
      <h1 className="mt-4 font-display text-3xl font-bold">Lost in the dreamspace</h1>
      <p className="mt-2 text-sm text-muted-foreground">This page doesn't exist yet — but your dreams do.</p>
      <Link to="/" className="btn-pop mt-6 inline-flex items-center gap-2 px-6 py-2.5 text-sm">
        <Home className="h-4 w-4" /> Take me home
      </Link>
    </div>
  );
}
