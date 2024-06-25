import { useDojo } from "@/dojo/useDojo";
import { useCallback, useMemo, useState } from "react";
import { Account } from "starknet";
import { Button } from "@/ui/elements/button";
import { useGame } from "@/hooks/useGame";
import { usePlayer } from "@/hooks/usePlayer";
import { useGameStore } from "@/stores/game";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export const Remove = ({ index }: { index: number }) => {
  const {
    account: { account },
    master,
    setup: {
      systemCalls: { remove },
    },
  } = useDojo();

  const { setResources } = useGameStore();

  const { player } = usePlayer({ playerId: account.address });
  const { game } = useGame({
    gameId: player?.game_id || "0x0",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(async () => {
    setIsLoading(true);
    try {
      await remove({
        account: account as Account,
        slot_index: index,
      });
      setResources(0n);
    } finally {
      setIsLoading(false);
    }
  }, [account, index]);

  const disabled = useMemo(() => {
    return !account || !master || account === master || !player || !game;
  }, [account, master, player, game]);

  return (
    <Button
      disabled={disabled || isLoading}
      isLoading={isLoading}
      onClick={handleClick}
      className="h-8 w-8"
    >
      <FontAwesomeIcon icon={faTrash} />
    </Button>
  );
};
