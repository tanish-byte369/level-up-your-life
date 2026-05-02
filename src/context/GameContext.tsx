import { createContext, useContext, ReactNode } from "react";
import { useGame } from "@/hooks/useGame";

type GameApi = ReturnType<typeof useGame>;
const GameContext = createContext<GameApi | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const game = useGame();
  return <GameContext.Provider value={game}>{children}</GameContext.Provider>;
}

export function useGameCtx(): GameApi {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGameCtx must be used within GameProvider");
  return ctx;
}
