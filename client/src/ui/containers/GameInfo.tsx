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

  const { player } = usePlayer({ playerId: account.address });
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
    <div className="h-full w-full flex justify-between items-start">
      <div className="flex flex-col gap-2 items-center">
        <span className="text-lg">Remaining</span>
        <p className="text-6xl">{remaining}</p>
      </div>

      <ScoreTitle score={score} />
      <UpgradeTitle score={upgrade} />

      <div className="flex flex-col gap-2">
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
