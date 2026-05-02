import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GameProvider } from "@/context/GameContext";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "./pages/Dashboard";
import Character from "./pages/Character";
import Skills from "./pages/Skills";
import Quests from "./pages/Quests";
import Chronicle from "./pages/Chronicle";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <GameProvider>
          <Routes>
            <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
            <Route path="/character" element={<AppLayout><Character /></AppLayout>} />
            <Route path="/skills" element={<AppLayout><Skills /></AppLayout>} />
            <Route path="/skills/:pillar" element={<AppLayout><Skills /></AppLayout>} />
            <Route path="/quests" element={<AppLayout><Quests /></AppLayout>} />
            <Route path="/chronicle" element={<AppLayout><Chronicle /></AppLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </GameProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
