import { useDojo } from "@/dojo/useDojo";
import { usePlayer } from "@/hooks/usePlayer";
import { useGame } from "@/hooks/useGame";
import { Card } from "@/ui/components/Card";
import { Info } from "./Info";

export const Deck = () => {
  const {
    account: { account },
  } = useDojo();

  const { player } = usePlayer({ playerId: account.address });
  const { game } = useGame({
    gameId: player?.game_id || "0x0",
  });

  if (!player || !game || game.isOver()) return null;

  return (
    <div className="relative">
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-8 scale-[0.6] md:scale-[0.7]">
        <Info count={game.move_count} score={game.getScore()} />
        <Card
          data={game.card_three}
          first={false}
          actionable={false}
          stored={game.inStorage(game.card_three.id)}
        />
      </div>
    </div>
  );
};
