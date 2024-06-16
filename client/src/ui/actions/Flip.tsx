import { useDojo } from "@/dojo/useDojo";
import { useCallback, useMemo } from "react";
import { Account } from "starknet";
import { Button } from "@/ui/elements/button";
import { useGame } from "@/hooks/useGame";
import { usePlayer } from "@/hooks/usePlayer";
import { Action, ActionType } from "@/dojo/game/types/action";

export const Flip = () => {
  const {
    account: { account },
    master,
    setup: {
      systemCalls: { play },
    },
  } = useDojo();

  const { player } = usePlayer({ playerId: account.address });
  const { game } = useGame({
    gameId: player?.game_id || 0,
    playerId: account.address,
  });

  const handleClick = useCallback(() => {
    play({
      account: account as Account,
      action: new Action(ActionType.Flip).into(),
      choice: 0,
      resources: 0,
    });
  }, [account]);

  const disabled = useMemo(() => {
    return !account || !master || account === master || !player || !game;
  }, [account, master, player, game]);

  return (
    <Button disabled={disabled} onClick={handleClick}>
      Flip
    </Button>
  );
};
