import { useDojo } from "@/dojo/useDojo";
import { useCallback, useMemo } from "react";
import { Account } from "starknet";
import { Button } from "@/ui/elements/button";
import { useGame } from "@/hooks/useGame";
import { usePlayer } from "@/hooks/usePlayer";
import { Action, ActionType } from "@/dojo/game/types/action";
import { useGameStore } from "@/stores/game";

export const Rotate = ({
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

  const { resources, setResources } = useGameStore();

  const { player } = usePlayer({ playerId: account.address });
  const { game } = useGame({
    gameId: player?.game_id || "0x0",
  });

  const handleClick = useCallback(() => {
    play({
      account: account as Account,
      action: new Action(ActionType.Rotate).into(),
      choice,
      resources,
    });
    setResources(0);
  }, [account, resources]);

  const disabled = useMemo(() => {
    return (
      !enabled || !account || !master || account === master || !player || !game
    );
  }, [enabled, account, master, player, game]);

  return (
    <Button disabled={disabled} onClick={handleClick}>
      Improve
    </Button>
  );
};
