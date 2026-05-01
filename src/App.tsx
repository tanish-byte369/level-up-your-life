import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DreamProvider } from "@/hooks/useDream";
import AppLayout from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Goals from "@/pages/Goals";
import GoalDetail from "@/pages/GoalDetail";
import VisionBoard from "@/pages/VisionBoard";
import Analytics from "@/pages/Analytics";
import Partners from "@/pages/Partners";
import Stories from "@/pages/Stories";
import StoryDetail from "@/pages/StoryDetail";
import Achievements from "@/pages/Achievements";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import CategoryPage from "@/pages/CategoryPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <DreamProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/goals/:id" element={<GoalDetail />} />
              <Route path="/vision" element={<VisionBoard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/stories" element={<Stories />} />
              <Route path="/stories/:id" element={<StoryDetail />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/category/:key" element={<CategoryPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </DreamProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
