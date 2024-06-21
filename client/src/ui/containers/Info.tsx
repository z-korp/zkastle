import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Storage } from "./Storage";
import { Cost } from "../components/Cost";
import { useDojo } from "@/dojo/useDojo";
import { usePlayer } from "@/hooks/usePlayer";
import { useGame } from "@/hooks/useGame";
import { Surrender } from "../actions/Surrender";
import { useMemo } from "react";

export const Info = ({
  count,
  score,
}: {
  count: number;
  score: number;
  height?: string;
  width?: string;
  scale?: string;
}) => {
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

  if (!player || !game || game.isOver()) return null;

  return (
    <div className="h-full w-full flex justify-between items-start">
      <div className="flex flex-col gap-2 items-center">
        <span className="text-lg">Remaining</span>
        <p className="text-6xl">{remaining}</p>
      </div>

      <div className="flex flex-col justify-center items-center gap-2">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon
            icon={faStar}
            size="2xs"
            className="text-yellow-500"
          />
          <p className="text-base">Score</p>
          <FontAwesomeIcon
            size="2xs"
            icon={faStar}
            className="text-yellow-500"
          />
        </div>
        <span className="font-bold text-4xl">{score}</span>
      </div>

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
