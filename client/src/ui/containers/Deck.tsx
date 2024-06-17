import { useDojo } from "@/dojo/useDojo";
import { usePlayer } from "@/hooks/usePlayer";
import { useGame } from "@/hooks/useGame";
import { Card } from "@/ui/components/Card";
import { Info } from "../components/Info";

export const Deck = () => {
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
    <div className="flex gap-8 scale-[0.5]">
      <Info count={game.move_count} score={game.getScore()} />
      <Card data={game.card_three} first={false} actionable={false} />
    </div>
  );
};
