import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge } from "../elements/badge";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Storage } from "./Storage";
import { Cost } from "../components/Cost";
import { useDojo } from "@/dojo/useDojo";
import { usePlayer } from "@/hooks/usePlayer";
import { useGame } from "@/hooks/useGame";

export const Info = ({
  count,
  score,
  height = "h-96",
  width = "w-60",
  scale = "scale-100",
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

  if (!player || !game || game.isOver()) return null;

  return (
    <div
      className={`relative ${height} ${width} rounded-2xl overflow-clip bg-slate-700 ${scale}`}
    >
      <Badge className="h-full w-full flex flex-col gap-8 justify-center items-center">
        <p className="text-6xl">{count}</p>
        <p className="flex gap-2 text-4xl items-center">
          <span className="font-bold">{score}</span>
          <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
        </p>
        <Storage />
        <div className="scale-[1.4]">
          <Cost resources={[game.getStorageResource()]} />
        </div>
      </Badge>
    </div>
  );
};
