import { useDojo } from "@/dojo/useDojo";
import { useCallback, useMemo } from "react";
import { Account } from "starknet";
import { Button } from "@/ui/elements/button";
import { useGame } from "@/hooks/useGame";
import { usePlayer } from "@/hooks/usePlayer";
import { Action, ActionType } from "@/dojo/game/types/action";
import { useGameStore } from "@/stores/game";
import { Resource } from "@/dojo/game/types/resource";

export const Rotate = ({
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
    gameId: player?.game_id || "0x0",
  });

  const handleClick = useCallback(() => {
    const paid = costs.filter((cost) => !cost.isNull()).length > 0;
    // If free, then send the store action
    if (!paid) {
      play({
        account: account as Account,
        action: new Action(ActionType.Store).into(),
        choice,
        resources: 0,
      });
      return;
    }
    // Otherwise, open the storage modal and set the costs
    setStorage(true);
    setCosts(costs);
    setCallback((resources: number) => {
      play({
        account: account as Account,
        action: new Action(ActionType.Rotate).into(),
        choice,
        resources,
      });
    });
  }, [account, costs]);

  const disabled = useMemo(() => {
    return (
      !enabled || !account || !master || account === master || !player || !game
    );
  }, [enabled, account, master, player, game]);

  return (
    <Button className="w-[80px]" disabled={disabled} onClick={handleClick}>
      Improve
    </Button>
  );
};
