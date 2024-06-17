import { useDojo } from "@/dojo/useDojo";
import { usePlayer } from "@/hooks/usePlayer";
import { useGame } from "@/hooks/useGame";
import { Card } from "@/ui/components/Card";

export const Cards = () => {
  const {
    account: { account },
  } = useDojo();

  const { player } = usePlayer({ playerId: account.address });
  const { game } = useGame({
    gameId: player?.game_id || "0x0",
  });

  if (!player || !game || game.isOver()) return null;

  return (
    <div className="flex gap-8 flex-row-reverse absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/3 scale-[0.77] md:scale-[0.95]">
      <Card
        data={game.card_one}
        first={true}
        actionable={!game.inStorage(game.card_one.id)}
        stored={game.inStorage(game.card_one.id)}
      />
      <Card
        data={game.card_two}
        first={false}
        actionable={!game.inStorage(game.card_one.id)}
        stored={game.inStorage(game.card_two.id)}
      />
    </div>
  );
};
