import { useDojo } from "@/dojo/useDojo";
import { useCallback, useMemo, useState } from "react";
import { Account } from "starknet";
import { Button } from "@/ui/elements/button";
import { usePlayer } from "@/hooks/usePlayer";
import { Achievement, AchievementType } from "@/dojo/game/types/achievement";

export const Select = ({ id }: { id: number }) => {
  const {
    account: { account },
    master,
    setup: {
      systemCalls: { select },
    },
  } = useDojo();

  const { player } = usePlayer({ playerId: account.address });

  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(async () => {
    setIsLoading(true);
    try {
      await select({
        account: account as Account,
        card_id: id,
      });
    } finally {
      setIsLoading(false);
    }
  }, [account, id]);

  const disabled = useMemo(() => {
    return (
      !account ||
      !master ||
      account === master ||
      !player ||
      player.has(new Achievement(AchievementType.OracleStone)) ||
      player.card_id === id
    );
  }, [account, master, player]);

  return (
    <Button
      className="w-[55px] h-[28px]"
      size="sm"
      disabled={disabled || isLoading}
      isLoading={isLoading}
      onClick={handleClick}
    >
      Select
    </Button>
  );
};
