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
    gameId: player?.game_id || "0x1",
  });

  if (!player || !game || game.isOver()) return null;

  return (
    <div className="flex gap-0 flex-row-reverse absolute bottom-1/2 left-1/2 -translate-x-[40%] md:-translate-x-1/3 translate-y-1/3 scale-[0.68] md:scale-[0.9]">
      <div className="rotate-0 z-30 -ml-3">
        <Card
          data={game.card_one}
          first={true}
          actionable={!game.inStorage(game.card_one.id)}
          stored={game.inStorage(game.card_one.id)}
        />
      </div>
      <div className="rotate-0 z-20 ">
        <Card
          data={game.card_two}
          first={false}
          actionable={!game.inStorage(game.card_one.id)}
          stored={game.inStorage(game.card_two.id)}
        />
      </div>
      {/* deck */}
      <div className="relative -rotate-12 z-10 mt-0 -mr-0 bg-red-500">
        <div className="absolute rotate-0 -left-48">
          <Card data={game.card_three} greyed={true} noBg={true} />
        </div>
        <div className="absolute rotate-1 -left-48">
          <Card data={game.card_three} greyed={true} noBg={true} />
        </div>
        <div className="absolute rotate-2 -left-48">
          <Card data={game.card_three} greyed={true} noBg={true} />
        </div>
        <div className="absolute rotate-3 -left-48">
          <Card
            data={game.card_three}
            first={false}
            greyed={true}
            actionable={false}
            stored={game.inStorage(game.card_three.id)}
          />
        </div>
      </div>
    </div>
  );
};
