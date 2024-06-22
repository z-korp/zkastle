import { useDojo } from "@/dojo/useDojo";
import { useCallback, useMemo, useState } from "react";
import { Account } from "starknet";
import { Button } from "@/ui/elements/button";
import { useGame } from "@/hooks/useGame";
import { usePlayer } from "@/hooks/usePlayer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFontAwesome } from "@fortawesome/free-solid-svg-icons";

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

  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(async () => {
    setIsLoading(true);
    try {
      await surrender({ account: account as Account });
    } finally {
      setIsLoading(false);
    }
  }, [account]);

  const disabled = useMemo(() => {
    return !account || !master || account === master || !player || !game;
  }, [account, master, player, game]);

  if (disabled) return null;

  return (
    <div className="flex items-center gap-4">
      <p className="text-2xl hidden md:block">Surrender</p>
      <Button
        size={"icon"}
        disabled={disabled || isLoading}
        isLoading={isLoading}
        onClick={handleClick}
      >
        <FontAwesomeIcon icon={faFontAwesome} className="h-6 w-6" />
      </Button>
    </div>
  );
};
