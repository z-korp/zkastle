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
    gameId: player?.game_id || 0,
    playerId: account.address,
  });

  if (!player || !game) return null;

  return (
    <div className="flex gap-8">
      <Card card={game.card_one} />
      <Card card={game.card_two} />
      <Card card={game.card_three} />
    </div>
  );
};
