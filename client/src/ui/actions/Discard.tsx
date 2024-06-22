import { useDojo } from "@/dojo/useDojo";
import { useCallback, useMemo, useState } from "react";
import { Account } from "starknet";
import { Button } from "@/ui/elements/button";
import { useGame } from "@/hooks/useGame";
import { usePlayer } from "@/hooks/usePlayer";
import { Action, ActionType } from "@/dojo/game/types/action";
import { useGameStore } from "@/stores/game";

export const Discard = ({
  choice,
  enabled,
}: {
  choice: boolean;
  enabled: boolean;
}) => {
  const {
    account: { account },
    master,
    setup: {
      systemCalls: { play },
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
      await play({
        account: account as Account,
        action: new Action(ActionType.Discard).into(),
        choice,
        resources: 0n,
      });
      setResources(0n);
    } finally {
      setIsLoading(false);
    }
  }, [account]);

  const disabled = useMemo(() => {
    return !account || !master || account === master || !player || !game;
  }, [account, master, player, game]);

  return (
    <Button
      className="w-[55px] h-[28px]"
      size="sm"
      disabled={!enabled || disabled || isLoading}
      isLoading={isLoading}
      onClick={handleClick}
    >
      Discard
    </Button>
  );
};
