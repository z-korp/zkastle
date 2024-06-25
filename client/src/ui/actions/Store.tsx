import { useDojo } from "@/dojo/useDojo";
import { useCallback, useMemo, useState } from "react";
import { Account } from "starknet";
import { Button } from "@/ui/elements/button";
import { useGame } from "@/hooks/useGame";
import { usePlayer } from "@/hooks/usePlayer";
import { Action, ActionType } from "@/dojo/game/types/action";
import { useGameStore } from "@/stores/game";
import { Resource } from "@/dojo/game/types/resource";

export const Store = ({
  choice,
  enabled,
  costs,
}: {
  choice: boolean;
  enabled: boolean;
  costs: Resource[];
}) => {
  const {
    account: { account },
    master,
    setup: {
      systemCalls: { play },
    },
  } = useDojo();

  const { setStorage, setCosts, setCallback } = useGameStore();

  const { player } = usePlayer({ playerId: account.address });
  const { game } = useGame({
    gameId: player?.game_id,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(async () => {
    if (!game) return;
    setIsLoading(true);
    try {
      const paid = costs.filter((cost) => !cost.isNull()).length > 0;
      const full = game.isStorageFull();
      // If free and storage is not full, then send the store action
      if (!paid && !full) {
        await play({
          account: account as Account,
          action: new Action(ActionType.Store).into(),
          choice,
          resources: 0n,
        });
        return;
      }
      // Otherwise, open the storage modal and set the costs
      setStorage(true);
      setCosts(costs);
      setCallback(async (resources: bigint) => {
        await play({
          account: account as Account,
          action: new Action(ActionType.Store).into(),
          choice,
          resources,
        });
        setIsLoading(false);
      });
    } finally {
      setIsLoading(false);
    }
  }, [account, game, costs]);

  const disabled = useMemo(() => {
    return (
      !enabled || !account || !master || account === master || !player || !game
    );
  }, [enabled, account, master, player, game]);

  return (
    <Button
      className="w-[55px] h-[28px]"
      size="sm"
      disabled={disabled || isLoading}
      isLoading={isLoading}
      onClick={handleClick}
    >
      Store
    </Button>
  );
};
