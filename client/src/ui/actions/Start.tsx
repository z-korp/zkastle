import { useDojo } from "@/dojo/useDojo";
import { useCallback, useMemo, useState } from "react";
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
    gameId: player?.game_id || "0x0",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(async () => {
    setIsLoading(true);
    try {
      await start({ account: account as Account });
    } finally {
      setIsLoading(false);
    }
  }, [account]);

  const disabled = useMemo(() => {
    return (
      !account ||
      !master ||
      account === master ||
      !player ||
      (!!game && !game.isOver())
    );
  }, [account, master, player, game]);

  if (disabled) return null;

  return (
    <Button
      disabled={disabled || isLoading}
      isLoading={isLoading}
      onClick={handleClick}
    >
      Start a Game
    </Button>
  );
};
