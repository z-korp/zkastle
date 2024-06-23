import { Storage } from "./Storage";
import { Cost } from "../components/Cost";
import { useDojo } from "@/dojo/useDojo";
import { usePlayer } from "@/hooks/usePlayer";
import { useGame } from "@/hooks/useGame";
import { Surrender } from "../actions/Surrender";
import { useMemo } from "react";
import { ScoreTitle } from "../components/ScoreTitle";
import { UpgradeTitle } from "../components/UpgradeTitle";

export const GameInfo = () => {
  const {
    account: { account },
  } = useDojo();

  const { player } = usePlayer({ playerId: account?.address });
  const { game } = useGame({
    gameId: player?.game_id || "0x0",
  });

  const remaining = useMemo(() => {
    return game?.getRemaining() || 0;
  }, [game]);

  const { score, upgrade } = useMemo(() => {
    return {
      score: game?.getScore() || 0,
      upgrade: game?.getUpgrade() || 0,
    };
  }, [game]);

  if (!player || !game || game.isOver()) return null;

  return (
    <div className="grid grid-cols-3 w-full">
      <div className="flex flex-col items-start">
        <ScoreTitle score={score} />
        <UpgradeTitle score={upgrade} />
      </div>
      <div className="flex flex-col items-center">
        <span className="text-md">Remaining</span>
        <p className="text-6xl">{remaining}</p>
      </div>

      <div className="flex flex-col gap-2 w-full items-end py-1">
        <Surrender />
        <Storage />
        <Cost
          resources={[game.getStorageResource()]}
          textColor=""
          col
          gap={2}
        />
      </div>
    </div>
  );
};
