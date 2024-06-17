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

  if (!player || !game) return null;

  return (
    <div className="flex gap-8 flex-row-reverse">
      <Card data={game.card_one} first={true} actionable={true} />
      <Card data={game.card_two} first={false} actionable={true} />
    </div>
  );
};
