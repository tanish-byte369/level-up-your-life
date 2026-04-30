import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DreamDeckProvider } from "@/hooks/useDreamDeck";
import { AppShell } from "@/components/AppShell";
import Dashboard from "./pages/Dashboard";
import Goals from "./pages/Goals";
import NewGoal from "./pages/NewGoal";
import GoalDetail from "./pages/GoalDetail";
import VisionBoard from "./pages/VisionBoard";
import Analytics from "./pages/Analytics";
import Milestones from "./pages/Milestones";
import Partners from "./pages/Partners";
import Stories from "./pages/Stories";
import Motivation from "./pages/Motivation";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <DreamDeckProvider>
          <AppShell>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/goals/new" element={<NewGoal />} />
              <Route path="/goals/:id" element={<GoalDetail />} />
              <Route path="/vision-board" element={<VisionBoard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/milestones" element={<Milestones />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/stories" element={<Stories />} />
              <Route path="/motivation" element={<Motivation />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppShell>
        </DreamDeckProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
