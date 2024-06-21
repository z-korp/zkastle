import { useDojo } from "@/dojo/useDojo";
import { usePlayer } from "@/hooks/usePlayer";
import { useGame } from "@/hooks/useGame";
import { useMemo } from "react";
import { ScoreTitle } from "../components/ScoreTitle";
import { UpgradeTitle } from "../components/UpgradeTitle";

export const GameOver = () => {
  const {
    account: { account },
  } = useDojo();

  const { player } = usePlayer({ playerId: account.address });
  const { game } = useGame({
    gameId: player?.game_id || "0x0",
  });

  const { score, upgrade } = useMemo(() => {
    return {
      score: game?.getScore() || 0,
      upgrade: game?.getUpgrade() || 0,
    };
  }, [game]);

  if (!player || !game || !game.isOver()) return null;

  return (
    <div className="absolute top-1/2 right-1/2 translate-x-1/2 translate-y-1/2 flex flex-col gap-8">
      <p className="text-4xl text-center">Game Over</p>
      <div className="h-full w-full flex justify-center gap-8 items-start">
        <ScoreTitle score={score} />
        <UpgradeTitle score={upgrade} />
      </div>
    </div>
  );
};
