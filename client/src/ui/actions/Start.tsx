import { useDojo } from "@/dojo/useDojo";
import { useCallback, useMemo } from "react";
import { Account } from "starknet";
import { Button } from "@/ui/elements/button";
import { useGame } from "@/hooks/useGame";
import { usePlayer } from "@/hooks/usePlayer";

export const Start = () => {
  const {
    account: { account },
    master,
    setup: {
      systemCalls: { start },
    },
  } = useDojo();

  const { player } = usePlayer({ playerId: account.address });
  const { game } = useGame({
    gameId: player?.game_id || 0,
    playerId: account.address,
  });

  const handleClick = useCallback(() => {
    start({ account: account as Account });
  }, [account]);

  const disabled = useMemo(() => {
    return !account || !master || account === master || !player || !!game;
  }, [account, master, player, game]);

  return (
    <Button disabled={disabled} onClick={handleClick}>
      Start Game
    </Button>
  );
};
