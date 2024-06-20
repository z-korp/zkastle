import { useDojo } from "@/dojo/useDojo";
import { useCallback, useMemo } from "react";
import { Account } from "starknet";
import { Button } from "@/ui/elements/button";
import { useGame } from "@/hooks/useGame";
import { usePlayer } from "@/hooks/usePlayer";

export const Surrender = () => {
  const {
    account: { account },
    master,
    setup: {
      systemCalls: { surrender },
    },
  } = useDojo();

  const { player } = usePlayer({ playerId: account.address });
  const { game } = useGame({
    gameId: player?.game_id || "0x0",
  });

  const handleClick = useCallback(() => {
    surrender({ account: account as Account });
  }, [account]);

  const disabled = useMemo(() => {
    return !account || !master || account === master || !player || !game;
  }, [account, master, player, game]);

  if (disabled) return null;

  return (
    <Button disabled={disabled} onClick={handleClick}>
      Surrender
    </Button>
  );
};
