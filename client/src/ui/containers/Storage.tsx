import { useDojo } from "@/dojo/useDojo";
import { usePlayer } from "@/hooks/usePlayer";
import { useGame } from "@/hooks/useGame";
import { Slot } from "../components/Slot";

export const Storage = () => {
  const {
    account: { account },
  } = useDojo();

  const { player } = usePlayer({ playerId: account.address });
  const { game } = useGame({
    gameId: player?.game_id || "0x0",
  });

  if (!player || !game) return null;

  return (
    <div className="flex flex-col gap-4 min-w-60 items-center">
      <h2 className="text-xl">Storage</h2>
      {game.stores.map((store, index) => (
        <Slot key={index} data={store} index={index + 1} />
      ))}
    </div>
  );
};
